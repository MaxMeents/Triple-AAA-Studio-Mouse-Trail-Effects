// ============================================================
//  WEATHER & SKY (25 effects)
// ============================================================
(function(){
  const { register, spawn, U, fx } = Engine;
  const { rand, pick, hsla, TAU, lerp } = U;
  const CAT = 'Weather & Sky';
  const reg = (id,name,onMove,extra)=>register(Object.assign({id,name,category:CAT,onMove},extra||{}));

  reg('rainstorm','Rainstorm', m=>{
    for(let i=0;i<4;i++) spawn({x:m.x+rand(-30,30),y:m.y+rand(-30,30),vx:rand(-0.3,0.3),vy:rand(6,10),life:rand(30,50),size:rand(1,2),color:'rgba(160,190,220,0.9)',type:'line',data:{x1:0,y1:0,x2:0,y2:10},update(p){p.data.x1=p.x;p.data.y1=p.y;p.data.x2=p.x+p.vx;p.data.y2=p.y+p.vy*3;p.x+=p.vx;p.y+=p.vy;p.age++;}});
  });
  reg('hail_pellets','Hail Pellets', m=>{
    fx.fall(m,4,{color:'rgba(220,235,245,1)',vy:rand(4,7),size:rand(2,4),type:'disc',blend:'source-over',gravity:0.2});
  });
  reg('thunder_cloud','Thunder Cloud', m=>{
    for(let i=0;i<3;i++) spawn({x:m.x+rand(-18,18),y:m.y+rand(-10,10),vx:rand(-0.2,0.2),vy:rand(-0.2,0.2),life:rand(120,200),size:rand(16,26),color:`rgba(${U.randi(50,80)},${U.randi(50,80)},${U.randi(70,100)},${rand(0.3,0.5)})`,type:'disc',blend:'source-over',update(p){p.size*=1.005;p.x+=p.vx;p.y+=p.vy;p.age++;}});
    if(Math.random()<0.04) fx.pulseRing(m,'rgba(230,240,255,1)',{start:4,grow:3,life:14});
  });
  reg('tornado_funnel','Tornado Funnel', m=>{
    for(let i=0;i<6;i++){
      const a=rand(0,TAU), r=rand(6,40);
      spawn({x:m.x+Math.cos(a)*r,y:m.y+Math.sin(a)*r,vx:0,vy:0,life:rand(30,60),size:rand(3,7),color:`rgba(150,150,170,${rand(0.4,0.7)})`,type:'disc',blend:'source-over',data:{a,r,cx:m.x,cy:m.y,spin:rand(0.3,0.5)},update(p){p.data.a+=p.data.spin;p.data.r*=0.97;p.x=p.data.cx+Math.cos(p.data.a)*p.data.r;p.y=p.data.cy+Math.sin(p.data.a)*p.data.r-p.age*0.3;p.age++;}});
    }
  });
  reg('fog_bank','Fog Bank', m=>{
    for(let i=0;i<2;i++) spawn({x:m.x+rand(-24,24),y:m.y+rand(-14,14),vx:rand(-0.15,0.15),vy:rand(-0.1,0.1),life:rand(180,280),size:rand(24,40),color:`rgba(200,210,225,${rand(0.12,0.22)})`,type:'disc',blend:'source-over',update(p){p.size*=1.004;p.x+=p.vx;p.y+=p.vy;p.age++;}});
  }, {fade:0.04});
  reg('sleet_lash','Sleet Lash', m=>{
    for(let i=0;i<5;i++) spawn({x:m.x+rand(-20,20),y:m.y+rand(-20,20),vx:-2,vy:6,life:rand(25,45),size:rand(1.5,2.5),color:'rgba(200,220,240,1)',type:'line',data:{x1:0,y1:0,x2:0,y2:0},update(p){p.data.x1=p.x;p.data.y1=p.y;p.data.x2=p.x-3;p.data.y2=p.y+9;p.x+=p.vx;p.y+=p.vy;p.age++;}});
  });
  reg('cirrus_whisper','Cirrus Whisper', m=>{
    for(let i=0;i<2;i++) spawn({x:m.x+rand(-30,30),y:m.y+rand(-4,4),vx:rand(0.1,0.4),vy:rand(-0.05,0.05),life:rand(200,320),size:rand(16,28),color:'rgba(240,245,255,0.25)',type:'disc',blend:'lighter',update(p){p.size*=1.004;p.x+=p.vx;p.y+=p.vy;p.age++;}});
  }, {fade:0.04});
  reg('monsoon','Monsoon', m=>{
    for(let i=0;i<7;i++) spawn({x:m.x+rand(-40,40),y:m.y+rand(-10,10),vx:-3,vy:10,life:rand(25,45),size:rand(1,2.5),color:'rgba(120,160,200,0.9)',type:'line',data:{x1:0,y1:0,x2:0,y2:0},update(p){p.data.x1=p.x;p.data.y1=p.y;p.data.x2=p.x-4;p.data.y2=p.y+14;p.x+=p.vx;p.y+=p.vy;p.age++;}});
  });
  reg('drizzle','Drizzle', m=>{
    for(let i=0;i<2;i++) spawn({x:m.x+rand(-20,20),y:m.y,vx:rand(-0.2,0.2),vy:rand(2,3),life:rand(40,70),size:rand(0.8,1.4),color:'rgba(180,200,230,0.8)',type:'disc',blend:'source-over'});
  });
  reg('wind_gust','Wind Gust', m=>{
    const ang=m.angle||0;
    for(let i=0;i<5;i++){
      const sp=rand(3,8);
      spawn({x:m.x+rand(-10,10),y:m.y+rand(-10,10),vx:Math.cos(ang)*sp,vy:Math.sin(ang)*sp,life:rand(25,50),size:rand(1,2),color:'rgba(220,230,240,0.6)',type:'line',data:{x1:0,y1:0,x2:0,y2:0},update(p){p.data.x1=p.x;p.data.y1=p.y;p.data.x2=p.x-p.vx*3;p.data.y2=p.y-p.vy*3;p.x+=p.vx;p.y+=p.vy;p.vx*=0.96;p.vy*=0.96;p.age++;}});
    }
  });
  reg('cumulus_puff','Cumulus Puff', m=>{
    for(let i=0;i<3;i++) spawn({x:m.x+rand(-16,16),y:m.y+rand(-10,10),vx:rand(-0.15,0.15),vy:rand(-0.2,0),life:rand(160,240),size:rand(20,34),color:'rgba(245,248,255,0.6)',type:'disc',blend:'source-over',update(p){p.size*=1.003;p.x+=p.vx;p.y+=p.vy;p.age++;}});
  });
  reg('lightning_web','Lightning Web', m=>{
    if(m.speed<2) return;
    let x=m.px,y=m.py;
    for(let i=0;i<8;i++){
      const nx=lerp(m.px,m.x,(i+1)/8)+rand(-12,12);
      const ny=lerp(m.py,m.y,(i+1)/8)+rand(-12,12);
      fx.line({x,y},{x:nx,y:ny},'rgba(220,230,255,1)',{width:1.5,life:12});
      if(Math.random()<0.3){
        fx.line({x:nx,y:ny},{x:nx+rand(-15,15),y:ny+rand(-15,15)},'rgba(180,200,255,0.7)',{width:1,life:10});
      }
      x=nx;y=ny;
    }
  });
  reg('blizzard','Blizzard', m=>{
    for(let i=0;i<6;i++) spawn({x:m.x+rand(-30,30),y:m.y+rand(-30,30),vx:rand(-3,-1),vy:rand(2,5),life:rand(40,80),size:rand(2,4),color:'rgba(240,248,255,0.95)',type:'disc',blend:'source-over',update(p){p.vx+=Math.sin(p.age*0.1)*0.1;p.x+=p.vx;p.y+=p.vy;p.age++;}});
  });
  reg('rainbow_mist','Rainbow Mist', m=>{
    for(let i=0;i<3;i++) spawn({x:m.x+rand(-14,14),y:m.y+rand(-14,14),vx:rand(-0.3,0.3),vy:rand(-0.3,0.3),life:rand(100,180),size:rand(10,20),color:hsla(rand(0,360),100,70,0.35),type:'disc',blend:'lighter',update(p){p.size*=1.008;p.x+=p.vx;p.y+=p.vy;p.age++;}});
  });
  reg('sunbeam','Sunbeam', m=>{
    for(let i=0;i<3;i++){
      const a=rand(0,TAU);
      spawn({x:m.x,y:m.y,vx:0,vy:0,life:20,size:2,color:`rgba(255,230,150,${rand(0.5,0.9)})`,type:'line',data:{x1:m.x,y1:m.y,x2:m.x+Math.cos(a)*rand(30,80),y2:m.y+Math.sin(a)*rand(30,80)},update(p){p.age++;}});
    }
    spawn({x:m.x,y:m.y,vx:0,vy:0,life:20,size:12,color:'rgba(255,240,180,1)'});
  });
  reg('moonglow','Moonglow', m=>{
    spawn({x:m.x,y:m.y,vx:0,vy:0,life:50,size:rand(10,14),color:'rgba(210,220,255,0.9)'});
    fx.puff(m,2,{color:'rgba(220,230,255,0.5)',size:rand(4,8),life:rand(60,110)});
  });
  reg('ash_fall','Ash Fall', m=>{
    for(let i=0;i<3;i++) spawn({x:m.x+rand(-16,16),y:m.y,vx:rand(-0.3,0.3),vy:rand(0.3,1.2),life:rand(120,200),size:rand(2,4),color:`rgba(${U.randi(70,100)},${U.randi(70,100)},${U.randi(70,100)},${rand(0.6,0.9)})`,type:'disc',blend:'source-over'});
  });
  reg('sandstorm','Sandstorm', m=>{
    for(let i=0;i<5;i++) spawn({x:m.x+rand(-20,20),y:m.y+rand(-20,20),vx:rand(2,5),vy:rand(-0.4,0.4),life:rand(40,70),size:rand(2,5),color:`rgba(${U.randi(200,230)},${U.randi(170,200)},${U.randi(120,160)},${rand(0.5,0.8)})`,type:'disc',blend:'source-over'});
  });
  reg('heatwave','Heatwave', m=>{
    for(let i=0;i<3;i++) spawn({x:m.x+rand(-20,20),y:m.y+rand(-6,6),vx:rand(-0.2,0.2),vy:-rand(0.4,1),life:rand(80,140),size:rand(14,24),color:`hsla(${rand(20,45)},100%,60%,${rand(0.1,0.25)})`,type:'disc',blend:'lighter',update(p){p.vx+=Math.sin(p.age*0.1)*0.08;p.x+=p.vx;p.y+=p.vy;p.age++;}});
  });
  reg('hurricane_eye','Hurricane Eye', m=>{
    fx.orbit(m,4,{r:rand(30,55),spin:0.18,color:`rgba(150,170,200,${rand(0.6,0.9)})`,drift:0.998});
  });
  reg('stratosphere','Stratosphere', m=>{
    for(let i=0;i<2;i++) spawn({x:m.x+rand(-25,25),y:m.y+rand(-10,10),vx:rand(0.1,0.3),vy:0,life:rand(200,300),size:rand(18,32),color:'rgba(180,210,240,0.3)',type:'disc',blend:'source-over',update(p){p.size*=1.003;p.x+=p.vx;p.y+=p.vy;p.age++;}});
  }, {fade:0.04});
  reg('dust_devil','Dust Devil', m=>{
    for(let i=0;i<5;i++){
      const a=rand(0,TAU),r=rand(4,22);
      spawn({x:m.x+Math.cos(a)*r,y:m.y+Math.sin(a)*r,vx:0,vy:0,life:rand(30,50),size:rand(3,6),color:`rgba(200,170,130,${rand(0.5,0.8)})`,type:'disc',blend:'source-over',data:{a,r,cx:m.x,cy:m.y,spin:0.4},update(p){p.data.a+=p.data.spin;p.data.r+=0.3;p.x=p.data.cx+Math.cos(p.data.a)*p.data.r;p.y=p.data.cy+Math.sin(p.data.a)*p.data.r-p.age*0.2;p.age++;}});
    }
  });
  reg('cirrostratus','Cirrostratus', m=>{
    for(let i=0;i<2;i++) spawn({x:m.x+rand(-40,40),y:m.y+rand(-3,3),vx:rand(0.05,0.2),vy:0,life:rand(240,360),size:rand(14,26),color:'rgba(230,235,250,0.18)',type:'disc',blend:'lighter',update(p){p.size*=1.004;p.x+=p.vx;p.age++;}});
  }, {fade:0.03});
  reg('monsoon_swell','Monsoon Swell', m=>{
    fx.pulseRing(m,'rgba(100,160,200,0.5)',{start:8,grow:1.2,life:60,blend:'source-over'});
    for(let i=0;i<3;i++) spawn({x:m.x+rand(-20,20),y:m.y,vx:-1,vy:6,life:rand(30,55),size:rand(1,2),color:'rgba(140,180,220,0.8)',type:'disc',blend:'source-over'});
  });
  reg('meteor_shower','Meteor Shower', m=>{
    if(Math.random()<0.35){
      spawn({x:m.x+rand(-40,40),y:m.y-rand(10,30),vx:rand(4,7),vy:rand(4,7),life:rand(40,70),size:rand(2,4),color:'rgba(255,230,180,1)',data:{tail:[]},update(p){p.data.tail.push({x:p.x,y:p.y});if(p.data.tail.length>12)p.data.tail.shift();p.x+=p.vx;p.y+=p.vy;p.age++;},render(ctx,pp,t){ctx.globalCompositeOperation='lighter';const T=pp.data.tail;for(let i=0;i<T.length-1;i++){ctx.strokeStyle=`rgba(255,220,160,${i/T.length*t})`;ctx.lineWidth=(i/T.length)*2.5;ctx.beginPath();ctx.moveTo(T[i].x,T[i].y);ctx.lineTo(T[i+1].x,T[i+1].y);ctx.stroke();}ctx.fillStyle='rgba(255,255,255,1)';ctx.beginPath();ctx.arc(pp.x,pp.y,pp.size,0,TAU);ctx.fill();}});
    }
  });
})();
