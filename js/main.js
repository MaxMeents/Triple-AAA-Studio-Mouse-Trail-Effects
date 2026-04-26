// ============================================================
//  UI wiring: build category buttons (twice — one panel per slot),
//  search, shortcuts.
// ============================================================
(function(){
  const { effects, setEffect, clear } = Engine;

  const clearBtn = document.getElementById('btn-clear');
  const toggleBtn = document.getElementById('btn-toggle');
  const toggle2Btn = document.getElementById('btn-toggle-2');
  const toggle3Btn = document.getElementById('btn-toggle-3');
  const panel = document.getElementById('panel');
  const panel2 = document.getElementById('panel-2');
  const panel3 = document.getElementById('panel-3');
  const off2Btn = document.getElementById('btn-off-2');
  const off3Btn = document.getElementById('btn-off-3');

  // Group by category preserving registration order
  const groups = {};
  effects.forEach((eff, idx)=>{
    const cat = eff.category || 'Uncategorized';
    if(!groups[cat]) groups[cat] = [];
    eff._index = idx + 1;
    groups[cat].push(eff);
  });

  // Build a panel's effect list for the given slot (0 = primary, 1 = secondary).
  function buildPanel(catsElId, searchElId, slot){
    const catsEl = document.getElementById(catsElId);
    const searchEl = document.getElementById(searchElId);
    const buttons = [];

    Object.keys(groups).forEach(cat=>{
      const catEl = document.createElement('div');
      catEl.className = 'cat';
      const h = document.createElement('h3');
      h.textContent = cat;
      catEl.appendChild(h);
      const grid = document.createElement('div');
      grid.className = 'cat-grid';
      catEl.appendChild(grid);
      groups[cat].forEach(eff=>{
        const b = document.createElement('button');
        b.className = 'fx-btn';
        b.dataset.id = eff.id;
        b.dataset.name = eff.name.toLowerCase();
        b.innerHTML = `<span class="num">NO.${String(eff._index).padStart(2,'0')}</span>${eff.name}`;
        b.addEventListener('click', ()=>{
          setEffect(eff.id, slot);
          buttons.forEach(btn=>btn.classList.remove('active'));
          b.classList.add('active');
        });
        grid.appendChild(b);
        buttons.push(b);
      });
      catsEl.appendChild(catEl);
    });

    searchEl.addEventListener('input', ()=>{
      const q = searchEl.value.toLowerCase().trim();
      buttons.forEach(b=>{
        const match = !q || b.dataset.name.includes(q) || b.dataset.id.includes(q);
        b.style.display = match ? '' : 'none';
      });
      catsEl.querySelectorAll('.cat').forEach(c=>{
        const anyVisible = Array.from(c.querySelectorAll('.fx-btn'))
          .some(b=>b.style.display !== 'none');
        c.style.display = anyVisible ? '' : 'none';
      });
    });

    return { buttons, searchEl };
  }

  const p1 = buildPanel('categories', 'search', 0);
  const p2 = buildPanel('categories-2', 'search-2', 1);
  const p3 = buildPanel('categories-3', 'search-3', 2);

  clearBtn.addEventListener('click', clear);

  toggleBtn.addEventListener('click', ()=>{
    panel.classList.toggle('hidden');
    toggleBtn.textContent = panel.classList.contains('hidden') ? 'SHOW UI' : 'HIDE UI';
  });

  toggle2Btn.addEventListener('click', ()=>{
    panel2.classList.toggle('hidden');
    toggle2Btn.textContent = panel2.classList.contains('hidden') ? '2ND PANEL' : 'HIDE 2ND';
  });

  off2Btn.addEventListener('click', ()=>{
    setEffect(null, 1);
    p2.buttons.forEach(btn=>btn.classList.remove('active'));
  });

  toggle3Btn.addEventListener('click', ()=>{
    panel3.classList.toggle('hidden');
    toggle3Btn.textContent = panel3.classList.contains('hidden') ? '3RD PANEL' : 'HIDE 3RD';
  });

  off3Btn.addEventListener('click', ()=>{
    setEffect(null, 2);
    p3.buttons.forEach(btn=>btn.classList.remove('active'));
  });

  // Keyboard shortcuts: arrow keys cycle the primary slot, space clears.
  let activeIndex = 0;
  function activate(i){
    const buttons = p1.buttons;
    const visible = buttons.filter(b=>b.style.display !== 'none');
    if(!visible.length) return;
    const current = buttons[activeIndex];
    let idx = visible.indexOf(current);
    if(idx < 0){ idx = 0; }
    else { idx = ((i - activeIndex) > 0) ? (idx + 1) % visible.length
                                         : (idx - 1 + visible.length) % visible.length; }
    const target = visible[idx];
    activeIndex = buttons.indexOf(target);
    target.click();
    target.scrollIntoView({block:'nearest', behavior:'smooth'});
  }
  addEventListener('keydown', e=>{
    if(document.activeElement === p1.searchEl || document.activeElement === p2.searchEl || document.activeElement === p3.searchEl) return;
    if(e.key === 'ArrowRight' || e.key === 'ArrowDown'){ e.preventDefault(); activate(activeIndex+1); }
    else if(e.key === 'ArrowLeft' || e.key === 'ArrowUp'){ e.preventDefault(); activate(activeIndex-1); }
    else if(e.key === ' '){ e.preventDefault(); clear(); }
    else if(e.key === 'h' || e.key === 'H'){ toggleBtn.click(); }
  });

  // Mouse wheel cycles the primary slot from anywhere outside the UI panels.
  let wheelCooldown = 0;
  addEventListener('wheel', e=>{
    if(e.target.closest && e.target.closest('#categories, #categories-2, #categories-3, #search, #search-2, #search-3, .hud, .panel-header')) return;
    e.preventDefault();
    const now = performance.now();
    if(now < wheelCooldown) return;
    wheelCooldown = now + 60;
    activate(activeIndex + (e.deltaY > 0 ? 1 : -1));
  }, {passive:false});

  // Default: activate the first effect in slot 0. Slot 1 starts empty.
  if(p1.buttons.length){
    p1.buttons[0].click();
  }
})();
