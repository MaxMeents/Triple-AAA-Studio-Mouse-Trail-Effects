// ============================================================
//  FIRE & COMBAT effects (10)
// ============================================================
(function(){
  const { register, spawn, U, mouse } = Engine;
  const { rand, randi, pick, hsla, TAU } = U;
  const CAT = 'Fire & Combat';

  // 1. Ember Wake
  register({
    id:'ember_wake', name:'Ember Wake', category:CAT,
    onMove(m){
      const n = 2 + Math.min(6, m.speed/4);
      for(let i=0;i<n;i++){
        const h = rand(8, 44);
        spawn({
          x:m.x+rand(-5,5), y:m.y+rand(-5,5),
          vx:m.dx*0.05+rand(-0.6,0.6), vy:-rand(0.4,1.8),
          life:rand(40,90), size:rand(1.5,3.5),
          color:hsla(h,100,rand(55,70),0.9),
          gravity:-0.015, drag:0.985
        });
      }
    }
  });

  // 2. Magma Trail
  register({
    id:'magma_trail', name:'Magma Trail', category:CAT, fade:0.18,
    onMove(m){
      for(let i=0;i<4;i++){
        spawn({
          x:m.x+rand(-8,8), y:m.y+rand(-6,6),
          vx:rand(-0.4,0.4), vy:rand(-1.2,-0.2),
          life:rand(50,90), size:rand(6,14),
          color:hsla(rand(0,30),100,rand(45,60),0.7),
          shrink:0.97, drag:0.97
        });
      }
      for(let i=0;i<2;i++){ // sparks
        spawn({
          x:m.x, y:m.y,
          vx:rand(-3,3), vy:rand(-3,0),
          life:rand(20,35), size:rand(1,2),
          color:hsla(rand(40,60),100,75,1),
          gravity:0.12, drag:0.99
        });
      }
    }
  });

  // 3. Dragon Breath — forward cone from travel direction
  register({
    id:'dragon_breath', name:'Dragon Breath', category:CAT,
    onMove(m){
      if(m.speed<0.1) return;
      const ang = m.angle;
      for(let i=0;i<8;i++){
        const spread = rand(-0.5, 0.5);
        const sp = rand(1, 4) + m.speed*0.15;
        spawn({
          x:m.x, y:m.y,
          vx:Math.cos(ang+spread)*sp, vy:Math.sin(ang+spread)*sp,
          life:rand(30,60), size:rand(4,9),
          color:hsla(rand(0,45),100,rand(55,70),0.85),
          shrink:0.96, drag:0.96
        });
      }
    }
  });

  // 4. Crimson Flare
  register({
    id:'crimson_flare', name:'Crimson Flare', category:CAT,
    onMove(m){
      for(let i=0;i<3;i++){
        spawn({
          x:m.x, y:m.y,
          vx:rand(-2,2), vy:rand(-2,2),
          life:rand(25,50), size:rand(2,5),
          color:hsla(rand(350,10),100,rand(50,65),1),
          drag:0.94
        });
      }
      spawn({ // flare ring
        x:m.x, y:m.y, vx:0, vy:0,
        life:22, size:4, color:'rgba(255,60,80,0.9)',
        type:'ring',
        update(p){ p.size += 1.8; p.age++; }
      });
    }
  });

  // 5. Soul Flame — ghost-blue fire
  register({
    id:'soul_flame', name:'Soul Flame', category:CAT,
    onMove(m){
      for(let i=0;i<4;i++){
        spawn({
          x:m.x+rand(-6,6), y:m.y+rand(-4,4),
          vx:rand(-0.3,0.3), vy:-rand(0.5,1.6),
          life:rand(60,110), size:rand(3,6),
          color:hsla(rand(160,210),100,rand(55,75),0.75),
          gravity:-0.02, drag:0.985,
          update(p){
            p.vx += Math.sin((p.age+p.x)*0.06)*0.08;
            p.vy += p.gravity; p.x+=p.vx; p.y+=p.vy;
            p.vx*=p.drag; p.age++;
          }
        });
      }
    }
  });

  // 6. Thunderstrike — branching lightning segments
  register({
    id:'thunderstrike', name:'Thunderstrike', category:CAT, fade:0.35,
    onMove(m){
      if(m.speed<2) return;
      let x=m.px, y=m.py;
      const steps = 10;
      for(let i=0;i<steps;i++){
        const nx = U.lerp(m.px,m.x,(i+1)/steps) + rand(-8,8);
        const ny = U.lerp(m.py,m.y,(i+1)/steps) + rand(-8,8);
        spawn({
          x:0,y:0, life:10, size:rand(1.2,2.2), age:0,
          color:'rgba(220,235,255,1)',
          type:'line',
          data:{ x1:x, y1:y, x2:nx, y2:ny },
          update(p){ p.age++; }
        });
        // glow dot
        spawn({ x:nx, y:ny, vx:0, vy:0, life:20, size:rand(2,4),
                color:'rgba(170,210,255,1)' });
        x=nx; y=ny;
      }
    }
  });

  // 7. Blood Moon — dark red droplets
  register({
    id:'blood_moon', name:'Blood Moon', category:CAT,
    onMove(m){
      for(let i=0;i<2;i++){
        spawn({
          x:m.x+rand(-3,3), y:m.y+rand(-3,3),
          vx:rand(-1,1), vy:rand(0,2),
          life:rand(70,120), size:rand(3,6),
          color:hsla(rand(345,360),rand(70,95),rand(25,40),0.95),
          type:'disc', blend:'source-over',
          gravity:0.12, drag:0.99
        });
      }
    }
  });

  // 8. Gold Rush — cascading coins/sparks
  register({
    id:'gold_rush', name:'Gold Rush', category:CAT,
    onMove(m){
      for(let i=0;i<3;i++){
        spawn({
          x:m.x+rand(-6,6), y:m.y,
          vx:rand(-1.5,1.5), vy:rand(-2,-0.5),
          life:rand(60,100), size:rand(3,6),
          color:hsla(rand(40,55),100,rand(55,70),1),
          gravity:0.15, drag:0.995,
          type:'star', rot:rand(0,TAU), rotV:rand(-0.15,0.15),
          data:{points:5}
        });
      }
    }
  });

  // 9. Heart Strike — love pulses
  register({
    id:'heart_strike', name:'Heart Strike', category:CAT,
    onMove(m){
      if(Math.random()<0.45){
        spawn({
          x:m.x+rand(-6,6), y:m.y+rand(-6,6),
          vx:rand(-0.6,0.6), vy:-rand(0.4,1.2),
          life:rand(50,80), size:rand(12,22),
          color:hsla(rand(330,355),100,rand(55,70),1),
          rot:rand(-0.3,0.3),
          render(ctx,p,t){
            ctx.globalCompositeOperation='lighter';
            ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot);
            ctx.scale(p.size/20, p.size/20);
            ctx.fillStyle=p.color;
            ctx.beginPath();
            ctx.moveTo(0,4);
            ctx.bezierCurveTo(-12,-6,-8,-16,0,-8);
            ctx.bezierCurveTo(8,-16,12,-6,0,4);
            ctx.closePath(); ctx.fill();
            ctx.restore();
          }
        });
      }
    }
  });

  // 10. Firefly Swarm — wandering glow dots that linger
  register({
    id:'firefly_swarm', name:'Firefly Swarm', category:CAT, fade:0.12,
    onMove(m){
      if(Math.random()<0.5){
        spawn({
          x:m.x+rand(-10,10), y:m.y+rand(-10,10),
          vx:rand(-0.4,0.4), vy:rand(-0.4,0.4),
          life:rand(140,240), size:rand(1.5,3),
          color:hsla(rand(55,75),100,65,1),
          data:{ph:rand(0,TAU)},
          update(p){
            p.data.ph += 0.06;
            p.vx += Math.cos(p.data.ph)*0.05;
            p.vy += Math.sin(p.data.ph*0.7)*0.05;
            p.vx*=0.96; p.vy*=0.96;
            p.x+=p.vx; p.y+=p.vy; p.age++;
            p.alpha = 0.5 + 0.5*Math.sin(p.data.ph*1.4);
          }
        });
      }
    }
  });

  // ---------- extended: effects 11-25 ----------
  const fx = Engine.fx;
  const reg = (id,name,onMove,extra)=>register(Object.assign({id,name,category:CAT,onMove},extra||{}));

  reg('inferno_wave','Inferno Wave', m=>{
    fx.pulseRing(m,'rgba(255,120,40,0.9)',{start:6,grow:2.5,life:30});
    fx.rise(m,4,{color:hsla(rand(10,40),100,rand(55,70),0.9),size:rand(6,11),life:rand(40,70),gravity:-0.03});
  });
  reg('pyro_burst','Pyro Burst', m=>{
    fx.burst(m,12,{color:hsla(rand(5,40),100,rand(55,70),1),smin:2,smax:6,life:rand(25,45),size:rand(2,4),gravity:0.05,drag:0.95});
  });
  reg('hellfire_chain','Hellfire Chain', m=>{
    fx.line({x:m.px,y:m.py},{x:m.x,y:m.y},'rgba(255,60,20,1)',{width:3,life:20});
    fx.line({x:m.px,y:m.py},{x:m.x,y:m.y},'rgba(255,180,60,0.5)',{width:10,life:25});
    fx.rise(m,2,{color:'rgba(40,0,0,0.8)',size:rand(8,14),life:rand(60,90)});
  });
  reg('flame_whip','Flame Whip', function(m){
    const prev=this.last||{x:m.px,y:m.py};
    fx.line(prev,{x:m.x,y:m.y},hsla(rand(10,40),100,60,0.95),{width:rand(2,4),life:22});
    for(let i=0;i<2;i++) fx.rise(m,1,{color:hsla(rand(20,50),100,65,0.8),size:rand(4,7),life:rand(30,60)});
    this.last={x:m.x,y:m.y};
  }, {init(){this.last=null;}});
  reg('volcano_spit','Volcano Spit', m=>{
    for(let i=0;i<3;i++){
      const a=rand(-Math.PI*0.9,-Math.PI*0.1);
      spawn({x:m.x,y:m.y,vx:Math.cos(a)*rand(2,5),vy:Math.sin(a)*rand(2,5),life:rand(50,80),size:rand(4,8),color:hsla(rand(5,30),100,rand(45,60),1),gravity:0.2,type:'disc',blend:'source-over'});
    }
  });
  reg('scorched_earth','Scorched Earth', m=>{
    for(let i=0;i<3;i++) spawn({x:m.x+rand(-12,12),y:m.y+rand(-6,6),vx:rand(-0.2,0.2),vy:rand(-0.2,0.2),life:rand(120,200),size:rand(8,16),color:`rgba(${U.randi(30,60)},${U.randi(15,30)},10,${rand(0.5,0.75)})`,type:'disc',blend:'source-over',update(p){p.size*=1.008;p.x+=p.vx;p.y+=p.vy;p.age++;}});
    fx.puff(m,2,{color:hsla(rand(20,50),100,60,0.9),size:rand(2,4),life:rand(30,55)});
  });
  reg('flare_gun','Flare Gun', m=>{
    if(Math.random()<0.25){
      fx.pulseRing(m,'rgba(255,120,40,0.95)',{start:3,grow:2.5,life:25});
      spawn({x:m.x,y:m.y,vx:0,vy:0,life:22,size:10,color:'rgba(255,220,140,1)'});
    }
    fx.rise(m,1,{color:'rgba(200,80,40,0.7)',size:rand(8,14),life:rand(80,120)});
  });
  reg('cinders','Cinders', m=>{
    for(let i=0;i<4;i++) spawn({x:m.x+rand(-6,6),y:m.y,vx:rand(-0.5,0.5),vy:-rand(0.8,2),life:rand(80,140),size:rand(1,2.5),color:hsla(rand(20,45),100,rand(55,70),1),gravity:-0.015,drag:0.985});
  });
  reg('bonfire_smoke','Bonfire Smoke', m=>{
    fx.rise(m,3,{color:`rgba(${U.randi(100,140)},${U.randi(80,110)},${U.randi(70,100)},${rand(0.35,0.6)})`,size:rand(10,18),life:rand(100,160),type:'disc',blend:'source-over',update(p){p.size*=1.012;p.vx+=rand(-0.03,0.03);p.x+=p.vx;p.y+=p.vy;p.age++;}});
    fx.puff(m,1,{color:hsla(rand(10,40),100,65,0.95),size:rand(2,4),life:rand(20,40)});
  });
  reg('firework_bloom','Firework Bloom', m=>{
    if(Math.random()<0.15){
      const hue=rand(0,360);
      for(let i=0;i<20;i++){
        const a=i*TAU/20, s=rand(2,5);
        spawn({x:m.x,y:m.y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:rand(40,70),size:rand(2,4),color:hsla(hue+rand(-20,20),100,70,1),gravity:0.07,drag:0.97});
      }
    }
    fx.puff(m,1,{color:'rgba(255,255,255,1)',size:rand(1,2),life:15});
  });
  reg('torch_light','Torch Light', m=>{
    fx.rise(m,3,{color:hsla(rand(25,45),100,rand(55,70),0.85),size:rand(5,10),life:rand(40,70),gravity:-0.04});
    if(Math.random()<0.3) spawn({x:m.x+rand(-2,2),y:m.y,vx:rand(-0.3,0.3),vy:-rand(0.5,1.5),life:rand(50,80),size:rand(1,2),color:'rgba(255,230,150,1)',gravity:-0.01});
  });
  reg('meteor_flame','Meteor Flame', function(m){
    spawn({x:m.x,y:m.y,vx:m.dx*0.1,vy:m.dy*0.1,life:30,size:rand(7,11),color:'rgba(255,200,100,1)',drag:0.95});
    for(let i=0;i<4;i++) spawn({x:m.x+rand(-3,3),y:m.y+rand(-3,3),vx:-m.dx*0.1+rand(-0.5,0.5),vy:-m.dy*0.1+rand(-0.5,0.5),life:rand(30,55),size:rand(3,5),color:hsla(rand(10,40),100,rand(55,70),0.9),drag:0.94});
  });
  reg('coal_spark','Coal Spark', m=>{
    for(let i=0;i<2;i++) spawn({x:m.x+rand(-4,4),y:m.y+rand(-4,4),vx:rand(-0.3,0.3),vy:rand(-0.3,0.3),life:rand(60,100),size:rand(3,6),color:'rgba(30,20,20,0.9)',type:'disc',blend:'source-over'});
    if(Math.random()<0.4) spawn({x:m.x,y:m.y,vx:rand(-1.5,1.5),vy:-rand(0.5,2),life:rand(25,45),size:rand(1,2),color:hsla(rand(20,45),100,70,1),gravity:0.05});
  });
  reg('wildfire','Wildfire', m=>{
    for(let i=0;i<6;i++){
      const a=rand(0,TAU);
      spawn({x:m.x,y:m.y,vx:Math.cos(a)*rand(1,3),vy:Math.sin(a)*rand(1,3)-1,life:rand(40,80),size:rand(4,8),color:hsla(rand(0,40),100,rand(50,65),0.9),gravity:-0.02,drag:0.96});
    }
  });
  reg('brimstone','Brimstone', m=>{
    fx.rise(m,2,{color:'rgba(255,200,40,0.8)',size:rand(5,9),life:rand(50,80),gravity:-0.03});
    for(let i=0;i<2;i++) spawn({x:m.x+rand(-4,4),y:m.y,vx:rand(-0.3,0.3),vy:rand(0.3,1.2),life:rand(60,100),size:rand(3,6),color:'rgba(80,40,10,0.9)',type:'disc',blend:'source-over',gravity:0.12});
  });

})();
