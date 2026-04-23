// ============================================================
//  MUSIC & RHYTHM (25 effects)
// ============================================================
(function(){
  const { register, spawn, U, fx } = Engine;
  const { rand, pick, hsla, TAU } = U;
  const CAT = 'Music & Rhythm';
  const reg = (id,name,onMove,extra)=>register(Object.assign({id,name,category:CAT,onMove},extra||{}));

  const NOTES = '♪♫♬♩𝄞';

  reg('bass_drop','Bass Drop', m=>{
    fx.pulseRing(m,'rgba(255,80,220,0.8)',{start:6,grow:3,life:30});
    fx.pulseRing(m,'rgba(120,40,220,0.5)',{start:10,grow:2,life:40});
  });
  reg('treble_sparkle','Treble Sparkle', m=>{
    for(let i=0;i<4;i++) spawn({x:m.x+rand(-8,8),y:m.y+rand(-8,8),vx:rand(-0.5,0.5),vy:-rand(0.3,1),life:rand(30,60),size:rand(4,8),color:hsla(rand(45,65),100,75,1),type:'star',rot:rand(0,TAU),data:{points:4}});
  });
  reg('vinyl_scratch','Vinyl Scratch', m=>{
    fx.orbit(m,4,{r:rand(10,28),spin:rand(0.3,0.5),color:'rgba(255,255,255,0.9)',size:rand(1.5,3)});
  });
  reg('snare_snap','Snare Snap', m=>{
    if(m.speed>2) fx.burst(m,8,{color:'rgba(255,250,220,1)',smin:3,smax:6,life:rand(15,30),size:rand(1.5,3)});
  });
  reg('synth_wave','Synth Wave', m=>{
    for(let i=0;i<3;i++) spawn({x:m.x+rand(-10,10),y:m.y,vx:rand(-0.4,0.4),vy:-rand(0.3,1),life:rand(60,100),size:rand(4,8),color:Math.random()<0.5?'rgba(255,80,220,1)':'rgba(80,220,255,1)',update(p){p.vx+=Math.sin((p.x+p.age)*0.05)*0.1;p.x+=p.vx;p.y+=p.vy;p.age++;}});
  });
  reg('jazz_notes','Jazz Notes', m=>{
    if(Math.random()<0.4) fx.emoji(m,NOTES,{size:rand(18,28),color:hsla(rand(30,50),80,70,1),rotV:rand(-0.08,0.08),vy:-rand(0.4,1)});
  });
  reg('metal_shred','Metal Shred', m=>{
    fx.burst(m,8,{color:hsla(rand(0,30),100,rand(40,60),1),smin:2,smax:6,life:rand(20,40),size:rand(2,4),type:'triangle',rot:rand(0,TAU),blend:'source-over'});
  });
  reg('trap_hihats','Trap Hihats', m=>{
    for(let i=0;i<5;i++) spawn({x:m.x+rand(-3,3),y:m.y+rand(-3,3),vx:rand(-2,2),vy:rand(-2,2),life:rand(8,18),size:rand(1,2),color:'rgba(255,240,180,1)'});
  });
  reg('orchestra_swell','Orchestra Swell', m=>{
    fx.pulseRing(m,'rgba(255,220,150,0.5)',{start:10,grow:1,life:70});
    for(let i=0;i<2;i++) spawn({x:m.x+rand(-12,12),y:m.y+rand(-12,12),vx:0,vy:-rand(0.2,0.6),life:rand(90,150),size:rand(6,12),color:'rgba(255,220,160,0.5)'});
  });
  reg('choir_light','Choir Light', m=>{
    for(let i=0;i<3;i++) spawn({x:m.x+rand(-14,14),y:m.y+rand(-14,14),vx:0,vy:-rand(0.2,0.5),life:rand(120,200),size:rand(6,12),color:'rgba(255,245,210,0.45)'});
  }, {fade:0.06});
  reg('808_boom','808 Boom', m=>{
    fx.pulseRing(m,'rgba(80,40,160,0.9)',{start:8,grow:2.5,life:35});
    for(let i=0;i<2;i++) spawn({x:m.x,y:m.y,vx:0,vy:0,life:24,size:rand(12,18),color:'rgba(120,50,220,0.7)'});
  });
  reg('violin_bow','Violin Bow', m=>{
    fx.line({x:m.px,y:m.py},{x:m.x,y:m.y},'rgba(250,220,180,0.9)',{width:1.5,life:40});
    if(Math.random()<0.3) fx.emoji(m,NOTES,{size:rand(14,20),color:'rgba(250,230,190,1)',vy:-rand(0.4,1)});
  });
  reg('piano_keys','Piano Keys', m=>{
    const gx=Math.round(m.x/20)*20;
    spawn({x:gx,y:m.y,vx:0,vy:0,life:35,size:18,color:Math.random()<0.5?'rgba(250,250,250,0.9)':'rgba(20,20,20,0.9)',type:'square',blend:'source-over',rot:0});
  });
  reg('flute_wisp','Flute Wisp', m=>{
    for(let i=0;i<2;i++) spawn({x:m.x+rand(-8,8),y:m.y,vx:rand(-0.3,0.3),vy:-rand(0.3,0.8),life:rand(90,150),size:rand(6,12),color:'rgba(200,240,255,0.35)',update(p){p.vx+=Math.sin(p.age*0.1)*0.1;p.x+=p.vx;p.y+=p.vy;p.size*=1.008;p.age++;}});
  }, {fade:0.07});
  reg('guitar_riff','Guitar Riff', m=>{
    if(m.speed>1){
      fx.line({x:m.px,y:m.py},{x:m.x,y:m.y},hsla(rand(0,40),100,60,0.9),{width:2,life:25});
      fx.burst(m,3,{color:'rgba(255,180,80,1)',smin:1,smax:3,life:rand(20,40),size:rand(1.5,3)});
    }
  });
  reg('dj_pulse','DJ Pulse', m=>{
    fx.pulseRing(m,'rgba(80,255,180,0.8)',{start:4,grow:2,life:40});
    for(let i=0;i<3;i++) spawn({x:m.x,y:m.y,vx:rand(-2,2),vy:rand(-2,2),life:rand(20,40),size:rand(2,4),color:'rgba(150,255,220,1)'});
  });
  reg('gong_shock','Gong Shock', m=>{
    if(Math.random()<0.15){
      for(let r=0;r<3;r++) fx.pulseRing(m,`rgba(255,200,80,${0.8-r*0.25})`,{start:6+r*6,grow:1.5,life:60});
    }
  });
  reg('bell_chime','Bell Chime', m=>{
    spawn({x:m.x,y:m.y,vx:0,vy:0,life:30,size:8,color:'rgba(255,240,200,1)'});
    for(let i=0;i<3;i++) spawn({x:m.x+rand(-4,4),y:m.y+rand(-4,4),vx:rand(-1,1),vy:rand(-1,-0.2),life:rand(50,80),size:rand(2,4),color:'rgba(255,235,180,1)',gravity:0.03});
  });
  reg('harp_cascade','Harp Cascade', m=>{
    for(let i=0;i<3;i++) spawn({x:m.x+rand(-6,6),y:m.y,vx:rand(-0.4,0.4),vy:rand(0.5,1.8),life:rand(60,100),size:rand(3,6),color:hsla(rand(40,60),100,70,1),gravity:0.02});
  });
  reg('drum_fill','Drum Fill', m=>{
    if(m.speed>1.5){
      fx.pulseRing(m,'rgba(255,140,80,0.85)',{start:3,grow:1.8,life:25});
      fx.burst(m,4,{color:'rgba(255,180,120,1)',smin:1,smax:3,life:rand(20,35),size:rand(2,4)});
    }
  });
  reg('dubstep_wob','Dubstep Wob', m=>{
    for(let i=0;i<4;i++) spawn({x:m.x,y:m.y,vx:rand(-3,3),vy:rand(-3,3),life:rand(20,40),size:rand(4,9),color:Math.random()<0.5?'rgba(120,220,80,1)':'rgba(200,80,220,1)',type:'square',rot:rand(0,TAU),rotV:rand(-0.3,0.3)});
  }, {fade:0.3});
  reg('opera_note','Opera Note', m=>{
    if(Math.random()<0.3) fx.emoji(m,NOTES,{size:rand(24,34),color:'rgba(240,220,255,1)',rotV:rand(-0.05,0.05),vy:-rand(0.3,0.7),life:rand(100,160)});
  });
  reg('tambourine','Tambourine', m=>{
    for(let i=0;i<5;i++){
      const a=rand(0,TAU);
      spawn({x:m.x+Math.cos(a)*rand(12,20),y:m.y+Math.sin(a)*rand(12,20),vx:Math.cos(a)*0.5,vy:Math.sin(a)*0.5,life:rand(20,40),size:rand(2,3),color:'rgba(255,220,120,1)'});
    }
  });
  reg('xylophone','Xylophone', m=>{
    for(let i=0;i<3;i++){
      const h=i*120+Math.floor(m.x/50)*40;
      spawn({x:m.x+i*6-6,y:m.y,vx:0,vy:-0.5,life:rand(40,70),size:rand(4,7),color:hsla(h%360,100,65,1),type:'square',rot:0,blend:'source-over'});
    }
  });
  reg('beatmatch','Beatmatch', m=>{
    const t=Math.floor(performance.now()/300)%2;
    fx.pulseRing(m,t?'rgba(80,220,255,0.9)':'rgba(255,80,220,0.9)',{start:4,grow:2.2,life:25});
  });
})();
