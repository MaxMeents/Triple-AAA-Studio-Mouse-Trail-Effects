// ============================================================
//  HORROR & UNDEAD (25 effects)
// ============================================================
(function(){
  const { register, spawn, U, fx } = Engine;
  const { rand, pick, hsla, TAU } = U;
  const CAT = 'Horror & Undead';
  const reg = (id,name,onMove,extra)=>register(Object.assign({id,name,category:CAT,onMove},extra||{}));

  reg('ghost_veil','Ghost Veil', m=>{
    for(let i=0;i<3;i++) spawn({x:m.x+rand(-10,10),y:m.y+rand(-10,10),vx:rand(-0.2,0.2),vy:-rand(0.1,0.5),life:rand(120,200),size:rand(14,24),color:`rgba(220,230,245,${rand(0.15,0.3)})`,type:'disc',blend:'lighter',update(p){p.size*=1.01;p.x+=p.vx;p.y+=p.vy;p.age++;}});
  }, {fade:0.06});
  reg('blood_mist','Blood Mist', m=>{
    for(let i=0;i<3;i++) spawn({x:m.x+rand(-10,10),y:m.y+rand(-10,10),vx:rand(-0.3,0.3),vy:rand(-0.3,0.3),life:rand(100,170),size:rand(10,20),color:`rgba(${U.randi(100,160)},10,20,${rand(0.2,0.45)})`,type:'disc',blend:'source-over',update(p){p.size*=1.012;p.x+=p.vx;p.y+=p.vy;p.age++;}});
  }, {fade:0.08});
  reg('bone_wake','Bone Wake', m=>{
    if(Math.random()<0.3) fx.emoji(m,'🦴',{size:rand(16,24),color:'rgba(245,235,215,1)',blend:'source-over'});
    fx.puff(m,2,{color:'rgba(220,210,190,0.7)',size:rand(1.5,3),life:rand(50,90)});
  });
  reg('zombie_rot','Zombie Rot', m=>{
    for(let i=0;i<3;i++) spawn({x:m.x+rand(-8,8),y:m.y+rand(-8,8),vx:rand(-0.3,0.3),vy:-rand(0.2,0.7),life:rand(80,140),size:rand(8,16),color:`rgba(${U.randi(90,130)},${U.randi(100,140)},${U.randi(40,70)},${rand(0.3,0.5)})`,type:'disc',blend:'source-over',update(p){p.size*=1.01;p.x+=p.vx;p.y+=p.vy;p.age++;}});
  });
  reg('vampire_bats','Vampire Bats', m=>{
    if(Math.random()<0.35) fx.emoji(m,'🦇',{size:rand(14,22),color:'rgba(40,20,50,1)',blend:'source-over',vy:rand(-1,1),vx:rand(-1.5,1.5)});
  });
  reg('demon_eye','Demon Eye', m=>{
    fx.pulseRing(m,'rgba(255,30,30,0.8)',{start:3,grow:0.9,life:40});
    spawn({x:m.x,y:m.y,vx:0,vy:0,life:20,size:4,color:'rgba(255,60,60,1)'});
  });
  reg('cursed_ink','Cursed Ink', m=>{
    for(let i=0;i<3;i++) spawn({x:m.x+rand(-6,6),y:m.y+rand(-6,6),vx:rand(-0.2,0.2),vy:rand(-0.2,0.2),life:rand(120,220),size:rand(10,20),color:`rgba(20,0,30,${rand(0.5,0.8)})`,type:'disc',blend:'source-over',update(p){p.size*=1.008;p.x+=p.vx;p.y+=p.vy;p.age++;}});
  });
  reg('shadow_claws','Shadow Claws', m=>{
    if(m.speed>2){
      for(let i=-1;i<=1;i++){
        const a=m.angle+i*0.2;
        fx.line({x:m.x,y:m.y},{x:m.x+Math.cos(a)*rand(16,28),y:m.y+Math.sin(a)*rand(16,28)},'rgba(20,0,20,0.95)',{width:rand(1,2.5),life:22,blend:'source-over'});
      }
    }
  });
  reg('wraith_trail','Wraith Trail', m=>{
    for(let i=0;i<2;i++) spawn({x:m.x+rand(-10,10),y:m.y+rand(-10,10),vx:rand(-0.4,0.4),vy:-rand(0.2,0.8),life:rand(90,160),size:rand(8,16),color:'rgba(160,220,255,0.35)',update(p){p.vx+=Math.sin(p.age*0.1)*0.05;p.x+=p.vx;p.y+=p.vy;p.size*=1.005;p.age++;}});
  }, {fade:0.08});
  reg('necrotic_ooze','Necrotic Ooze', m=>{
    for(let i=0;i<2;i++) spawn({x:m.x+rand(-8,8),y:m.y,vx:rand(-0.3,0.3),vy:rand(0.4,1.2),life:rand(80,130),size:rand(8,14),color:'rgba(100,180,60,0.8)',type:'disc',blend:'source-over',gravity:0.12});
  });
  reg('lich_whisper','Lich Whisper', m=>{
    if(Math.random()<0.4) fx.emoji(m,'ᚠᚢᚦᚨᚱᚲᚷ',{size:rand(16,24),color:hsla(rand(160,200),100,rand(60,80),0.9)});
  }, {fade:0.1});
  reg('specter_pulse','Specter Pulse', m=>{
    fx.pulseRing(m,'rgba(200,220,255,0.5)',{start:5,grow:1.4,life:50});
    fx.pulseRing(m,'rgba(160,180,220,0.3)',{start:8,grow:0.8,life:60});
  });
  reg('grim_reaper','Grim Reaper', m=>{
    if(m.speed>3) fx.line({x:m.px,y:m.py},{x:m.x,y:m.y},'rgba(80,10,40,0.9)',{width:5,life:25,blend:'source-over'});
    fx.rise(m,2,{color:'rgba(20,0,30,0.6)',size:rand(12,20),type:'disc',blend:'source-over',update(p){p.size*=1.01;p.x+=p.vx;p.y+=p.vy;p.age++;}});
  });
  reg('banshee_wail','Banshee Wail', m=>{
    for(let i=0;i<3;i++){
      const a=rand(0,TAU);
      spawn({x:m.x,y:m.y,vx:Math.cos(a)*rand(2,4),vy:Math.sin(a)*rand(2,4),life:rand(40,70),size:rand(10,20),color:'rgba(180,220,255,0.5)',drag:0.95,update(p){p.vx*=p.drag;p.vy*=p.drag;p.x+=p.vx;p.y+=p.vy;p.size*=1.01;p.age++;}});
    }
  });
  reg('crypt_dust','Crypt Dust', m=>{
    for(let i=0;i<4;i++) spawn({x:m.x+rand(-6,6),y:m.y+rand(-6,6),vx:rand(-0.4,0.4),vy:rand(0.2,0.8),life:rand(100,160),size:rand(1,2.5),color:'rgba(190,180,160,0.7)',type:'disc',blend:'source-over'});
  });
  reg('haunted_flame','Haunted Flame', m=>{
    fx.rise(m,4,{color:hsla(rand(260,300),100,rand(50,70),0.8),size:rand(4,8),life:rand(50,90),gravity:-0.03});
  });
  reg('devil_horns','Devil Horns', m=>{
    if(Math.random()<0.3) fx.emoji(m,'👹👺😈',{size:rand(18,26),color:'rgba(255,60,60,1)',blend:'source-over'});
  });
  reg('possessed','Possessed', m=>{
    for(let i=0;i<5;i++) spawn({x:m.x+rand(-20,20),y:m.y+rand(-20,20),vx:0,vy:0,life:rand(8,18),size:rand(1,2),color:Math.random()<0.5?'rgba(255,255,255,1)':'rgba(20,0,0,1)',type:'disc',blend:'source-over'});
  }, {fade:0.4});
  reg('blood_moon_tears','Blood Moon Tears', m=>{
    for(let i=0;i<2;i++) spawn({x:m.x+rand(-4,4),y:m.y,vx:rand(-0.3,0.3),vy:rand(0.5,1.5),life:rand(80,120),size:rand(3,5),color:'rgba(160,20,30,1)',type:'disc',blend:'source-over',gravity:0.2});
  });
  reg('eldritch_tendrils','Eldritch Tendrils', m=>{
    for(let i=0;i<3;i++){
      const a=rand(0,TAU);
      spawn({x:m.x,y:m.y,vx:0,vy:0,life:rand(40,70),size:rand(10,18),color:`rgba(40,100,60,${rand(0.4,0.7)})`,data:{a,r:0,cx:m.x,cy:m.y,ph:rand(0,TAU)},update(p){p.data.r+=1.2;p.data.ph+=0.15;p.x=p.data.cx+Math.cos(p.data.a+Math.sin(p.data.ph)*0.5)*p.data.r;p.y=p.data.cy+Math.sin(p.data.a+Math.sin(p.data.ph)*0.5)*p.data.r;p.size*=0.985;p.age++;}});
    }
  });
  reg('gore_splatter','Gore Splatter', m=>{
    fx.burst(m,10,{color:hsla(rand(350,10),100,rand(30,45),0.95),smin:2,smax:6,life:rand(40,70),size:rand(2,5),gravity:0.2,type:'disc',blend:'source-over'});
  });
  reg('skeletal_rattle','Skeletal Rattle', m=>{
    if(Math.random()<0.3) fx.emoji(m,'💀☠',{size:rand(14,22),color:'rgba(240,235,220,1)',blend:'source-over',vy:rand(-0.6,0.3)});
  });
  reg('witch_smoke','Witch Smoke', m=>{
    fx.rise(m,3,{color:`rgba(${U.randi(60,90)},20,${U.randi(80,130)},${rand(0.35,0.55)})`,size:rand(14,22),life:rand(90,150),type:'disc',blend:'source-over',update(p){p.size*=1.01;p.vx+=rand(-0.05,0.05);p.x+=p.vx;p.y+=p.vy;p.age++;}});
  });
  reg('phantom_gaze','Phantom Gaze', m=>{
    if(Math.random()<0.2){
      spawn({x:m.x+rand(-20,20),y:m.y+rand(-20,20),vx:0,vy:0,life:rand(30,60),size:4,color:'rgba(255,255,255,1)'});
      spawn({x:m.x+rand(-20,20),y:m.y+rand(-20,20),vx:0,vy:0,life:rand(30,60),size:4,color:'rgba(255,255,255,1)'});
    }
  }, {fade:0.05});
  reg('soul_harvest','Soul Harvest', m=>{
    fx.orbit(m,2,{r:rand(18,38),spin:0.12,color:'rgba(160,255,200,0.9)',drift:0.97,size:rand(2,4)});
  });
})();
