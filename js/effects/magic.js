// ============================================================
//  MAGIC & ARCANE effects (10)
// ============================================================
(function(){
  const { register, spawn, U } = Engine;
  const { rand, pick, hsla, TAU } = U;
  const CAT = 'Magic & Arcane';

  // 21. Phantom Ink — black smoke
  register({
    id:'phantom_ink', name:'Phantom Ink', category:CAT, fade:0.08,
    onMove(m){
      for(let i=0;i<3;i++){
        spawn({
          x:m.x+rand(-6,6), y:m.y+rand(-6,6),
          vx:rand(-0.4,0.4), vy:rand(-0.8,0.2),
          life:rand(90,160), size:rand(8,18),
          color:`rgba(10,10,20,${rand(0.4,0.75)})`,
          type:'disc', blend:'source-over',
          drag:0.985,
          update(p){
            p.vx += rand(-0.05,0.05); p.vy += rand(-0.05,0.05);
            p.vx*=p.drag; p.vy*=p.drag;
            p.x+=p.vx; p.y+=p.vy;
            p.size *= 1.008;
            p.age++;
          }
        });
      }
    }
  });

  // 22. Ghost Rune — unicode runes
  register({
    id:'ghost_rune', name:'Ghost Rune', category:CAT, fade:0.15,
    runes:'ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ',
    onMove(m){
      if(Math.random()<0.5){
        spawn({
          x:m.x+rand(-10,10), y:m.y+rand(-10,10),
          vx:rand(-0.2,0.2), vy:-rand(0.2,0.6),
          life:rand(80,140), size:rand(18,28),
          color:hsla(rand(170,210),90,70,0.9),
          type:'text',
          rot:rand(-0.4,0.4),
          data:{char:this.runes[Math.floor(Math.random()*this.runes.length)]}
        });
      }
    }
  });

  // 23. Arcane Sigil — rotating symbol ring
  register({
    id:'arcane_sigil', name:'Arcane Sigil', category:CAT, fade:0.2,
    symbols:'✧✦✶✷✸❋❉✺✹',
    onMove(m){
      if(Math.random()<0.35){
        const base = rand(0,TAU);
        for(let i=0;i<6;i++){
          const a = base + i*TAU/6;
          const r = 22;
          spawn({
            x:m.x+Math.cos(a)*r, y:m.y+Math.sin(a)*r,
            vx:Math.cos(a)*0.3, vy:Math.sin(a)*0.3,
            life:rand(40,70), size:14,
            color:hsla(rand(260,300),100,70,1),
            type:'text', rot:a,
            data:{char:this.symbols[Math.floor(Math.random()*this.symbols.length)]}
          });
        }
      }
    }
  });

  // 24. Spectral Chains — chain-linked orbs
  register({
    id:'spectral_chains', name:'Spectral Chains', category:CAT, fade:0.22,
    last:null,
    onMove(m){
      const prev=this.last;
      const cur={x:m.x,y:m.y};
      this.last=cur;
      if(prev){
        spawn({
          x:0,y:0,life:28,age:0,size:2,
          color:'rgba(170,130,255,0.85)',
          type:'line',
          data:{x1:prev.x,y1:prev.y,x2:cur.x,y2:cur.y},
          update(p){ p.age++; }
        });
      }
      spawn({
        x:m.x, y:m.y, vx:0, vy:0,
        life:30, size:rand(3,5),
        color:'rgba(200,170,255,1)', type:'ring'
      });
    },
    init(){ this.last=null; }
  });

  // 25. Hex Shield
  register({
    id:'hex_shield', name:'Hex Shield', category:CAT, fade:0.25,
    onMove(m){
      spawn({
        x:m.x, y:m.y, vx:0, vy:0,
        life:40, size:8,
        color:'rgba(120,200,255,0.9)',
        type:'hexagon',
        update(p){ p.size += 1.3; p.rot += 0.04; p.age++; }
      });
    }
  });

  // 26. Runebound — glowing glyphs tethered to cursor
  register({
    id:'runebound', name:'Runebound', category:CAT, fade:0.15,
    chars:'⚡✦❖✧◈⟁⟟⟠',
    onMove(m){
      if(Math.random()<0.45){
        const a = rand(0,TAU), r = rand(12,36);
        spawn({
          x:m.x+Math.cos(a)*r, y:m.y+Math.sin(a)*r,
          vx:Math.cos(a)*rand(-0.4,0.4), vy:Math.sin(a)*rand(-0.4,0.4),
          life:rand(50,90), size:rand(12,20),
          color:hsla(rand(40,60),100,70,1),
          type:'text', rot:rand(-0.3,0.3),
          data:{char:this.chars[Math.floor(Math.random()*this.chars.length)]}
        });
      }
    }
  });

  // 27. Glyph Burst — bursts of symbols on quick motion
  register({
    id:'glyph_burst', name:'Glyph Burst', category:CAT, fade:0.22,
    chars:'✦✧★☆✶✷',
    onMove(m){
      const n = Math.min(6, Math.floor(m.speed/6));
      for(let i=0;i<n;i++){
        const a=rand(0,TAU), s=rand(1,3);
        spawn({
          x:m.x, y:m.y,
          vx:Math.cos(a)*s, vy:Math.sin(a)*s,
          life:rand(35,65), size:rand(10,18),
          color:hsla(rand(280,330),100,70,1),
          type:'text', rot:rand(0,TAU), rotV:rand(-0.2,0.2),
          drag:0.95,
          data:{char:this.chars[Math.floor(Math.random()*this.chars.length)]}
        });
      }
    }
  });

  // 28. Halo Ring
  register({
    id:'halo_ring', name:'Halo Ring', category:CAT, fade:0.2,
    onMove(m){
      spawn({
        x:m.x, y:m.y, vx:0, vy:0,
        life:50, size:4,
        color:'rgba(255,235,180,0.9)', type:'ring',
        update(p){ p.size += 1.1; p.age++; }
      });
      if(Math.random()<0.3){
        spawn({
          x:m.x, y:m.y, vx:0, vy:0,
          life:60, size:4,
          color:'rgba(255,200,120,0.6)', type:'ring',
          update(p){ p.size += 0.7; p.age++; }
        });
      }
    }
  });

  // 29. Shadow Veil — dark cloud clings
  register({
    id:'shadow_veil', name:'Shadow Veil', category:CAT, fade:0.1,
    onMove(m){
      for(let i=0;i<4;i++){
        spawn({
          x:m.x+rand(-12,12), y:m.y+rand(-12,12),
          vx:rand(-0.3,0.3), vy:rand(-0.3,0.3),
          life:rand(80,140), size:rand(14,24),
          color:`rgba(30,10,50,${rand(0.3,0.6)})`,
          type:'disc', blend:'source-over',
          update(p){ p.size*=1.005; p.x+=p.vx; p.y+=p.vy; p.age++; }
        });
      }
    }
  });

  // 30. Obsidian Glass — angular black shards with violet edge
  register({
    id:'obsidian_glass', name:'Obsidian Glass', category:CAT, fade:0.2,
    onMove(m){
      for(let i=0;i<3;i++){
        const a=rand(0,TAU), s=rand(1,3);
        spawn({
          x:m.x, y:m.y,
          vx:Math.cos(a)*s, vy:Math.sin(a)*s,
          life:rand(40,70), size:rand(8,16),
          color:'#120820',
          rot:a, rotV:rand(-0.05,0.05),
          drag:0.97,
          render(ctx,p,t){
            ctx.globalCompositeOperation='source-over';
            ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot);
            ctx.fillStyle=p.color;
            ctx.strokeStyle='rgba(180,120,255,0.8)';
            ctx.lineWidth=1;
            ctx.beginPath();
            ctx.moveTo(0,-p.size);
            ctx.lineTo(p.size*0.6, 0);
            ctx.lineTo(0, p.size);
            ctx.lineTo(-p.size*0.5, p.size*0.3);
            ctx.closePath();
            ctx.fill(); ctx.stroke();
            ctx.restore();
          }
        });
      }
    }
  });

  // ---------- extended: effects 31-45 ----------
  const fx = Engine.fx;
  const reg = (id,name,onMove,extra)=>register(Object.assign({id,name,category:CAT,onMove},extra||{}));

  reg('mana_surge','Mana Surge', m=>{
    for(let i=0;i<3;i++) spawn({x:m.x+rand(-6,6),y:m.y+rand(-6,6),vx:rand(-0.4,0.4),vy:-rand(0.3,0.9),life:rand(60,100),size:rand(3,6),color:hsla(rand(200,250),100,70,1)});
    fx.pulseRing(m,'rgba(120,170,255,0.5)',{start:4,grow:1,life:40});
  });
  reg('wizard_spark','Wizard Spark', m=>{
    fx.burst(m,6,{color:hsla(rand(260,300),100,rand(65,80),1),smin:1,smax:3,life:rand(30,60),size:rand(1.5,3),drag:0.95,gravity:-0.02});
  });
  reg('summon_circle','Summon Circle', m=>{
    for(let i=0;i<6;i++){
      const a=i*TAU/6+performance.now()*0.003;
      spawn({x:m.x+Math.cos(a)*22,y:m.y+Math.sin(a)*22,vx:0,vy:0,life:30,size:4,color:'rgba(180,100,255,1)',type:'star',rot:a,data:{points:5}});
    }
    fx.pulseRing(m,'rgba(180,100,255,0.6)',{start:20,grow:0.4,life:30});
  });
  reg('enchant_dust','Enchant Dust', m=>{
    for(let i=0;i<3;i++) spawn({x:m.x+rand(-10,10),y:m.y+rand(-10,10),vx:rand(-0.3,0.3),vy:-rand(0.2,0.6),life:rand(80,140),size:rand(1.2,2.4),color:hsla(rand(40,60),100,rand(75,90),1)});
  });
  reg('spellbook_glyph','Spellbook Glyph', m=>{
    const chars='✶✷✸✹✺✻✼❋✥✦';
    if(Math.random()<0.4) fx.emoji(m,chars,{size:rand(14,22),color:hsla(rand(180,240),100,70,1),rotV:rand(-0.05,0.05)});
  });
  reg('pentagram','Pentagram', m=>{
    const now=performance.now()*0.001;
    for(let i=0;i<5;i++){
      const a=i*TAU/5 - Math.PI/2 + now*0.2;
      const a2=((i+2)%5)*TAU/5 - Math.PI/2 + now*0.2;
      fx.line({x:m.x+Math.cos(a)*16,y:m.y+Math.sin(a)*16},{x:m.x+Math.cos(a2)*16,y:m.y+Math.sin(a2)*16},'rgba(255,50,80,0.6)',{width:1,life:12});
    }
  }, {fade:0.3});
  reg('divine_ray','Divine Ray', m=>{
    for(let i=0;i<5;i++){
      const a=-Math.PI/2+rand(-0.3,0.3);
      fx.line({x:m.x,y:m.y},{x:m.x+Math.cos(a)*rand(30,80),y:m.y+Math.sin(a)*rand(30,80)},'rgba(255,240,180,0.7)',{width:rand(1,2),life:20});
    }
    spawn({x:m.x,y:m.y,vx:0,vy:0,life:25,size:8,color:'rgba(255,250,200,1)'});
  });
  reg('time_sigil','Time Sigil', m=>{
    fx.pulseRing(m,'rgba(180,220,255,0.7)',{start:6,grow:0.6,life:80});
    if(Math.random()<0.3) fx.emoji(m,'⟲⟳⧖⧗',{size:rand(14,22),color:'rgba(180,220,255,1)'});
  });
  reg('arcane_mist','Arcane Mist', m=>{
    for(let i=0;i<3;i++) spawn({x:m.x+rand(-12,12),y:m.y+rand(-12,12),vx:rand(-0.2,0.2),vy:rand(-0.2,0.2),life:rand(100,180),size:rand(10,20),color:hsla(rand(270,320),80,65,0.3),type:'disc',blend:'lighter',update(p){p.size*=1.01;p.x+=p.vx;p.y+=p.vy;p.age++;}});
  }, {fade:0.06});
  reg('crystal_ball','Crystal Ball', m=>{
    spawn({x:m.x,y:m.y,vx:0,vy:0,life:30,size:rand(12,18),color:'rgba(180,220,255,0.7)',render(ctx,p,t){ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(p.x-p.size*0.3,p.y-p.size*0.3,0,p.x,p.y,p.size);g.addColorStop(0,'rgba(255,255,255,0.9)');g.addColorStop(0.4,'rgba(180,220,255,0.5)');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,TAU);ctx.fill();}});
  });
  reg('rune_shatter','Rune Shatter', m=>{
    if(m.speed>3) fx.burst(m,10,{color:hsla(rand(180,240),100,70,0.9),smin:2,smax:5,life:rand(30,55),size:rand(4,8),type:'triangle',rot:rand(0,TAU),rotV:rand(-0.3,0.3),drag:0.96,blend:'source-over'});
  });
  reg('elemental_orb','Elemental Orb', m=>{
    fx.orbit(m,3,{r:rand(12,22),spin:0.18,color:hsla(pick([0,120,210,280]),100,65,1),size:rand(2,4)});
    spawn({x:m.x,y:m.y,vx:0,vy:0,life:20,size:6,color:'rgba(255,255,255,0.8)'});
  });
  reg('warlock_fire','Warlock Fire', m=>{
    fx.rise(m,3,{color:hsla(rand(260,310),100,rand(50,65),0.85),size:rand(6,11),life:rand(50,90),gravity:-0.03});
  });
  reg('seers_eye','Seer\'s Eye', m=>{
    if(Math.random()<0.08){
      fx.pulseRing(m,'rgba(180,140,255,0.9)',{start:4,grow:1.8,life:50});
      spawn({x:m.x,y:m.y,vx:0,vy:0,life:40,size:6,color:'rgba(220,180,255,1)'});
    }
    fx.puff(m,1,{color:'rgba(180,140,255,0.6)',size:rand(2,3),life:rand(30,60)});
  });
  reg('teleport_shimmer','Teleport Shimmer', m=>{
    for(let i=0;i<4;i++) spawn({x:m.x+rand(-8,8),y:m.y+rand(-14,14),vx:0,vy:0,life:rand(10,20),size:rand(2,5),color:hsla(rand(180,240),100,75,1),type:'square',rot:0,blend:'lighter'});
  }, {fade:0.3});

})();
