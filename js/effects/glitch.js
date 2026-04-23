// ============================================================
//  GLITCH & DATA (25 effects)
// ============================================================
(function(){
  const { register, spawn, U, fx } = Engine;
  const { rand, pick, hsla, TAU } = U;
  const CAT = 'Glitch & Data';
  const reg = (id,name,onMove,extra)=>register(Object.assign({id,name,category:CAT,onMove},extra||{}));

  reg('corrupted_pixel','Corrupted Pixel', m=>{
    for(let i=0;i<5;i++) spawn({x:Math.round(m.x+rand(-20,20)),y:Math.round(m.y+rand(-20,20)),vx:0,vy:0,life:rand(15,30),size:rand(3,8),color:hsla(rand(0,360),100,60,1),type:'square',rot:0,blend:'source-over'});
  }, {fade:0.3});
  reg('scan_line','Scan Line', m=>{
    spawn({x:0,y:m.y,vx:0,vy:0,life:25,size:1,color:'rgba(100,255,180,0.6)',type:'line',data:{x1:0,y1:m.y,x2:innerWidth,y2:m.y},update(p){p.age++;}});
  }, {fade:0.25});
  reg('bit_rot','Bit Rot', m=>{
    for(let i=0;i<4;i++){
      const ch=Math.random()<0.5?'0':'1';
      fx.emoji(m,ch,{size:rand(10,16),color:'rgba(80,255,120,0.9)',vy:rand(-0.5,0.5),vx:rand(-0.5,0.5),life:rand(40,70),data:{char:ch,font:'monospace'}});
    }
  });
  reg('vhs_static','VHS Static', m=>{
    for(let i=0;i<12;i++) spawn({x:m.x+rand(-30,30),y:m.y+rand(-30,30),vx:0,vy:0,life:rand(4,10),size:rand(1,3),color:Math.random()<0.5?'rgba(255,255,255,1)':'rgba(0,0,0,1)',type:'square',rot:0,blend:'source-over'});
  }, {fade:0.4});
  reg('crt_ghost','CRT Ghost', m=>{
    fx.line({x:0,y:m.y},{x:innerWidth,y:m.y},'rgba(255,80,80,0.3)',{width:1,life:20,blend:'source-over'});
    fx.line({x:0,y:m.y+2},{x:innerWidth,y:m.y+2},'rgba(80,180,255,0.3)',{width:1,life:20,blend:'source-over'});
  });
  reg('rgb_split','RGB Split', m=>{
    spawn({x:m.x-4,y:m.y,vx:0,vy:0,life:20,size:rand(4,8),color:'rgba(255,50,50,0.8)',type:'disc',blend:'lighter'});
    spawn({x:m.x+4,y:m.y,vx:0,vy:0,life:20,size:rand(4,8),color:'rgba(50,255,150,0.8)',type:'disc',blend:'lighter'});
    spawn({x:m.x,y:m.y+4,vx:0,vy:0,life:20,size:rand(4,8),color:'rgba(50,120,255,0.8)',type:'disc',blend:'lighter'});
  });
  reg('buffer_overflow','Buffer Overflow', m=>{
    for(let i=0;i<8;i++) spawn({x:m.x+i*rand(3,8),y:m.y+rand(-2,2),vx:0,vy:0,life:rand(10,25),size:rand(2,5),color:'rgba(255,0,120,0.9)',type:'square',rot:0,blend:'source-over'});
  }, {fade:0.3});
  reg('null_pointer','Null Pointer', m=>{
    fx.emoji(m,'∅',{size:rand(20,30),color:'rgba(255,40,40,1)',vy:-rand(0.3,0.8),rotV:0.05});
  });
  reg('stack_trace','Stack Trace', m=>{
    const chars='abcdef0123456789';
    for(let i=0;i<2;i++){
      const s='0x'+Array.from({length:4}).map(()=>pick(chars)).join('');
      spawn({x:m.x+rand(-20,20),y:m.y+i*12,vx:0,vy:0,life:rand(30,60),size:12,color:'rgba(255,80,80,0.9)',type:'text',rot:0,data:{char:s,font:'monospace'}});
    }
  }, {fade:0.15});
  reg('matrix_leak','Matrix Leak', m=>{
    const chars='ｱｲｳｴｵｶｷｸｹｺ01';
    for(let i=0;i<2;i++) spawn({x:m.x+rand(-16,16),y:m.y,vx:0,vy:rand(3,6),life:rand(40,80),size:rand(12,16),color:Math.random()<0.2?'rgba(220,255,220,1)':'rgba(60,220,120,1)',type:'text',data:{char:chars[Math.floor(Math.random()*chars.length)],font:'monospace'}});
  }, {fade:0.1});
  reg('dns_flood','DNS Flood', m=>{
    for(let i=0;i<5;i++){
      const t=Math.floor(rand(0,255))+'.'+Math.floor(rand(0,255));
      spawn({x:m.x+rand(-40,40),y:m.y+rand(-20,20),vx:0,vy:0,life:rand(15,30),size:10,color:'rgba(120,220,255,0.9)',type:'text',data:{char:t,font:'monospace'}});
    }
  }, {fade:0.25});
  reg('packet_loss','Packet Loss', m=>{
    for(let i=0;i<8;i++){
      if(Math.random()<0.5) spawn({x:m.x+i*8-30,y:m.y,vx:rand(1,3),vy:0,life:rand(15,30),size:6,color:'rgba(255,220,80,0.9)',type:'square',rot:0,blend:'source-over'});
    }
  });
  reg('kernel_panic','Kernel Panic', m=>{
    for(let i=0;i<10;i++) spawn({x:m.x+rand(-40,40),y:m.y+rand(-40,40),vx:0,vy:0,life:rand(5,15),size:rand(2,6),color:pick(['rgba(255,0,0,1)','rgba(0,255,255,1)','rgba(255,255,0,1)','rgba(255,0,255,1)']),type:'square',rot:0,blend:'source-over'});
  }, {fade:0.35});
  reg('memory_leak','Memory Leak', m=>{
    for(let i=0;i<3;i++) spawn({x:m.x+rand(-10,10),y:m.y+rand(-10,10),vx:0,vy:0,life:rand(200,320),size:rand(4,8),color:'rgba(255,80,120,0.5)',type:'square',rot:0,blend:'source-over',update(p){p.size*=1.003;p.age++;}});
  }, {fade:0.04});
  reg('blue_screen','Blue Screen', m=>{
    spawn({x:m.x-12,y:m.y-3,vx:0,vy:0,life:30,size:8,color:'rgba(255,255,255,1)',type:'text',data:{char:':(',font:'monospace'}});
    fx.puff(m,2,{color:'rgba(40,90,220,1)',size:rand(4,8),life:rand(30,60),type:'square',rot:0,blend:'source-over'});
  }, {fade:0.25});
  reg('404_drift','404 Drift', m=>{
    if(Math.random()<0.4) spawn({x:m.x+rand(-10,10),y:m.y+rand(-10,10),vx:rand(-0.3,0.3),vy:rand(-0.3,0.3),life:rand(40,80),size:16,color:'rgba(255,100,100,0.95)',type:'text',rot:rand(-0.2,0.2),data:{char:'404',font:'monospace'}});
  });
  reg('ascii_rain','ASCII Rain', m=>{
    const chars='!@#$%^&*(){}[]<>?/\\';
    for(let i=0;i<2;i++) spawn({x:m.x+rand(-20,20),y:m.y,vx:0,vy:rand(3,6),life:rand(30,60),size:rand(10,14),color:'rgba(180,255,180,0.9)',type:'text',data:{char:pick(chars.split('')),font:'monospace'}});
  }, {fade:0.12});
  reg('hex_dump','Hex Dump', m=>{
    const chars='0123456789ABCDEF';
    for(let i=0;i<3;i++) spawn({x:m.x+rand(-30,30),y:m.y+rand(-6,6),vx:0,vy:0,life:rand(30,50),size:12,color:'rgba(120,220,180,0.9)',type:'text',data:{char:pick(chars)+pick(chars),font:'monospace'}});
  }, {fade:0.18});
  reg('binary_spill','Binary Spill', m=>{
    for(let i=0;i<3;i++) spawn({x:m.x+rand(-10,10),y:m.y+rand(-10,10),vx:rand(-0.5,0.5),vy:rand(0.3,1.2),life:rand(50,90),size:rand(10,14),color:'rgba(140,255,200,0.9)',type:'text',data:{char:Math.random()<0.5?'0':'1',font:'monospace'}});
  });
  reg('qr_burst','QR Burst', m=>{
    const g=4;
    for(let i=0;i<10;i++){
      const gx=Math.round((m.x+rand(-20,20))/g)*g, gy=Math.round((m.y+rand(-20,20))/g)*g;
      spawn({x:gx,y:gy,vx:0,vy:0,life:rand(15,40),size:g,color:Math.random()<0.5?'rgba(255,255,255,1)':'rgba(0,0,0,1)',type:'square',rot:0,blend:'source-over'});
    }
  }, {fade:0.25});
  reg('datamosh','Datamosh', m=>{
    for(let i=0;i<4;i++) spawn({x:m.x+rand(-25,25),y:m.y+rand(-10,10),vx:rand(-2,2),vy:0,life:rand(20,45),size:rand(8,20),color:hsla(rand(0,360),100,60,0.55),type:'square',rot:0,blend:'lighter'});
  }, {fade:0.2});
  reg('lag_spike','Lag Spike', m=>{
    if(Math.random()<0.15){
      for(let i=0;i<6;i++){
        spawn({x:m.x+i*rand(5,12),y:m.y,vx:0,vy:0,life:rand(10,25),size:rand(2,4),color:'rgba(255,80,80,1)',type:'square',rot:0,blend:'source-over'});
      }
    }
    fx.puff(m,1,{color:'rgba(255,200,80,1)',size:3,life:15});
  });
  reg('signal_jam','Signal Jam', m=>{
    for(let i=0;i<4;i++){
      const y=m.y+rand(-20,20);
      fx.line({x:m.x-rand(10,40),y},{x:m.x+rand(10,40),y},hsla(rand(0,360),100,60,0.7),{width:rand(1,3),life:rand(12,25)});
    }
  }, {fade:0.25});
  reg('deepfried','Deepfried', m=>{
    for(let i=0;i<3;i++) spawn({x:m.x+rand(-8,8),y:m.y+rand(-8,8),vx:rand(-0.5,0.5),vy:rand(-0.5,0.5),life:rand(20,40),size:rand(6,12),color:hsla(rand(20,55),100,60,0.9),type:'square',rot:rand(0,TAU),blend:'lighter'});
  });
  reg('checksum_fail','Checksum Fail', m=>{
    fx.emoji(m,'✗',{size:rand(18,28),color:'rgba(255,60,60,1)',vy:0,vx:0,life:rand(20,40)});
    for(let i=0;i<3;i++) spawn({x:m.x+rand(-12,12),y:m.y+rand(-12,12),vx:0,vy:0,life:rand(10,20),size:rand(2,5),color:'rgba(255,80,80,1)',type:'square',rot:0,blend:'source-over'});
  }, {fade:0.25});
})();
