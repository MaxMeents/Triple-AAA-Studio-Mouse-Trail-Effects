// ============================================================
//  COSMIC & SPACE effects (10)
// ============================================================
(function(){
  const { register, spawn, U } = Engine;
  const { rand, pick, hsla, TAU, lerp } = U;
  const CAT = 'Cosmic & Space';

  // 41. Plasma Rift — twisting magenta/cyan strands
  register({
    id:'plasma_rift', name:'Plasma Rift', category:CAT, fade:0.12,
    onMove(m){
      for(let i=0;i<5;i++){
        const a = rand(0,TAU);
        spawn({
          x:m.x, y:m.y,
          vx:Math.cos(a)*rand(0.5,2), vy:Math.sin(a)*rand(0.5,2),
          life:rand(50,90), size:rand(3,6),
          color:hsla(Math.random()<0.5?rand(280,320):rand(180,210),100,rand(55,70),0.9),
          update(p){
            p.vx += Math.cos((p.age)*0.2 + p.x*0.01)*0.12;
            p.vy += Math.sin((p.age)*0.2 + p.y*0.01)*0.12;
            p.vx*=0.97; p.vy*=0.97;
            p.x+=p.vx; p.y+=p.vy; p.age++;
          }
        });
      }
    }
  });

  // 42. Stardust Veil — tiny twinkling stars
  register({
    id:'stardust_veil', name:'Stardust Veil', category:CAT, fade:0.08,
    onMove(m){
      for(let i=0;i<4;i++){
        spawn({
          x:m.x+rand(-18,18), y:m.y+rand(-18,18),
          vx:rand(-0.15,0.15), vy:rand(-0.15,0.15),
          life:rand(100,180), size:rand(0.8,2),
          color:hsla(rand(180,260),60,rand(75,95),1),
          data:{ph:rand(0,TAU)},
          update(p){
            p.data.ph += 0.12;
            p.alpha = 0.3 + 0.7*Math.abs(Math.sin(p.data.ph));
            p.x+=p.vx; p.y+=p.vy; p.age++;
          }
        });
      }
    }
  });

  // 43. Void Whisper — deep purple smoke
  register({
    id:'void_whisper', name:'Void Whisper', category:CAT, fade:0.08,
    onMove(m){
      for(let i=0;i<3;i++){
        spawn({
          x:m.x+rand(-8,8), y:m.y+rand(-8,8),
          vx:rand(-0.3,0.3), vy:rand(-0.3,0.3),
          life:rand(100,180), size:rand(12,22),
          color:`rgba(${U.randi(30,60)},10,${U.randi(60,110)},${rand(0.25,0.5)})`,
          type:'disc', blend:'source-over',
          update(p){ p.size*=1.01; p.x+=p.vx; p.y+=p.vy; p.age++; }
        });
      }
    }
  });

  // 44. Nebula Drift — large soft color clouds
  register({
    id:'nebula_drift', name:'Nebula Drift', category:CAT, fade:0.06,
    onMove(m){
      for(let i=0;i<2;i++){
        spawn({
          x:m.x+rand(-20,20), y:m.y+rand(-20,20),
          vx:rand(-0.2,0.2), vy:rand(-0.2,0.2),
          life:rand(160,260), size:rand(30,60),
          color:hsla(rand(210,330),80,rand(45,65),0.18),
          update(p){ p.size*=1.005; p.x+=p.vx; p.y+=p.vy; p.age++; }
        });
      }
    }
  });

  // 45. Quantum Foam — flickering micro dots
  register({
    id:'quantum_foam', name:'Quantum Foam', category:CAT, fade:0.3,
    onMove(m){
      for(let i=0;i<12;i++){
        spawn({
          x:m.x+rand(-24,24), y:m.y+rand(-24,24),
          vx:0, vy:0,
          life:rand(6,16), size:rand(0.8,2),
          color:hsla(rand(0,360),100,rand(60,85),1),
          type:'disc', blend:'lighter'
        });
      }
    }
  });

  // 46. Photon Beam — white beam line
  register({
    id:'photon_beam', name:'Photon Beam', category:CAT, fade:0.35,
    last:null,
    onMove(m){
      const prev=this.last||{x:m.px,y:m.py};
      spawn({
        x:0,y:0,age:0,life:22,size:3.5,
        color:'rgba(255,255,255,1)',
        type:'line',
        data:{x1:prev.x,y1:prev.y,x2:m.x,y2:m.y},
        update(p){ p.age++; }
      });
      spawn({
        x:0,y:0,age:0,life:30,size:8,
        color:'rgba(120,230,255,0.6)',
        type:'line',
        data:{x1:prev.x,y1:prev.y,x2:m.x,y2:m.y},
        update(p){ p.age++; }
      });
      this.last={x:m.x,y:m.y};
    },
    init(){ this.last=null; }
  });

  // 47. Prism Arc — rainbow arcs
  register({
    id:'prism_arc', name:'Prism Arc', category:CAT, fade:0.15,
    hue:0,
    onMove(m){
      this.hue = (this.hue+6)%360;
      for(let i=0;i<4;i++){
        spawn({
          x:m.x+rand(-3,3), y:m.y+rand(-3,3),
          vx:rand(-1.5,1.5), vy:rand(-1.5,1.5),
          life:rand(40,70), size:rand(3,6),
          color:hsla((this.hue+i*12)%360,100,65,1),
          drag:0.95
        });
      }
    },
    init(){ this.hue=0; }
  });

  // 48. Vortex Warp — particles spiraling outward
  register({
    id:'vortex_warp', name:'Vortex Warp', category:CAT, fade:0.15,
    onMove(m){
      for(let i=0;i<3;i++){
        const a=rand(0,TAU);
        spawn({
          x:m.x+Math.cos(a)*4, y:m.y+Math.sin(a)*4,
          vx:0, vy:0,
          life:rand(50,90), size:rand(2,4),
          color:hsla(rand(180,260),100,70,1),
          data:{a, r:4, cx:m.x, cy:m.y, spin:rand(0.2,0.35)},
          update(p){
            p.data.a += p.data.spin;
            p.data.r += 1.2;
            p.x = p.data.cx + Math.cos(p.data.a)*p.data.r;
            p.y = p.data.cy + Math.sin(p.data.a)*p.data.r;
            p.age++;
          }
        });
      }
    }
  });

  // 49. Blackhole — inward spiral, disappear at center
  register({
    id:'blackhole', name:'Blackhole', category:CAT, fade:0.18,
    onMove(m){
      for(let i=0;i<4;i++){
        const a=rand(0,TAU), r=rand(40,80);
        spawn({
          x:m.x+Math.cos(a)*r, y:m.y+Math.sin(a)*r,
          vx:0, vy:0,
          life:rand(40,70), size:rand(1.5,3),
          color:hsla(rand(260,320),100,70,1),
          data:{a, r, cx:m.x, cy:m.y, spin:rand(0.22,0.3)},
          update(p){
            p.data.a += p.data.spin;
            p.data.r *= 0.94;
            p.x = p.data.cx + Math.cos(p.data.a)*p.data.r;
            p.y = p.data.cy + Math.sin(p.data.a)*p.data.r;
            p.age++;
          }
        });
      }
      // event horizon dot
      spawn({ x:m.x, y:m.y, vx:0, vy:0, life:10, size:6, color:'rgba(0,0,0,1)', type:'disc', blend:'source-over' });
    }
  });

  // 50. Starfall — shooting stars with tails
  register({
    id:'starfall', name:'Starfall', category:CAT, fade:0.18,
    onMove(m){
      if(Math.random()<0.5){
        const ang = rand(Math.PI*0.15, Math.PI*0.35); // down-right
        const sp = rand(4,7);
        spawn({
          x:m.x, y:m.y,
          vx:Math.cos(ang)*sp, vy:Math.sin(ang)*sp,
          life:rand(40,70), size:rand(2,3.5),
          color:'rgba(255,255,255,1)',
          data:{tail:[]},
          update(p){
            p.data.tail.push({x:p.x,y:p.y});
            if(p.data.tail.length>14) p.data.tail.shift();
            p.x+=p.vx; p.y+=p.vy; p.age++;
          },
          render(ctx,pp,t){
            ctx.globalCompositeOperation='lighter';
            const tail=pp.data.tail;
            for(let i=0;i<tail.length-1;i++){
              const a = (i/tail.length) * t;
              ctx.strokeStyle=`rgba(180,220,255,${a})`;
              ctx.lineWidth = (i/tail.length)*3;
              ctx.beginPath();
              ctx.moveTo(tail[i].x,tail[i].y);
              ctx.lineTo(tail[i+1].x,tail[i+1].y);
              ctx.stroke();
            }
            const g=ctx.createRadialGradient(pp.x,pp.y,0,pp.x,pp.y,pp.size*4);
            g.addColorStop(0,'rgba(255,255,255,1)');
            g.addColorStop(1,'rgba(255,255,255,0)');
            ctx.fillStyle=g;
            ctx.beginPath(); ctx.arc(pp.x,pp.y,pp.size*4,0,TAU); ctx.fill();
          }
        });
      }
    }
  });

  // ---------- extended: effects 51-65 ----------
  const fx = Engine.fx;
  const reg = (id,name,onMove,extra)=>register(Object.assign({id,name,category:CAT,onMove},extra||{}));

  reg('supernova','Supernova', m=>{
    if(Math.random()<0.1){
      for(let r=0;r<3;r++) fx.pulseRing(m,`rgba(255,${180+r*20},${120+r*40},${0.95-r*0.25})`,{start:4+r*4,grow:3.5,life:40});
      fx.burst(m,16,{color:hsla(rand(30,60),100,70,1),smin:2,smax:7,life:rand(30,60),size:rand(2,4)});
    }
    spawn({x:m.x,y:m.y,vx:0,vy:0,life:20,size:6,color:'rgba(255,240,200,1)'});
  });
  reg('constellation','Constellation', function(m){
    this.pts=this.pts||[];
    if(Math.random()<0.2){
      this.pts.push({x:m.x+rand(-10,10),y:m.y+rand(-10,10),life:180,age:0});
      if(this.pts.length>18) this.pts.shift();
    }
  }, {onFrame(){const ctx=Engine.ctx,pts=this.pts;if(!pts)return;ctx.globalCompositeOperation='lighter';for(let i=0;i<pts.length;i++){pts[i].age++;}for(let i=0;i<pts.length;i++){for(let j=i+1;j<pts.length;j++){const d=Math.hypot(pts[i].x-pts[j].x,pts[i].y-pts[j].y);if(d<80){const a=(1-d/80)*(1-pts[i].age/pts[i].life);if(a>0){ctx.strokeStyle=`rgba(200,220,255,${a*0.5})`;ctx.lineWidth=0.6;ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.stroke();}}}}for(const p of pts){const a=1-p.age/p.life;ctx.fillStyle=`rgba(255,255,255,${a})`;ctx.beginPath();ctx.arc(p.x,p.y,2,0,TAU);ctx.fill();}this.pts=pts.filter(p=>p.age<p.life);}, init(){this.pts=[];}, fade:0.04});
  reg('wormhole','Wormhole', m=>{
    for(let i=0;i<5;i++){
      const a=rand(0,TAU),r=rand(40,70);
      spawn({x:m.x+Math.cos(a)*r,y:m.y+Math.sin(a)*r,vx:0,vy:0,life:rand(40,70),size:rand(2,4),color:hsla(rand(220,290),100,70,1),data:{a,r,cx:m.x,cy:m.y,spin:0.28},update(p){p.data.a+=p.data.spin;p.data.r*=0.92;p.x=p.data.cx+Math.cos(p.data.a)*p.data.r;p.y=p.data.cy+Math.sin(p.data.a)*p.data.r;p.age++;}});
    }
  });
  reg('cosmic_ray','Cosmic Ray', m=>{
    if(Math.random()<0.25){
      const a=rand(0,TAU);
      fx.line({x:m.x-Math.cos(a)*60,y:m.y-Math.sin(a)*60},{x:m.x+Math.cos(a)*60,y:m.y+Math.sin(a)*60},hsla(rand(180,300),100,75,1),{width:1,life:18});
    }
    spawn({x:m.x,y:m.y,vx:0,vy:0,life:12,size:2,color:'rgba(220,240,255,1)'});
  });
  reg('galaxy_spiral','Galaxy Spiral', function(m){
    this.t=(this.t||0)+0.4;
    for(let arm=0;arm<3;arm++){
      const a=this.t+arm*TAU/3, r=4+this.t*0.8;
      spawn({x:m.x+Math.cos(a)*r,y:m.y+Math.sin(a)*r,vx:0,vy:0,life:rand(60,100),size:rand(1.5,3),color:hsla(rand(200,280),100,rand(65,80),1)});
    }
    if(this.t>30) this.t=0;
  }, {init(){this.t=0;}, fade:0.08});
  reg('solar_flare','Solar Flare', m=>{
    const a=m.angle||rand(0,TAU);
    for(let i=0;i<5;i++){
      const sp=rand(3,7);
      spawn({x:m.x,y:m.y,vx:Math.cos(a+rand(-0.2,0.2))*sp,vy:Math.sin(a+rand(-0.2,0.2))*sp,life:rand(30,55),size:rand(5,9),color:hsla(rand(30,55),100,rand(55,70),0.95),drag:0.94});
    }
    spawn({x:m.x,y:m.y,vx:0,vy:0,life:20,size:10,color:'rgba(255,240,180,1)'});
  });
  reg('dark_matter','Dark Matter', m=>{
    for(let i=0;i<3;i++) spawn({x:m.x+rand(-12,12),y:m.y+rand(-12,12),vx:rand(-0.3,0.3),vy:rand(-0.3,0.3),life:rand(150,240),size:rand(10,18),color:`rgba(${U.randi(10,30)},0,${U.randi(20,50)},${rand(0.5,0.75)})`,type:'disc',blend:'source-over',update(p){p.size*=1.006;p.x+=p.vx;p.y+=p.vy;p.age++;}});
  }, {fade:0.04});
  reg('ion_storm','Ion Storm', m=>{
    for(let i=0;i<4;i++){
      const a=rand(0,TAU);
      spawn({x:m.x,y:m.y,vx:Math.cos(a)*rand(1,4),vy:Math.sin(a)*rand(1,4),life:rand(30,60),size:rand(2,4),color:hsla(rand(180,220),100,75,1),drag:0.96,update(p){if(Math.random()<0.2){p.vx+=rand(-1,1);p.vy+=rand(-1,1);}p.vx*=p.drag;p.vy*=p.drag;p.x+=p.vx;p.y+=p.vy;p.age++;}});
    }
  });
  reg('pulsar_beat','Pulsar Beat', m=>{
    const beat=Math.floor(performance.now()/200)%2;
    if(beat) fx.pulseRing(m,'rgba(180,220,255,0.9)',{start:4,grow:3,life:20});
    spawn({x:m.x,y:m.y,vx:0,vy:0,life:15,size:beat?8:4,color:'rgba(220,240,255,1)'});
  });
  reg('comet_tail','Comet Tail', function(m){
    spawn({x:m.x,y:m.y,vx:0,vy:0,life:30,size:rand(5,8),color:'rgba(255,255,255,1)'});
    const a=m.angle;
    for(let i=1;i<10;i++){
      spawn({x:m.x-Math.cos(a)*i*4,y:m.y-Math.sin(a)*i*4,vx:0,vy:0,life:rand(15,30),size:rand(1.5,3.5),color:hsla(200-i*8,100,rand(65,80),1-i*0.08)});
    }
  }, {fade:0.2});
  reg('asteroid_belt','Asteroid Belt', m=>{
    fx.orbit(m,3,{r:rand(18,36),spin:rand(0.06,0.1),color:`rgba(${U.randi(120,160)},${U.randi(110,140)},${U.randi(90,120)},1)`,size:rand(2,5),drift:1});
  });
  reg('stellar_wind','Stellar Wind', m=>{
    for(let i=0;i<5;i++){
      const a=rand(0,TAU);
      spawn({x:m.x+Math.cos(a)*12,y:m.y+Math.sin(a)*12,vx:Math.cos(a)*rand(2,4),vy:Math.sin(a)*rand(2,4),life:rand(30,55),size:rand(1.5,3),color:hsla(rand(40,60),100,rand(75,90),0.9),drag:0.98});
    }
  });
  reg('quasar_flash','Quasar Flash', m=>{
    if(Math.random()<0.08){
      fx.pulseRing(m,'rgba(255,255,255,1)',{start:2,grow:5,life:15});
      for(let i=0;i<2;i++){
        const a=i*Math.PI;
        fx.line({x:m.x-Math.cos(a)*100,y:m.y-Math.sin(a)*100},{x:m.x+Math.cos(a)*100,y:m.y+Math.sin(a)*100},'rgba(200,230,255,0.9)',{width:2,life:15});
      }
    }
    spawn({x:m.x,y:m.y,vx:0,vy:0,life:15,size:3,color:'rgba(220,240,255,1)'});
  });
  reg('event_horizon','Event Horizon', m=>{
    for(let i=0;i<4;i++){
      const a=rand(0,TAU),r=rand(30,55);
      spawn({x:m.x+Math.cos(a)*r,y:m.y+Math.sin(a)*r,vx:0,vy:0,life:rand(40,70),size:rand(2,4),color:hsla(rand(30,50),100,75,1),data:{a,r,cx:m.x,cy:m.y,spin:0.2},update(p){p.data.a+=p.data.spin;p.data.r*=0.96;p.x=p.data.cx+Math.cos(p.data.a)*p.data.r;p.y=p.data.cy+Math.sin(p.data.a)*p.data.r;p.age++;}});
    }
    fx.pulseRing(m,'rgba(255,180,80,0.6)',{start:20,grow:0.2,life:40,blend:'lighter'});
    spawn({x:m.x,y:m.y,vx:0,vy:0,life:15,size:10,color:'rgba(0,0,0,1)',type:'disc',blend:'source-over'});
  });
  reg('big_bang','Big Bang', m=>{
    if(Math.random()<0.08){
      spawn({x:m.x,y:m.y,vx:0,vy:0,life:14,size:30,color:'rgba(255,255,255,1)'});
      for(let i=0;i<40;i++){
        const a=rand(0,TAU),s=rand(3,10);
        spawn({x:m.x,y:m.y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:rand(40,80),size:rand(1.5,3),color:hsla(rand(0,360),100,rand(65,85),1),drag:0.98});
      }
    }
  });

})();
