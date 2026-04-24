// ============================================================
//  Triple-A Studio · Mouse Trail Lab — GPU engine
//  Same public API as js/engine.js, but particles are rendered
//  by PixiJS (WebGL).  A small Canvas-2D layer (#fx) is kept so
//  effects that draw strokes in `onFrame` via Engine.ctx still work.
// ============================================================
(function(){
  const strokeCanvas = document.getElementById('fx');       // CPU overlay
  const gpuCanvas    = document.getElementById('fxGpu');    // GPU particles
  const ctx = strokeCanvas.getContext('2d');

  let W = innerWidth, H = innerHeight;

  function resize(){
    W = innerWidth; H = innerHeight;
    strokeCanvas.width  = W; strokeCanvas.height = H;
    strokeCanvas.style.width = W + 'px'; strokeCanvas.style.height = H + 'px';
    app.renderer.resize(W, H);
  }

  // -------- PIXI setup --------
  const app = new PIXI.Application({
    view: gpuCanvas,
    width: W, height: H,
    backgroundColor: window.__transparent ? 0x000000 : 0x05060b,
    backgroundAlpha: window.__transparent ? 0 : 1,
    antialias: false,
    powerPreference: 'high-performance',
    resolution: 1,
    autoDensity: false,
    clearBeforeRender: false,             // preserve frame for fade-trail
    preserveDrawingBuffer: !window.__transparent
  });
  // Cap the render rate to the monitor refresh — without this the ticker
  // runs as fast as the GPU allows (200–500 fps), which pegs the GPU and
  // throttles the system during long sessions.
  app.ticker.maxFPS = 60;

  const stage         = app.stage;
  const fadeRect      = new PIXI.Graphics(); stage.addChild(fadeRect);
  const normLayer     = new PIXI.Container(); stage.addChild(normLayer);
  const addLayer      = new PIXI.Container(); stage.addChild(addLayer);
  const graphicsLayer = new PIXI.Container(); stage.addChild(graphicsLayer);
  normLayer.sortableChildren = addLayer.sortableChildren = false;

  // -------- textures (pre-rendered once per shape) --------
  function mkTex(size, draw){
    const c = document.createElement('canvas');
    c.width = c.height = size;
    draw(c.getContext('2d'), size);
    return PIXI.Texture.from(c);
  }
  const TEX = {
    glow: mkTex(128, (g,s)=>{
      const r = s/2, grad = g.createRadialGradient(r,r,0,r,r,r);
      grad.addColorStop(0,'rgba(255,255,255,1)');
      grad.addColorStop(0.4,'rgba(255,255,255,0.4)');
      grad.addColorStop(1,'rgba(255,255,255,0)');
      g.fillStyle = grad; g.fillRect(0,0,s,s);
    }),
    disc: mkTex(64, (g,s)=>{
      g.fillStyle = '#fff';
      g.beginPath(); g.arc(s/2,s/2,s/2-1,0,Math.PI*2); g.fill();
    }),
    square: mkTex(16, (g,s)=>{ g.fillStyle='#fff'; g.fillRect(0,0,s,s); }),
    ring: mkTex(128, (g,s)=>{
      g.strokeStyle='#fff'; g.lineWidth=6;
      g.beginPath(); g.arc(s/2,s/2,s/2-4,0,Math.PI*2); g.stroke();
    }),
    star: mkTex(64, (g,s)=>{
      const cx=s/2, cy=s/2, r1=s/2-2, r2=r1*0.45, pts=5;
      g.fillStyle='#fff'; g.beginPath();
      for(let i=0;i<pts*2;i++){
        const r = i%2 ? r2 : r1;
        const a = (i/(pts*2))*Math.PI*2 - Math.PI/2;
        const x = cx + Math.cos(a)*r, y = cy + Math.sin(a)*r;
        if(i===0) g.moveTo(x,y); else g.lineTo(x,y);
      }
      g.closePath(); g.fill();
    }),
    triangle: mkTex(64, (g,s)=>{
      g.fillStyle='#fff'; g.beginPath();
      g.moveTo(s/2, 2);
      g.lineTo(s-4, s-4);
      g.lineTo(4, s-4);
      g.closePath(); g.fill();
    }),
    hexagon: mkTex(64, (g,s)=>{
      g.strokeStyle='#fff'; g.lineWidth=3;
      g.beginPath();
      for(let i=0;i<6;i++){
        const a = i*Math.PI/3;
        const x = s/2 + Math.cos(a)*(s/2-3), y = s/2 + Math.sin(a)*(s/2-3);
        if(i===0) g.moveTo(x,y); else g.lineTo(x,y);
      }
      g.closePath(); g.stroke();
    })
  };

  // -------- color parsing (hex + hsla) → { int, alpha } --------
  // The cache is bounded because effects pass randomized hsla strings, which
  // would otherwise grow the map unboundedly (every particle = a new key).
  const colorCache = new Map();
  const COLOR_CACHE_MAX = 512;
  function parseColor(c){
    if(typeof c === 'number') return { int: c, alpha: 1 };
    if(!c) return { int: 0xffffff, alpha: 1 };
    const hit = colorCache.get(c);
    if(hit) return hit;
    if(colorCache.size >= COLOR_CACHE_MAX){
      // Drop the oldest entry (Map preserves insertion order).
      const firstKey = colorCache.keys().next().value;
      colorCache.delete(firstKey);
    }
    let out = { int: 0xffffff, alpha: 1 };
    if(c[0] === '#'){
      const hex = c.slice(1);
      out.int = hex.length === 3
        ? parseInt(hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2], 16)
        : parseInt(hex, 16);
    } else if(c.startsWith('hsl')){
      const m = c.match(/hsla?\(\s*(-?\d+(?:\.\d+)?)[,\s]+(-?\d+(?:\.\d+)?)%?[,\s]+(-?\d+(?:\.\d+)?)%?(?:[,\s/]+([\d.]+))?\s*\)/);
      if(m){
        const h=+m[1], s=+m[2]/100, l=+m[3]/100, a=m[4]!=null?+m[4]:1;
        const k = n => (n + h/30) % 12;
        const aa = s * Math.min(l, 1-l);
        const f = n => l - aa * Math.max(-1, Math.min(k(n)-3, Math.min(9-k(n), 1)));
        out.int = (Math.round(f(0)*255)<<16) | (Math.round(f(8)*255)<<8) | Math.round(f(4)*255);
        out.alpha = a;
      }
    } else if(c.startsWith('rgb')){
      const m = c.match(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)(?:[,\s/]+([\d.]+))?\s*\)/);
      if(m){
        out.int = (+m[1]<<16) | (+m[2]<<8) | +m[3];
        out.alpha = m[4]!=null ? +m[4] : 1;
      }
    }
    colorCache.set(c, out);
    return out;
  }

  // -------- sprite pool --------
  const pool = [];
  function takeSprite(tex){
    let s = pool.pop();
    if(!s){ s = new PIXI.Sprite(); s.anchor.set(0.5); }
    s.texture = tex;
    s.visible = true;
    return s;
  }
  function freeSprite(s){
    if(s.parent) s.parent.removeChild(s);
    if(pool.length < 2000) pool.push(s);
  }

  // -------- mouse --------
  const mouse = { x: W/2, y: H/2, px: W/2, py: H/2, dx:0, dy:0, speed:0, angle:0, down:false, inside:true };
  function onMove(e){
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    mouse.px = mouse.x; mouse.py = mouse.y;
    mouse.x = cx; mouse.y = cy;
    mouse.dx = mouse.x - mouse.px; mouse.dy = mouse.y - mouse.py;
    mouse.speed = Math.hypot(mouse.dx, mouse.dy);
    mouse.angle = Math.atan2(mouse.dy, mouse.dx);
    if(current && current.onMove) current.onMove(mouse);
  }
  addEventListener('mousemove', onMove);
  addEventListener('touchmove', onMove, {passive:true});
  addEventListener('mousedown', ()=>{ mouse.down=true; if(current && current.onDown) current.onDown(mouse); });
  addEventListener('mouseup',   ()=>{ mouse.down=false; });
  addEventListener('mouseleave',()=>{ mouse.inside=false; });
  addEventListener('mouseenter',()=>{ mouse.inside=true; });
  addEventListener('resize', resize);

  // -------- particle system --------
  const particles = [];
  const MAX_PARTICLES = 2600;

  function blendFor(p){
    if(p.blend === 'source-over' || p.blend === 'normal') return PIXI.BLEND_MODES.NORMAL;
    return PIXI.BLEND_MODES.ADD;
  }

  function attachDisplay(p){
    const parsed = parseColor(p.color);
    p._colorInt = parsed.int;
    p._colorAlpha = parsed.alpha;

    if(p.type === 'text'){
      const t = new PIXI.Text(
        (p.data && p.data.char) || '✦',
        {
          fontFamily: (p.data && p.data.font) || 'Orbitron, monospace',
          fontSize: Math.max(6, p.size),
          fill: parsed.int
        }
      );
      t.anchor.set(0.5);
      t.blendMode = blendFor(p);
      graphicsLayer.addChild(t);
      p._disp = t; p._isText = true; return;
    }
    if(p.type === 'line'){
      const g = new PIXI.Graphics();
      g.blendMode = blendFor(p);
      graphicsLayer.addChild(g);
      p._disp = g; p._isGraphics = true; return;
    }
    const tex = TEX[p.type] || TEX.glow;
    const s = takeSprite(tex);
    s.tint = parsed.int;
    s.blendMode = blendFor(p);
    (s.blendMode === PIXI.BLEND_MODES.ADD ? addLayer : normLayer).addChild(s);
    p._disp = s;
  }

  function detachDisplay(p){
    const d = p._disp;
    if(!d) return;
    if(p._isText || p._isGraphics){
      if(d.parent) d.parent.removeChild(d);
      d.destroy({ children: true, texture: p._isText });
    } else {
      freeSprite(d);
    }
    p._disp = null;
  }

  function updateDisplay(p, t){
    const d = p._disp;
    if(!d) return;
    const alpha = Math.max(0, Math.min(1, p.alpha * t * p._colorAlpha));
    d.alpha = alpha;

    if(p._isText){
      d.x = p.x; d.y = p.y; d.rotation = p.rot;
      return;
    }
    if(p._isGraphics){
      d.clear();
      const lw = Math.max(0.4, p.size);
      d.lineStyle({ width: lw, color: p._colorInt, alpha: 1, cap: 'round' });
      d.moveTo(p.data.x1, p.data.y1);
      d.lineTo(p.data.x2, p.data.y2);
      return;
    }
    d.x = p.x; d.y = p.y; d.rotation = p.rot;
    const sz = Math.max(0.01, p.size);
    switch(p.type){
      case 'glow':    d.scale.set((sz*3)/128); break;      // was radius = size*3
      case 'disc':    d.scale.set((sz*2)/64);  break;
      case 'square':  d.scale.set(sz/16);      break;
      case 'ring':    d.scale.set((sz*2)/128); break;
      case 'star':    d.scale.set((sz*2)/64);  break;
      case 'triangle':d.scale.set((sz*2)/64);  break;
      case 'hexagon': d.scale.set((sz*2)/64);  break;
      default:        d.scale.set((sz*3)/128); break;      // treat unknown as glow
    }
  }

  function spawn(p){
    if(particles.length >= MAX_PARTICLES){
      const old = particles.shift(); detachDisplay(old);
    }
    const particle = Object.assign({
      x:0, y:0, vx:0, vy:0,
      life:60, age:0,
      size:4, color:'#fff',
      gravity:0, drag:1, shrink:1,
      alpha:1, rot:0, rotV:0,
      type:'glow', blend:'lighter',
      data:null,
      update:null
    }, p);
    attachDisplay(particle);
    particles.push(particle);
  }

  // -------- registry --------
  const effects = [];
  const effectsById = {};
  let current = null;

  function register(eff){ effects.push(eff); effectsById[eff.id] = eff; }

  function setEffect(id){
    current = effectsById[id] || current;
    if(!current) return;
    for(const p of particles) detachDisplay(p);
    particles.length = 0;
    const nameEl = document.getElementById('effect-name');
    if(nameEl) nameEl.textContent = current.name.toUpperCase();
    if(current.init) current.init();
  }

  // -------- utils --------
  const U = {
    rand:(a,b)=>a+Math.random()*(b-a),
    randi:(a,b)=>Math.floor(a+Math.random()*(b-a)),
    pick:a=>a[Math.floor(Math.random()*a.length)],
    hsla:(h,s,l,a=1)=>`hsla(${h},${s}%,${l}%,${a})`,
    lerp:(a,b,t)=>a+(b-a)*t,
    clamp:(v,a,b)=>v<a?a:v>b?b:v,
    TAU: Math.PI*2
  };

  // -------- main tick --------
  let last = performance.now();
  let fpsFrames = 0, lastFpsUpdate = last;
  const fpsEl   = document.getElementById('fps');
  const countEl = document.getElementById('pcount');

  app.ticker.add(() => {
    const now = performance.now();
    const dt = Math.min(33, now - last); last = now;

    if(window.__paused) return;

    // Fade previous frame (motion-blur trail)
    const fade = (current && current.fade != null) ? current.fade : 0.22;
    fadeRect.clear();
    if(window.__transparent){
      fadeRect.blendMode = PIXI.BLEND_MODES.ERASE;
      fadeRect.beginFill(0x000000, fade);
    } else {
      fadeRect.blendMode = PIXI.BLEND_MODES.NORMAL;
      fadeRect.beginFill(0x05060b, fade);
    }
    fadeRect.drawRect(0, 0, W, H);
    fadeRect.endFill();

    // Clear CPU stroke layer (effects' onFrame may repaint it this tick)
    ctx.clearRect(0, 0, W, H);

    if(current && current.onFrame) current.onFrame(dt);

    for(let i = particles.length - 1; i >= 0; i--){
      const p = particles[i];
      if(p.update){
        p.update(p, dt);
      } else {
        p.vy += p.gravity;
        p.vx *= p.drag; p.vy *= p.drag;
        p.x  += p.vx;   p.y  += p.vy;
        p.size *= p.shrink;
        p.rot += p.rotV;
        p.age++;
      }
      if(p.age >= p.life || p.size < 0.15){
        detachDisplay(p);
        particles.splice(i, 1);
        continue;
      }
      const t = 1 - p.age / p.life;
      updateDisplay(p, t);
    }

    // fps
    fpsFrames++;
    if(now - lastFpsUpdate > 500){
      const fps = Math.round(1000 * fpsFrames / (now - lastFpsUpdate));
      if(fpsEl) fpsEl.textContent = fps;
      if(countEl) countEl.textContent = particles.length;
      fpsFrames = 0; lastFpsUpdate = now;
    }
  });

  // -------- render helpers (stubs kept for API compatibility) --------
  const R = {};

  // -------- public API --------
  window.Engine = {
    ctx, canvas: strokeCanvas, mouse, particles, spawn,
    register, setEffect,
    effects, effectsById, R, U,
    clear(){
      for(const p of particles) detachDisplay(p);
      particles.length = 0;
      ctx.clearRect(0, 0, W, H);
    },
    get W(){ return W; },
    get H(){ return H; }
  };
})();
