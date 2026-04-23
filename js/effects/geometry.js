// ============================================================
//  GEOMETRY & ABSTRACT (25 effects)
// ============================================================
(function(){
  const { register, spawn, U, fx } = Engine;
  const { rand, pick, hsla, TAU } = U;
  const CAT = 'Geometry & Abstract';
  const reg = (id,name,onMove,extra)=>register(Object.assign({id,name,category:CAT,onMove},extra||{}));

  reg('triangle_wave','Triangle Wave', m=>{
    for(let i=0;i<3;i++) spawn({x:m.x+rand(-8,8),y:m.y+rand(-8,8),vx:rand(-0.4,0.4),vy:rand(-0.4,0.4),life:rand(40,70),size:rand(6,12),color:hsla(rand(180,220),100,70,1),type:'triangle',rot:rand(0,TAU),rotV:rand(-0.15,0.15)});
  });
  reg('square_spiral','Square Spiral', m=>{
    for(let i=0;i<2;i++){
      const a=rand(0,TAU);
      spawn({x:m.x,y:m.y,vx:0,vy:0,life:rand(50,90),size:rand(5,9),color:hsla(rand(200,280),100,70,1),type:'square',rot:a,rotV:0.1,data:{a,r:4,cx:m.x,cy:m.y,spin:0.2},update(p){p.data.a+=p.data.spin;p.data.r+=0.8;p.x=p.data.cx+Math.cos(p.data.a)*p.data.r;p.y=p.data.cy+Math.sin(p.data.a)*p.data.r;p.rot+=p.rotV;p.age++;}});
    }
  });
  reg('hex_tile','Hex Tile', m=>{
    const g=28;
    const gx=Math.round(m.x/g)*g, gy=Math.round(m.y/g)*g;
    spawn({x:gx,y:gy,vx:0,vy:0,life:50,size:g*0.6,color:hsla((m.x+m.y)%360,100,70,1),type:'hexagon',rot:0,update(p){p.size*=0.995;p.rot+=0.02;p.age++;}});
  });
  reg('fibonacci_arc','Fibonacci Arc', function(m){
    this.n=(this.n||0)+1;
    const a=this.n*2.39996;
    const r=Math.sqrt(this.n)*4;
    spawn({x:m.x+Math.cos(a)*r,y:m.y+Math.sin(a)*r,vx:0,vy:0,life:rand(60,110),size:rand(3,5),color:hsla((this.n*6)%360,90,65,1)});
  }, {init(){this.n=0;}});
  reg('fractal_bloom','Fractal Bloom', m=>{
    for(let i=0;i<6;i++){
      const a=i*TAU/6+(m.age||0);
      spawn({x:m.x+Math.cos(a)*10,y:m.y+Math.sin(a)*10,vx:Math.cos(a)*1,vy:Math.sin(a)*1,life:rand(40,70),size:rand(3,6),color:hsla((performance.now()*0.1+i*60)%360,100,70,1),drag:0.97});
    }
  });
  reg('voronoi_cell','Voronoi Cell', m=>{
    for(let i=0;i<2;i++) spawn({x:m.x+rand(-30,30),y:m.y+rand(-30,30),vx:0,vy:0,life:rand(30,60),size:rand(12,22),color:hsla(rand(160,260),90,65,0.6),type:'hexagon',rot:rand(0,TAU),rotV:0});
  });
  reg('mobius_strip','Möbius Strip', m=>{
    for(let i=0;i<3;i++){
      const a=rand(0,TAU);
      spawn({x:m.x,y:m.y,vx:0,vy:0,life:rand(60,100),size:rand(3,5),color:hsla(rand(260,320),100,70,1),data:{a,cx:m.x,cy:m.y,t:0},update(p){p.data.t+=0.1;const r=20+Math.sin(p.data.t)*8;p.x=p.data.cx+Math.cos(p.data.a+p.data.t*0.5)*r;p.y=p.data.cy+Math.sin((p.data.a+p.data.t*0.5)*2)*r*0.5;p.age++;}});
    }
  });
  reg('penrose_step','Penrose Step', m=>{
    const gx=Math.round(m.x/30)*30, gy=Math.round(m.y/30)*30;
    spawn({x:gx,y:gy,vx:0,vy:0,life:45,size:14,color:hsla(rand(40,80),100,70,0.85),type:'triangle',rot:rand(0,TAU)});
  });
  reg('sierpinski_seed','Sierpinski Seed', m=>{
    for(let i=0;i<3;i++){
      const a=i*TAU/3-Math.PI/2;
      spawn({x:m.x+Math.cos(a)*16,y:m.y+Math.sin(a)*16,vx:Math.cos(a)*0.3,vy:Math.sin(a)*0.3,life:rand(50,80),size:rand(5,9),color:hsla(rand(40,80),100,70,1),type:'triangle',rot:a+Math.PI/2});
    }
  });
  reg('mandala_mint','Mandala Mint', m=>{
    for(let i=0;i<6;i++){
      const a=i*TAU/6;
      spawn({x:m.x+Math.cos(a)*18,y:m.y+Math.sin(a)*18,vx:0,vy:0,life:40,size:6,color:hsla(150,90,70,1),type:'star',rot:a,data:{points:5}});
    }
  });
  reg('lissajous','Lissajous', m=>{
    for(let i=0;i<2;i++) spawn({x:m.x,y:m.y,vx:0,vy:0,life:rand(50,90),size:rand(2,4),color:hsla(rand(170,230),100,70,1),data:{cx:m.x,cy:m.y,t:0,ax:rand(1,3),ay:rand(1,3),ph:rand(0,TAU)},update(p){p.data.t+=0.15;p.x=p.data.cx+Math.cos(p.data.ax*p.data.t+p.data.ph)*20;p.y=p.data.cy+Math.sin(p.data.ay*p.data.t)*20;p.age++;}});
  });
  reg('bezier_bend','Bezier Bend', function(m){
    this.pts=this.pts||[];
    this.pts.push({x:m.x,y:m.y});
    if(this.pts.length>20) this.pts.shift();
  }, {onFrame(){const ctx=Engine.ctx,pts=this.pts;if(!pts||pts.length<3)return;ctx.globalCompositeOperation='lighter';ctx.strokeStyle='rgba(120,230,255,0.8)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(pts[0].x,pts[0].y);for(let i=1;i<pts.length-1;i++){const xc=(pts[i].x+pts[i+1].x)/2, yc=(pts[i].y+pts[i+1].y)/2;ctx.quadraticCurveTo(pts[i].x,pts[i].y,xc,yc);}ctx.stroke();}, init(){this.pts=[];}});
  reg('kaleidoscope','Kaleidoscope', m=>{
    const cx=innerWidth/2, cy=innerHeight/2;
    const dx=m.x-cx, dy=m.y-cy;
    for(let i=0;i<6;i++){
      const a=i*TAU/6, ca=Math.cos(a), sa=Math.sin(a);
      spawn({x:cx+dx*ca-dy*sa,y:cy+dx*sa+dy*ca,vx:0,vy:0,life:40,size:rand(3,6),color:hsla((i*60+performance.now()*0.2)%360,100,65,1)});
    }
  });
  reg('polygon_pop','Polygon Pop', m=>{
    if(Math.random()<0.5){
      const sides=U.randi(3,8);
      spawn({x:m.x,y:m.y,vx:0,vy:0,life:30,size:16,color:hsla(rand(0,360),100,65,1),rot:rand(0,TAU),data:{sides},render(ctx,p,t){ctx.globalCompositeOperation='lighter';ctx.strokeStyle=p.color;ctx.lineWidth=1.5;ctx.beginPath();for(let i=0;i<p.data.sides;i++){const a=p.rot+i*TAU/p.data.sides;const x=p.x+Math.cos(a)*p.size,y=p.y+Math.sin(a)*p.size;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.closePath();ctx.stroke();},update(p){p.size+=1.2;p.age++;}});
    }
  });
  reg('euclidean','Euclidean', m=>{
    fx.line({x:m.px,y:m.py},{x:m.x,y:m.y},'rgba(220,220,255,0.9)',{width:1,life:40});
    spawn({x:m.x,y:m.y,vx:0,vy:0,life:30,size:3,color:'rgba(255,255,255,1)',type:'disc',blend:'source-over'});
  });
  reg('parabola','Parabola', m=>{
    for(let i=0;i<2;i++){
      const x0=rand(-4,4);
      spawn({x:m.x+x0,y:m.y,vx:x0*0.2,vy:-rand(2,4),life:rand(50,90),size:rand(3,5),color:hsla(rand(200,260),100,70,1),gravity:0.12});
    }
  });
  reg('ellipse_drift','Ellipse Drift', m=>{
    for(let i=0;i<2;i++){
      const a=rand(0,TAU);
      spawn({x:m.x,y:m.y,vx:0,vy:0,life:rand(60,100),size:rand(2,4),color:hsla(rand(180,240),100,70,1),data:{a,cx:m.x,cy:m.y,rx:rand(14,28),ry:rand(8,16),spin:rand(0.08,0.14)},update(p){p.data.a+=p.data.spin;p.x=p.data.cx+Math.cos(p.data.a)*p.data.rx;p.y=p.data.cy+Math.sin(p.data.a)*p.data.ry;p.age++;}});
    }
  });
  reg('sacred_geo','Sacred Geometry', m=>{
    for(let i=0;i<6;i++){
      const a=i*TAU/6;
      spawn({x:m.x+Math.cos(a)*10,y:m.y+Math.sin(a)*10,vx:0,vy:0,life:45,size:14,color:'rgba(255,220,100,0.8)',type:'ring',update(p){p.size+=0.4;p.age++;}});
    }
  });
  reg('pythagoras','Pythagoras', m=>{
    const s=rand(12,22);
    spawn({x:m.x,y:m.y,vx:0,vy:0,life:40,size:s,color:hsla(rand(40,80),100,65,0.9),type:'square',rot:rand(0,TAU),rotV:0.05});
  });
  reg('cardioid','Cardioid', function(m){
    this.t=(this.t||0)+0.2;
    const r=16*(1-Math.cos(this.t));
    spawn({x:m.x+Math.cos(this.t)*r,y:m.y+Math.sin(this.t)*r,vx:0,vy:0,life:rand(40,70),size:rand(2,4),color:hsla((this.t*20)%360,100,70,1)});
  }, {init(){this.t=0;}});
  reg('rose_curve','Rose Curve', function(m){
    this.t=(this.t||0)+0.25;
    const r=20*Math.cos(3*this.t);
    spawn({x:m.x+Math.cos(this.t)*r,y:m.y+Math.sin(this.t)*r,vx:0,vy:0,life:rand(50,80),size:rand(2,4),color:hsla(rand(320,360),100,70,1)});
  }, {init(){this.t=0;}});
  reg('spirograph','Spirograph', function(m){
    this.t=(this.t||0)+0.3;
    const R=20,r=7,d=12,t=this.t;
    const x=(R-r)*Math.cos(t)+d*Math.cos(((R-r)/r)*t);
    const y=(R-r)*Math.sin(t)-d*Math.sin(((R-r)/r)*t);
    spawn({x:m.x+x,y:m.y+y,vx:0,vy:0,life:rand(60,100),size:2,color:hsla((t*30)%360,100,70,1)});
  }, {init(){this.t=0;}});
  reg('prism_folds','Prism Folds', m=>{
    for(let i=0;i<3;i++){
      const a=rand(0,TAU);
      spawn({x:m.x,y:m.y,vx:Math.cos(a)*rand(1,3),vy:Math.sin(a)*rand(1,3),life:rand(40,70),size:rand(8,14),color:hsla(i*120+performance.now()*0.1%60,100,65,1),type:'triangle',rot:a,drag:0.97});
    }
  });
  reg('tessellation','Tessellation', m=>{
    const g=24;
    for(let i=-1;i<=1;i++) for(let j=-1;j<=1;j++){
      if(Math.random()<0.3){
        const gx=Math.round(m.x/g)*g+i*g, gy=Math.round(m.y/g)*g+j*g;
        spawn({x:gx,y:gy,vx:0,vy:0,life:30,size:g*0.45,color:hsla(((gx+gy)/4)%360,100,65,0.8),type:'square',rot:0,blend:'source-over'});
      }
    }
  });
  reg('zeta_field','Zeta Field', m=>{
    for(let i=0;i<4;i++){
      const x=m.x+rand(-30,30), y=m.y+rand(-30,30);
      spawn({x,y,vx:0,vy:0,life:rand(30,60),size:rand(1,2.5),color:hsla(rand(180,260),100,70,1)});
    }
  }, {fade:0.1});
})();
