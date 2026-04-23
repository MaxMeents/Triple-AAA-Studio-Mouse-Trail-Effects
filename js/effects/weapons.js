// ============================================================
//  WEAPONS & WARFARE (25 effects)
// ============================================================
(function(){
  const { register, spawn, U, fx } = Engine;
  const { rand, pick, hsla, TAU } = U;
  const CAT = 'Weapons & Warfare';
  const reg = (id,name,onMove,extra)=>register(Object.assign({id,name,category:CAT,onMove},extra||{}));

  // 1
  reg('rifle_casings','Rifle Casings', m=>{
    if(Math.random()<0.5) fx.chunk(m,{color:'rgba(210,170,90,1)',vx:rand(-3,3),vy:-rand(1,3),size:rand(3,5),gravity:0.3});
  });
  // 2
  reg('shrapnel_storm','Shrapnel Storm', m=>{
    fx.burst(m,6,{color:hsla(rand(20,40),100,60,1),smin:2,smax:6,life:rand(40,70),size:rand(3,6),gravity:0.15,type:'triangle',rot:rand(0,TAU),rotV:rand(-0.3,0.3),blend:'source-over'});
  });
  // 3
  reg('sword_slash','Sword Slash', function(m){
    if(m.speed>2) fx.line({x:m.px,y:m.py},{x:m.x,y:m.y},'rgba(255,255,255,1)',{width:4,life:18});
    fx.puff(m,3,{color:'rgba(200,230,255,0.9)',life:rand(20,35),size:rand(2,4)});
  });
  // 4
  reg('muzzle_flash','Muzzle Flash', m=>{
    if(m.speed<1) return;
    const a=m.angle;
    for(let i=0;i<10;i++){
      const sp=rand(3,8);
      spawn({x:m.x,y:m.y,vx:Math.cos(a+rand(-0.3,0.3))*sp,vy:Math.sin(a+rand(-0.3,0.3))*sp,life:rand(15,25),size:rand(4,8),color:hsla(rand(40,55),100,70,1),drag:0.9});
    }
  });
  // 5
  reg('grenade_arc','Grenade Arc', m=>{
    if(Math.random()<0.4) spawn({x:m.x,y:m.y,vx:rand(-2,2),vy:-rand(2,4),life:rand(50,80),size:rand(4,7),color:'rgba(120,140,80,1)',gravity:0.25,type:'disc',blend:'source-over',rot:rand(0,TAU),rotV:rand(-0.2,0.2)});
  });
  // 6
  reg('tracer_line','Tracer Line', function(m){
    fx.line({x:m.px,y:m.py},{x:m.x,y:m.y},'rgba(255,160,50,1)',{width:2,life:20});
    fx.line({x:m.px,y:m.py},{x:m.x,y:m.y},'rgba(255,220,100,0.5)',{width:6,life:25});
  });
  // 7
  reg('sniper_glint','Sniper Glint', m=>{
    if(Math.random()<0.1){
      fx.pulseRing(m,'rgba(255,255,255,1)',{start:2,grow:4,life:14});
      for(let i=0;i<4;i++){
        const a=i*TAU/4;
        spawn({x:m.x,y:m.y,vx:Math.cos(a)*4,vy:Math.sin(a)*4,life:14,size:2,color:'rgba(255,255,255,1)',type:'line',data:{x1:m.x,y1:m.y,x2:m.x+Math.cos(a)*30,y2:m.y+Math.sin(a)*30},update(p){p.age++;}});
      }
    }
    fx.puff(m,1,{color:'rgba(255,255,255,1)',size:rand(1.5,3),life:15});
  });
  // 8
  reg('katana_wake','Katana Wake', {onMove:m=>{
    fx.line({x:m.px,y:m.py},{x:m.x,y:m.y},'rgba(255,255,255,1)',{width:1.5,life:28});
    fx.line({x:m.px,y:m.py},{x:m.x,y:m.y},'rgba(180,220,255,0.4)',{width:8,life:30});
  }}.onMove);
  // 9
  reg('axe_cleave','Axe Cleave', m=>{
    if(m.speed>3){
      fx.burst(m,8,{color:'rgba(200,50,50,1)',smin:1,smax:4,life:rand(25,45),size:rand(3,6),type:'triangle',rot:rand(0,TAU),blend:'source-over'});
    }
  });
  // 10
  reg('plasma_round','Plasma Round', m=>{
    spawn({x:m.x,y:m.y,vx:0,vy:0,life:25,size:8,color:'rgba(255,80,220,1)'});
    fx.puff(m,3,{color:'rgba(220,120,255,0.9)',size:rand(3,6),life:rand(25,40)});
  });
  // 11
  reg('rocket_smoke','Rocket Smoke', m=>{
    fx.rise(m,4,{color:`rgba(180,180,180,${rand(0.3,0.6)})`,life:rand(80,140),size:rand(10,18),type:'disc',blend:'source-over',update(p){p.size*=1.01;p.vx*=0.98;p.vy*=0.98;p.x+=p.vx;p.y+=p.vy;p.age++;}});
  });
  // 12
  reg('bullet_time','Bullet Time', m=>{
    for(let i=0;i<3;i++){
      const a=m.angle+rand(-0.1,0.1);
      spawn({x:m.x+rand(-10,10),y:m.y+rand(-10,10),vx:Math.cos(a)*rand(6,10),vy:Math.sin(a)*rand(6,10),life:rand(30,50),size:rand(2,4),color:'rgba(255,220,150,1)',drag:1});
      fx.line({x:m.x,y:m.y},{x:m.x+Math.cos(a)*30,y:m.y+Math.sin(a)*30},'rgba(255,220,150,0.5)',{width:1,life:20});
    }
  });
  // 13
  reg('chainsaw_sparks','Chainsaw Sparks', m=>{
    fx.burst(m,8,{color:hsla(rand(40,55),100,70,1),smin:2,smax:5,life:rand(20,35),size:rand(1,2.5),gravity:0.15,drag:0.98});
  });
  // 14
  reg('warhammer_slam','Warhammer Slam', m=>{
    if(m.speed>4){
      fx.pulseRing(m,'rgba(255,220,100,0.9)',{start:4,grow:3,life:30});
      fx.burst(m,12,{color:'rgba(180,100,50,0.9)',smin:2,smax:5,life:rand(25,45),size:rand(3,6),gravity:0.2,type:'triangle',blend:'source-over'});
    }
  });
  // 15
  reg('throwing_stars','Throwing Stars', m=>{
    if(Math.random()<0.4) spawn({x:m.x,y:m.y,vx:m.dx*0.2+rand(-1,1),vy:m.dy*0.2+rand(-1,1),life:rand(40,70),size:rand(6,10),color:'rgba(210,220,230,1)',type:'star',rot:rand(0,TAU),rotV:0.4,data:{points:4},blend:'source-over'});
  });
  // 16
  reg('dagger_flurry','Dagger Flurry', m=>{
    for(let i=0;i<2;i++){
      const a=rand(0,TAU);
      spawn({x:m.x,y:m.y,vx:Math.cos(a)*3,vy:Math.sin(a)*3,life:rand(30,50),size:rand(6,10),color:'rgba(230,230,240,1)',type:'triangle',rot:a+Math.PI/2,blend:'source-over'});
    }
  });
  // 17
  reg('cannon_recoil','Cannon Recoil', m=>{
    if(Math.random()<0.25){
      fx.pulseRing(m,'rgba(120,120,120,0.7)',{start:6,grow:2,life:40});
      fx.rise(m,5,{color:`rgba(90,90,100,${rand(0.4,0.7)})`,size:rand(10,18),type:'disc',blend:'source-over'});
    }
  });
  // 18
  reg('frag_burst','Frag Burst', m=>{
    fx.burst(m,10,{color:hsla(rand(0,30),100,60,1),smin:1,smax:4,life:rand(30,55),size:rand(2,4),gravity:0.12});
  });
  // 19
  reg('laser_sight','Laser Sight', function(m){
    fx.line({x:m.px,y:m.py},{x:m.x,y:m.y},'rgba(255,30,30,1)',{width:1,life:15});
    spawn({x:m.x,y:m.y,vx:0,vy:0,life:20,size:4,color:'rgba(255,60,60,1)'});
  });
  // 20
  reg('napalm_streak','Napalm Streak', m=>{
    fx.puff(m,4,{color:hsla(rand(10,40),100,rand(50,65),0.9),size:rand(4,9),life:rand(50,80),gravity:-0.02});
  });
  // 21
  reg('shotgun_pellets','Shotgun Pellets', m=>{
    if(Math.random()<0.3){
      const ang=m.angle||rand(0,TAU);
      for(let i=0;i<10;i++){
        const a=ang+rand(-0.5,0.5), s=rand(4,8);
        spawn({x:m.x,y:m.y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:rand(25,45),size:rand(2,3),color:'rgba(200,170,80,1)',gravity:0.1,drag:0.98,type:'disc',blend:'source-over'});
      }
    }
  });
  // 22
  reg('bow_volley','Bow Volley', m=>{
    for(let i=0;i<2;i++){
      const a=rand(-Math.PI,-Math.PI*0.3);
      spawn({x:m.x,y:m.y,vx:Math.cos(a)*rand(3,5),vy:Math.sin(a)*rand(3,5),life:rand(50,80),size:rand(8,14),color:'rgba(180,120,80,1)',type:'triangle',rot:a+Math.PI/2,gravity:0.08,blend:'source-over'});
    }
  });
  // 23
  reg('landmine_pulse','Landmine Pulse', m=>{
    if(Math.random()<0.05){
      fx.pulseRing(m,'rgba(255,80,40,0.9)',{start:4,grow:3.5,life:30});
      fx.burst(m,14,{color:hsla(rand(10,40),100,60,1),smin:3,smax:7,life:rand(30,55),size:rand(3,6),gravity:0.15});
    }
  });
  // 24
  reg('kunai_dash','Kunai Dash', m=>{
    if(m.speed>1){
      const a=m.angle;
      spawn({x:m.x,y:m.y,vx:Math.cos(a)*2,vy:Math.sin(a)*2,life:30,size:10,color:'rgba(80,80,90,1)',type:'triangle',rot:a+Math.PI/2,blend:'source-over'});
      fx.line({x:m.px,y:m.py},{x:m.x,y:m.y},'rgba(200,200,220,0.7)',{width:1,life:16});
    }
  });
  // 25
  reg('death_blossom','Death Blossom', m=>{
    if(Math.random()<0.5){
      for(let i=0;i<12;i++){
        const a=i*TAU/12;
        spawn({x:m.x,y:m.y,vx:Math.cos(a)*rand(2,4),vy:Math.sin(a)*rand(2,4),life:rand(30,50),size:rand(3,5),color:hsla(rand(0,40),100,65,1),drag:0.96});
      }
    }
  });
})();
