// ============================================================
//  CYBER & TECH effects (10)
// ============================================================
(function(){
  const { register, spawn, U, particles } = Engine;
  const { rand, pick, hsla, TAU, lerp } = U;
  const CAT = 'Cyber & Tech';

  // 11. Neon Comet
  register({
    id:'neon_comet', name:'Neon Comet', category:CAT, fade:0.15,
    onMove(m){
      // bright core
      spawn({
        x:m.x, y:m.y, vx:m.dx*0.05, vy:m.dy*0.05,
        life:24, size:rand(6,9),
        color:'rgba(120,230,255,1)',
        shrink:0.96
      });
      for(let i=0;i<4;i++){
        spawn({
          x:m.x+rand(-2,2), y:m.y+rand(-2,2),
          vx:-m.dx*0.08+rand(-0.5,0.5), vy:-m.dy*0.08+rand(-0.5,0.5),
          life:rand(30,55), size:rand(2,4),
          color:hsla(rand(180,210),100,rand(60,75),0.9),
          drag:0.96
        });
      }
    }
  });

  // 12. Cyber Surge — glitch squares cyan/magenta
  register({
    id:'cyber_surge', name:'Cyber Surge', category:CAT, fade:0.2,
    onMove(m){
      for(let i=0;i<5;i++){
        spawn({
          x:m.x+rand(-8,8), y:m.y+rand(-8,8),
          vx:rand(-1.5,1.5), vy:rand(-1.5,1.5),
          life:rand(20,40), size:rand(3,9),
          color:Math.random()<0.5?'rgba(99,231,255,0.9)':'rgba(255,79,216,0.9)',
          type:'square',
          rot:rand(0,TAU), rotV:rand(-0.2,0.2),
          drag:0.92
        });
      }
    }
  });

  // 13. Laser Lattice — connect last N points
  register({
    id:'laser_lattice', name:'Laser Lattice', category:CAT, fade:0.25,
    points:[],
    onMove(m){
      this.points.push({x:m.x,y:m.y,age:0});
      if(this.points.length>18) this.points.shift();
    },
    onFrame(){
      const ctx = Engine.ctx;
      ctx.globalCompositeOperation='lighter';
      for(let i=0;i<this.points.length;i++){
        this.points[i].age++;
        for(let j=i+1;j<this.points.length;j++){
          const a=this.points[i], b=this.points[j];
          const d = Math.hypot(a.x-b.x,a.y-b.y);
          if(d<180){
            const alpha = (1 - d/180) * (1 - a.age/60);
            if(alpha<=0) continue;
            ctx.strokeStyle=`rgba(120,230,255,${alpha*0.7})`;
            ctx.lineWidth=1;
            ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
          }
        }
      }
      this.points = this.points.filter(p=>p.age<60);
      // node dots
      for(const p of this.points){
        ctx.fillStyle=`rgba(255,255,255,${1-p.age/60})`;
        ctx.beginPath(); ctx.arc(p.x,p.y,2,0,TAU); ctx.fill();
      }
    },
    init(){ this.points=[]; }
  });

  // 14. Holo Grid — grid-snapped squares
  register({
    id:'holo_grid', name:'Holo Grid', category:CAT, fade:0.2,
    onMove(m){
      const g=24;
      const gx=Math.round(m.x/g)*g, gy=Math.round(m.y/g)*g;
      spawn({
        x:gx, y:gy, vx:0, vy:0,
        life:40, size:g-4,
        color:'rgba(99,231,255,0.7)',
        type:'hexagon',
        update(p){ p.age++; p.size -= 0.15; p.rot+=0.02; }
      });
      spawn({
        x:gx, y:gy, vx:0, vy:0,
        life:40, size:3, color:'rgba(99,231,255,1)'
      });
    }
  });

  // 15. Digital Rain — katakana chars falling
  register({
    id:'digital_rain', name:'Digital Rain', category:CAT, fade:0.1,
    chars:'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉ0123456789',
    onMove(m){
      for(let i=0;i<2;i++){
        spawn({
          x:m.x+rand(-20,20), y:m.y,
          vx:0, vy:rand(2,5),
          life:rand(50,90), size:rand(12,18),
          color:Math.random()<0.15?'rgba(220,255,220,1)':'rgba(60,220,120,1)',
          type:'text',
          data:{char:this.chars[Math.floor(Math.random()*this.chars.length)], font:'monospace'},
          drag:1
        });
      }
    }
  });

  // 16. Ion Cascade
  register({
    id:'ion_cascade', name:'Ion Cascade', category:CAT,
    onMove(m){
      for(let i=0;i<3;i++){
        spawn({
          x:m.x+rand(-4,4), y:m.y,
          vx:rand(-0.6,0.6), vy:rand(0.4,1.6),
          life:rand(60,100), size:rand(2,4),
          color:hsla(rand(195,225),100,rand(55,75),1),
          gravity:0.07, drag:0.99
        });
      }
    }
  });

  // 17. Electro Pulse — expanding rings
  register({
    id:'electro_pulse', name:'Electro Pulse', category:CAT, fade:0.3,
    cooldown:0,
    onMove(m){
      if(this.cooldown>0){ this.cooldown--; return; }
      this.cooldown = 3;
      spawn({
        x:m.x, y:m.y, vx:0, vy:0,
        life:40, size:4,
        color:'rgba(120,230,255,1)', type:'ring',
        update(p){ p.size += 2.2; p.age++; }
      });
      spawn({
        x:m.x, y:m.y, vx:0, vy:0,
        life:55, size:6,
        color:'rgba(255,79,216,0.8)', type:'ring',
        update(p){ p.size += 1.4; p.age++; }
      });
    },
    init(){ this.cooldown=0; }
  });

  // 18. Nanite Swarm — orbiting dots
  register({
    id:'nanite_swarm', name:'Nanite Swarm', category:CAT, fade:0.2,
    onMove(m){
      for(let i=0;i<3;i++){
        const a = rand(0,TAU), r = rand(6,26);
        spawn({
          x:m.x+Math.cos(a)*r, y:m.y+Math.sin(a)*r,
          vx:0, vy:0,
          life:rand(50,90), size:rand(1,2.2),
          color:'rgba(170,230,255,1)',
          data:{a, r, cx:m.x, cy:m.y, speed:rand(0.08,0.15)},
          update(p){
            p.data.a += p.data.speed;
            p.data.r *= 0.985;
            p.x = p.data.cx + Math.cos(p.data.a)*p.data.r;
            p.y = p.data.cy + Math.sin(p.data.a)*p.data.r;
            p.age++;
          }
        });
      }
    }
  });

  // 19. Pixel Storm — 8-bit chunky pixels
  register({
    id:'pixel_storm', name:'Pixel Storm', category:CAT, fade:0.2,
    onMove(m){
      const colors=['#ff4fd8','#63e7ff','#ffd24a','#7dff7d','#ff7a7a','#ffffff'];
      for(let i=0;i<4;i++){
        spawn({
          x:Math.round((m.x+rand(-10,10))/4)*4,
          y:Math.round((m.y+rand(-10,10))/4)*4,
          vx:Math.round(rand(-2,2)), vy:Math.round(rand(-2,2)),
          life:rand(30,55), size:pick([4,6,8]),
          color:pick(colors), type:'square', blend:'source-over',
          update(p){
            p.x += p.vx; p.y += p.vy;
            p.x = Math.round(p.x/2)*2; p.y = Math.round(p.y/2)*2;
            p.age++;
          }
        });
      }
    }
  });

  // 20. Chrono Echo — delayed cursor clones
  register({
    id:'chrono_echo', name:'Chrono Echo', category:CAT, fade:0.25,
    history:[],
    onMove(m){
      this.history.push({x:m.x,y:m.y});
      if(this.history.length>60) this.history.shift();
    },
    onFrame(){
      const h=this.history;
      if(!h.length) return;
      const ctx=Engine.ctx;
      ctx.globalCompositeOperation='lighter';
      const steps=[10,24,42];
      for(let s=0;s<steps.length;s++){
        const idx = Math.max(0, h.length-1-steps[s]);
        const p = h[idx];
        const a = 0.6 - s*0.18;
        const r = 14 - s*3;
        const g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,r*2);
        g.addColorStop(0,`rgba(120,230,255,${a})`);
        g.addColorStop(1,'rgba(0,0,0,0)');
        ctx.fillStyle=g;
        ctx.beginPath(); ctx.arc(p.x,p.y,r*2,0,TAU); ctx.fill();
      }
    },
    init(){ this.history=[]; }
  });

  // ---------- extended: effects 21-35 ----------
  const fx = Engine.fx;
  const reg = (id,name,onMove,extra)=>register(Object.assign({id,name,category:CAT,onMove},extra||{}));

  reg('hologram_flicker','Hologram Flicker', m=>{
    for(let i=0;i<3;i++) spawn({x:m.x+rand(-10,10),y:m.y+rand(-10,10),vx:0,vy:0,life:rand(10,20),size:rand(3,7),color:Math.random()<0.15?'rgba(255,255,255,1)':'rgba(80,220,255,0.8)',type:'square',rot:0,blend:'lighter'});
  }, {fade:0.25});
  reg('data_stream','Data Stream', m=>{
    const chars='01';
    for(let i=0;i<2;i++) spawn({x:m.x+i*14-7,y:m.y,vx:0,vy:rand(3,5),life:rand(30,55),size:12,color:'rgba(80,255,180,1)',type:'text',data:{char:pick(chars.split('')),font:'monospace'}});
  }, {fade:0.15});
  reg('circuit_trace','Circuit Trace', function(m){
    const prev=this.last||{x:m.px,y:m.py};
    const midX=prev.x, midY=m.y;
    fx.line(prev,{x:midX,y:midY},'rgba(80,220,255,0.95)',{width:1.5,life:40});
    fx.line({x:midX,y:midY},{x:m.x,y:m.y},'rgba(80,220,255,0.95)',{width:1.5,life:40});
    spawn({x:midX,y:midY,vx:0,vy:0,life:40,size:3,color:'rgba(120,240,255,1)'});
    this.last={x:m.x,y:m.y};
  }, {init(){this.last=null;}});
  reg('neon_wireframe','Neon Wireframe', m=>{
    for(let i=0;i<4;i++){
      const a=i*TAU/4+performance.now()*0.002;
      fx.line({x:m.x+Math.cos(a)*14,y:m.y+Math.sin(a)*14},{x:m.x+Math.cos(a+TAU/4)*14,y:m.y+Math.sin(a+TAU/4)*14},'rgba(255,79,216,0.9)',{width:1,life:15});
    }
  }, {fade:0.3});
  reg('emp_burst','EMP Burst', m=>{
    if(Math.random()<0.12){
      for(let r=0;r<3;r++) fx.pulseRing(m,`rgba(120,220,255,${0.9-r*0.25})`,{start:4+r*4,grow:3,life:35});
      fx.burst(m,8,{color:'rgba(180,240,255,1)',smin:2,smax:5,life:rand(20,40),size:rand(1.5,3)});
    }
  });
  reg('servo_sparks','Servo Sparks', m=>{
    fx.burst(m,6,{color:'rgba(255,240,180,1)',smin:1,smax:4,life:rand(15,30),size:rand(1,2),gravity:0.2,drag:0.97});
  });
  reg('terminal_cursor','Terminal Cursor', m=>{
    const gx=Math.round(m.x/10)*10, gy=Math.round(m.y/14)*14;
    spawn({x:gx,y:gy,vx:0,vy:0,life:30,size:10,color:'rgba(80,255,120,0.9)',type:'square',rot:0,blend:'source-over'});
  }, {fade:0.2});
  reg('motherboard','Motherboard', m=>{
    const g=16;
    for(let dx=-1;dx<=1;dx++) for(let dy=-1;dy<=1;dy++){
      if(Math.random()<0.15){
        const gx=Math.round(m.x/g)*g+dx*g, gy=Math.round(m.y/g)*g+dy*g;
        spawn({x:gx,y:gy,vx:0,vy:0,life:30,size:3,color:'rgba(120,255,180,1)'});
      }
    }
    fx.line({x:m.px,y:m.py},{x:m.x,y:m.y},'rgba(80,200,140,0.6)',{width:1,life:30});
  }, {fade:0.12});
  reg('laser_mesh','Laser Mesh', m=>{
    for(let i=0;i<4;i++){
      const a=rand(0,TAU),r=rand(18,32);
      fx.line({x:m.x,y:m.y},{x:m.x+Math.cos(a)*r,y:m.y+Math.sin(a)*r},'rgba(255,80,120,0.7)',{width:1,life:16});
    }
  }, {fade:0.25});
  reg('vector_trail','Vector Trail', function(m){
    const prev=this.last||{x:m.px,y:m.py};
    fx.line(prev,{x:m.x,y:m.y},'rgba(180,255,180,0.9)',{width:1.5,life:30});
    spawn({x:m.x,y:m.y,vx:0,vy:0,life:30,size:3,color:'rgba(180,255,180,1)',type:'triangle',rot:m.angle+Math.PI/2,blend:'source-over'});
    this.last={x:m.x,y:m.y};
  }, {init(){this.last=null;}, fade:0.2});
  reg('subroutine','Subroutine', m=>{
    const names=['exec','init','run','ret','for','if','fn'];
    if(Math.random()<0.35) spawn({x:m.x+rand(-20,20),y:m.y,vx:0,vy:rand(-0.3,0.3),life:rand(40,70),size:12,color:'rgba(120,220,255,1)',type:'text',data:{char:pick(names)+'()',font:'monospace'}});
  }, {fade:0.15});
  reg('bit_stream','Bit Stream', m=>{
    if(m.speed<0.5) return;
    const a=m.angle;
    for(let i=0;i<3;i++){
      const d=i*10;
      spawn({x:m.x-Math.cos(a)*d,y:m.y-Math.sin(a)*d,vx:0,vy:0,life:25,size:10,color:'rgba(80,255,180,1)',type:'text',data:{char:Math.random()<0.5?'0':'1',font:'monospace'}});
    }
  }, {fade:0.2});
  reg('quantum_link','Quantum Link', m=>{
    for(let i=0;i<2;i++){
      const a=rand(0,TAU),r=rand(20,40);
      const x=m.x+Math.cos(a)*r,y=m.y+Math.sin(a)*r;
      fx.line({x:m.x,y:m.y},{x,y},'rgba(180,120,255,0.7)',{width:1,life:14});
      spawn({x,y,vx:0,vy:0,life:20,size:2,color:'rgba(200,160,255,1)'});
    }
  }, {fade:0.22});
  reg('satellite_ping','Satellite Ping', m=>{
    if(Math.random()<0.08) fx.pulseRing(m,'rgba(80,220,255,0.8)',{start:4,grow:1.8,life:80});
    spawn({x:m.x,y:m.y,vx:0,vy:0,life:15,size:2.5,color:'rgba(120,230,255,1)'});
  }, {fade:0.1});
  reg('firewall','Firewall', m=>{
    for(let i=0;i<3;i++){
      const a=rand(0,TAU);
      spawn({x:m.x+Math.cos(a)*14,y:m.y+Math.sin(a)*14,vx:Math.cos(a)*1.5,vy:Math.sin(a)*1.5,life:rand(25,45),size:rand(4,7),color:hsla(rand(10,40),100,60,1),type:'triangle',rot:a+Math.PI/2,blend:'lighter'});
    }
  });

})();
