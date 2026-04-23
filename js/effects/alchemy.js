// ============================================================
//  ALCHEMY & POTIONS (25 effects)
// ============================================================
(function(){
  const { register, spawn, U, fx } = Engine;
  const { rand, pick, hsla, TAU } = U;
  const CAT = 'Alchemy & Potions';
  const reg = (id,name,onMove,extra)=>register(Object.assign({id,name,category:CAT,onMove},extra||{}));

  // bubble emitter: rising translucent bubbles of a given hue
  const potion = (hue, sat=100, light=60) => m => {
    for(let i=0;i<2;i++) spawn({
      x:m.x+rand(-6,6), y:m.y+rand(-4,4),
      vx:rand(-0.2,0.2), vy:-rand(0.3,1),
      life:rand(80,140), size:rand(4,9),
      color:hsla(hue+rand(-10,10),sat,light,0.85),
      render(ctx,p,t){
        ctx.globalCompositeOperation='source-over';
        ctx.strokeStyle=p.color; ctx.lineWidth=1;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,TAU); ctx.stroke();
        ctx.fillStyle='rgba(255,255,255,0.35)';
        ctx.beginPath(); ctx.arc(p.x-p.size*0.35,p.y-p.size*0.35,p.size*0.25,0,TAU); ctx.fill();
      }
    });
    spawn({x:m.x+rand(-4,4),y:m.y,vx:0,vy:-rand(0.3,0.8),life:rand(40,70),size:rand(10,16),color:hsla(hue,sat,light,0.3),type:'disc',blend:'lighter'});
  };

  reg('health_potion','Health Potion', potion(350));
  reg('mana_brew','Mana Brew', potion(220));
  reg('elixir_mist','Elixir Mist', m=>{
    for(let i=0;i<3;i++) spawn({x:m.x+rand(-10,10),y:m.y+rand(-10,10),vx:rand(-0.2,0.2),vy:-rand(0.2,0.6),life:rand(90,160),size:rand(10,18),color:hsla(rand(280,320),80,70,0.4),type:'disc',blend:'lighter',update(p){p.size*=1.01;p.x+=p.vx;p.y+=p.vy;p.age++;}});
  }, {fade:0.07});
  reg('philosophers_dust','Philosopher\'s Dust', m=>{
    for(let i=0;i<3;i++) spawn({x:m.x+rand(-8,8),y:m.y+rand(-8,8),vx:rand(-0.4,0.4),vy:rand(-0.4,0.4),life:rand(80,140),size:rand(1.2,2.2),color:hsla(rand(40,55),100,75,1)});
  });
  reg('poison_vial','Poison Vial', potion(110));
  reg('antidote','Antidote', potion(60, 70, 70));
  reg('stamina_flask','Stamina Flask', potion(30));
  reg('phoenix_down','Phoenix Down', m=>{
    if(Math.random()<0.35) fx.emoji(m,'🪶',{size:rand(16,24),color:'rgba(255,180,80,1)',vy:-rand(0.3,0.8),rotV:rand(-0.05,0.05)});
    fx.puff(m,2,{color:hsla(rand(10,40),100,65,0.9),size:rand(3,5),life:rand(40,70)});
  });
  reg('ethereal_oil','Ethereal Oil', potion(180, 80, 65));
  reg('mercury_vial','Mercury Vial', m=>{
    for(let i=0;i<2;i++) spawn({x:m.x+rand(-5,5),y:m.y+rand(-3,3),vx:rand(-0.3,0.3),vy:-rand(0.2,0.6),life:rand(80,130),size:rand(5,9),color:'rgba(220,225,235,0.95)',type:'disc',blend:'source-over'});
  });
  reg('dragon_tears','Dragon Tears', potion(170, 100, 55));
  reg('wyvern_blood','Wyvern Blood', potion(280, 80, 40));
  reg('unicorn_horn','Unicorn Horn', m=>{
    for(let i=0;i<3;i++) spawn({x:m.x+rand(-6,6),y:m.y+rand(-6,6),vx:rand(-0.4,0.4),vy:-rand(0.3,0.9),life:rand(70,120),size:rand(2,4),color:hsla(rand(280,340),100,80,1)});
  });
  reg('goblin_brew','Goblin Brew', potion(90, 100, 45));
  reg('fairy_essence','Fairy Essence', m=>{
    for(let i=0;i<3;i++){
      const a=rand(0,TAU);
      spawn({x:m.x,y:m.y,vx:0,vy:0,life:rand(80,140),size:rand(1.5,3),color:hsla(rand(0,360),100,75,1),data:{a,r:rand(4,8),cx:m.x,cy:m.y,spin:rand(0.1,0.2),drift:1.01},update(p){p.data.a+=p.data.spin;p.data.r*=p.data.drift;p.x=p.data.cx+Math.cos(p.data.a)*p.data.r;p.y=p.data.cy+Math.sin(p.data.a)*p.data.r;p.age++;}});
    }
  });
  reg('witch_potion','Witch Potion', potion(300, 80, 45));
  reg('nectar_drip','Nectar Drip', m=>{
    for(let i=0;i<2;i++) spawn({x:m.x+rand(-4,4),y:m.y,vx:rand(-0.2,0.2),vy:rand(0.4,1.2),life:rand(60,100),size:rand(3,5),color:'rgba(255,200,80,0.9)',type:'disc',blend:'source-over',gravity:0.1});
  });
  reg('ambrosia','Ambrosia', m=>{
    for(let i=0;i<3;i++) spawn({x:m.x+rand(-10,10),y:m.y+rand(-10,10),vx:0,vy:-rand(0.2,0.6),life:rand(100,160),size:rand(6,12),color:'rgba(255,230,150,0.5)',update(p){p.size*=1.008;p.x+=p.vx;p.y+=p.vy;p.age++;}});
  }, {fade:0.06});
  reg('hellfire_draft','Hellfire Draft', m=>{
    fx.rise(m,3,{color:hsla(rand(0,20),100,rand(45,60),0.9),size:rand(5,9),life:rand(50,90),gravity:-0.03});
    if(Math.random()<0.2) spawn({x:m.x,y:m.y,vx:0,vy:-rand(0.5,1.2),life:rand(40,70),size:rand(3,5),color:'rgba(0,0,0,0.9)',type:'disc',blend:'source-over'});
  });
  reg('frost_tonic','Frost Tonic', potion(195, 100, 75));
  reg('luck_charm','Luck Charm', m=>{
    if(Math.random()<0.25) fx.emoji(m,'🍀',{size:rand(14,20),color:'rgba(100,220,100,1)',vy:-rand(0.3,0.8),rotV:rand(-0.05,0.05)});
    fx.puff(m,2,{color:'rgba(150,255,150,0.8)',size:rand(2,4),life:rand(40,70)});
  });
  reg('shadow_serum','Shadow Serum', m=>{
    for(let i=0;i<3;i++) spawn({x:m.x+rand(-6,6),y:m.y+rand(-6,6),vx:rand(-0.2,0.2),vy:-rand(0.2,0.6),life:rand(90,150),size:rand(6,12),color:`rgba(20,0,40,${rand(0.5,0.8)})`,type:'disc',blend:'source-over',update(p){p.size*=1.012;p.x+=p.vx;p.y+=p.vy;p.age++;}});
  });
  reg('glimmer_dust','Glimmer Dust', m=>{
    for(let i=0;i<4;i++) spawn({x:m.x+rand(-10,10),y:m.y+rand(-10,10),vx:rand(-0.3,0.3),vy:rand(-0.3,0.3),life:rand(70,130),size:rand(1,2.2),color:hsla(rand(40,60),100,rand(75,90),1)});
  });
  reg('basilisk_venom','Basilisk Venom', potion(130, 100, 35));
  reg('alchemist_fire','Alchemist Fire', m=>{
    fx.rise(m,3,{color:hsla(rand(30,60),100,rand(55,70),0.9),size:rand(4,8),life:rand(50,90),gravity:-0.02});
    fx.burst(m,2,{color:'rgba(255,230,100,1)',smin:0.5,smax:2,life:rand(20,40),size:rand(1.5,3),gravity:0.1});
  });
})();
