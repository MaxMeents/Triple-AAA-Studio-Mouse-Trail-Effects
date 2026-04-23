/* =========================================================
   Main — wires the UI, engine, and effects together.
   ========================================================= */
(function () {
    'use strict';

    const canvas   = document.getElementById('fxCanvas');
    const engine   = new FX.Engine(canvas);
    const grid     = document.getElementById('buttonGrid');
    const search   = document.getElementById('search');
    const clearBtn = document.getElementById('clearBtn');
    const panel    = document.getElementById('panel');
    const toggle   = document.getElementById('togglePanel');
    const hint     = document.getElementById('hint');
    const activeName   = document.getElementById('activeName');
    const particleCount = document.getElementById('particleCount');
    const fpsEl    = document.getElementById('fps');

    let active = FX_EFFECTS[0];

    /* --------- build the button grid --------- */
    function buildButtons(filter = '') {
        grid.innerHTML = '';
        const term = filter.trim().toLowerCase();
        FX_EFFECTS.forEach((fx) => {
            if (term && !(fx.name.toLowerCase().includes(term) ||
                          fx.category.toLowerCase().includes(term))) return;
            const btn = document.createElement('button');
            btn.className = 'fx-btn';
            btn.dataset.id = fx.id;
            btn.style.setProperty('--c1', fx.colors[0]);
            btn.style.setProperty('--c2', fx.colors[1]);
            btn.innerHTML =
                `<span class="num">#${String(fx.id).padStart(3, '0')} · ${fx.category}</span>` +
                `${fx.name}`;
            if (fx === active) btn.classList.add('active');
            btn.addEventListener('click', () => setActive(fx));
            grid.appendChild(btn);
        });
    }

    function setActive(fx, { preview = true, scroll = true } = {}) {
        active = fx;
        activeName.textContent = fx.name;
        const btns = grid.querySelectorAll('.fx-btn');
        let activeBtn = null;
        btns.forEach((b) => {
            const match = +b.dataset.id === fx.id;
            b.classList.toggle('active', match);
            if (match) activeBtn = b;
        });
        if (scroll && activeBtn) activeBtn.scrollIntoView({ block: 'nearest' });
        if (preview) {
            engine.spawn({ x: window.innerWidth / 2, y: window.innerHeight / 2,
                shape: 'glow', size: 10, color: fx.colors[0], color2: fx.colors[1],
                growth: -0.4, fade: 0.08, life: 14, glow: 18 });
        }
    }

    /* --------- mouse wheel cycles effects --------- */
    let wheelLast = 0;
    window.addEventListener('wheel', (e) => {
        // avoid fighting the panel's scrollbar
        if (e.target.closest('.button-grid') || e.target.closest('input')) return;
        e.preventDefault();
        const now = performance.now();
        if (now - wheelLast < 60) return; // debounce high-resolution trackpads
        wheelLast = now;
        const dir = e.deltaY > 0 ? 1 : -1;
        const idx = FX_EFFECTS.indexOf(active);
        const next = (idx + dir + FX_EFFECTS.length) % FX_EFFECTS.length;
        setActive(FX_EFFECTS[next]);
    }, { passive: false });

    /* --------- keyboard: arrow keys also cycle, space = clear --------- */
    window.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT') return;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            const idx = FX_EFFECTS.indexOf(active);
            setActive(FX_EFFECTS[(idx + 1) % FX_EFFECTS.length]);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            const idx = FX_EFFECTS.indexOf(active);
            setActive(FX_EFFECTS[(idx - 1 + FX_EFFECTS.length) % FX_EFFECTS.length]);
        } else if (e.key === ' ' || e.key === 'c' || e.key === 'C') {
            engine.clear();
        }
    });

    /* --------- canvas click / drag --------- */
    let dragging = false;
    let lastFire = 0;
    const DRAG_MIN_MS = 40; // GPU pipeline can sustain much higher rates
    const fire = (ev, isDrag) => {
        const now = performance.now();
        if (isDrag && now - lastFire < DRAG_MIN_MS) return;
        lastFire = now;
        const x = ev.clientX, y = ev.clientY;
        try { active.run(engine, x, y); } catch (err) { console.error(err); }
        hint.classList.add('hidden');
    };

    canvas.addEventListener('pointerdown', (e) => {
        dragging = true;
        fire(e, false); // initial click always fires
    });
    canvas.addEventListener('pointermove', (e) => { if (dragging) fire(e, true); });
    window.addEventListener('pointerup', () => { dragging = false; });

    /* --------- UI handlers --------- */
    search.addEventListener('input', () => buildButtons(search.value));
    clearBtn.addEventListener('click', () => engine.clear());
    toggle.addEventListener('click', () => {
        panel.classList.toggle('hidden');
        toggle.textContent = panel.classList.contains('hidden') ? '⮞' : '⮜';
    });

    /* --------- HUD update --------- */
    setInterval(() => {
        particleCount.textContent = engine.count;
        fpsEl.textContent = engine.fps;
    }, 200);

    /* --------- ambient canvas drift (background atmosphere) --------- */
    engine.addFrameHook((eng) => {
        if (Math.random() < 0.08 && eng.count < 400) {
            eng.spawn({
                x: Math.random() * eng.w,
                y: eng.h + 10,
                vx: (Math.random() - 0.5) * 0.3,
                vy: -Math.random() * 0.6 - 0.2,
                shape: 'circle', size: Math.random() * 1.2 + 0.3,
                color: Math.random() < 0.5 ? '#00e6ff' : '#ff2bd6',
                fade: 0.006, life: 160, glow: 0, alpha: 0.5
            });
        }
    });

    /* --------- boot --------- */
    buildButtons();
    activeName.textContent = active.name;
})();
