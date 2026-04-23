// ============================================================
//  Triple-A Studio · Mouse Trail Lab
//  Core engine: canvas, particle system, effect registry.
// ============================================================
(function(){
  const canvas = document.getElementById('fx');
  const ctx = canvas.getContext('2d');
  // Overlay runs fullscreen transparent on Windows; cap DPR to 1 in that mode
  // because transparent windows use a slower compositing path and fill-rate
  // cost scales with DPR^2 on a whole-screen canvas.
  let W = 0, H = 0,
      DPR = window.__transparent ? 1 : Math.min(window.devicePixelRatio || 1, 2);

  function resize(){
    W = canvas.width  = Math.floor(innerWidth  * DPR);
    H = canvas.height = Math.floor(innerHeight * DPR);
    canvas.style.width  = innerWidth  + 'px';
    canvas.style.height = innerHeight + 'px';
    ctx.setTransform(1,0,0,1,0,0);
    ctx.scale(DPR, DPR);
  }
  addEventListener('resize', resize); resize();

  const mouse = { x: innerWidth/2, y: innerHeight/2, px: innerWidth/2, py: innerHeight/2,
                  dx:0, dy:0, speed:0, angle:0, down:false, inside:true };

  function onMove(e){
    const cx = (e.touches ? e.touches[0].clientX : e.clientX);
    const cy = (e.touches ? e.touches[0].clientY : e.clientY);
    mouse.px = mouse.x; mouse.py = mouse.y;
    mouse.x  = cx;      mouse.y  = cy;
    mouse.dx = mouse.x - mouse.px;
    mouse.dy = mouse.y - mouse.py;
    mouse.speed = Math.hypot(mouse.dx, mouse.dy);
    mouse.angle = Math.atan2(mouse.dy, mouse.dx);
    if(current && current.onMove) current.onMove(mouse);
  }
  addEventListener('mousemove', onMove);
  addEventListener('touchmove', onMove, {passive:true});
  addEventListener('mousedown', e=>{ mouse.down=true; if(current && current.onDown) current.onDown(mouse); });
  addEventListener('mouseup',   ()=>{ mouse.down=false; });
  addEventListener('mouseleave',()=>{ mouse.inside=false; });
  addEventListener('mouseenter',()=>{ mouse.inside=true;  });

  // -------- Particle store --------
  const particles = [];
  const MAX_PARTICLES = 2600;

  function spawn(p){
    if(particles.length >= MAX_PARTICLES) particles.shift();
    particles.push(Object.assign({
      x:0, y:0, vx:0, vy:0,
      life:60, age:0,
      size:4, color:'#fff',
      gravity:0, drag:1, shrink:1,
      alpha:1, rot:0, rotV:0,
      type:'glow',
      blend:'lighter',
      data:null,
      update:null, render:null
    }, p));
  }

  // -------- Registry --------
  const effects = [];
  const effectsById = {};
  let current = null;

  function register(eff){
    effects.push(eff);
    effectsById[eff.id] = eff;
  }

  function setEffect(id){
    current = effectsById[id] || current;
    if(!current) return;
    particles.length = 0;
    const nameEl = document.getElementById('effect-name');
    if(nameEl) nameEl.textContent = current.name.toUpperCase();
    if(current.init) current.init();
  }

  // -------- Render helpers --------
  const R = {
    glow(ctx,p,t){
      ctx.globalCompositeOperation = p.blend || 'lighter';
      const r = Math.max(0.1, p.size * 3);
      const g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,r);
      g.addColorStop(0, p.color);
      g.addColorStop(0.4, p.color.replace(/[\d.]+\)$/,'0.4)'));
      g.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(p.x,p.y,r,0,Math.PI*2); ctx.fill();
    },
    disc(ctx,p){
      ctx.globalCompositeOperation = p.blend || 'source-over';
      ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(p.x,p.y,Math.max(0.1,p.size),0,Math.PI*2); ctx.fill();
    },
    square(ctx,p){
      ctx.globalCompositeOperation = p.blend || 'lighter';
      ctx.fillStyle = p.color;
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot);
      ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size);
      ctx.restore();
    },
    ring(ctx,p,t){
      ctx.globalCompositeOperation = p.blend || 'lighter';
      ctx.strokeStyle = p.color;
      ctx.lineWidth = Math.max(0.4, p.size * 0.15);
      ctx.beginPath(); ctx.arc(p.x,p.y,Math.max(0.1,p.size),0,Math.PI*2); ctx.stroke();
    },
    text(ctx,p){
      ctx.globalCompositeOperation = p.blend || 'lighter';
      ctx.fillStyle = p.color;
      ctx.font = `${Math.max(6,p.size)}px ${p.data && p.data.font || 'Orbitron, monospace'}`;
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot);
      ctx.fillText(p.data && p.data.char || '✦', 0, 0);
      ctx.restore();
    },
    star(ctx,p){
      ctx.globalCompositeOperation = p.blend || 'lighter';
      const pts = (p.data && p.data.points) || 5;
      const r1 = p.size, r2 = p.size*0.45;
      ctx.beginPath();
      for(let i=0;i<pts*2;i++){
        const r = i%2 ? r2 : r1;
        const a = p.rot + i * Math.PI / pts;
        ctx.lineTo(p.x + Math.cos(a)*r, p.y + Math.sin(a)*r);
      }
      ctx.closePath();
      ctx.fillStyle = p.color; ctx.fill();
    },
    triangle(ctx,p){
      ctx.globalCompositeOperation = p.blend || 'lighter';
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot);
      ctx.beginPath();
      ctx.moveTo(0,-p.size);
      ctx.lineTo(p.size*0.9, p.size*0.7);
      ctx.lineTo(-p.size*0.9, p.size*0.7);
      ctx.closePath();
      ctx.fillStyle = p.color; ctx.fill();
      ctx.restore();
    },
    hexagon(ctx,p){
      ctx.globalCompositeOperation = p.blend || 'lighter';
      ctx.strokeStyle = p.color;
      ctx.lineWidth = Math.max(0.5, p.size*0.1);
      ctx.beginPath();
      for(let i=0;i<6;i++){
        const a = p.rot + i * Math.PI/3;
        const x = p.x + Math.cos(a)*p.size, y = p.y + Math.sin(a)*p.size;
        if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
      }
      ctx.closePath(); ctx.stroke();
    },
    line(ctx,p){
      ctx.globalCompositeOperation = p.blend || 'lighter';
      ctx.strokeStyle = p.color;
      ctx.lineWidth = Math.max(0.4, p.size);
      ctx.beginPath();
      ctx.moveTo(p.data.x1, p.data.y1);
      ctx.lineTo(p.data.x2, p.data.y2);
      ctx.stroke();
    }
  };

  // -------- Utils --------
  const U = {
    rand:(a,b)=>a+Math.random()*(b-a),
    randi:(a,b)=>Math.floor(a+Math.random()*(b-a)),
    pick:a=>a[Math.floor(Math.random()*a.length)],
    hsla:(h,s,l,a=1)=>`hsla(${h},${s}%,${l}%,${a})`,
    lerp:(a,b,t)=>a+(b-a)*t,
    clamp:(v,a,b)=>v<a?a:v>b?b:v,
    TAU: Math.PI*2
  };

  // -------- Main loop --------
  let last = performance.now();
  let fpsAccum = 0, fpsFrames = 0, lastFpsUpdate = last;
  const fpsEl = document.getElementById('fps');
  const countEl = document.getElementById('pcount');

  function tick(now){
    const dt = Math.min(33, now - last); last = now;

    // Paused? Skip the expensive fullscreen fade-rect entirely.
    if(window.__paused){
      requestAnimationFrame(tick);
      return;
    }

    // Background fade per-effect controlled trail
    const fade = (current && current.fade != null) ? current.fade : 0.22;
    if(window.__transparent){
      // Fade existing pixels toward full transparency so the desktop shows through.
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = `rgba(0,0,0,${fade})`;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = `rgba(5,6,13,${fade})`;
    }
    ctx.fillRect(0,0,innerWidth,innerHeight);
    ctx.globalCompositeOperation = 'source-over';

    if(current && current.onFrame) current.onFrame(dt);

    for(let i = particles.length - 1; i >= 0; i--){
      const p = particles[i];
      if(p.update){
        p.update(p, dt);
      } else {
        p.vy += p.gravity;
        p.vx *= p.drag;
        p.vy *= p.drag;
        p.x  += p.vx;
        p.y  += p.vy;
        p.size *= p.shrink;
        p.rot += p.rotV;
        p.age++;
      }
      if(p.age >= p.life || p.size < 0.15){
        particles.splice(i,1); continue;
      }
      const t = 1 - p.age / p.life;
      ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha * t));
      if(p.render){ p.render(ctx,p,t); }
      else { (R[p.type] || R.glow)(ctx,p,t); }
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';

    // FPS / counter
    fpsFrames++;
    if(now - lastFpsUpdate > 500){
      const fps = Math.round(1000 * fpsFrames / (now - lastFpsUpdate));
      if(fpsEl) fpsEl.textContent = fps;
      if(countEl) countEl.textContent = particles.length;
      fpsFrames = 0; lastFpsUpdate = now;
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // -------- Public API --------
  window.Engine = {
    ctx, canvas, mouse, particles, spawn,
    register, setEffect,
    effects, effectsById,
    R, U,
    clear(){ particles.length = 0; },
    get W(){ return innerWidth; },
    get H(){ return innerHeight; }
  };
})();
