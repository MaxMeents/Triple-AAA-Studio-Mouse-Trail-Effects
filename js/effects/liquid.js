// ============================================================
//  LIQUID & FLUID (25 effects)
// ============================================================
(function(){
  const { register, spawn, U, fx } = Engine;
  const { rand, pick, hsla, TAU } = U;
  const CAT = 'Liquid & Fluid';
  const reg = (id,name,onMove,extra)=>register(Object.assign({id,name,category:CAT,onMove},extra||{}));

  const drip = (color, g=0.12) => m => {
    for(let i=0;i<3;i++) spawn({
      x:m.x+rand(-4,4), y:m.y+rand(-2,2),
      vx:rand(-0.5,0.5), vy:rand(0.3,1.4),
      life:rand(60,120), size:rand(3,6),
      color, type:'disc', blend:'source-over',
      gravity:g, drag:0.995
    });
  };
  const pool = (color) => m => {
    for(let i=0;i<2;i++) spawn({
      x:m.x+rand(-10,10), y:m.y+rand(-6,6),
      vx:rand(-0.3,0.3), vy:rand(-0.3,0.3),
      life:rand(100,180), size:rand(10,18),
      color, type:'disc', blend:'source-over',
      update(p){ p.size*=1.01; p.x+=p.vx; p.y+=p.vy; p.age++; }
    });
  };

  // 1-25 use drip/pool/stream variations with distinct hues
  reg('water_droplets','Water Droplets', drip('rgba(120,180,255,0.85)'));
  reg('oil_slick','Oil Slick', function(m){
    for(let i=0;i<2;i++) spawn({x:m.x+rand(-10,10),y:m.y+rand(-10,10),vx:rand(-0.2,0.2),vy:rand(-0.2,0.2),life:rand(140,220),size:rand(12,22),color:hsla(rand(260,320),80,rand(15,30),0.7),type:'disc',blend:'source-over',update(p){p.size*=1.008;p.x+=p.vx;p.y+=p.vy;p.age++;}});
  });
  reg('mercury_flow','Mercury Flow', m=>{
    for(let i=0;i<3;i++) spawn({x:m.x+rand(-6,6),y:m.y+rand(-4,4),vx:rand(-0.3,0.3),vy:rand(-0.3,0.3),life:rand(80,140),size:rand(6,12),color:`rgba(${U.randi(180,220)},${U.randi(190,220)},${U.randi(210,240)},0.9)`,type:'disc',blend:'source-over',update(p){p.size*=0.99;p.x+=p.vx;p.y+=p.vy;p.age++;}});
  });
  reg('blood_spill','Blood Spill', drip('rgba(140,20,30,0.95)',0.2));
  reg('honey_drip','Honey Drip', drip('rgba(240,180,40,0.85)',0.05));
  reg('lava_flow','Lava Flow', m=>{
    for(let i=0;i<3;i++) spawn({x:m.x+rand(-6,6),y:m.y,vx:rand(-0.3,0.3),vy:rand(0.3,0.8),life:rand(80,140),size:rand(6,12),color:hsla(rand(0,30),100,rand(45,60),0.9),type:'disc',blend:'source-over',gravity:0.03});
  });
  reg('molten_gold','Molten Gold', drip('rgba(255,200,60,0.95)',0.08));
  reg('ink_stream','Ink Stream', m=>{
    for(let i=0;i<3;i++) spawn({x:m.x+rand(-3,3),y:m.y+rand(-3,3),vx:rand(-0.3,0.3),vy:rand(0,0.5),life:rand(100,160),size:rand(5,10),color:`rgba(${U.randi(10,30)},${U.randi(10,30)},${U.randi(20,50)},${rand(0.6,0.9)})`,type:'disc',blend:'source-over',update(p){p.size*=1.012;p.x+=p.vx;p.y+=p.vy;p.age++;}});
  });
  reg('liquid_nitrogen','Liquid Nitrogen', m=>{
    fx.rise(m,3,{color:'rgba(200,240,255,0.6)',size:rand(8,16),type:'disc',blend:'source-over'});
    fx.fall(m,2,{color:'rgba(220,245,255,0.9)',size:rand(2,4)});
  });
  reg('quicksilver','Quicksilver', m=>{
    fx.burst(m,6,{color:'rgba(220,230,240,0.95)',smin:0.5,smax:2,life:rand(40,70),size:rand(3,6),type:'disc',blend:'source-over',gravity:0.12});
  });
  reg('absinthe_pour','Absinthe Pour', drip('rgba(150,230,100,0.9)'));
  reg('wine_swirl','Wine Swirl', pool('rgba(90,20,40,0.6)'));
  reg('milk_bloom','Milk Bloom', pool('rgba(240,240,235,0.55)'));
  reg('glacier_melt','Glacier Melt', drip('rgba(180,220,240,0.8)',0.06));
  reg('tidepool','Tidepool', m=>{
    fx.pulseRing(m,'rgba(100,200,220,0.7)',{start:6,grow:1.5,life:50,blend:'source-over'});
    drip('rgba(100,180,220,0.7)')(m);
  });
  reg('tar_pit','Tar Pit', pool('rgba(5,5,10,0.8)'));
  reg('slime_ooze','Slime Ooze', m=>{
    for(let i=0;i<2;i++) spawn({x:m.x+rand(-8,8),y:m.y,vx:rand(-0.3,0.3),vy:rand(0.4,1),life:rand(80,120),size:rand(8,14),color:'rgba(140,220,60,0.85)',type:'disc',blend:'source-over',gravity:0.1,update(p){p.vy+=p.gravity;p.x+=p.vx;p.y+=p.vy;p.size*=0.995;p.age++;}});
  });
  reg('coolant_leak','Coolant Leak', drip('rgba(100,220,220,0.85)',0.15));
  reg('pixie_water','Pixie Water', m=>{
    for(let i=0;i<3;i++) spawn({x:m.x+rand(-6,6),y:m.y+rand(-6,6),vx:rand(-0.5,0.5),vy:rand(-0.5,0.5),life:rand(60,110),size:rand(1.5,3),color:hsla(rand(170,220),100,rand(70,85),1)});
  });
  reg('mana_pool','Mana Pool', pool('rgba(80,120,255,0.45)'));
  reg('antifreeze','Antifreeze', drip('rgba(180,250,150,0.85)',0.1));
  reg('fuel_spill','Fuel Spill', m=>{
    for(let i=0;i<2;i++) spawn({x:m.x+rand(-8,8),y:m.y+rand(-8,8),vx:rand(-0.2,0.2),vy:rand(-0.2,0.2),life:rand(120,200),size:rand(12,20),color:`hsla(${rand(180,320)},100%,60%,0.25)`,type:'disc',blend:'lighter',update(p){p.size*=1.01;p.x+=p.vx;p.y+=p.vy;p.age++;}});
  });
  reg('cherry_syrup','Cherry Syrup', drip('rgba(210,30,70,0.9)',0.06));
  reg('liquid_crystal','Liquid Crystal', m=>{
    for(let i=0;i<3;i++) spawn({x:m.x+rand(-6,6),y:m.y+rand(-6,6),vx:rand(-0.4,0.4),vy:rand(-0.4,0.4),life:rand(60,100),size:rand(3,6),color:hsla(rand(0,360),100,70,0.9),type:'disc',blend:'source-over'});
  });
  reg('jellyfish_drift','Jellyfish Drift', m=>{
    if(Math.random()<0.3){
      spawn({x:m.x,y:m.y,vx:rand(-0.3,0.3),vy:-rand(0.2,0.8),life:rand(140,220),size:rand(14,24),color:hsla(rand(260,320),100,70,0.45),type:'disc',blend:'lighter',update(p){p.size*=1.005;p.x+=p.vx;p.y+=p.vy;p.age++;}});
      fx.pulseRing(m,'rgba(255,180,255,0.4)',{start:10,grow:0.5,life:60});
    }
  });
})();
