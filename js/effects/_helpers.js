// ============================================================
//  Shared emission helpers used by the 10 expanded categories.
//  Exposed as Engine.fx.*
// ============================================================
(function(){
  const { spawn, U } = Engine;
  const { rand, pick, hsla, TAU } = U;

  const fx = {
    // emit particles at cursor in random directions
    puff(m, n, cfg){
      for(let i=0;i<n;i++) spawn(Object.assign({
        x:m.x+rand(-6,6), y:m.y+rand(-6,6),
        vx:rand(-1,1), vy:rand(-1,1),
        life:rand(40,80), size:rand(2,5),
        color:'rgba(255,255,255,0.9)'
      }, cfg));
    },
    // radial burst of N particles outward
    burst(m, n, cfg){
      const smin=cfg.smin||1, smax=cfg.smax||3;
      for(let i=0;i<n;i++){
        const a = rand(0,TAU), s = rand(smin,smax);
        const p = Object.assign({
          life:rand(30,60), size:rand(3,6),
          color:'rgba(255,255,255,0.9)', drag:0.96
        }, cfg, {
          x:m.x, y:m.y,
          vx:Math.cos(a)*s, vy:Math.sin(a)*s
        });
        spawn(p);
      }
    },
    // rising particles (smoke/fire)
    rise(m, n, cfg){
      for(let i=0;i<n;i++) spawn(Object.assign({
        x:m.x+rand(-8,8), y:m.y+rand(-6,6),
        vx:rand(-0.3,0.3), vy:-rand(0.3,1.2),
        life:rand(60,120), size:rand(4,9),
        color:'rgba(255,255,255,0.6)'
      }, cfg));
    },
    // falling particles (rain/droplets)
    fall(m, n, cfg){
      for(let i=0;i<n;i++) spawn(Object.assign({
        x:m.x+rand(-8,8), y:m.y,
        vx:rand(-0.4,0.4), vy:rand(0.6,2.2),
        life:rand(40,80), size:rand(2,4),
        color:'rgba(255,255,255,0.9)',
        gravity:0.1
      }, cfg));
    },
    // expanding single ring at cursor
    pulseRing(m, color, opts){
      opts=opts||{};
      spawn({
        x:m.x, y:m.y, vx:0, vy:0,
        life:opts.life||40, size:opts.start||4,
        color, type:'ring', blend:opts.blend||'lighter',
        update(p){ p.size += (opts.grow||1.6); p.age++; }
      });
    },
    // single line segment from→to
    line(from, to, color, opts){
      opts=opts||{};
      spawn({
        x:0,y:0,life:opts.life||22,size:opts.width||2, age:0,
        color, type:'line', blend:opts.blend||'lighter',
        data:{x1:from.x,y1:from.y,x2:to.x,y2:to.y},
        update(p){ p.age++; }
      });
    },
    // emoji/character near cursor (handles surrogate-pair emojis correctly)
    emoji(m, chars, opts){
      opts=opts||{};
      const arr = typeof chars==='string' ? Array.from(chars) : chars;
      const char = arr[Math.floor(Math.random()*arr.length)];
      spawn(Object.assign({
        x:m.x+rand(-6,6), y:m.y+rand(-6,6),
        vx:rand(-0.6,0.6), vy:-rand(0.2,1),
        life:rand(50,90), size:rand(14,22),
        color:'rgba(255,255,255,1)',
        type:'text', rot:rand(-0.3,0.3),
        data:{char}
      }, opts));
    },
    // drop a shape that follows gravity and rotates
    chunk(m, cfg){
      spawn(Object.assign({
        x:m.x+rand(-4,4), y:m.y+rand(-4,4),
        vx:rand(-2,2), vy:-rand(0.5,2.5),
        life:rand(60,100), size:rand(3,6),
        color:'rgba(255,255,255,1)',
        gravity:0.18, drag:0.99,
        rot:rand(0,TAU), rotV:rand(-0.2,0.2),
        type:'square', blend:'source-over'
      }, cfg));
    },
    // orbital particle at angle around cursor
    orbit(m, n, cfg){
      for(let i=0;i<n;i++){
        const a=rand(0,TAU), r=cfg.r||rand(10,28);
        spawn(Object.assign({
          life:rand(50,90), size:rand(1.5,3),
          color:'rgba(200,230,255,1)'
        }, cfg, {
          x:m.x+Math.cos(a)*r, y:m.y+Math.sin(a)*r,
          vx:0, vy:0,
          data:{a, r, cx:m.x, cy:m.y, spin:cfg.spin||rand(0.08,0.15), drift:cfg.drift||1},
          update(p){
            p.data.a += p.data.spin;
            p.data.r *= p.data.drift;
            p.x = p.data.cx + Math.cos(p.data.a)*p.data.r;
            p.y = p.data.cy + Math.sin(p.data.a)*p.data.r;
            p.age++;
          }
        }));
      }
    },
    // splat (droplet + splash)
    splat(m, color, n, smin, smax){
      for(let i=0;i<(n||5);i++){
        const a=rand(0,TAU), s=rand(smin||0.5, smax||3);
        spawn({
          x:m.x, y:m.y, vx:Math.cos(a)*s, vy:Math.sin(a)*s,
          life:rand(30,60), size:rand(1.5,4),
          color, type:'disc', blend:'source-over',
          gravity:0.1, drag:0.98
        });
      }
    },
    // helper to register a streamlined effect definition
    reg(cat, defs){
      defs.forEach((d,i)=>{
        Engine.register({
          id:d[0], name:d[1], category:cat,
          onMove:d[2],
          onFrame:d[3]||null, init:d[4]||null,
          fade:d[5]!=null?d[5]:undefined
        });
      });
    }
  };

  Engine.fx = fx;
})();
