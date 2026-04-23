/* =========================================================
   50 Triple-A Mouse Click Effects
   Each effect is an object:
     { id, name, category, colors:[c1,c2], run(engine, x, y) }
   ========================================================= */
(function (global) {
    'use strict';
    const { rand, randi, pick, TAU, lerp } = FX.util;

    /* tiny helper: spawn particle on engine */
    const S = (eng, o) => eng.spawn(o);

    const EFFECTS = [];
    const add = (o) => { o.id = EFFECTS.length + 1; EFFECTS.push(o); };

    /* ---------- 1. Shockwave Pulse ---------- */
    add({
        name: 'Shockwave Pulse', category: 'Kinetic', colors: ['#00e6ff', '#0066ff'],
        run(e, x, y) {
            for (let i = 0; i < 3; i++) {
                S(e, { x, y, shape: 'ring', size: 4 + i * 6, color: i === 0 ? '#ffffff' : '#00e6ff',
                    growth: 4 - i * 0.6, fade: 0.025, life: 60, alpha: 1, glow: 25,
                    data: { thickness: 3 - i } });
            }
            for (let i = 0; i < 24; i++) {
                const a = (i / 24) * TAU, sp = rand(4, 9);
                S(e, { x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
                    color: '#00e6ff', size: rand(1.5, 3), friction: 0.94, fade: 0.03,
                    glow: 14, life: 50 });
            }
        }
    });

    /* ---------- 2. Plasma Burst ---------- */
    add({
        name: 'Plasma Burst', category: 'Energy', colors: ['#ff2bd6', '#6a00ff'],
        run(e, x, y) {
            S(e, { x, y, shape: 'glow', size: 90, color: '#ff2bd6', color2: '#6a00ff',
                growth: -2, fade: 0.04, life: 40, blend: 'lighter' });
            for (let i = 0; i < 60; i++) {
                const a = rand(0, TAU), sp = rand(1, 10);
                S(e, { x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
                    shape: 'glow', size: rand(6, 18), color: pick(['#ff2bd6', '#b34bff', '#ffffff']),
                    color2: '#6a00ff', friction: 0.9, fade: 0.025, life: 55, glow: 20 });
            }
        }
    });

    /* ---------- 3. Arcane Sigil ---------- */
    add({
        name: 'Arcane Sigil', category: 'Magic', colors: ['#a46bff', '#ffd1ff'],
        run(e, x, y) {
            const col = '#c39bff';
            // outer + inner ring
            S(e, { x, y, shape: 'ring', size: 50, color: col, growth: 0.2, fade: 0.015,
                life: 90, alpha: 1, glow: 20, data: { thickness: 2 } });
            S(e, { x, y, shape: 'ring', size: 30, color: '#fff', growth: -0.1, fade: 0.015,
                life: 90, glow: 16, data: { thickness: 1 } });
            // runic glyphs around a circle
            const glyphs = ['✦','✧','☆','✵','✺','✹','❈'];
            for (let i = 0; i < 7; i++) {
                const a = (i / 7) * TAU;
                S(e, { x: x + Math.cos(a) * 40, y: y + Math.sin(a) * 40,
                    shape: 'text', text: pick(glyphs), color: col, font: 'bold 18px Orbitron',
                    rotation: a + Math.PI / 2, spin: 0.01, life: 100, fade: 0.012, glow: 14 });
            }
            // rising dust
            for (let i = 0; i < 30; i++) {
                S(e, { x: x + rand(-30, 30), y: y + rand(-30, 30),
                    vx: rand(-0.3, 0.3), vy: rand(-2, -0.5),
                    shape: 'circle', size: rand(1, 2.5), color: col,
                    fade: 0.02, life: 80, glow: 10 });
            }
        }
    });

    /* ---------- 4. Dragon's Breath ---------- */
    add({
        name: "Dragon's Breath", category: 'Fire', colors: ['#ff3d00', '#ffb300'],
        run(e, x, y) {
            const dir = rand(0, TAU);
            for (let i = 0; i < 60; i++) {
                const a = dir + rand(-0.4, 0.4), sp = rand(5, 12);
                S(e, { x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 0.5,
                    shape: 'glow', size: rand(10, 22),
                    color: pick(['#ff3d00','#ff8a00','#ffb300','#ffffff']),
                    color2: '#330000', friction: 0.93, growth: -0.3, fade: 0.02,
                    life: 60, glow: 22 });
            }
        }
    });

    /* ---------- 5. Frost Nova ---------- */
    add({
        name: 'Frost Nova', category: 'Ice', colors: ['#b3f0ff', '#0077ff'],
        run(e, x, y) {
            S(e, { x, y, shape: 'ring', size: 10, color: '#e8faff', growth: 3.2,
                fade: 0.02, life: 60, glow: 22, data: { thickness: 3 } });
            for (let i = 0; i < 40; i++) {
                const a = rand(0, TAU), sp = rand(3, 9);
                S(e, { x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
                    shape: 'shard', size: rand(4, 10),
                    color: pick(['#b3f0ff','#e8faff','#7ad8ff']),
                    rotation: a, spin: rand(-0.2, 0.2),
                    friction: 0.9, fade: 0.02, life: 70, glow: 14 });
            }
        }
    });

    /* ---------- 6. Void Rift ---------- */
    add({
        name: 'Void Rift', category: 'Cosmic', colors: ['#6a00ff', '#000'],
        run(e, x, y) {
            S(e, { x, y, shape: 'glow', size: 70, color: '#1a0033', color2: '#000',
                growth: 1.5, fade: 0.02, life: 90, blend: 'source-over' });
            for (let i = 0; i < 50; i++) {
                const a = rand(0, TAU), r = rand(40, 140);
                const px = x + Math.cos(a) * r, py = y + Math.sin(a) * r;
                S(e, { x: px, y: py,
                    vx: (x - px) * 0.04, vy: (y - py) * 0.04,
                    shape: 'circle', size: rand(1, 3),
                    color: pick(['#b266ff','#6a00ff','#ffffff']),
                    friction: 0.98, fade: 0.018, life: 80, glow: 12 });
            }
        }
    });

    /* ---------- 7. Stellar Collapse ---------- */
    add({
        name: 'Stellar Collapse', category: 'Cosmic', colors: ['#ffd700', '#ff0055'],
        run(e, x, y) {
            for (let i = 0; i < 80; i++) {
                const a = rand(0, TAU), r = rand(120, 200);
                const px = x + Math.cos(a) * r, py = y + Math.sin(a) * r;
                S(e, { x: px, y: py,
                    vx: (x - px) * 0.06, vy: (y - py) * 0.06,
                    shape: 'circle', size: rand(1, 2.5),
                    color: pick(['#ffd700','#ffffff','#ff88aa']),
                    friction: 1, fade: 0.012, life: 80, glow: 12, trail: 6 });
            }
            setTimeout(() => {
                for (let i = 0; i < 60; i++) {
                    const a = rand(0, TAU), sp = rand(6, 14);
                    S(e, { x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
                        shape: 'glow', size: rand(6, 14), color: '#ffd700', color2: '#ff0055',
                        friction: 0.95, fade: 0.03, life: 60, glow: 20 });
                }
            }, 700);
        }
    });

    /* ---------- 8. Phoenix Flare ---------- */
    add({
        name: 'Phoenix Flare', category: 'Fire', colors: ['#ff6600', '#ffee00'],
        run(e, x, y) {
            for (let i = 0; i < 50; i++) {
                const a = rand(-Math.PI, 0); // upward half
                const sp = rand(3, 10);
                S(e, { x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
                    shape: 'glow', size: rand(8, 16),
                    color: pick(['#ff3300','#ff8800','#ffcc00','#ffffff']),
                    gravity: 0.15, friction: 0.96, fade: 0.02, life: 70, glow: 22, trail: 4 });
            }
            // wings (feathers)
            for (let i = 0; i < 14; i++) {
                const side = i < 7 ? -1 : 1;
                const a = side * rand(0.3, 1.1);
                const sp = rand(6, 10);
                S(e, { x, y, vx: Math.cos(Math.PI / 2 + a * side) * sp * side, vy: -Math.abs(sp),
                    shape: 'shard', size: rand(8, 14),
                    color: pick(['#ffaa00','#ff4400','#ffee99']),
                    rotation: a, spin: rand(-0.1, 0.1) * side,
                    gravity: 0.12, fade: 0.018, life: 90, glow: 16 });
            }
        }
    });

    /* ---------- 9. Thunder Strike ---------- */
    add({
        name: 'Thunder Strike', category: 'Electric', colors: ['#ffffff', '#66ccff'],
        run(e, x, y) {
            // main bolt from top
            S(e, { x: x + rand(-40, 40), y: 0, x2: x, y2: y,
                shape: 'bolt', color: '#ffffff', size: 3, fade: 0.08, life: 14,
                glow: 30, data: { segments: 14, amp: 22 } });
            S(e, { x: x + rand(-40, 40), y: 0, x2: x, y2: y,
                shape: 'bolt', color: '#a6e4ff', size: 6, fade: 0.12, life: 10,
                glow: 40, data: { segments: 10, amp: 30 } });
            // ground flash
            S(e, { x, y, shape: 'glow', size: 140, color: '#ffffff', color2: '#66ccff',
                growth: -2, fade: 0.1, life: 14, glow: 40 });
            for (let i = 0; i < 24; i++) {
                const a = rand(0, TAU), sp = rand(2, 8);
                S(e, { x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
                    shape: 'spark', size: 2, color: '#a6e4ff',
                    friction: 0.9, fade: 0.04, life: 30, glow: 14,
                    data: { length: 16 } });
            }
        }
    });

    /* ---------- 10. Shadow Warp ---------- */
    add({
        name: 'Shadow Warp', category: 'Shadow', colors: ['#1a0033', '#ff00cc'],
        run(e, x, y) {
            for (let i = 0; i < 40; i++) {
                const a = rand(0, TAU);
                S(e, { x: x + Math.cos(a) * 60, y: y + Math.sin(a) * 60,
                    vx: Math.cos(a) * -3, vy: Math.sin(a) * -3,
                    shape: 'circle', size: rand(2, 6),
                    color: pick(['#2a004d','#550099','#ff00cc']),
                    friction: 1, fade: 0.03, life: 45, glow: 12, trail: 5, blend: 'source-over' });
            }
            S(e, { x, y, shape: 'ring', size: 60, color: '#ff00cc',
                growth: -1.2, fade: 0.03, life: 40, glow: 20, data: { thickness: 2 } });
        }
    });

    /* ---------- 11. Holy Smite ---------- */
    add({
        name: 'Holy Smite', category: 'Light', colors: ['#fff6a0', '#ffffff'],
        run(e, x, y) {
            // descending beam
            for (let i = 0; i < 30; i++) {
                S(e, { x: x + rand(-15, 15), y: -20, vy: rand(18, 28),
                    shape: 'line', x2: x + rand(-5, 5), y2: -60,
                    color: '#fff6a0', size: rand(1, 2), fade: 0.05, life: 20,
                    glow: 20, custom(p) { p.x2 = p.x; p.y2 = p.y - 80; } });
            }
            // ground flash
            S(e, { x, y, shape: 'glow', size: 120, color: '#ffffff', color2: '#fff6a0',
                growth: -2, fade: 0.05, life: 30, glow: 40 });
            for (let i = 0; i < 20; i++) {
                S(e, { x: x + rand(-20, 20), y: y + rand(-20, 20),
                    vy: rand(-3, -1), shape: 'star', size: rand(3, 6),
                    color: '#fff6a0', spin: rand(-0.1, 0.1), fade: 0.025, life: 60, glow: 14,
                    data: { points: 4, inner: 0.35 } });
            }
        }
    });

    /* ---------- 12. Nether Bloom ---------- */
    add({
        name: 'Nether Bloom', category: 'Shadow', colors: ['#8800ff', '#ff0088'],
        run(e, x, y) {
            const petals = 8;
            for (let i = 0; i < petals; i++) {
                const a = (i / petals) * TAU;
                for (let j = 0; j < 12; j++) {
                    const r = j * 3;
                    S(e, { x: x + Math.cos(a) * r, y: y + Math.sin(a) * r,
                        vx: Math.cos(a) * rand(1, 3), vy: Math.sin(a) * rand(1, 3),
                        shape: 'glow', size: rand(5, 10),
                        color: pick(['#8800ff','#ff0088','#ffffff']),
                        color2: '#22002a',
                        friction: 0.94, fade: 0.02, life: 55, glow: 18 });
                }
            }
        }
    });

    /* ---------- 13. Cyber Glitch ---------- */
    add({
        name: 'Cyber Glitch', category: 'Tech', colors: ['#00ffa6', '#ff00aa'],
        run(e, x, y) {
            for (let i = 0; i < 40; i++) {
                const horiz = Math.random() < 0.5;
                S(e, { x: x + rand(-30, 30), y: y + rand(-30, 30),
                    shape: 'square', size: rand(3, 10),
                    color: pick(['#00ffa6','#ff00aa','#ffffff','#00e6ff']),
                    vx: horiz ? rand(-6, 6) : 0, vy: horiz ? 0 : rand(-6, 6),
                    friction: 0.85, fade: 0.05, life: 30, glow: 12, blend: 'source-over' });
            }
            for (let i = 0; i < 3; i++) {
                S(e, { x: x - 80, y: y + rand(-10, 10), x2: x + 80, y2: y + rand(-10, 10),
                    shape: 'line', color: pick(['#00ffa6','#ff00aa']),
                    size: 2, fade: 0.1, life: 10, glow: 14 });
            }
        }
    });

    /* ---------- 14. Neon Ripple ---------- */
    add({
        name: 'Neon Ripple', category: 'Energy', colors: ['#00ffff', '#ff00ff'],
        run(e, x, y) {
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    S(e, { x, y, shape: 'ring', size: 6,
                        color: i % 2 ? '#ff00ff' : '#00ffff',
                        growth: 2.2, fade: 0.018, life: 70, glow: 22, data: { thickness: 3 } });
                }, i * 90);
            }
        }
    });

    /* ---------- 15. Blood Splatter ---------- */
    add({
        name: 'Blood Splatter', category: 'Impact', colors: ['#8b0000', '#ff1a1a'],
        run(e, x, y) {
            for (let i = 0; i < 50; i++) {
                const a = rand(0, TAU), sp = rand(2, 11);
                S(e, { x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
                    shape: 'circle', size: rand(2, 6),
                    color: pick(['#8b0000','#b30000','#ff1a1a','#660000']),
                    gravity: 0.35, friction: 0.96, fade: 0.01, life: 120,
                    blend: 'source-over', glow: 0 });
            }
            // central splat
            for (let i = 0; i < 12; i++) {
                const a = rand(0, TAU);
                S(e, { x: x + Math.cos(a) * rand(4, 12), y: y + Math.sin(a) * rand(4, 12),
                    shape: 'circle', size: rand(3, 7), color: '#8b0000',
                    fade: 0.005, life: 200, blend: 'source-over' });
            }
        }
    });

    /* ---------- 16. Crystal Shatter ---------- */
    add({
        name: 'Crystal Shatter', category: 'Ice', colors: ['#c9b6ff', '#6effff'],
        run(e, x, y) {
            for (let i = 0; i < 30; i++) {
                const a = rand(0, TAU), sp = rand(4, 10);
                S(e, { x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
                    shape: 'shard', size: rand(6, 14),
                    color: pick(['#c9b6ff','#6effff','#ffffff']),
                    rotation: a, spin: rand(-0.3, 0.3),
                    gravity: 0.25, fade: 0.02, life: 70, glow: 16 });
            }
            S(e, { x, y, shape: 'ring', size: 8, color: '#ffffff',
                growth: 2, fade: 0.04, life: 30, glow: 22, data: { thickness: 2 } });
        }
    });

    /* ---------- 17. Quantum Flux ---------- */
    add({
        name: 'Quantum Flux', category: 'Cosmic', colors: ['#00e6ff', '#a46bff'],
        run(e, x, y) {
            for (let i = 0; i < 40; i++) {
                const a = rand(0, TAU), r = rand(10, 40);
                const px = x + Math.cos(a) * r, py = y + Math.sin(a) * r;
                S(e, { x: px, y: py, vx: 0, vy: 0,
                    shape: 'circle', size: rand(1, 2.5),
                    color: pick(['#00e6ff','#a46bff','#ffffff']),
                    fade: 0.015, life: 90, glow: 12,
                    data: { ox: px, oy: py, phase: rand(0, TAU), freq: rand(0.05, 0.12), amp: rand(6, 18) },
                    custom(p) {
                        p.data.phase += p.data.freq;
                        const ang = Math.atan2(y - p.data.oy, x - p.data.ox);
                        const off = Math.sin(p.data.phase) * p.data.amp;
                        p.x = p.data.ox + Math.cos(ang + Math.PI / 2) * off;
                        p.y = p.data.oy + Math.sin(ang + Math.PI / 2) * off;
                    } });
            }
        }
    });

    /* ---------- 18. Ember Cascade ---------- */
    add({
        name: 'Ember Cascade', category: 'Fire', colors: ['#ff6600', '#ffd000'],
        run(e, x, y) {
            for (let i = 0; i < 40; i++) {
                S(e, { x: x + rand(-10, 10), y,
                    vx: rand(-1, 1), vy: rand(-5, -1),
                    shape: 'circle', size: rand(1.5, 3),
                    color: pick(['#ff6600','#ffaa00','#ffd000']),
                    gravity: 0.12, friction: 0.99, fade: 0.018, life: 90, glow: 14, trail: 4 });
            }
        }
    });

    /* ---------- 19. Ion Storm ---------- */
    add({
        name: 'Ion Storm', category: 'Electric', colors: ['#66ffff', '#ffffff'],
        run(e, x, y) {
            for (let i = 0; i < 8; i++) {
                const a = rand(0, TAU), r = rand(40, 100);
                S(e, { x, y, x2: x + Math.cos(a) * r, y2: y + Math.sin(a) * r,
                    shape: 'bolt', color: '#66ffff', size: 2, fade: 0.07, life: 15,
                    glow: 20, data: { segments: 8, amp: 10 } });
            }
            for (let i = 0; i < 30; i++) {
                const a = rand(0, TAU), sp = rand(1, 5);
                S(e, { x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
                    shape: 'circle', size: rand(1, 2), color: '#a6e4ff',
                    friction: 0.95, fade: 0.03, life: 40, glow: 14 });
            }
        }
    });

    /* ---------- 20. Chrono Freeze ---------- */
    add({
        name: 'Chrono Freeze', category: 'Time', colors: ['#a0faff', '#ffffff'],
        run(e, x, y) {
            S(e, { x, y, shape: 'ring', size: 10, color: '#ffffff',
                growth: 1.5, fade: 0.015, life: 90, glow: 20, data: { thickness: 2 } });
            for (let i = 0; i < 12; i++) {
                const a = (i / 12) * TAU;
                S(e, { x: x + Math.cos(a) * 12, y: y + Math.sin(a) * 12,
                    shape: 'text', text: pick(['|','—','/','\\']),
                    color: '#a0faff', font: 'bold 14px Orbitron',
                    rotation: a, spin: 0.02, life: 120, fade: 0.01, glow: 14,
                    data: { ox: x, oy: y, a, r: 12 },
                    custom(p) {
                        p.data.r += 0.5;
                        p.x = p.data.ox + Math.cos(p.data.a) * p.data.r;
                        p.y = p.data.oy + Math.sin(p.data.a) * p.data.r;
                    } });
            }
        }
    });

    /* ---------- 21. Runic Circle ---------- */
    add({
        name: 'Runic Circle', category: 'Magic', colors: ['#ffcc00', '#ff6600'],
        run(e, x, y) {
            const runes = ['ᚠ','ᚢ','ᚦ','ᚨ','ᚱ','ᚲ','ᚷ','ᚹ','ᚺ','ᚾ','ᛁ','ᛃ'];
            const n = 12;
            for (let i = 0; i < n; i++) {
                const a = (i / n) * TAU;
                S(e, { x: x + Math.cos(a) * 50, y: y + Math.sin(a) * 50,
                    shape: 'text', text: pick(runes), color: '#ffcc00',
                    font: 'bold 20px Orbitron', life: 120, fade: 0.008, glow: 18,
                    data: { ox: x, oy: y, a, r: 50 },
                    custom(p) { p.data.a += 0.02; p.x = p.data.ox + Math.cos(p.data.a) * p.data.r;
                        p.y = p.data.oy + Math.sin(p.data.a) * p.data.r; } });
            }
            S(e, { x, y, shape: 'ring', size: 50, color: '#ffcc00',
                growth: 0, fade: 0.008, life: 120, glow: 20, data: { thickness: 2 } });
            S(e, { x, y, shape: 'ring', size: 30, color: '#ff6600',
                growth: 0, fade: 0.008, life: 120, glow: 18, data: { thickness: 1 } });
        }
    });

    /* ---------- 22. Gravity Well ---------- */
    add({
        name: 'Gravity Well', category: 'Cosmic', colors: ['#220044', '#66ccff'],
        run(e, x, y) {
            for (let i = 0; i < 70; i++) {
                const a = rand(0, TAU), r = rand(60, 160);
                const px = x + Math.cos(a) * r, py = y + Math.sin(a) * r;
                S(e, { x: px, y: py, shape: 'circle', size: rand(1, 2.5),
                    color: pick(['#66ccff','#ffffff','#a0ffff']),
                    life: 90, fade: 0.01, glow: 12, trail: 8,
                    data: { cx: x, cy: y },
                    custom(p) {
                        const dx = p.data.cx - p.x, dy = p.data.cy - p.y;
                        const d = Math.hypot(dx, dy) + 1;
                        p.vx += (dx / d) * 0.5;
                        p.vy += (dy / d) * 0.5;
                        // tangential
                        p.vx += (-dy / d) * 0.3;
                        p.vy += ( dx / d) * 0.3;
                        p.vx *= 0.96; p.vy *= 0.96;
                    } });
            }
        }
    });

    /* ---------- 23. Solar Flare ---------- */
    add({
        name: 'Solar Flare', category: 'Fire', colors: ['#ffea00', '#ff4400'],
        run(e, x, y) {
            S(e, { x, y, shape: 'glow', size: 50, color: '#ffffff', color2: '#ffea00',
                growth: 2, fade: 0.04, life: 40, glow: 40 });
            for (let i = 0; i < 80; i++) {
                const a = rand(0, TAU), sp = rand(2, 12);
                S(e, { x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
                    shape: 'spark', size: rand(1.5, 2.5),
                    color: pick(['#ffea00','#ffaa00','#ff4400','#ffffff']),
                    friction: 0.93, fade: 0.025, life: 55, glow: 18,
                    data: { length: rand(12, 22) } });
            }
        }
    });

    /* ---------- 24. Lunar Eclipse ---------- */
    add({
        name: 'Lunar Eclipse', category: 'Cosmic', colors: ['#c0c0ff', '#220033'],
        run(e, x, y) {
            S(e, { x, y, shape: 'glow', size: 60, color: '#0a0020', color2: '#000',
                growth: 0.3, fade: 0.012, life: 100, blend: 'source-over' });
            S(e, { x, y, shape: 'ring', size: 60, color: '#c0c0ff',
                growth: 0.3, fade: 0.012, life: 100, glow: 30, data: { thickness: 3 } });
            for (let i = 0; i < 40; i++) {
                const a = rand(0, TAU), r = 60 + rand(-4, 4);
                S(e, { x: x + Math.cos(a) * r, y: y + Math.sin(a) * r,
                    vx: Math.cos(a) * rand(0.5, 2), vy: Math.sin(a) * rand(0.5, 2),
                    shape: 'circle', size: rand(1, 2), color: '#c0c0ff',
                    fade: 0.015, life: 80, glow: 14 });
            }
        }
    });

    /* ---------- 25. Spectral Wisp ---------- */
    add({
        name: 'Spectral Wisp', category: 'Shadow', colors: ['#88ffcc', '#00ff99'],
        run(e, x, y) {
            for (let i = 0; i < 20; i++) {
                const a = rand(0, TAU);
                S(e, { x, y, vx: Math.cos(a) * rand(0.5, 2), vy: Math.sin(a) * rand(0.5, 2) - 1,
                    shape: 'glow', size: rand(8, 16),
                    color: '#88ffcc', color2: '#003322',
                    fade: 0.012, life: 100, glow: 22, friction: 0.99,
                    data: { t: rand(0, TAU) },
                    custom(p) { p.data.t += 0.15; p.vx += Math.sin(p.data.t) * 0.15; } });
            }
        }
    });

    /* ---------- 26. Volcanic Erupt ---------- */
    add({
        name: 'Volcanic Erupt', category: 'Fire', colors: ['#ff3300', '#222222'],
        run(e, x, y) {
            // magma chunks
            for (let i = 0; i < 35; i++) {
                const a = rand(-Math.PI * 0.9, -Math.PI * 0.1);
                const sp = rand(6, 14);
                S(e, { x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
                    shape: 'circle', size: rand(3, 7),
                    color: pick(['#ff3300','#ff8800','#ffcc00']),
                    gravity: 0.35, fade: 0.012, life: 90, glow: 18, trail: 3 });
            }
            // smoke
            for (let i = 0; i < 20; i++) {
                S(e, { x: x + rand(-20, 20), y,
                    vx: rand(-0.5, 0.5), vy: rand(-2, -0.6),
                    shape: 'glow', size: rand(10, 20),
                    color: '#444', color2: '#222',
                    fade: 0.012, life: 90, blend: 'source-over' });
            }
        }
    });

    /* ---------- 27. Abyssal Maw ---------- */
    add({
        name: 'Abyssal Maw', category: 'Shadow', colors: ['#001a33', '#00ffcc'],
        run(e, x, y) {
            for (let i = 0; i < 3; i++) {
                S(e, { x, y, shape: 'ring', size: 10 + i * 8,
                    color: '#00ffcc', growth: -0.3, fade: 0.015, life: 80, glow: 22,
                    data: { thickness: 2 } });
            }
            // tendrils
            for (let i = 0; i < 10; i++) {
                const a = (i / 10) * TAU;
                for (let j = 0; j < 10; j++) {
                    const r = j * 5;
                    S(e, { x: x + Math.cos(a + j * 0.2) * r,
                        y: y + Math.sin(a + j * 0.2) * r,
                        shape: 'circle', size: rand(1, 3),
                        color: pick(['#003344','#00ffcc','#0088aa']),
                        fade: 0.02, life: 60, glow: 12 });
                }
            }
        }
    });

    /* ---------- 28. Kinetic Slam ---------- */
    add({
        name: 'Kinetic Slam', category: 'Kinetic', colors: ['#ffaa00', '#ffffff'],
        run(e, x, y) {
            S(e, { x, y, shape: 'ring', size: 8, color: '#ffffff',
                growth: 6, fade: 0.06, life: 20, glow: 30, data: { thickness: 4 } });
            S(e, { x, y, shape: 'glow', size: 80, color: '#ffaa00', color2: '#663300',
                growth: -3, fade: 0.08, life: 18, glow: 30 });
            // dust
            for (let i = 0; i < 40; i++) {
                const a = rand(0, TAU), sp = rand(4, 10);
                S(e, { x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp * 0.3,
                    shape: 'circle', size: rand(2, 5),
                    color: pick(['#aa8855','#eedd99','#776655']),
                    gravity: 0.1, friction: 0.9, fade: 0.02, life: 60,
                    blend: 'source-over' });
            }
        }
    });

    /* ---------- 29. Prism Refract ---------- */
    add({
        name: 'Prism Refract', category: 'Light', colors: ['#ff0066', '#00ffcc'],
        run(e, x, y) {
            const colors = ['#ff0066','#ff8800','#ffee00','#00ff66','#00ccff','#6633ff','#cc00ff'];
            for (let i = 0; i < colors.length; i++) {
                const a = (i / colors.length) * TAU;
                for (let j = 0; j < 8; j++) {
                    S(e, { x, y,
                        vx: Math.cos(a) * (1 + j * 0.6),
                        vy: Math.sin(a) * (1 + j * 0.6),
                        shape: 'circle', size: rand(2, 4),
                        color: colors[i],
                        fade: 0.02, life: 70, glow: 16, trail: 3 });
                }
            }
        }
    });

    /* ---------- 30. Starburst Nova ---------- */
    add({
        name: 'Starburst Nova', category: 'Light', colors: ['#ffffff', '#ffe066'],
        run(e, x, y) {
            const pts = 10;
            for (let i = 0; i < pts; i++) {
                const a = (i / pts) * TAU;
                for (let j = 0; j < 20; j++) {
                    S(e, { x, y, vx: Math.cos(a) * (2 + j * 0.5),
                        vy: Math.sin(a) * (2 + j * 0.5),
                        shape: 'circle', size: rand(1.5, 3),
                        color: j < 8 ? '#ffffff' : '#ffe066',
                        fade: 0.025, life: 50, glow: 18 });
                }
            }
            S(e, { x, y, shape: 'star', size: 20, color: '#ffffff',
                spin: 0.15, growth: 1.5, fade: 0.05, life: 25, glow: 28,
                data: { points: 6, inner: 0.3 } });
        }
    });

    /* ---------- 31. Crimson Vortex ---------- */
    add({
        name: 'Crimson Vortex', category: 'Impact', colors: ['#ff0033', '#550011'],
        run(e, x, y) {
            for (let i = 0; i < 60; i++) {
                const a = rand(0, TAU), r = rand(10, 60);
                S(e, { x: x + Math.cos(a) * r, y: y + Math.sin(a) * r,
                    shape: 'circle', size: rand(2, 4),
                    color: pick(['#ff0033','#990022','#ffffff']),
                    life: 90, fade: 0.012, glow: 16, trail: 6,
                    data: { a, r, cx: x, cy: y },
                    custom(p) {
                        p.data.a += 0.15;
                        p.data.r *= 0.97;
                        p.x = p.data.cx + Math.cos(p.data.a) * p.data.r;
                        p.y = p.data.cy + Math.sin(p.data.a) * p.data.r;
                    } });
            }
        }
    });

    /* ---------- 32. Electric Arc ---------- */
    add({
        name: 'Electric Arc', category: 'Electric', colors: ['#66ffff', '#ffffff'],
        run(e, x, y) {
            for (let i = 0; i < 12; i++) {
                const a = rand(0, TAU), r = rand(30, 110);
                S(e, { x, y, x2: x + Math.cos(a) * r, y2: y + Math.sin(a) * r,
                    shape: 'bolt', color: '#ffffff', size: 1.5, fade: 0.08, life: 16,
                    glow: 24, data: { segments: 10, amp: 10 } });
            }
        }
    });

    /* ---------- 33. Mystic Portal ---------- */
    add({
        name: 'Mystic Portal', category: 'Magic', colors: ['#33ddff', '#cc88ff'],
        run(e, x, y) {
            for (let i = 0; i < 4; i++) {
                S(e, { x, y, shape: 'ring', size: 14 + i * 10,
                    color: i % 2 ? '#33ddff' : '#cc88ff',
                    growth: 0.15, fade: 0.01, life: 110, glow: 20,
                    data: { thickness: 2 } });
            }
            for (let i = 0; i < 40; i++) {
                const a = rand(0, TAU);
                S(e, { x: x + Math.cos(a) * 55, y: y + Math.sin(a) * 55,
                    shape: 'circle', size: rand(1, 2.5),
                    color: pick(['#33ddff','#cc88ff','#ffffff']),
                    life: 100, fade: 0.011, glow: 14,
                    data: { a, r: 55, cx: x, cy: y },
                    custom(p) {
                        p.data.a += 0.05;
                        p.x = p.data.cx + Math.cos(p.data.a) * p.data.r;
                        p.y = p.data.cy + Math.sin(p.data.a) * p.data.r;
                    } });
            }
        }
    });

    /* ---------- 34. Nebula Swirl ---------- */
    add({
        name: 'Nebula Swirl', category: 'Cosmic', colors: ['#ff66cc', '#6633ff'],
        run(e, x, y) {
            for (let i = 0; i < 60; i++) {
                const a = rand(0, TAU), r = rand(0, 60);
                S(e, { x: x + Math.cos(a) * r, y: y + Math.sin(a) * r,
                    shape: 'glow', size: rand(8, 20),
                    color: pick(['#ff66cc','#6633ff','#33ccff','#ffffff']),
                    color2: '#110022',
                    fade: 0.012, life: 90, glow: 14,
                    data: { a, r, cx: x, cy: y },
                    custom(p) {
                        p.data.a += 0.03;
                        p.data.r += 0.4;
                        p.x = p.data.cx + Math.cos(p.data.a) * p.data.r;
                        p.y = p.data.cy + Math.sin(p.data.a) * p.data.r;
                    } });
            }
        }
    });

    /* ---------- 35. Bullet Impact ---------- */
    add({
        name: 'Bullet Impact', category: 'Impact', colors: ['#ffffff', '#ffaa33'],
        run(e, x, y) {
            S(e, { x, y, shape: 'glow', size: 40, color: '#ffffff', color2: '#ffaa33',
                growth: -2, fade: 0.1, life: 12, glow: 30 });
            for (let i = 0; i < 20; i++) {
                const a = rand(0, TAU), sp = rand(4, 12);
                S(e, { x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
                    shape: 'spark', size: rand(1, 2.5), color: '#ffddaa',
                    friction: 0.92, fade: 0.04, life: 25, glow: 12,
                    data: { length: rand(6, 14) } });
            }
            // debris
            for (let i = 0; i < 14; i++) {
                const a = rand(0, TAU), sp = rand(2, 7);
                S(e, { x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
                    shape: 'square', size: rand(2, 4), color: pick(['#666','#888','#aaa']),
                    gravity: 0.3, spin: rand(-0.3, 0.3), fade: 0.02, life: 60,
                    blend: 'source-over' });
            }
        }
    });

    /* ---------- 36. Confetti Cannon ---------- */
    add({
        name: 'Confetti Cannon', category: 'Celebration', colors: ['#ff3366', '#33ccff'],
        run(e, x, y) {
            const colors = ['#ff3366','#33ccff','#ffee33','#33ff99','#cc33ff','#ff9933'];
            for (let i = 0; i < 80; i++) {
                const a = rand(-Math.PI * 0.8, -Math.PI * 0.2);
                const sp = rand(5, 14);
                S(e, { x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
                    shape: 'square', size: rand(4, 8),
                    color: pick(colors),
                    rotation: rand(0, TAU), spin: rand(-0.3, 0.3),
                    gravity: 0.25, fade: 0.008, life: 140, blend: 'source-over' });
            }
        }
    });

    /* ---------- 37. Digital Dissolve ---------- */
    add({
        name: 'Digital Dissolve', category: 'Tech', colors: ['#00ff66', '#003311'],
        run(e, x, y) {
            const chars = '01';
            for (let i = 0; i < 60; i++) {
                S(e, { x: x + rand(-20, 20), y: y + rand(-20, 20),
                    vy: rand(1, 4),
                    shape: 'text', text: pick(chars),
                    color: pick(['#00ff66','#33ff99','#ffffff']),
                    font: 'bold 12px Orbitron',
                    fade: 0.02, life: 60, glow: 10 });
            }
        }
    });

    /* ---------- 38. Ghost Trail ---------- */
    add({
        name: 'Ghost Trail', category: 'Shadow', colors: ['#aaffee', '#ffffff'],
        run(e, x, y) {
            for (let i = 0; i < 25; i++) {
                const a = rand(0, TAU);
                S(e, { x, y, vx: Math.cos(a) * rand(0.5, 2), vy: Math.sin(a) * rand(0.5, 2) - 1.2,
                    shape: 'glow', size: rand(10, 20),
                    color: '#aaffee', color2: '#002a22',
                    fade: 0.015, life: 90, glow: 20, friction: 0.98 });
            }
            S(e, { x, y, shape: 'text', text: '✦', color: '#ffffff',
                font: 'bold 30px Orbitron', fade: 0.03, life: 40, glow: 20 });
        }
    });

    /* ---------- 39. Spirit Bloom ---------- */
    add({
        name: 'Spirit Bloom', category: 'Magic', colors: ['#ff99cc', '#ffffff'],
        run(e, x, y) {
            for (let i = 0; i < 6; i++) {
                const a = (i / 6) * TAU;
                for (let j = 0; j < 10; j++) {
                    const t = j / 10;
                    S(e, { x, y,
                        vx: Math.cos(a) * (1 + t * 5),
                        vy: Math.sin(a) * (1 + t * 5),
                        shape: 'circle', size: rand(2, 4),
                        color: pick(['#ff99cc','#ffffff','#ffccee']),
                        friction: 0.93, fade: 0.015, life: 80, glow: 18, trail: 4 });
                }
            }
        }
    });

    /* ---------- 40. Supernova ---------- */
    add({
        name: 'Supernova', category: 'Cosmic', colors: ['#ffffff', '#ffaa00'],
        run(e, x, y) {
            S(e, { x, y, shape: 'glow', size: 30, color: '#ffffff', color2: '#ffaa00',
                growth: 4, fade: 0.03, life: 50, glow: 50 });
            for (let i = 0; i < 120; i++) {
                const a = rand(0, TAU), sp = rand(3, 16);
                S(e, { x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
                    shape: 'circle', size: rand(1.5, 3),
                    color: pick(['#ffffff','#ffee66','#ffaa00','#ff3333']),
                    friction: 0.97, fade: 0.014, life: 90, glow: 16, trail: 5 });
            }
            S(e, { x, y, shape: 'ring', size: 10, color: '#ffffff',
                growth: 5, fade: 0.03, life: 40, glow: 30, data: { thickness: 3 } });
        }
    });

    /* ---------- 41. Magma Splash ---------- */
    add({
        name: 'Magma Splash', category: 'Fire', colors: ['#ff3300', '#ffcc00'],
        run(e, x, y) {
            for (let i = 0; i < 40; i++) {
                const a = rand(-Math.PI, 0), sp = rand(3, 10);
                S(e, { x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
                    shape: 'circle', size: rand(3, 7),
                    color: pick(['#ff3300','#ff6600','#ffaa00','#ffcc00']),
                    gravity: 0.3, fade: 0.012, life: 90, glow: 18, trail: 3 });
            }
            for (let i = 0; i < 5; i++) {
                S(e, { x, y, shape: 'ring', size: 5 + i * 4,
                    color: '#ff6600', growth: 1, fade: 0.03, life: 30, glow: 16,
                    data: { thickness: 2 } });
            }
        }
    });

    /* ---------- 42. Tesla Coil ---------- */
    add({
        name: 'Tesla Coil', category: 'Electric', colors: ['#66ccff', '#ffffff'],
        run(e, x, y) {
            // repeating arcs
            for (let burst = 0; burst < 4; burst++) {
                setTimeout(() => {
                    for (let i = 0; i < 6; i++) {
                        const a = rand(0, TAU), r = rand(40, 120);
                        S(e, { x, y, x2: x + Math.cos(a) * r, y2: y + Math.sin(a) * r,
                            shape: 'bolt', color: '#ffffff', size: 2, fade: 0.12, life: 10,
                            glow: 24, data: { segments: 9, amp: 14 } });
                    }
                    S(e, { x, y, shape: 'glow', size: 30, color: '#66ccff', color2: '#003366',
                        growth: -1.5, fade: 0.1, life: 14, glow: 24 });
                }, burst * 120);
            }
        }
    });

    /* ---------- 43. Meteor Impact ---------- */
    add({
        name: 'Meteor Impact', category: 'Impact', colors: ['#ff6600', '#663300'],
        run(e, x, y) {
            // meteor trail coming in
            const start = { x: x - 220, y: y - 220 };
            for (let i = 0; i < 20; i++) {
                const t = i / 20;
                S(e, { x: lerp(start.x, x, t), y: lerp(start.y, y, t),
                    shape: 'glow', size: rand(10, 20) * (1 - t * 0.5),
                    color: '#ff6600', color2: '#331100',
                    fade: 0.04, life: 25, glow: 22 });
            }
            // impact
            setTimeout(() => {
                S(e, { x, y, shape: 'glow', size: 100, color: '#ffffff', color2: '#ff3300',
                    growth: -3, fade: 0.06, life: 25, glow: 40 });
                S(e, { x, y, shape: 'ring', size: 10, color: '#ffaa00',
                    growth: 5, fade: 0.04, life: 30, glow: 28, data: { thickness: 4 } });
                for (let i = 0; i < 50; i++) {
                    const a = rand(0, TAU), sp = rand(5, 14);
                    S(e, { x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
                        shape: 'circle', size: rand(2, 5),
                        color: pick(['#ff3300','#ff8800','#996633']),
                        gravity: 0.3, fade: 0.02, life: 70, glow: 14, trail: 3 });
                }
            }, 150);
        }
    });

    /* ---------- 44. Time Ripple ---------- */
    add({
        name: 'Time Ripple', category: 'Time', colors: ['#aaffff', '#3355aa'],
        run(e, x, y) {
            for (let i = 0; i < 6; i++) {
                setTimeout(() => {
                    S(e, { x, y, shape: 'ring', size: 5, color: '#aaffff',
                        growth: 3.5 - i * 0.3, fade: 0.015, life: 80, glow: 18,
                        data: { thickness: 2 } });
                }, i * 80);
            }
            // clock hands
            for (let i = 0; i < 12; i++) {
                const a = (i / 12) * TAU;
                S(e, { x, y, x2: x + Math.cos(a) * 40, y2: y + Math.sin(a) * 40,
                    shape: 'line', color: '#aaffff', size: 1,
                    fade: 0.02, life: 50, glow: 10 });
            }
        }
    });

    /* ---------- 45. Particle Storm ---------- */
    add({
        name: 'Particle Storm', category: 'Energy', colors: ['#ffffff', '#66ccff'],
        run(e, x, y) {
            for (let i = 0; i < 120; i++) {
                const a = rand(0, TAU), sp = rand(1, 8);
                S(e, { x: x + rand(-10, 10), y: y + rand(-10, 10),
                    vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
                    shape: 'circle', size: rand(0.8, 2),
                    color: pick(['#ffffff','#66ccff','#aaddff','#eeeeff']),
                    friction: 0.97, fade: 0.015, life: 80, glow: 10, trail: 4 });
            }
        }
    });

    /* ---------- 46. Ink Splash ---------- */
    add({
        name: 'Ink Splash', category: 'Impact', colors: ['#000000', '#222244'],
        run(e, x, y) {
            for (let i = 0; i < 40; i++) {
                const a = rand(0, TAU), sp = rand(2, 10);
                S(e, { x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
                    shape: 'circle', size: rand(3, 9),
                    color: pick(['#000','#111','#222244']),
                    friction: 0.88, fade: 0.008, life: 140, blend: 'source-over' });
            }
            for (let i = 0; i < 15; i++) {
                const a = rand(0, TAU);
                S(e, { x: x + Math.cos(a) * rand(2, 10),
                    y: y + Math.sin(a) * rand(2, 10),
                    shape: 'circle', size: rand(6, 14), color: '#000',
                    fade: 0.004, life: 220, blend: 'source-over' });
            }
        }
    });

    /* ---------- 47. Glass Break ---------- */
    add({
        name: 'Glass Break', category: 'Ice', colors: ['#cceeff', '#ffffff'],
        run(e, x, y) {
            // cracks
            for (let i = 0; i < 12; i++) {
                const a = (i / 12) * TAU + rand(-0.1, 0.1);
                const r = rand(40, 100);
                S(e, { x, y, x2: x + Math.cos(a) * r, y2: y + Math.sin(a) * r,
                    shape: 'line', color: '#ffffff', size: rand(1, 2),
                    fade: 0.015, life: 70, glow: 14 });
            }
            // shards flying
            for (let i = 0; i < 30; i++) {
                const a = rand(0, TAU), sp = rand(2, 9);
                S(e, { x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
                    shape: 'shard', size: rand(3, 8),
                    color: '#cceeff', rotation: a, spin: rand(-0.2, 0.2),
                    gravity: 0.2, fade: 0.02, life: 70, glow: 14 });
            }
        }
    });

    /* ---------- 48. Firework Burst ---------- */
    add({
        name: 'Firework Burst', category: 'Celebration', colors: ['#ff3366', '#ffee33'],
        run(e, x, y) {
            const hue = randi(0, 360);
            const col = `hsl(${hue}, 100%, 60%)`;
            const col2 = `hsl(${(hue + 60) % 360}, 100%, 70%)`;
            for (let i = 0; i < 80; i++) {
                const a = rand(0, TAU), sp = rand(4, 10);
                S(e, { x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
                    shape: 'circle', size: rand(1.5, 3),
                    color: Math.random() < 0.5 ? col : col2,
                    gravity: 0.1, friction: 0.97, fade: 0.018, life: 80,
                    glow: 14, trail: 5 });
            }
        }
    });

    /* ---------- 49. Black Hole ---------- */
    add({
        name: 'Black Hole', category: 'Cosmic', colors: ['#000000', '#ff6600'],
        run(e, x, y) {
            // accretion disk
            for (let i = 0; i < 60; i++) {
                const a = rand(0, TAU), r = rand(20, 80);
                S(e, { x: x + Math.cos(a) * r, y: y + Math.sin(a) * r,
                    shape: 'circle', size: rand(1.5, 3),
                    color: pick(['#ff6600','#ffaa00','#ffffff']),
                    life: 120, fade: 0.008, glow: 14, trail: 8,
                    data: { a, r, cx: x, cy: y },
                    custom(p) {
                        p.data.a += 0.15;
                        p.data.r *= 0.985;
                        p.x = p.data.cx + Math.cos(p.data.a) * p.data.r;
                        p.y = p.data.cy + Math.sin(p.data.a) * p.data.r;
                    } });
            }
            S(e, { x, y, shape: 'glow', size: 24, color: '#000', color2: '#000',
                growth: 0, fade: 0.005, life: 150, blend: 'source-over' });
            S(e, { x, y, shape: 'ring', size: 22, color: '#ff6600',
                growth: 0, fade: 0.005, life: 150, glow: 30, data: { thickness: 2 } });
        }
    });

    /* ---------- 50. Rainbow Cascade ---------- */
    add({
        name: 'Rainbow Cascade', category: 'Celebration', colors: ['#ff0066', '#00ccff'],
        run(e, x, y) {
            const colors = ['#ff0066','#ff8800','#ffee00','#00ff66','#00ccff','#6633ff','#cc00ff'];
            for (let i = 0; i < 7; i++) {
                setTimeout(() => {
                    S(e, { x, y, shape: 'ring', size: 6 + i * 4, color: colors[i],
                        growth: 2.2, fade: 0.02, life: 60, glow: 24,
                        data: { thickness: 3 } });
                    for (let j = 0; j < 20; j++) {
                        const a = rand(0, TAU), sp = rand(2, 7);
                        S(e, { x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
                            shape: 'circle', size: rand(1.5, 3),
                            color: colors[i], friction: 0.94, fade: 0.025,
                            life: 50, glow: 16, trail: 3 });
                    }
                }, i * 60);
            }
        }
    });

    /* =====================================================
       50 MORE EFFECTS (51–100) — ultra-creative expansion
       ===================================================== */

    /* ---------- 51. Matrix Rain ---------- */
    add({
        name: 'Matrix Rain', category: 'Tech', colors: ['#00ff66', '#003311'],
        run(e, x, y) {
            const glyphs = 'ｱｲｳｴｵｶｷｸｹｺ01ﾘﾛﾌﾊﾋ';
            for (let col = -3; col <= 3; col++) {
                for (let j = 0; j < 14; j++) {
                    S(e, { x: x + col * 14, y: y - j * 14,
                        vy: rand(2, 5),
                        shape: 'text', text: pick(glyphs.split('')),
                        color: j === 0 ? '#ffffff' : '#00ff66',
                        font: 'bold 14px Orbitron',
                        fade: 0.015, life: 80, glow: j === 0 ? 20 : 8,
                        alpha: 1 - j * 0.06 });
                }
            }
        }
    });

    /* ---------- 52. Sakura Storm ---------- */
    add({
        name: 'Sakura Storm', category: 'Nature', colors: ['#ffb7d5', '#ff66aa'],
        run(e, x, y) {
            for (let i = 0; i < 45; i++) {
                const a = rand(0, TAU), sp = rand(1, 5);
                S(e, { x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 1,
                    shape: 'shard', size: rand(4, 9),
                    color: pick(['#ffb7d5','#ffc9e0','#ff66aa','#ffffff']),
                    rotation: rand(0, TAU), spin: rand(-0.2, 0.2),
                    gravity: 0.05, friction: 0.985, fade: 0.012, life: 110, glow: 12,
                    data: { t: rand(0, TAU) },
                    custom(p) { p.data.t += 0.08; p.vx += Math.sin(p.data.t) * 0.1; } });
            }
        }
    });

    /* ---------- 53. Reality Tear ---------- */
    add({
        name: 'Reality Tear', category: 'Void', colors: ['#ff00ff', '#00ffff'],
        run(e, x, y) {
            const ang = rand(0, TAU);
            for (let i = 0; i < 24; i++) {
                const t = (i / 24 - 0.5) * 2;
                const tx = x + Math.cos(ang) * t * 80;
                const ty = y + Math.sin(ang) * t * 80;
                S(e, { x: tx + rand(-3, 3), y: ty + rand(-3, 3),
                    shape: 'line', color: pick(['#ff00ff','#00ffff','#ffffff']),
                    size: rand(1, 2),
                    x2: tx + Math.cos(ang + Math.PI/2) * rand(-14, 14),
                    y2: ty + Math.sin(ang + Math.PI/2) * rand(-14, 14),
                    fade: 0.04, life: 25, glow: 18 });
            }
            for (let i = 0; i < 30; i++) {
                const t = rand(-1, 1);
                S(e, { x: x + Math.cos(ang) * t * 80,
                    y: y + Math.sin(ang) * t * 80,
                    vx: Math.cos(ang + Math.PI/2) * rand(-4, 4),
                    vy: Math.sin(ang + Math.PI/2) * rand(-4, 4),
                    shape: 'circle', size: rand(1.5, 3),
                    color: pick(['#ff00ff','#00ffff']),
                    fade: 0.03, life: 40, glow: 16 });
            }
        }
    });

    /* ---------- 54. Firefly Swarm ---------- */
    add({
        name: 'Firefly Swarm', category: 'Nature', colors: ['#ffee88', '#66ff99'],
        run(e, x, y) {
            for (let i = 0; i < 25; i++) {
                const a = rand(0, TAU), r = rand(10, 40);
                S(e, { x: x + Math.cos(a) * r, y: y + Math.sin(a) * r,
                    shape: 'glow', size: rand(3, 6),
                    color: pick(['#ffee88','#66ff99','#ffffaa']), color2: '#221100',
                    fade: 0.006, life: 160, glow: 18,
                    data: { t: rand(0, TAU), phase: rand(0, TAU) },
                    custom(p) {
                        p.data.t += 0.08;
                        p.vx = Math.cos(p.data.t + p.data.phase) * 1.2;
                        p.vy = Math.sin(p.data.t * 0.7 + p.data.phase) * 1.2;
                        p.alpha = 0.4 + 0.6 * Math.abs(Math.sin(p.data.t * 0.4));
                    } });
            }
        }
    });

    /* ---------- 55. Disco Ball ---------- */
    add({
        name: 'Disco Ball', category: 'Celebration', colors: ['#ff00aa', '#00ffff'],
        run(e, x, y) {
            const hues = 16;
            for (let i = 0; i < hues; i++) {
                const a = (i / hues) * TAU;
                S(e, { x, y, x2: x + Math.cos(a) * 400, y2: y + Math.sin(a) * 400,
                    shape: 'line', color: `hsl(${(i * 360 / hues) | 0}, 100%, 60%)`,
                    size: 2, fade: 0.03, life: 35, glow: 14 });
            }
            for (let i = 0; i < 40; i++) {
                const a = rand(0, TAU), sp = rand(3, 8);
                S(e, { x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
                    shape: 'square', size: rand(3, 5),
                    color: `hsl(${randi(0, 360)}, 100%, 65%)`,
                    rotation: rand(0, TAU), spin: rand(-0.2, 0.2),
                    gravity: 0.1, fade: 0.018, life: 80, glow: 14 });
            }
        }
    });

    /* ---------- 56. Holographic Pulse ---------- */
    add({
        name: 'Holographic Pulse', category: 'Tech', colors: ['#00ffff', '#ff00aa'],
        run(e, x, y) {
            for (let i = 0; i < 20; i++) {
                S(e, { x: x - 80 + i * 8, y, x2: x + 80 - i * 8, y2: y + rand(-1, 1),
                    shape: 'line', color: '#00ffff',
                    size: 1, fade: 0.03, life: 30, glow: 12, alpha: 0.6 });
            }
            for (let i = 0; i < 3; i++) {
                S(e, { x, y, shape: 'ring', size: 10 + i * 20,
                    color: i === 1 ? '#ff00aa' : '#00ffff',
                    growth: 2, fade: 0.02, life: 50, glow: 18,
                    data: { thickness: 2 } });
            }
        }
    });

    /* ---------- 57. Orbital Rings ---------- */
    add({
        name: 'Orbital Rings', category: 'Cosmic', colors: ['#66ccff', '#ffffff'],
        run(e, x, y) {
            for (let i = 0; i < 60; i++) {
                const a = rand(0, TAU), r = rand(40, 60);
                const tilt = rand(0, Math.PI);
                S(e, { x: x + Math.cos(a) * r * Math.cos(tilt),
                    y: y + Math.sin(a) * r * 0.35,
                    shape: 'circle', size: rand(1, 2.5),
                    color: pick(['#66ccff','#ffffff','#aaddff']),
                    life: 120, fade: 0.01, glow: 12,
                    data: { a, r, tilt, cx: x, cy: y },
                    custom(p) {
                        p.data.a += 0.08;
                        p.x = p.data.cx + Math.cos(p.data.a) * p.data.r * Math.cos(p.data.tilt);
                        p.y = p.data.cy + Math.sin(p.data.a) * p.data.r * 0.35;
                    } });
            }
        }
    });

    /* ---------- 58. Plasma Web ---------- */
    add({
        name: 'Plasma Web', category: 'Energy', colors: ['#ff00ff', '#ffffff'],
        run(e, x, y) {
            const nodes = [];
            for (let i = 0; i < 10; i++) {
                const a = rand(0, TAU), r = rand(40, 90);
                nodes.push({ x: x + Math.cos(a) * r, y: y + Math.sin(a) * r });
            }
            for (const n of nodes) {
                S(e, { x: n.x, y: n.y, shape: 'glow', size: rand(6, 10),
                    color: '#ff00ff', color2: '#330033',
                    fade: 0.025, life: 40, glow: 18 });
                S(e, { x, y, x2: n.x, y2: n.y,
                    shape: 'line', color: '#ff66ff', size: 1,
                    fade: 0.035, life: 30, glow: 14 });
            }
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    if (Math.random() < 0.3) {
                        S(e, { x: nodes[i].x, y: nodes[i].y, x2: nodes[j].x, y2: nodes[j].y,
                            shape: 'line', color: '#ffffff', size: 1,
                            fade: 0.05, life: 20, glow: 10, alpha: 0.5 });
                    }
                }
            }
        }
    });

    /* ---------- 59. Laser Grid ---------- */
    add({
        name: 'Laser Grid', category: 'Tech', colors: ['#ff0033', '#ff9999'],
        run(e, x, y) {
            for (let i = -3; i <= 3; i++) {
                S(e, { x: x + i * 18, y: y - 80, x2: x + i * 18, y2: y + 80,
                    shape: 'line', color: '#ff0033', size: 1,
                    fade: 0.04, life: 28, glow: 16 });
                S(e, { x: x - 80, y: y + i * 18, x2: x + 80, y2: y + i * 18,
                    shape: 'line', color: '#ff0033', size: 1,
                    fade: 0.04, life: 28, glow: 16 });
            }
            for (let i = 0; i < 20; i++) {
                S(e, { x: x + rand(-60, 60), y: y + rand(-60, 60),
                    shape: 'circle', size: rand(1.5, 2.5),
                    color: '#ffffff', fade: 0.03, life: 40, glow: 14 });
            }
        }
    });

    /* ---------- 60. Time Warp ---------- */
    add({
        name: 'Time Warp', category: 'Time', colors: ['#99ccff', '#6633cc'],
        run(e, x, y) {
            for (let i = 0; i < 80; i++) {
                const a = rand(0, TAU), r = rand(60, 140);
                S(e, { x: x + Math.cos(a) * r, y: y + Math.sin(a) * r,
                    shape: 'circle', size: rand(1, 2.5),
                    color: pick(['#99ccff','#ffffff','#cc99ff']),
                    life: 100, fade: 0.012, glow: 12,
                    data: { a, r, cx: x, cy: y, spin: rand(-0.25, -0.1) },
                    custom(p) {
                        p.data.a += p.data.spin;
                        p.data.r *= 0.96;
                        p.x = p.data.cx + Math.cos(p.data.a) * p.data.r;
                        p.y = p.data.cy + Math.sin(p.data.a) * p.data.r;
                    } });
            }
        }
    });

    /* ---------- 61. Soul Harvest ---------- */
    add({
        name: 'Soul Harvest', category: 'Shadow', colors: ['#88ffcc', '#006644'],
        run(e, x, y) {
            for (let i = 0; i < 18; i++) {
                S(e, { x: x + rand(-10, 10), y: y + rand(-5, 5),
                    vy: rand(-4, -1.5),
                    shape: 'glow', size: rand(6, 14),
                    color: '#88ffcc', color2: '#003322',
                    friction: 0.99, fade: 0.01, life: 130, glow: 20,
                    data: { t: rand(0, TAU), amp: rand(0.3, 1.2) },
                    custom(p) { p.data.t += 0.12; p.vx = Math.sin(p.data.t) * p.data.amp; } });
            }
            S(e, { x, y, shape: 'ring', size: 10, color: '#88ffcc',
                growth: 1.5, fade: 0.03, life: 40, glow: 18,
                data: { thickness: 2 } });
        }
    });

    /* ---------- 62. Combat Hit ---------- */
    add({
        name: 'Combat Hit', category: 'Impact', colors: ['#ffee00', '#ff3300'],
        run(e, x, y) {
            S(e, { x, y, shape: 'text', text: pick(['HIT!','CRIT!','POW!','BAM!','+999']),
                color: '#ffee00', font: 'bold 28px Orbitron',
                vy: -3, friction: 0.94, fade: 0.03, life: 40, glow: 22,
                rotation: rand(-0.2, 0.2) });
            for (let i = 0; i < 20; i++) {
                const a = rand(0, TAU), sp = rand(4, 10);
                S(e, { x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
                    shape: 'star', size: rand(3, 6), color: '#ffee00',
                    spin: rand(-0.3, 0.3), fade: 0.035, life: 30, glow: 16 });
            }
            S(e, { x, y, shape: 'glow', size: 60, color: '#ffffff', color2: '#ff3300',
                growth: -2, fade: 0.08, life: 16, glow: 30 });
        }
    });

    /* ---------- 63. Chromatic Aberration ---------- */
    add({
        name: 'Chromatic Aberration', category: 'Light', colors: ['#ff0000', '#00ff00'],
        run(e, x, y) {
            for (let i = 0; i < 3; i++) {
                const offset = i * 4;
                const cols = ['#ff0000','#00ff00','#0000ff'];
                S(e, { x: x + offset, y: y + offset, shape: 'ring', size: 10,
                    color: cols[i], growth: 2.5, fade: 0.025, life: 50, glow: 18,
                    data: { thickness: 2 } });
            }
            for (let i = 0; i < 40; i++) {
                const a = rand(0, TAU), sp = rand(2, 7);
                S(e, { x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
                    shape: 'circle', size: rand(1.5, 2.5),
                    color: pick(['#ff0000','#00ff00','#0000ff']),
                    fade: 0.025, life: 45, glow: 14 });
            }
        }
    });

    /* ---------- 64. Dragon Eye ---------- */
    add({
        name: 'Dragon Eye', category: 'Magic', colors: ['#ffaa00', '#ff0000'],
        run(e, x, y) {
            for (let j = -25; j <= 25; j++) {
                const t = j / 25;
                const w = Math.sqrt(1 - t * t) * 40;
                S(e, { x, y: y + j, shape: 'line',
                    x2: x + w, y2: y + j,
                    color: '#ff4400', size: 1.5,
                    fade: 0.025, life: 50, glow: 14 });
                S(e, { x: x - w, y: y + j, shape: 'line',
                    x2: x, y2: y + j,
                    color: '#ff4400', size: 1.5,
                    fade: 0.025, life: 50, glow: 14 });
            }
            S(e, { x, y, shape: 'line', x2: x, y2: y - 40,
                color: '#000', size: 6, fade: 0.01, life: 80, blend: 'source-over' });
            S(e, { x, y, shape: 'line', x2: x, y2: y + 40,
                color: '#000', size: 6, fade: 0.01, life: 80, blend: 'source-over' });
            S(e, { x, y, shape: 'glow', size: 20,
                color: '#ffaa00', color2: '#330000',
                growth: 0.5, fade: 0.02, life: 60, glow: 24 });
        }
    });

    /* ---------- 65. Lotus Bloom ---------- */
    add({
        name: 'Lotus Bloom', category: 'Nature', colors: ['#ff99cc', '#ffffff'],
        run(e, x, y) {
            const petals = 8;
            for (let p = 0; p < petals; p++) {
                const base = (p / petals) * TAU;
                for (let j = 0; j < 12; j++) {
                    const t = j / 12;
                    const r = t * 60;
                    const spread = Math.sin(t * Math.PI) * 0.35;
                    S(e, { x: x + Math.cos(base + rand(-spread, spread)) * r,
                        y: y + Math.sin(base + rand(-spread, spread)) * r,
                        shape: 'circle', size: rand(1.5, 3),
                        color: pick(['#ff99cc','#ffccee','#ffffff']),
                        fade: 0.012, life: 90, glow: 14 });
                }
            }
            S(e, { x, y, shape: 'glow', size: 20, color: '#ffee99', color2: '#ff99cc',
                growth: 0.3, fade: 0.02, life: 60, glow: 18 });
        }
    });

    /* ---------- 66. Acid Rain ---------- */
    add({
        name: 'Acid Rain', category: 'Nature', colors: ['#88ff33', '#336600'],
        run(e, x, y) {
            for (let i = 0; i < 25; i++) {
                S(e, { x: x + rand(-60, 60), y: y - 100,
                    vy: rand(10, 16),
                    shape: 'spark', size: rand(2, 3),
                    color: '#88ff33', fade: 0.02, life: 40, glow: 14,
                    data: { length: 14 } });
            }
            for (let i = 0; i < 20; i++) {
                const a = rand(0, TAU), sp = rand(2, 5);
                S(e, { x: x + rand(-30, 30), y: y + rand(-5, 5),
                    vx: Math.cos(a) * sp * 0.5, vy: -Math.abs(Math.sin(a) * sp) - 1,
                    shape: 'circle', size: rand(2, 4),
                    color: pick(['#88ff33','#aaff66','#336600']),
                    gravity: 0.2, fade: 0.02, life: 60, glow: 12 });
            }
        }
    });

    /* ---------- 67. Gravity Slam ---------- */
    add({
        name: 'Gravity Slam', category: 'Kinetic', colors: ['#ffffff', '#aa88ff'],
        run(e, x, y) {
            for (let i = 0; i < 60; i++) {
                const a = rand(0, TAU), r = rand(60, 160);
                S(e, { x: x + Math.cos(a) * r, y: y + Math.sin(a) * r,
                    vx: (x - (x + Math.cos(a) * r)) * 0.06,
                    vy: (y - (y + Math.sin(a) * r)) * 0.06,
                    shape: 'circle', size: rand(1.5, 3),
                    color: pick(['#ffffff','#aa88ff','#ccccff']),
                    friction: 1, fade: 0.02, life: 40, glow: 14 });
            }
            setTimeout(() => {
                S(e, { x, y, shape: 'ring', size: 5, color: '#ffffff',
                    growth: 9, fade: 0.08, life: 18, glow: 30, data: { thickness: 4 } });
                for (let i = 0; i < 24; i++) {
                    const a = rand(0, TAU), sp = rand(6, 12);
                    S(e, { x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp * 0.3,
                        shape: 'circle', size: rand(2, 4),
                        color: '#aa88ff', fade: 0.03, life: 30, glow: 14 });
                }
            }, 400);
        }
    });

    /* ---------- 68. Spider Web ---------- */
    add({
        name: 'Spider Web', category: 'Nature', colors: ['#ffffff', '#666666'],
        run(e, x, y) {
            const spokes = 8;
            for (let i = 0; i < spokes; i++) {
                const a = (i / spokes) * TAU;
                S(e, { x, y, x2: x + Math.cos(a) * 70, y2: y + Math.sin(a) * 70,
                    shape: 'line', color: '#eeeeee', size: 1.2,
                    fade: 0.006, life: 180, glow: 8 });
            }
            for (let ring = 1; ring <= 5; ring++) {
                const r = ring * 14;
                for (let i = 0; i < spokes; i++) {
                    const a1 = (i / spokes) * TAU, a2 = ((i + 1) / spokes) * TAU;
                    S(e, { x: x + Math.cos(a1) * r, y: y + Math.sin(a1) * r,
                        x2: x + Math.cos(a2) * r, y2: y + Math.sin(a2) * r,
                        shape: 'line', color: '#aaaaaa', size: 1,
                        fade: 0.006, life: 180, glow: 6 });
                }
            }
        }
    });

    /* ---------- 69. DNA Helix ---------- */
    add({
        name: 'DNA Helix', category: 'Tech', colors: ['#00ffaa', '#ff66ff'],
        run(e, x, y) {
            for (let i = 0; i < 30; i++) {
                const t = i / 30 * TAU * 2;
                const yOff = (i - 15) * 6;
                const x1 = x + Math.cos(t) * 20;
                const x2 = x + Math.cos(t + Math.PI) * 20;
                S(e, { x: x1, y: y + yOff, shape: 'glow', size: 4,
                    color: '#00ffaa', color2: '#002211',
                    fade: 0.012, life: 90, glow: 16 });
                S(e, { x: x2, y: y + yOff, shape: 'glow', size: 4,
                    color: '#ff66ff', color2: '#220022',
                    fade: 0.012, life: 90, glow: 16 });
                if (i % 3 === 0) {
                    S(e, { x: x1, y: y + yOff, x2: x2, y2: y + yOff,
                        shape: 'line', color: '#ffffff', size: 0.8,
                        fade: 0.02, life: 60, glow: 8, alpha: 0.6 });
                }
            }
        }
    });

    /* ---------- 70. Atom Orbit ---------- */
    add({
        name: 'Atom Orbit', category: 'Tech', colors: ['#66ffff', '#ffee00'],
        run(e, x, y) {
            for (let axis = 0; axis < 3; axis++) {
                const tilt = (axis / 3) * Math.PI;
                for (let i = 0; i < 20; i++) {
                    S(e, { x, y, shape: 'circle', size: rand(1.5, 2.5),
                        color: pick(['#66ffff','#ffee00','#ffffff']),
                        life: 120, fade: 0.01, glow: 14,
                        data: { a: (i / 20) * TAU, tilt, r: 50, cx: x, cy: y },
                        custom(p) {
                            p.data.a += 0.15;
                            p.x = p.data.cx + Math.cos(p.data.a) * p.data.r * Math.cos(p.data.tilt);
                            p.y = p.data.cy + Math.sin(p.data.a) * p.data.r * 0.5 +
                                  Math.cos(p.data.a) * p.data.r * Math.sin(p.data.tilt) * 0.5;
                        } });
                }
            }
            S(e, { x, y, shape: 'glow', size: 12, color: '#ffee00', color2: '#663300',
                fade: 0.008, life: 120, glow: 20 });
        }
    });

    /* ---------- 71. Kamehameha ---------- */
    add({
        name: 'Kamehameha', category: 'Energy', colors: ['#66ddff', '#ffffff'],
        run(e, x, y) {
            const ang = rand(0, TAU);
            for (let i = 0; i < 50; i++) {
                const t = i / 50;
                S(e, { x: x + Math.cos(ang) * t * 300,
                    y: y + Math.sin(ang) * t * 300,
                    shape: 'glow', size: rand(14, 22) * (1 - t * 0.5),
                    color: t < 0.3 ? '#ffffff' : '#66ddff', color2: '#002244',
                    fade: 0.04, life: 22, glow: 24 });
            }
            for (let i = 0; i < 30; i++) {
                const a = ang + rand(-0.3, 0.3), sp = rand(6, 14);
                S(e, { x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
                    shape: 'circle', size: rand(1.5, 3),
                    color: '#ffffff', friction: 0.96, fade: 0.03, life: 40, glow: 16 });
            }
        }
    });

    /* ---------- 72. Polar Aurora ---------- */
    add({
        name: 'Polar Aurora', category: 'Nature', colors: ['#33ff99', '#6633ff'],
        run(e, x, y) {
            for (let band = 0; band < 3; band++) {
                for (let i = 0; i < 30; i++) {
                    const t = i / 30;
                    const yOff = Math.sin(t * Math.PI * 2 + band) * 30;
                    S(e, { x: x - 120 + t * 240, y: y + yOff + band * 8,
                        shape: 'glow', size: rand(12, 20),
                        color: pick(['#33ff99','#66ffcc','#6633ff']),
                        color2: '#001122',
                        fade: 0.012, life: 80, glow: 20,
                        vy: rand(-0.3, 0.3) });
                }
            }
        }
    });

    /* ---------- 73. Magic Missile ---------- */
    add({
        name: 'Magic Missile', category: 'Magic', colors: ['#ff66cc', '#ffffff'],
        run(e, x, y) {
            for (let i = 0; i < 8; i++) {
                const a = rand(0, TAU), sp = rand(5, 9);
                S(e, { x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
                    shape: 'glow', size: rand(6, 10),
                    color: '#ff66cc', color2: '#330022',
                    fade: 0.02, life: 60, glow: 22,
                    data: { t: rand(0, TAU) },
                    custom(p) {
                        p.data.t += 0.25;
                        p.vx += Math.sin(p.data.t) * 0.6;
                        p.vy += Math.cos(p.data.t) * 0.6;
                        // sparkle trail
                        if (Math.random() < 0.5) {
                            // we add a trail via engine reference is tricky without closure, skip.
                        }
                    } });
            }
        }
    });

    /* ---------- 74. Muzzle Flash ---------- */
    add({
        name: 'Muzzle Flash', category: 'Impact', colors: ['#ffee00', '#ff6600'],
        run(e, x, y) {
            const ang = rand(0, TAU);
            S(e, { x, y, shape: 'glow', size: 40,
                color: '#ffffaa', color2: '#ff6600',
                growth: -3, fade: 0.12, life: 10, glow: 28 });
            for (let i = 0; i < 3; i++) {
                S(e, { x, y, x2: x + Math.cos(ang + rand(-0.2, 0.2)) * rand(50, 90),
                    y2: y + Math.sin(ang + rand(-0.2, 0.2)) * rand(50, 90),
                    shape: 'line', color: '#ffee00', size: rand(2, 4),
                    fade: 0.15, life: 6, glow: 20 });
            }
            for (let i = 0; i < 18; i++) {
                const a = ang + rand(-0.6, 0.6), sp = rand(6, 14);
                S(e, { x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
                    shape: 'spark', size: 2, color: '#ffee00',
                    fade: 0.05, life: 20, glow: 14, data: { length: 18 } });
            }
        }
    });

    /* ---------- 75. Spectrum Wave ---------- */
    add({
        name: 'Spectrum Wave', category: 'Light', colors: ['#ff0066', '#00ffcc'],
        run(e, x, y) {
            for (let i = 0; i < 60; i++) {
                const t = i / 60;
                S(e, { x: x - 120 + t * 240, y: y + Math.sin(t * Math.PI * 4) * 30,
                    shape: 'circle', size: rand(2, 4),
                    color: `hsl(${(t * 360) | 0}, 100%, 60%)`,
                    fade: 0.018, life: 60, glow: 14 });
            }
        }
    });

    /* ---------- 76. Meteor Shower ---------- */
    add({
        name: 'Meteor Shower', category: 'Cosmic', colors: ['#ffaa55', '#ff3300'],
        run(e, x, y) {
            for (let m = 0; m < 5; m++) {
                setTimeout(() => {
                    const sx = x + rand(-120, 120), sy = y - 150;
                    const dx = rand(-0.5, 0.5), dy = 1;
                    for (let i = 0; i < 15; i++) {
                        const t = i / 15;
                        S(e, { x: sx + dx * t * 180, y: sy + dy * t * 180,
                            shape: 'glow', size: rand(5, 10) * (1 - t * 0.4),
                            color: pick(['#ffaa55','#ff3300','#ffffff']),
                            color2: '#220000',
                            fade: 0.05, life: 18, glow: 18 });
                    }
                }, m * 100);
            }
        }
    });

    /* ---------- 77. Kraken Tentacle ---------- */
    add({
        name: 'Kraken Tentacle', category: 'Shadow', colors: ['#1a3366', '#00ffcc'],
        run(e, x, y) {
            for (let arm = 0; arm < 5; arm++) {
                const base = (arm / 5) * TAU;
                for (let j = 0; j < 25; j++) {
                    const t = j / 25;
                    const a = base + Math.sin(t * Math.PI * 2) * 0.6;
                    S(e, { x: x + Math.cos(a) * t * 80,
                        y: y + Math.sin(a) * t * 80,
                        shape: 'glow', size: rand(5, 10) * (1 - t * 0.5),
                        color: pick(['#1a3366','#003366','#00ffcc']),
                        color2: '#000011',
                        fade: 0.012, life: 90, glow: 14 });
                }
            }
        }
    });

    /* ---------- 78. Fractal Bloom ---------- */
    add({
        name: 'Fractal Bloom', category: 'Magic', colors: ['#ff66ff', '#66ffff'],
        run(e, x, y) {
            const recurse = (cx, cy, r, depth, col) => {
                if (depth <= 0 || r < 4) return;
                S(e, { x: cx, y: cy, shape: 'ring', size: r, color: col,
                    growth: 0.3, fade: 0.018, life: 70, glow: 16,
                    data: { thickness: 1.5 } });
                for (let i = 0; i < 5; i++) {
                    const a = (i / 5) * TAU;
                    recurse(cx + Math.cos(a) * r, cy + Math.sin(a) * r, r * 0.4, depth - 1,
                        depth % 2 ? '#66ffff' : '#ff66ff');
                }
            };
            recurse(x, y, 40, 3, '#ff66ff');
        }
    });

    /* ---------- 79. Big Bang ---------- */
    add({
        name: 'Big Bang', category: 'Cosmic', colors: ['#ffffff', '#ff00ff'],
        run(e, x, y) {
            S(e, { x, y, shape: 'glow', size: 10, color: '#ffffff', color2: '#ffffff',
                growth: 8, fade: 0.025, life: 40, glow: 60 });
            for (let i = 0; i < 200; i++) {
                const a = rand(0, TAU), sp = rand(2, 18);
                S(e, { x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
                    shape: 'circle', size: rand(1, 2.5),
                    color: `hsl(${randi(0, 360)}, 100%, 70%)`,
                    friction: 0.99, fade: 0.008, life: 140, glow: 12 });
            }
            for (let i = 0; i < 5; i++) {
                S(e, { x, y, shape: 'ring', size: 5 + i * 5, color: '#ffffff',
                    growth: 4 - i * 0.3, fade: 0.018, life: 70, glow: 24,
                    data: { thickness: 3 } });
            }
        }
    });

    /* ---------- 80. Arcade Pop ---------- */
    add({
        name: 'Arcade Pop', category: 'Celebration', colors: ['#ffee00', '#ff3366'],
        run(e, x, y) {
            S(e, { x, y, shape: 'text', text: '+100',
                color: '#ffee00', font: 'bold 20px Orbitron',
                vy: -4, friction: 0.95, fade: 0.025, life: 50, glow: 18 });
            for (let i = 0; i < 20; i++) {
                const a = rand(0, TAU), sp = rand(3, 7);
                S(e, { x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
                    shape: 'square', size: rand(3, 5),
                    color: pick(['#ffee00','#ff3366','#33ccff','#ffffff']),
                    rotation: rand(0, TAU), spin: rand(-0.3, 0.3),
                    gravity: 0.15, fade: 0.02, life: 60, glow: 12 });
            }
        }
    });

    /* ---------- 81. Ice Spikes ---------- */
    add({
        name: 'Ice Spikes', category: 'Ice', colors: ['#aaeeff', '#ffffff'],
        run(e, x, y) {
            for (let i = 0; i < 10; i++) {
                const a = (i / 10) * TAU + rand(-0.1, 0.1);
                for (let j = 0; j < 12; j++) {
                    const r = j * 5;
                    S(e, { x: x + Math.cos(a) * r,
                        y: y + Math.sin(a) * r,
                        shape: 'shard', size: rand(4, 8) * (1 - j / 20),
                        color: pick(['#aaeeff','#ffffff','#66ccff']),
                        rotation: a + Math.PI / 2,
                        fade: 0.015, life: 80, glow: 14 });
                }
            }
        }
    });

    /* ---------- 82. Pixel Shatter ---------- */
    add({
        name: 'Pixel Shatter', category: 'Tech', colors: ['#00ffff', '#ff00ff'],
        run(e, x, y) {
            for (let i = 0; i < 50; i++) {
                const a = rand(0, TAU), sp = rand(3, 9);
                S(e, { x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
                    shape: 'square', size: rand(2, 5),
                    color: pick(['#00ffff','#ff00ff','#ffff00','#ffffff']),
                    gravity: 0.15, fade: 0.025, life: 50, glow: 12 });
            }
        }
    });

    /* ---------- 83. Sound Pulse ---------- */
    add({
        name: 'Sound Pulse', category: 'Energy', colors: ['#ff3366', '#00ffcc'],
        run(e, x, y) {
            for (let i = 0; i < 16; i++) {
                const a = (i / 16) * TAU;
                const h = rand(10, 60);
                S(e, { x, y,
                    x2: x + Math.cos(a) * h,
                    y2: y + Math.sin(a) * h,
                    shape: 'line', color: `hsl(${(i * 360 / 16) | 0}, 100%, 60%)`,
                    size: 3, fade: 0.025, life: 45, glow: 18 });
            }
            for (let r = 0; r < 3; r++) {
                S(e, { x, y, shape: 'ring', size: 10 + r * 8, color: '#ff3366',
                    growth: 1.8, fade: 0.02, life: 50, glow: 14,
                    data: { thickness: 1.5 } });
            }
        }
    });

    /* ---------- 84. Emerald Rain ---------- */
    add({
        name: 'Emerald Rain', category: 'Magic', colors: ['#33ff99', '#ffffff'],
        run(e, x, y) {
            for (let i = 0; i < 40; i++) {
                S(e, { x: x + rand(-40, 40), y: y + rand(-40, 40),
                    vy: rand(2, 6),
                    shape: 'shard', size: rand(3, 6),
                    color: pick(['#33ff99','#88ffcc','#ffffff']),
                    rotation: Math.PI / 2, spin: 0.05,
                    gravity: 0.1, fade: 0.02, life: 60, glow: 16 });
            }
        }
    });

    /* ---------- 85. Frostbite Crack ---------- */
    add({
        name: 'Frostbite Crack', category: 'Ice', colors: ['#99ddff', '#ffffff'],
        run(e, x, y) {
            const branches = (cx, cy, a, len, depth) => {
                if (depth <= 0 || len < 4) return;
                const ex = cx + Math.cos(a) * len;
                const ey = cy + Math.sin(a) * len;
                S(e, { x: cx, y: cy, x2: ex, y2: ey,
                    shape: 'line', color: '#cceeff', size: Math.max(1, depth),
                    fade: 0.006, life: 180, glow: 10 });
                branches(ex, ey, a + rand(-0.6, 0.6), len * 0.7, depth - 1);
                if (Math.random() < 0.6)
                    branches(ex, ey, a + rand(-1.2, 1.2), len * 0.55, depth - 1);
            };
            for (let i = 0; i < 6; i++) {
                branches(x, y, (i / 6) * TAU, 30, 4);
            }
        }
    });

    /* ---------- 86. Astral Projection ---------- */
    add({
        name: 'Astral Projection', category: 'Shadow', colors: ['#9999ff', '#ffffff'],
        run(e, x, y) {
            for (let ring = 0; ring < 4; ring++) {
                const r = 20 + ring * 10;
                for (let i = 0; i < 12; i++) {
                    const a = (i / 12) * TAU;
                    S(e, { x: x + Math.cos(a) * r, y: y + Math.sin(a) * r * 0.5,
                        shape: 'glow', size: rand(3, 6),
                        color: '#9999ff', color2: '#222244',
                        fade: 0.012, life: 90, glow: 14,
                        data: { a, r, tilt: ring * 0.1, cx: x, cy: y },
                        custom(p) {
                            p.data.a += 0.08;
                            p.x = p.data.cx + Math.cos(p.data.a) * p.data.r;
                            p.y = p.data.cy + Math.sin(p.data.a) * p.data.r * 0.5;
                        } });
                }
            }
        }
    });

    /* ---------- 87. Rune Blast ---------- */
    add({
        name: 'Rune Blast', category: 'Magic', colors: ['#ffcc00', '#ff0000'],
        run(e, x, y) {
            const runes = ['ᚠ','ᚢ','ᚦ','ᚨ','ᚱ','ᚲ','ᚷ','ᚹ','ᚺ','ᚾ'];
            for (let i = 0; i < 12; i++) {
                const a = rand(0, TAU), sp = rand(3, 8);
                S(e, { x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
                    shape: 'text', text: pick(runes),
                    color: pick(['#ffcc00','#ff0000','#ffffff']),
                    font: 'bold 22px Orbitron',
                    rotation: rand(-0.5, 0.5), spin: rand(-0.1, 0.1),
                    friction: 0.95, fade: 0.02, life: 55, glow: 18 });
            }
            S(e, { x, y, shape: 'glow', size: 30, color: '#ffcc00', color2: '#331100',
                growth: -1, fade: 0.04, life: 30, glow: 22 });
        }
    });

    /* ---------- 88. Black Lightning ---------- */
    add({
        name: 'Black Lightning', category: 'Shadow', colors: ['#000000', '#9900ff'],
        run(e, x, y) {
            for (let i = 0; i < 6; i++) {
                const a = rand(0, TAU), r = rand(60, 140);
                S(e, { x, y, x2: x + Math.cos(a) * r, y2: y + Math.sin(a) * r,
                    shape: 'bolt', color: '#9900ff', size: 3,
                    fade: 0.06, life: 18, glow: 18,
                    data: { segments: 10, amp: 18 } });
                S(e, { x, y, x2: x + Math.cos(a) * r, y2: y + Math.sin(a) * r,
                    shape: 'bolt', color: '#000000', size: 5,
                    fade: 0.05, life: 20, blend: 'source-over',
                    data: { segments: 10, amp: 18 } });
            }
        }
    });

    /* ---------- 89. Solar Wind ---------- */
    add({
        name: 'Solar Wind', category: 'Fire', colors: ['#ffaa00', '#ffee00'],
        run(e, x, y) {
            const dir = rand(0, TAU);
            for (let i = 0; i < 60; i++) {
                const sp = rand(4, 10);
                S(e, { x: x + rand(-30, 30), y: y + rand(-30, 30),
                    vx: Math.cos(dir) * sp, vy: Math.sin(dir) * sp,
                    shape: 'spark', size: rand(1.5, 2.5),
                    color: pick(['#ffaa00','#ffee00','#ffffff']),
                    fade: 0.02, life: 50, glow: 14,
                    data: { length: rand(14, 26) } });
            }
        }
    });

    /* ---------- 90. Cyber Wireframe ---------- */
    add({
        name: 'Cyber Wireframe', category: 'Tech', colors: ['#00ff66', '#00ffff'],
        run(e, x, y) {
            // expanding wireframe cube (2D projection)
            const pts = [];
            for (let i = 0; i < 4; i++) {
                const a = (i / 4) * TAU + Math.PI/4;
                pts.push({ x: x + Math.cos(a) * 40, y: y + Math.sin(a) * 40 });
            }
            for (let i = 0; i < 4; i++) {
                const n = (i + 1) % 4;
                S(e, { x: pts[i].x, y: pts[i].y, x2: pts[n].x, y2: pts[n].y,
                    shape: 'line', color: '#00ff66', size: 1.5,
                    fade: 0.015, life: 70, glow: 14 });
            }
            for (let i = 0; i < 4; i++) {
                S(e, { x: x, y: y, x2: pts[i].x, y2: pts[i].y,
                    shape: 'line', color: '#00ffff', size: 1,
                    fade: 0.018, life: 60, glow: 10, alpha: 0.7 });
            }
            for (const p of pts) {
                S(e, { x: p.x, y: p.y, shape: 'glow', size: 5,
                    color: '#ffffff', color2: '#003322',
                    fade: 0.02, life: 60, glow: 16 });
            }
        }
    });

    /* ---------- 91. Demon Summon ---------- */
    add({
        name: 'Demon Summon', category: 'Shadow', colors: ['#ff0000', '#000000'],
        run(e, x, y) {
            // pentagram
            const pts = [];
            for (let i = 0; i < 5; i++) {
                const a = (i / 5) * TAU - Math.PI / 2;
                pts.push({ x: x + Math.cos(a) * 50, y: y + Math.sin(a) * 50 });
            }
            for (let i = 0; i < 5; i++) {
                const j = (i + 2) % 5;
                S(e, { x: pts[i].x, y: pts[i].y, x2: pts[j].x, y2: pts[j].y,
                    shape: 'line', color: '#ff0000', size: 2,
                    fade: 0.01, life: 120, glow: 20 });
            }
            S(e, { x, y, shape: 'ring', size: 55, color: '#ff0000',
                fade: 0.008, life: 150, glow: 20, data: { thickness: 2 } });
            for (let i = 0; i < 30; i++) {
                S(e, { x: x + rand(-40, 40), y: y + rand(-40, 40),
                    vy: rand(-2, -0.5),
                    shape: 'glow', size: rand(4, 8),
                    color: '#660000', color2: '#220000',
                    fade: 0.018, life: 80, glow: 12, blend: 'source-over' });
            }
        }
    });

    /* ---------- 92. Neutron Pulse ---------- */
    add({
        name: 'Neutron Pulse', category: 'Cosmic', colors: ['#00ccff', '#ffffff'],
        run(e, x, y) {
            for (let i = 0; i < 4; i++) {
                setTimeout(() => {
                    S(e, { x, y, shape: 'ring', size: 5, color: '#ffffff',
                        growth: 8, fade: 0.05, life: 30, glow: 30,
                        data: { thickness: 2 } });
                    S(e, { x, y, shape: 'glow', size: 30, color: '#00ccff', color2: '#003366',
                        growth: -2, fade: 0.08, life: 14, glow: 22 });
                }, i * 90);
            }
        }
    });

    /* ---------- 93. Coral Growth ---------- */
    add({
        name: 'Coral Growth', category: 'Nature', colors: ['#ff6699', '#ffcc33'],
        run(e, x, y) {
            const grow = (cx, cy, a, depth) => {
                if (depth <= 0) return;
                const len = rand(10, 20);
                const ex = cx + Math.cos(a) * len;
                const ey = cy + Math.sin(a) * len;
                S(e, { x: cx, y: cy, x2: ex, y2: ey,
                    shape: 'line', color: pick(['#ff6699','#ffcc33','#ff9966']),
                    size: depth, fade: 0.008, life: 150, glow: 10 });
                S(e, { x: ex, y: ey, shape: 'glow', size: rand(3, 5),
                    color: pick(['#ff6699','#ffcc33']), color2: '#220011',
                    fade: 0.012, life: 100, glow: 14 });
                grow(ex, ey, a + rand(-0.7, 0.7), depth - 1);
                if (Math.random() < 0.7) grow(ex, ey, a + rand(-1.1, 1.1), depth - 1);
            };
            for (let i = 0; i < 5; i++) grow(x, y, (i / 5) * TAU, 4);
        }
    });

    /* ---------- 94. Phase Shift ---------- */
    add({
        name: 'Phase Shift', category: 'Tech', colors: ['#ff00aa', '#00ffff'],
        run(e, x, y) {
            for (let i = 0; i < 4; i++) {
                const off = i * 5;
                S(e, { x: x + off, y, shape: 'ring', size: 20,
                    color: i % 2 ? '#ff00aa' : '#00ffff',
                    growth: 1.5, fade: 0.03, life: 40, glow: 18,
                    data: { thickness: 2 } });
            }
            for (let i = 0; i < 30; i++) {
                S(e, { x: x + rand(-40, 40), y: y + rand(-2, 2),
                    vx: rand(-8, 8),
                    shape: 'line', color: pick(['#ff00aa','#00ffff','#ffffff']),
                    size: 1, x2: x + rand(-40, 40), y2: y + rand(-2, 2),
                    fade: 0.06, life: 15, glow: 10,
                    custom(p) { p.x2 = p.x + 20; p.y2 = p.y; } });
            }
        }
    });

    /* ---------- 95. Photon Cascade ---------- */
    add({
        name: 'Photon Cascade', category: 'Light', colors: ['#ffffff', '#00ccff'],
        run(e, x, y) {
            for (let i = 0; i < 100; i++) {
                const a = rand(0, TAU), sp = rand(6, 14);
                S(e, { x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
                    shape: 'spark', size: rand(1, 2),
                    color: pick(['#ffffff','#ccddff','#99ddff']),
                    fade: 0.02, life: 60, glow: 12,
                    data: { length: rand(6, 16) } });
            }
            S(e, { x, y, shape: 'glow', size: 25, color: '#ffffff', color2: '#00ccff',
                growth: 1, fade: 0.06, life: 20, glow: 28 });
        }
    });

    /* ---------- 96. Petal Vortex ---------- */
    add({
        name: 'Petal Vortex', category: 'Nature', colors: ['#ff88aa', '#ffccdd'],
        run(e, x, y) {
            for (let i = 0; i < 60; i++) {
                const a = rand(0, TAU), r = rand(20, 80);
                S(e, { x: x + Math.cos(a) * r, y: y + Math.sin(a) * r,
                    shape: 'shard', size: rand(4, 8),
                    color: pick(['#ff88aa','#ffccdd','#ffffff']),
                    rotation: a, spin: 0.1,
                    life: 120, fade: 0.01, glow: 12,
                    data: { a, r, cx: x, cy: y },
                    custom(p) {
                        p.data.a += 0.1;
                        p.data.r += 0.3;
                        p.x = p.data.cx + Math.cos(p.data.a) * p.data.r;
                        p.y = p.data.cy + Math.sin(p.data.a) * p.data.r;
                        p.rotation += 0.15;
                    } });
            }
        }
    });

    /* ---------- 97. Poison Cloud ---------- */
    add({
        name: 'Poison Cloud', category: 'Nature', colors: ['#99ff33', '#336600'],
        run(e, x, y) {
            for (let i = 0; i < 40; i++) {
                const a = rand(0, TAU);
                S(e, { x: x + Math.cos(a) * rand(0, 20),
                    y: y + Math.sin(a) * rand(0, 20),
                    vx: Math.cos(a) * rand(0.3, 1.5),
                    vy: Math.sin(a) * rand(0.3, 1.5) - 0.5,
                    shape: 'glow', size: rand(10, 20),
                    color: pick(['#99ff33','#66cc22','#336600']),
                    color2: '#113300',
                    fade: 0.01, life: 100, glow: 16 });
            }
        }
    });

    /* ---------- 98. Bladestorm ---------- */
    add({
        name: 'Bladestorm', category: 'Impact', colors: ['#cccccc', '#ffffff'],
        run(e, x, y) {
            for (let i = 0; i < 20; i++) {
                const a = (i / 20) * TAU;
                S(e, { x: x + Math.cos(a) * 60, y: y + Math.sin(a) * 60,
                    x2: x + Math.cos(a) * 100, y2: y + Math.sin(a) * 100,
                    shape: 'line', color: '#ffffff', size: 2,
                    fade: 0.04, life: 30, glow: 18 });
            }
            for (let i = 0; i < 25; i++) {
                const a = rand(0, TAU), r = rand(30, 80);
                S(e, { x: x + Math.cos(a) * r, y: y + Math.sin(a) * r,
                    shape: 'shard', size: rand(6, 12),
                    color: pick(['#cccccc','#ffffff','#aaccee']),
                    rotation: a, spin: 0.3,
                    life: 60, fade: 0.02, glow: 12,
                    data: { a, r, cx: x, cy: y },
                    custom(p) {
                        p.data.a += 0.2;
                        p.x = p.data.cx + Math.cos(p.data.a) * p.data.r;
                        p.y = p.data.cy + Math.sin(p.data.a) * p.data.r;
                    } });
            }
        }
    });

    /* ---------- 99. Light Saber Slash ---------- */
    add({
        name: 'Light Saber Slash', category: 'Light', colors: ['#00ff00', '#ffffff'],
        run(e, x, y) {
            const ang = rand(0, TAU);
            const col = pick(['#00ff00','#ff0000','#00aaff','#aa00ff']);
            for (let i = 0; i < 50; i++) {
                const t = (i / 50 - 0.5) * 2;
                S(e, { x: x + Math.cos(ang) * t * 120,
                    y: y + Math.sin(ang) * t * 120,
                    shape: 'glow', size: rand(8, 14),
                    color: '#ffffff', color2: col,
                    fade: 0.05, life: 18, glow: 22 });
            }
            S(e, { x: x - Math.cos(ang) * 120, y: y - Math.sin(ang) * 120,
                x2: x + Math.cos(ang) * 120, y2: y + Math.sin(ang) * 120,
                shape: 'line', color: '#ffffff', size: 3,
                fade: 0.08, life: 12, glow: 28 });
            S(e, { x: x - Math.cos(ang) * 120, y: y - Math.sin(ang) * 120,
                x2: x + Math.cos(ang) * 120, y2: y + Math.sin(ang) * 120,
                shape: 'line', color: col, size: 6,
                fade: 0.08, life: 12, glow: 26 });
        }
    });

    /* ---------- 100. Genesis ---------- */
    add({
        name: 'Genesis', category: 'Cosmic', colors: ['#ffffff', '#ffcc00'],
        run(e, x, y) {
            // singularity
            S(e, { x, y, shape: 'glow', size: 30, color: '#ffffff', color2: '#ffcc00',
                growth: 3, fade: 0.03, life: 40, glow: 50 });
            // rings
            for (let i = 0; i < 6; i++) {
                setTimeout(() => {
                    S(e, { x, y, shape: 'ring', size: 8 + i * 6,
                        color: `hsl(${(i * 60) % 360}, 100%, 65%)`,
                        growth: 3, fade: 0.018, life: 70, glow: 24,
                        data: { thickness: 3 } });
                }, i * 50);
            }
            // particle constellations
            for (let i = 0; i < 150; i++) {
                const a = rand(0, TAU), sp = rand(2, 14);
                S(e, { x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
                    shape: 'circle', size: rand(1, 2.5),
                    color: `hsl(${randi(0, 360)}, 100%, 65%)`,
                    friction: 0.98, fade: 0.008, life: 140, glow: 14 });
            }
            // orbiting electrons for flair
            for (let i = 0; i < 20; i++) {
                S(e, { x, y, shape: 'star', size: rand(3, 5),
                    color: '#ffee99',
                    life: 120, fade: 0.01, glow: 16,
                    data: { a: (i / 20) * TAU, r: 70, cx: x, cy: y },
                    custom(p) {
                        p.data.a += 0.08;
                        p.x = p.data.cx + Math.cos(p.data.a) * p.data.r;
                        p.y = p.data.cy + Math.sin(p.data.a) * p.data.r;
                        p.rotation += 0.2;
                    } });
            }
        }
    });

    /* ---------- expose ---------- */
    global.FX_EFFECTS = EFFECTS;
})(window);
