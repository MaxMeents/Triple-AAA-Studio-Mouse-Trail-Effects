// ============================================================
//  UI wiring: build category buttons, search, shortcuts.
// ============================================================
(function(){
  const { effects, setEffect, clear } = Engine;

  const catsEl = document.getElementById('categories');
  const searchEl = document.getElementById('search');
  const clearBtn = document.getElementById('btn-clear');
  const toggleBtn = document.getElementById('btn-toggle');
  const panel = document.getElementById('panel');

  // Group by category preserving registration order
  const groups = {};
  effects.forEach((eff, idx)=>{
    const cat = eff.category || 'Uncategorized';
    if(!groups[cat]) groups[cat] = [];
    eff._index = idx + 1;
    groups[cat].push(eff);
  });

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
        setEffect(eff.id);
        buttons.forEach(btn=>btn.classList.remove('active'));
        b.classList.add('active');
      });
      grid.appendChild(b);
      buttons.push(b);
    });
    catsEl.appendChild(catEl);
  });

  // Search filter
  searchEl.addEventListener('input', ()=>{
    const q = searchEl.value.toLowerCase().trim();
    buttons.forEach(b=>{
      const match = !q || b.dataset.name.includes(q) || b.dataset.id.includes(q);
      b.style.display = match ? '' : 'none';
    });
    // Hide categories with no visible buttons
    document.querySelectorAll('.cat').forEach(c=>{
      const anyVisible = Array.from(c.querySelectorAll('.fx-btn'))
        .some(b=>b.style.display !== 'none');
      c.style.display = anyVisible ? '' : 'none';
    });
  });

  clearBtn.addEventListener('click', clear);

  toggleBtn.addEventListener('click', ()=>{
    panel.classList.toggle('hidden');
    toggleBtn.textContent = panel.classList.contains('hidden') ? 'SHOW UI' : 'HIDE UI';
  });

  // Keyboard shortcuts: arrow keys to cycle, space to clear
  let activeIndex = 0;
  function activate(i){
    // Only cycle through currently visible (unfiltered) buttons
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
    if(document.activeElement === searchEl) return;
    if(e.key === 'ArrowRight' || e.key === 'ArrowDown'){ e.preventDefault(); activate(activeIndex+1); }
    else if(e.key === 'ArrowLeft' || e.key === 'ArrowUp'){ e.preventDefault(); activate(activeIndex-1); }
    else if(e.key === ' '){ e.preventDefault(); clear(); }
    else if(e.key === 'h' || e.key === 'H'){ toggleBtn.click(); }
  });

  // Mouse wheel cycling — works anywhere on the canvas / page
  // Wheel down → next effect, Wheel up → previous effect.
  // Ignore wheel events that originate inside the scrollable effects panel
  // so users can still scroll the button list normally.
  let wheelCooldown = 0;
  addEventListener('wheel', e=>{
    if(e.target.closest && e.target.closest('#categories, #search, .hud')) return;
    e.preventDefault();
    const now = performance.now();
    if(now < wheelCooldown) return;
    wheelCooldown = now + 60; // throttle rapid wheel ticks
    activate(activeIndex + (e.deltaY > 0 ? 1 : -1));
  }, {passive:false});

  // Default: activate the first effect
  if(buttons.length){
    buttons[0].click();
  }
})();
