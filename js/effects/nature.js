// ============================================================
//  NATURE & ELEMENTS effects (10)
// ============================================================
(function(){
  const { register, spawn, U } = Engine;
  const { rand, pick, hsla, TAU } = U;
  const CAT = 'Nature & Elements';

  // 31. Frostbyte — snowflakes
  register({
    id:'frostbyte', name:'Frostbyte', category:CAT, fade:0.1,
    onMove(m){
      for(let i=0;i<2;i++){
        spawn({
          x:m.x+rand(-8,8), y:m.y+rand(-8,8),
          vx:rand(-0.3,0.3), vy:rand(0.2,0.8),
          life:rand(120,200), size:rand(6,10),
          color:'rgba(220,240,255,0.95)',
          rot:rand(0,TAU), rotV:rand(-0.02,0.02),
          render(ctx,p,t){
            ctx.globalCompositeOperation='lighter';
            ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot);
            ctx.strokeStyle=p.color; ctx.lineWidth=1.2;
            for(let k=0;k<6;k++){
              ctx.rotate(TAU/6);
              ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0,-p.size);
              ctx.moveTo(0,-p.size*0.5); ctx.lineTo( p.size*0.3,-p.size*0.7);
              ctx.moveTo(0,-p.size*0.5); ctx.lineTo(-p.size*0.3,-p.size*0.7);
              ctx.stroke();
            }
            ctx.restore();
          }
        });
      }
    }
  });

  // 32. Ice Shards — blue triangles shooting out
  register({
    id:'ice_shards', name:'Ice Shards', category:CAT, fade:0.22,
    onMove(m){
      for(let i=0;i<4;i++){
        const a = rand(0,TAU), s=rand(2,5);
        spawn({
          x:m.x, y:m.y,
          vx:Math.cos(a)*s, vy:Math.sin(a)*s,
          life:rand(30,55), size:rand(6,12),
          color:hsla(rand(185,210),100,rand(70,85),1),
          type:'triangle', rot:a+Math.PI/2,
          drag:0.95
        });
      }
    }
  });

  // 33. Sakura Gust — drifting petals
  register({
    id:'sakura_gust', name:'Sakura Gust', category:CAT, fade:0.08,
    onMove(m){
      for(let i=0;i<2;i++){
        spawn({
          x:m.x+rand(-10,10), y:m.y+rand(-6,6),
          vx:rand(-0.5,0.5), vy:rand(0.3,1.2),
          life:rand(160,240), size:rand(6,10),
          color:hsla(rand(320,350),80,rand(75,88),0.95),
          rot:rand(0,TAU), rotV:rand(-0.04,0.04),
          data:{ph:rand(0,TAU)},
          render(ctx,p,t){
            ctx.globalCompositeOperation='source-over';
            ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot);
            ctx.fillStyle=p.color;
            ctx.beginPath();
            ctx.ellipse(0,0,p.size*0.6,p.size,0,0,TAU);
            ctx.fill();
            ctx.restore();
          },
          update(p){
            p.data.ph += 0.05;
            p.vx += Math.cos(p.data.ph)*0.04;
            p.x+=p.vx; p.y+=p.vy; p.rot+=p.rotV; p.age++;
          }
        });
      }
    }
  });

  // 34. Bubble Pop
  register({
    id:'bubble_pop', name:'Bubble Pop', category:CAT, fade:0.12,
    onMove(m){
      for(let i=0;i<2;i++){
        spawn({
          x:m.x+rand(-6,6), y:m.y+rand(-4,4),
          vx:rand(-0.2,0.2), vy:-rand(0.3,1),
          life:rand(80,140), size:rand(6,14),
          color:'rgba(200,230,255,0.9)',
          render(ctx,p,t){
            ctx.globalCompositeOperation='source-over';
            ctx.strokeStyle=p.color; ctx.lineWidth=1;
            ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,TAU); ctx.stroke();
            ctx.fillStyle='rgba(255,255,255,0.5)';
            ctx.beginPath(); ctx.arc(p.x-p.size*0.4,p.y-p.size*0.4,p.size*0.25,0,TAU); ctx.fill();
          }
        });
      }
    }
  });

  // 35. Toxic Vapor — green smoke
  register({
    id:'toxic_vapor', name:'Toxic Vapor', category:CAT, fade:0.1,
    onMove(m){
      for(let i=0;i<3;i++){
        spawn({
          x:m.x+rand(-8,8), y:m.y+rand(-8,8),
          vx:rand(-0.3,0.3), vy:-rand(0.3,0.9),
          life:rand(80,140), size:rand(10,22),
          color:`rgba(80,200,60,${rand(0.15,0.35)})`,
          type:'disc', blend:'source-over',
          update(p){ p.size*=1.01; p.x+=p.vx; p.y+=p.vy; p.age++; }
        });
      }
    }
  });

  // 36. Acid Spray — droplets splatter
  register({
    id:'acid_spray', name:'Acid Spray', category:CAT,
    onMove(m){
      for(let i=0;i<4;i++){
        spawn({
          x:m.x, y:m.y,
          vx:rand(-3,3), vy:rand(-3,2),
          life:rand(30,60), size:rand(2,5),
          color:hsla(rand(80,110),100,rand(50,65),1),
          type:'disc', blend:'source-over',
          gravity:0.18, drag:0.995
        });
      }
    }
  });

  // 37. Aurora Stream — wavy ribbon
  register({
    id:'aurora_stream', name:'Aurora Stream', category:CAT, fade:0.08,
    onMove(m){
      for(let i=0;i<5;i++){
        spawn({
          x:m.x+rand(-20,20), y:m.y+rand(-4,4),
          vx:rand(-0.2,0.2), vy:-rand(0.2,0.6),
          life:rand(100,160), size:rand(14,22),
          color:hsla(rand(120,280),100,rand(55,70),0.35),
          update(p){
            p.vx += Math.sin((p.age+p.x)*0.02)*0.06;
            p.x+=p.vx; p.y+=p.vy; p.age++;
          }
        });
      }
    }
  });

  // 38. Ink Bloom — expanding ink circles
  register({
    id:'ink_bloom', name:'Ink Bloom', category:CAT, fade:0.18,
    cooldown:0,
    onMove(m){
      if(this.cooldown--<=0){
        this.cooldown=2;
        spawn({
          x:m.x, y:m.y, vx:0, vy:0,
          life:60, size:6,
          color:`rgba(${U.randi(10,40)},${U.randi(10,40)},${U.randi(40,80)},0.9)`,
          type:'disc', blend:'source-over',
          update(p){ p.size *= 1.08; p.age++; }
        });
      }
    },
    init(){ this.cooldown=0; }
  });

  // 39. Bone Dust — gray flecks with skull pop
  register({
    id:'bone_dust', name:'Bone Dust', category:CAT, fade:0.15,
    onMove(m){
      for(let i=0;i<3;i++){
        spawn({
          x:m.x+rand(-4,4), y:m.y+rand(-4,4),
          vx:rand(-0.6,0.6), vy:rand(-0.8,0.2),
          life:rand(50,90), size:rand(1.5,3),
          color:`rgba(${U.randi(210,240)},${U.randi(210,230)},${U.randi(180,210)},0.9)`,
          type:'disc', blend:'source-over',
          gravity:0.03, drag:0.99
        });
      }
      if(Math.random()<0.05){
        spawn({
          x:m.x, y:m.y, vx:rand(-0.5,0.5), vy:-rand(0.4,1),
          life:60, size:18, color:'rgba(230,230,210,0.95)',
          type:'text', data:{char:'☠'}, blend:'source-over',
          rot:rand(-0.2,0.2)
        });
      }
    }
  });

  // 40. Vaporwave — retro pink/cyan stars + grid horizon
  register({
    id:'vaporwave', name:'Vaporwave', category:CAT, fade:0.15,
    onMove(m){
      for(let i=0;i<3;i++){
        spawn({
          x:m.x+rand(-6,6), y:m.y+rand(-6,6),
          vx:rand(-0.8,0.8), vy:rand(-0.8,0.8),
          life:rand(50,90), size:rand(6,12),
          color:Math.random()<0.5?'rgba(255,120,220,1)':'rgba(120,230,255,1)',
          type:'star', rot:rand(0,TAU), rotV:rand(-0.05,0.05),
          data:{points:4}
        });
      }
    }
  });

  // ---------- extended: effects 41-55 ----------
  const fx = Engine.fx;
  const reg = (id,name,onMove,extra)=>register(Object.assign({id,name,category:CAT,onMove},extra||{}));

  reg('autumn_leaves','Autumn Leaves', m=>{
    for(let i=0;i<2;i++) spawn({x:m.x+rand(-10,10),y:m.y,vx:rand(-0.5,0.5),vy:rand(0.3,1),life:rand(140,220),size:rand(6,10),color:hsla(rand(15,45),100,rand(45,60),0.95),type:'triangle',rot:rand(0,TAU),rotV:rand(-0.05,0.05),blend:'source-over',update(p){p.vx+=Math.sin(p.age*0.08)*0.08;p.x+=p.vx;p.y+=p.vy;p.rot+=p.rotV;p.age++;}});
  }, {fade:0.08});
  reg('pollen_drift','Pollen Drift', m=>{
    for(let i=0;i<4;i++) spawn({x:m.x+rand(-12,12),y:m.y+rand(-12,12),vx:rand(-0.2,0.2),vy:rand(-0.3,0.1),life:rand(120,200),size:rand(1.5,3),color:hsla(rand(45,60),100,rand(70,85),0.9)});
  }, {fade:0.06});
  reg('mushroom_spores','Mushroom Spores', m=>{
    for(let i=0;i<3;i++) spawn({x:m.x+rand(-8,8),y:m.y+rand(-8,8),vx:rand(-0.15,0.15),vy:-rand(0.1,0.4),life:rand(120,200),size:rand(2,4),color:hsla(rand(180,240),60,rand(70,85),0.8),update(p){p.vx+=Math.sin(p.age*0.08)*0.04;p.x+=p.vx;p.y+=p.vy;p.age++;}});
  }, {fade:0.07});
  reg('fern_curl','Fern Curl', function(m){
    this.t=(this.t||0)+0.25;
    const r=6+this.t*0.4;
    spawn({x:m.x+Math.cos(this.t)*r,y:m.y+Math.sin(this.t)*r,vx:0,vy:0,life:rand(60,100),size:rand(2,4),color:hsla(rand(80,140),70,rand(40,60),0.9)});
  }, {init(){this.t=0;}});
  reg('seaweed_sway','Seaweed Sway', m=>{
    for(let i=0;i<2;i++) spawn({x:m.x+rand(-6,6),y:m.y,vx:0,vy:-rand(0.3,0.8),life:rand(100,160),size:rand(4,8),color:hsla(rand(100,160),80,rand(30,50),0.85),type:'disc',blend:'source-over',update(p){p.vx=Math.sin((p.age+p.y)*0.08)*0.5;p.x+=p.vx;p.y+=p.vy;p.age++;}});
  });
  reg('dandelion_puff','Dandelion Puff', m=>{
    for(let i=0;i<3;i++){
      const a=rand(0,TAU);
      spawn({x:m.x,y:m.y,vx:Math.cos(a)*rand(0.3,1),vy:Math.sin(a)*rand(0.3,1),life:rand(120,200),size:rand(1.5,3),color:'rgba(245,245,235,0.95)',drag:0.99,update(p){p.vx+=rand(-0.03,0.03);p.vy+=rand(-0.03,0.03);p.x+=p.vx;p.y+=p.vy;p.age++;}});
    }
  }, {fade:0.05});
  reg('spider_silk','Spider Silk', function(m){
    const prev=this.last||{x:m.px,y:m.py};
    fx.line(prev,{x:m.x,y:m.y},'rgba(220,220,240,0.85)',{width:0.8,life:60,blend:'source-over'});
    this.last={x:m.x,y:m.y};
  }, {init(){this.last=null;}, fade:0.04});
  reg('firefly_glade','Firefly Glade', m=>{
    if(Math.random()<0.35) spawn({x:m.x+rand(-14,14),y:m.y+rand(-14,14),vx:rand(-0.2,0.2),vy:rand(-0.2,0.2),life:rand(180,280),size:rand(1.5,2.5),color:hsla(rand(60,90),100,70,1),data:{ph:rand(0,TAU)},update(p){p.data.ph+=0.1;p.alpha=0.3+0.7*Math.abs(Math.sin(p.data.ph));p.x+=p.vx;p.y+=p.vy;p.age++;}});
  }, {fade:0.06});
  reg('coral_bloom','Coral Bloom', m=>{
    for(let i=0;i<3;i++){
      const a=rand(0,TAU);
      spawn({x:m.x,y:m.y,vx:0,vy:0,life:rand(50,90),size:rand(4,8),color:hsla(rand(340,360),90,rand(60,75),0.9),data:{a,r:2,cx:m.x,cy:m.y},update(p){p.data.r+=0.5;p.x=p.data.cx+Math.cos(p.data.a)*p.data.r;p.y=p.data.cy+Math.sin(p.data.a)*p.data.r;p.size*=0.99;p.age++;}});
    }
  });
  reg('vine_growth','Vine Growth', function(m){
    const prev=this.last||{x:m.px,y:m.py};
    fx.line(prev,{x:m.x,y:m.y},'rgba(60,160,60,0.95)',{width:2.5,life:200,blend:'source-over'});
    if(Math.random()<0.2) spawn({x:m.x+rand(-4,4),y:m.y+rand(-4,4),vx:0,vy:0,life:rand(80,140),size:rand(3,5),color:'rgba(90,200,80,0.9)',type:'triangle',rot:rand(0,TAU),blend:'source-over'});
    this.last={x:m.x,y:m.y};
  }, {init(){this.last=null;}, fade:0.03});
  reg('moss_patch','Moss Patch', m=>{
    for(let i=0;i<4;i++) spawn({x:m.x+rand(-10,10),y:m.y+rand(-10,10),vx:0,vy:0,life:rand(200,320),size:rand(2,4),color:hsla(rand(70,110),70,rand(30,50),0.9),type:'disc',blend:'source-over'});
  }, {fade:0.03});
  reg('butterfly_trail','Butterfly Trail', m=>{
    if(Math.random()<0.35){
      spawn({x:m.x+rand(-4,4),y:m.y+rand(-4,4),vx:rand(-0.5,0.5),vy:-rand(0.2,0.6),life:rand(80,140),size:rand(10,16),color:hsla(rand(0,360),90,70,1),data:{ph:rand(0,TAU)},render(ctx,p,t){ctx.globalCompositeOperation='source-over';p.data.ph+=0.3;const sc=0.5+0.5*Math.abs(Math.sin(p.data.ph));ctx.save();ctx.translate(p.x,p.y);ctx.scale(sc,1);ctx.fillStyle=p.color;ctx.beginPath();ctx.ellipse(-p.size*0.4,0,p.size*0.5,p.size*0.8,0,0,TAU);ctx.ellipse(p.size*0.4,0,p.size*0.5,p.size*0.8,0,0,TAU);ctx.fill();ctx.restore();}});
    }
  }, {fade:0.08});
  reg('pond_ripple','Pond Ripple', m=>{
    fx.pulseRing(m,'rgba(120,180,220,0.7)',{start:4,grow:1.3,life:60,blend:'source-over'});
    if(Math.random()<0.3) fx.pulseRing(m,'rgba(140,200,230,0.4)',{start:8,grow:0.8,life:80,blend:'source-over'});
  }, {fade:0.1});
  reg('willow_drip','Willow Drip', m=>{
    for(let i=0;i<2;i++) spawn({x:m.x+rand(-10,10),y:m.y,vx:rand(-0.15,0.15),vy:rand(0.6,1.4),life:rand(80,130),size:rand(2,4),color:'rgba(170,210,160,0.9)',type:'disc',blend:'source-over',gravity:0.08});
  });
  reg('crystal_grove','Crystal Grove', m=>{
    for(let i=0;i<2;i++){
      const a=rand(-Math.PI,-Math.PI*0.2);
      spawn({x:m.x+rand(-8,8),y:m.y,vx:0,vy:0,life:rand(60,100),size:rand(8,14),color:hsla(rand(150,210),90,rand(65,80),0.9),type:'triangle',rot:a+Math.PI/2,blend:'lighter'});
    }
  });

})();
