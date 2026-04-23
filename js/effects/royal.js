// ============================================================
//  ROYAL & ORNAMENTAL (25 effects)
// ============================================================
(function(){
  const { register, spawn, U, fx } = Engine;
  const { rand, pick, hsla, TAU } = U;
  const CAT = 'Royal & Ornamental';
  const reg = (id,name,onMove,extra)=>register(Object.assign({id,name,category:CAT,onMove},extra||{}));

  const gem = (hue) => m => {
    for(let i=0;i<2;i++) spawn({
      x:m.x+rand(-6,6), y:m.y+rand(-6,6),
      vx:rand(-1,1), vy:-rand(0.3,1.2),
      life:rand(60,100), size:rand(5,9),
      color:hsla(hue+rand(-10,10),100,rand(60,75),1),
      type:'star', rot:rand(0,TAU), rotV:rand(-0.08,0.08),
      data:{points:4}, gravity:0.1, blend:'lighter'
    });
  };

  reg('royal_filigree','Royal Filigree', m=>{
    for(let i=0;i<3;i++){
      const a=rand(0,TAU);
      spawn({x:m.x,y:m.y,vx:0,vy:0,life:rand(60,100),size:rand(2,4),color:'rgba(255,215,120,1)',data:{a,r:3,cx:m.x,cy:m.y,spin:rand(0.15,0.25),drift:1.02},update(p){p.data.a+=p.data.spin;p.data.r*=p.data.drift;p.x=p.data.cx+Math.cos(p.data.a)*p.data.r;p.y=p.data.cy+Math.sin(p.data.a)*p.data.r;p.age++;}});
    }
  });
  reg('gold_leaf','Gold Leaf', m=>{
    for(let i=0;i<2;i++) spawn({x:m.x+rand(-8,8),y:m.y,vx:rand(-0.5,0.5),vy:rand(0.3,0.8),life:rand(100,160),size:rand(6,10),color:hsla(rand(40,55),100,rand(55,70),1),type:'triangle',rot:rand(0,TAU),rotV:rand(-0.05,0.05),gravity:0.02,blend:'source-over'});
  });
  reg('jewel_cascade','Jewel Cascade', m=>{
    for(let i=0;i<2;i++) spawn({x:m.x+rand(-6,6),y:m.y,vx:rand(-1,1),vy:rand(0.5,2),life:rand(60,100),size:rand(5,9),color:hsla(pick([0,60,120,200,280]),100,rand(55,70),1),type:'star',rot:rand(0,TAU),data:{points:4},gravity:0.2,blend:'lighter'});
  });
  reg('diamond_dust','Diamond Dust', m=>{
    for(let i=0;i<4;i++) spawn({x:m.x+rand(-10,10),y:m.y+rand(-10,10),vx:rand(-0.3,0.3),vy:rand(-0.3,0.3),life:rand(60,100),size:rand(1.5,3),color:'rgba(255,255,255,1)'});
  });
  reg('emerald_shards','Emerald Shards', gem(130));
  reg('sapphire_mist','Sapphire Mist', m=>{
    for(let i=0;i<2;i++) spawn({x:m.x+rand(-10,10),y:m.y+rand(-10,10),vx:rand(-0.2,0.2),vy:-rand(0.2,0.6),life:rand(100,160),size:rand(10,18),color:'rgba(60,100,220,0.4)',update(p){p.size*=1.008;p.x+=p.vx;p.y+=p.vy;p.age++;}});
    gem(220)(m);
  }, {fade:0.07});
  reg('ruby_rain','Ruby Rain', gem(0));
  reg('crown_gleam','Crown Gleam', m=>{
    if(Math.random()<0.3) fx.emoji(m,'👑',{size:rand(18,28),color:'rgba(255,215,100,1)',vy:-rand(0.3,0.8),blend:'source-over'});
    for(let i=0;i<2;i++) spawn({x:m.x+rand(-6,6),y:m.y+rand(-6,6),vx:0,vy:0,life:25,size:rand(2,4),color:'rgba(255,240,180,1)'});
  });
  reg('velvet_drape','Velvet Drape', m=>{
    for(let i=0;i<2;i++) spawn({x:m.x+rand(-10,10),y:m.y,vx:rand(-0.2,0.2),vy:rand(0.2,0.6),life:rand(140,220),size:rand(10,18),color:`rgba(${U.randi(90,140)},10,${U.randi(30,60)},${rand(0.5,0.75)})`,type:'disc',blend:'source-over',update(p){p.size*=1.005;p.vx+=Math.sin(p.age*0.05)*0.02;p.x+=p.vx;p.y+=p.vy;p.age++;}});
  }, {fade:0.05});
  reg('baroque_swirl','Baroque Swirl', function(m){
    this.t=(this.t||0)+0.3;
    for(let i=0;i<2;i++){
      const a=this.t+i*Math.PI, r=12+Math.sin(this.t*0.5)*6;
      spawn({x:m.x+Math.cos(a)*r,y:m.y+Math.sin(a)*r,vx:0,vy:0,life:rand(50,90),size:rand(2,4),color:'rgba(255,220,140,1)'});
    }
  }, {init(){this.t=0;}});
  reg('pearl_bloom','Pearl Bloom', m=>{
    for(let i=0;i<2;i++) spawn({x:m.x+rand(-8,8),y:m.y+rand(-8,8),vx:rand(-0.3,0.3),vy:rand(-0.3,0.3),life:rand(80,130),size:rand(5,9),color:'rgba(245,240,230,0.95)',render(ctx,p,t){ctx.globalCompositeOperation='source-over';const g=ctx.createRadialGradient(p.x-p.size*0.3,p.y-p.size*0.3,0,p.x,p.y,p.size);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(1,'rgba(220,215,200,0.7)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,TAU);ctx.fill();}});
  });
  reg('silver_chain','Silver Chain', function(m){
    const prev=this.last||{x:m.px,y:m.py};
    fx.line(prev,{x:m.x,y:m.y},'rgba(220,225,235,0.9)',{width:2,life:40});
    spawn({x:m.x,y:m.y,vx:0,vy:0,life:40,size:3,color:'rgba(230,235,245,1)',type:'ring',update(p){p.size+=0.2;p.age++;}});
    this.last={x:m.x,y:m.y};
  }, {init(){this.last=null;}});
  reg('opal_gleam','Opal Gleam', m=>{
    for(let i=0;i<3;i++) spawn({x:m.x+rand(-6,6),y:m.y+rand(-6,6),vx:rand(-0.3,0.3),vy:rand(-0.3,0.3),life:rand(60,100),size:rand(4,8),color:hsla(rand(0,360),100,80,0.6),type:'disc',blend:'lighter'});
  });
  reg('amethyst_waltz','Amethyst Waltz', gem(280));
  reg('topaz_flare','Topaz Flare', gem(40));
  reg('lace_pattern','Lace Pattern', m=>{
    for(let i=0;i<6;i++){
      const a=i*TAU/6;
      spawn({x:m.x+Math.cos(a)*10,y:m.y+Math.sin(a)*10,vx:0,vy:0,life:40,size:4,color:'rgba(250,240,230,0.9)',type:'ring',update(p){p.size+=0.3;p.age++;}});
    }
  });
  reg('royal_crest','Royal Crest', m=>{
    if(Math.random()<0.3) fx.emoji(m,'🦁🦅',{size:rand(18,26),color:'rgba(255,220,140,1)',blend:'source-over',vy:-rand(0.2,0.6)});
  });
  reg('scepter_pulse','Scepter Pulse', m=>{
    fx.pulseRing(m,'rgba(255,220,140,0.8)',{start:4,grow:1.6,life:40});
    spawn({x:m.x,y:m.y,vx:0,vy:0,life:25,size:5,color:'rgba(255,230,160,1)'});
  });
  reg('fleur_de_lis','Fleur de Lis', m=>{
    if(Math.random()<0.35) fx.emoji(m,'⚜',{size:rand(18,28),color:'rgba(255,215,120,1)',vy:-rand(0.3,0.8),rotV:rand(-0.03,0.03)});
  });
  reg('ornate_glyph','Ornate Glyph', m=>{
    if(Math.random()<0.4) fx.emoji(m,'❖❋✥✦✾',{size:rand(16,24),color:hsla(rand(40,60),100,rand(65,80),1),rotV:rand(-0.1,0.1),vy:-rand(0.3,0.8)});
  });
  reg('regal_ribbon','Regal Ribbon', function(m){
    const prev=this.last||{x:m.px,y:m.py};
    fx.line(prev,{x:m.x,y:m.y},'rgba(200,40,60,0.95)',{width:5,life:35,blend:'source-over'});
    fx.line(prev,{x:m.x,y:m.y},'rgba(255,220,140,0.9)',{width:1.5,life:40});
    this.last={x:m.x,y:m.y};
  }, {init(){this.last=null;}});
  reg('gilded_ember','Gilded Ember', m=>{
    fx.rise(m,3,{color:hsla(rand(35,55),100,rand(60,75),0.9),size:rand(3,6),life:rand(60,100),gravity:-0.02});
  });
  reg('brocade_stream','Brocade Stream', m=>{
    for(let i=0;i<3;i++) spawn({x:m.x+rand(-6,6),y:m.y+rand(-6,6),vx:rand(-0.3,0.3),vy:rand(-0.3,0.3),life:rand(60,100),size:rand(5,9),color:hsla(pick([10,40,280,340]),80,rand(50,65),0.85),type:'triangle',rot:rand(0,TAU),rotV:rand(-0.05,0.05),blend:'source-over'});
  });
  reg('moonstone','Moonstone', m=>{
    for(let i=0;i<2;i++) spawn({x:m.x+rand(-6,6),y:m.y+rand(-6,6),vx:rand(-0.2,0.2),vy:rand(-0.2,0.2),life:rand(100,160),size:rand(6,10),color:'rgba(220,230,255,0.8)',render(ctx,p,t){ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.size*2);g.addColorStop(0,'rgba(200,220,255,1)');g.addColorStop(0.6,'rgba(180,200,240,0.4)');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,p.size*2,0,TAU);ctx.fill();}});
  });
  reg('tiara_sparkle','Tiara Sparkle', m=>{
    for(let i=0;i<3;i++) spawn({x:m.x+rand(-14,14),y:m.y+rand(-6,6),vx:0,vy:0,life:rand(20,40),size:rand(3,6),color:'rgba(255,255,255,1)',type:'star',rot:rand(0,TAU),data:{points:4}});
    if(Math.random()<0.3) spawn({x:m.x+rand(-14,14),y:m.y,vx:0,vy:0,life:30,size:rand(5,8),color:hsla(pick([0,200,280,60]),100,70,1),type:'star',rot:rand(0,TAU),data:{points:4}});
  });
})();
