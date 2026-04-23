// ============================================================
//  RETRO ARCADE (25 effects)
// ============================================================
(function(){
  const { register, spawn, U, fx } = Engine;
  const { rand, pick, hsla, TAU } = U;
  const CAT = 'Retro Arcade';
  const reg = (id,name,onMove,extra)=>register(Object.assign({id,name,category:CAT,onMove},extra||{}));

  reg('pac_dots','Pac Dots', m=>{
    const g=16;
    const gx=Math.round(m.x/g)*g, gy=Math.round(m.y/g)*g;
    spawn({x:gx,y:gy,vx:0,vy:0,life:60,size:3,color:'rgba(255,220,80,1)',type:'disc',blend:'source-over'});
  });
  reg('space_invader','Space Invader', m=>{
    if(Math.random()<0.3) fx.emoji(m,'👾',{size:rand(16,24),color:'rgba(100,255,100,1)',blend:'source-over',vy:rand(-0.6,0.3)});
  });
  reg('tetris_rain','Tetris Rain', m=>{
    const colors=['#00f0f0','#f0f000','#a000f0','#00f000','#f00000','#0000f0','#f0a000'];
    for(let i=0;i<2;i++) spawn({x:Math.round(m.x/8)*8+rand(-20,20),y:m.y,vx:0,vy:rand(2,4),life:rand(40,70),size:8,color:pick(colors),type:'square',rot:0,blend:'source-over'});
  });
  reg('brick_break','Brick Break', m=>{
    for(let i=0;i<3;i++) spawn({x:m.x+rand(-8,8),y:m.y+rand(-8,8),vx:rand(-2,2),vy:rand(-2,1),life:rand(30,50),size:rand(6,10),color:pick(['#ff5555','#ffaa55','#ffff55','#55ff55','#55aaff','#aa55ff']),type:'square',rot:rand(0,TAU),rotV:rand(-0.2,0.2),gravity:0.15,blend:'source-over'});
  });
  reg('snake_trail','Snake Trail', function(m){
    this.pts=this.pts||[];
    this.pts.unshift({x:m.x,y:m.y});
    if(this.pts.length>40) this.pts.pop();
  }, {onFrame(){const ctx=Engine.ctx;ctx.globalCompositeOperation='source-over';this.pts.forEach((p,i)=>{const a=1-i/this.pts.length;ctx.fillStyle=`rgba(80,220,120,${a})`;ctx.fillRect(Math.round(p.x/6)*6-4,Math.round(p.y/6)*6-4,8,8);});}, init(){this.pts=[];}});
  reg('1_up_shower','1-Up Shower', m=>{
    if(Math.random()<0.25) spawn({x:m.x+rand(-10,10),y:m.y,vx:0,vy:-rand(0.5,1.2),life:rand(40,70),size:14,color:'rgba(80,220,80,1)',type:'text',rot:0,data:{char:'1UP',font:'monospace'}});
  });
  reg('coin_fountain','Coin Fountain', m=>{
    for(let i=0;i<2;i++) spawn({x:m.x,y:m.y,vx:rand(-2,2),vy:-rand(2,4),life:rand(50,80),size:rand(5,8),color:'rgba(255,220,60,1)',type:'disc',blend:'source-over',gravity:0.2});
  });
  reg('fireball','Fireball', m=>{
    spawn({x:m.x,y:m.y,vx:0,vy:0,life:30,size:12,color:'rgba(255,180,60,1)'});
    fx.puff(m,3,{color:hsla(rand(10,40),100,60,0.9),size:rand(3,6),life:rand(20,40)});
  });
  reg('shell_storm','Shell Storm', m=>{
    for(let i=0;i<3;i++){
      const a=rand(0,TAU);
      spawn({x:m.x,y:m.y,vx:Math.cos(a)*3,vy:Math.sin(a)*3,life:rand(40,70),size:10,color:'rgba(100,200,80,1)',type:'disc',blend:'source-over',rot:a,rotV:0.2});
    }
  });
  reg('lightning_blaster','Lightning Blaster', m=>{
    if(m.speed>1.5){
      const a=m.angle;
      for(let i=0;i<5;i++){
        const d=i*12;
        spawn({x:m.x+Math.cos(a)*d,y:m.y+Math.sin(a)*d,vx:0,vy:0,life:15,size:rand(3,5),color:'rgba(120,220,255,1)',type:'square',rot:a,blend:'lighter'});
      }
    }
  });
  reg('bubble_bobble','Bubble Bobble', m=>{
    if(Math.random()<0.35){
      spawn({x:m.x+rand(-8,8),y:m.y,vx:rand(-0.3,0.3),vy:-rand(0.4,1),life:rand(100,160),size:rand(8,14),color:hsla(rand(0,360),100,75,0.7),render(ctx,p,t){ctx.globalCompositeOperation='source-over';ctx.strokeStyle=p.color;ctx.lineWidth=2;ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,TAU);ctx.stroke();ctx.fillStyle='rgba(255,255,255,0.5)';ctx.beginPath();ctx.arc(p.x-p.size*0.35,p.y-p.size*0.35,p.size*0.25,0,TAU);ctx.fill();}});
    }
  });
  reg('pixel_mario','Pixel Mario', m=>{
    const colors=['#ff0000','#0033ff','#ffcc88'];
    for(let i=0;i<3;i++) spawn({x:Math.round((m.x+rand(-8,8))/4)*4,y:Math.round((m.y+rand(-8,8))/4)*4,vx:0,vy:0,life:rand(20,40),size:4,color:pick(colors),type:'square',rot:0,blend:'source-over'});
  });
  reg('retro_bullet','Retro Bullet', m=>{
    if(m.speed>1){
      const a=m.angle;
      spawn({x:m.x,y:m.y,vx:Math.cos(a)*6,vy:Math.sin(a)*6,life:30,size:6,color:'rgba(255,255,100,1)',type:'square',rot:a,blend:'source-over'});
      fx.line({x:m.x,y:m.y},{x:m.x-Math.cos(a)*10,y:m.y-Math.sin(a)*10},'rgba(255,220,80,0.6)',{width:3,life:10});
    }
  });
  reg('joystick_spark','Joystick Spark', m=>{
    fx.burst(m,5,{color:hsla(rand(0,360),100,70,1),smin:1,smax:4,life:rand(15,30),size:rand(2,3),type:'square',rot:0,blend:'source-over'});
  });
  reg('8bit_star','8-bit Star', m=>{
    if(Math.random()<0.4) spawn({x:Math.round(m.x/4)*4,y:Math.round(m.y/4)*4,vx:0,vy:0,life:rand(30,50),size:rand(6,10),color:'rgba(255,230,100,1)',type:'star',rot:0,data:{points:4},blend:'source-over'});
  });
  reg('boss_beam','Boss Beam', m=>{
    fx.line({x:m.px,y:m.py},{x:m.x,y:m.y},'rgba(255,80,80,1)',{width:6,life:18});
    fx.line({x:m.px,y:m.py},{x:m.x,y:m.y},'rgba(255,200,200,0.5)',{width:14,life:22});
  });
  reg('warp_pipe','Warp Pipe', m=>{
    for(let i=0;i<3;i++){
      const a=rand(0,TAU);
      spawn({x:m.x,y:m.y,vx:0,vy:0,life:rand(30,60),size:rand(3,6),color:'rgba(80,220,80,1)',type:'square',rot:0,data:{a,r:4,cx:m.x,cy:m.y,spin:0.25},update(p){p.data.a+=p.data.spin;p.data.r+=0.7;p.x=p.data.cx+Math.cos(p.data.a)*p.data.r;p.y=p.data.cy+Math.sin(p.data.a)*p.data.r;p.age++;},blend:'source-over'});
    }
  });
  reg('vector_ship','Vector Ship', m=>{
    if(m.speed>1){
      const a=m.angle;
      const pts=[{x:m.x+Math.cos(a)*10,y:m.y+Math.sin(a)*10},{x:m.x+Math.cos(a+2.3)*8,y:m.y+Math.sin(a+2.3)*8},{x:m.x+Math.cos(a-2.3)*8,y:m.y+Math.sin(a-2.3)*8}];
      fx.line(pts[0],pts[1],'rgba(180,255,220,0.95)',{width:1.5,life:20});
      fx.line(pts[1],pts[2],'rgba(180,255,220,0.95)',{width:1.5,life:20});
      fx.line(pts[2],pts[0],'rgba(180,255,220,0.95)',{width:1.5,life:20});
    }
  });
  reg('score_pop','Score Pop', m=>{
    if(Math.random()<0.2) spawn({x:m.x,y:m.y,vx:0,vy:-1.2,life:50,size:14,color:'rgba(255,220,80,1)',type:'text',rot:0,data:{char:'+'+(U.randi(1,10)*100),font:'monospace'}});
  });
  reg('power_pellet','Power Pellet', m=>{
    fx.pulseRing(m,'rgba(255,220,80,0.9)',{start:3,grow:1.2,life:40});
    spawn({x:m.x,y:m.y,vx:0,vy:0,life:30,size:6,color:'rgba(255,220,80,1)',type:'disc',blend:'source-over'});
  });
  reg('ghost_nom','Ghost Nom', m=>{
    if(Math.random()<0.3) fx.emoji(m,'👻',{size:rand(16,22),color:pick(['rgba(255,100,100,1)','rgba(255,180,220,1)','rgba(100,220,255,1)','rgba(255,180,80,1)']),blend:'source-over'});
  });
  reg('turtle_shell','Turtle Shell', m=>{
    if(Math.random()<0.25) spawn({x:m.x,y:m.y,vx:m.dx*0.3,vy:m.dy*0.3,life:rand(50,90),size:rand(8,12),color:'rgba(50,180,50,1)',type:'hexagon',rot:rand(0,TAU),rotV:0.15,drag:0.98,blend:'source-over'});
  });
  reg('dragon_coin','Dragon Coin', m=>{
    if(Math.random()<0.2) spawn({x:m.x+rand(-6,6),y:m.y,vx:rand(-1,1),vy:-rand(1,2),life:rand(50,80),size:rand(8,12),color:'rgba(255,180,60,1)',type:'disc',blend:'source-over',gravity:0.15});
  });
  reg('checker_flag','Checker Flag', m=>{
    const g=8;
    const gx=Math.round(m.x/g)*g, gy=Math.round(m.y/g)*g;
    spawn({x:gx,y:gy,vx:0,vy:0,life:30,size:g,color:((gx/g+gy/g)%2===0)?'rgba(0,0,0,1)':'rgba(255,255,255,1)',type:'square',rot:0,blend:'source-over'});
  }, {fade:0.25});
  reg('hyper_beam','Hyper Beam', m=>{
    const a=m.angle;
    for(let i=0;i<4;i++){
      const d=i*8;
      spawn({x:m.x+Math.cos(a)*d,y:m.y+Math.sin(a)*d,vx:Math.cos(a)*2,vy:Math.sin(a)*2,life:rand(15,30),size:rand(4,8),color:hsla((i*30+performance.now()*0.3)%360,100,65,1)});
    }
  });
})();
