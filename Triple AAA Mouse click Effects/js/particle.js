/* =========================================================
   Particle Engine — Triple-A FX Forge
   GPU-accelerated via PixiJS (WebGL, batched instanced sprites).
   The public API (FX.Engine, FX.Particle, FX.util, particle options)
   is kept identical to the previous Canvas-2D version so that
   js/effects.js works unchanged.
   ========================================================= */

(function (global) {
    'use strict';

    const TAU = Math.PI * 2;

    /* ---------- utility helpers ---------- */
    const rand  = (a, b) => a + Math.random() * (b - a);
    const randi = (a, b) => Math.floor(rand(a, b + 1));
    const pick  = arr   => arr[Math.floor(Math.random() * arr.length)];
    const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
    const lerp  = (a, b, t) => a + (b - a) * t;

    /* ---------- color helpers ----------
       Pixi needs numeric tints (0xRRGGBB). Effects pass hex strings
       or occasionally hsl() strings (Firework Burst).
    ------------------------------------- */
    function hslToInt(h, s, l) {
        s /= 100; l /= 100;
        const k = n => (n + h / 30) % 12;
        const a = s * Math.min(l, 1 - l);
        const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
        return (Math.round(f(0) * 255) << 16) |
               (Math.round(f(8) * 255) << 8)  |
                Math.round(f(4) * 255);
    }
    // Bounded LRU-ish cache: effects pass randomized hsla strings, so an
    // unbounded map grows forever during long-running sessions.
    const _colorCache = new Map();
    const _COLOR_CACHE_MAX = 512;
    function colorToInt(c) {
        if (typeof c === 'number') return c;
        const cached = _colorCache.get(c);
        if (cached !== undefined) return cached;
        if (_colorCache.size >= _COLOR_CACHE_MAX) {
            _colorCache.delete(_colorCache.keys().next().value);
        }
        let v = 0xffffff;
        if (typeof c === 'string') {
            if (c[0] === '#') {
                const hex = c.slice(1);
                if (hex.length === 3) {
                    v = parseInt(hex[0]+hex[0] + hex[1]+hex[1] + hex[2]+hex[2], 16);
                } else {
                    v = parseInt(hex, 16);
                }
            } else if (c.startsWith('hsl')) {
                const m = c.match(/hsl\(\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)%?,\s*(-?\d+(?:\.\d+)?)%?\s*\)/);
                if (m) v = hslToInt(+m[1], +m[2], +m[3]);
            }
        }
        _colorCache.set(c, v);
        return v;
    }

    /* ---------- Pre-rendered sprite atlas ---------- */
    function buildTextures() {
        const mk = (size, draw) => {
            const c = document.createElement('canvas');
            c.width = c.height = size;
            draw(c.getContext('2d'), size);
            const tex = PIXI.Texture.from(c);
            // make the texture GPU-ready immediately
            return tex;
        };

        return {
            dot: mk(64, (ctx, s) => {
                const g = ctx.createRadialGradient(s/2, s/2, 0, s/2, s/2, s/2);
                g.addColorStop(0.0, 'rgba(255,255,255,1)');
                g.addColorStop(0.4, 'rgba(255,255,255,0.85)');
                g.addColorStop(1.0, 'rgba(255,255,255,0)');
                ctx.fillStyle = g;
                ctx.fillRect(0, 0, s, s);
            }),
            glow: mk(128, (ctx, s) => {
                const g = ctx.createRadialGradient(s/2, s/2, 0, s/2, s/2, s/2);
                g.addColorStop(0.0, 'rgba(255,255,255,1)');
                g.addColorStop(0.25, 'rgba(255,255,255,0.55)');
                g.addColorStop(1.0, 'rgba(255,255,255,0)');
                ctx.fillStyle = g;
                ctx.fillRect(0, 0, s, s);
            }),
            square: mk(16, (ctx, s) => {
                ctx.fillStyle = '#fff';
                ctx.fillRect(0, 0, s, s);
            }),
            ring: mk(128, (ctx, s) => {
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.arc(s/2, s/2, s/2 - 4, 0, TAU);
                ctx.stroke();
            }),
            star: mk(64, (ctx, s) => {
                const cx = s/2, cy = s/2, r1 = s/2 - 2, r2 = r1 * 0.45, pts = 5;
                ctx.fillStyle = '#fff';
                ctx.beginPath();
                for (let i = 0; i < pts * 2; i++) {
                    const r = i % 2 ? r2 : r1;
                    const a = (i / (pts * 2)) * TAU - Math.PI/2;
                    const x = cx + Math.cos(a) * r;
                    const y = cy + Math.sin(a) * r;
                    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.fill();
            }),
            shard: mk(48, (ctx, s) => {
                ctx.fillStyle = '#fff';
                ctx.beginPath();
                ctx.moveTo(s/2, 1);
                ctx.lineTo(s/2 + s*0.18, s/2);
                ctx.lineTo(s/2, s - 1);
                ctx.lineTo(s/2 - s*0.18, s/2);
                ctx.closePath();
                ctx.fill();
            }),
            spark: mk(64, (ctx, s) => {
                const g = ctx.createLinearGradient(0, 0, s, 0);
                g.addColorStop(0.0, 'rgba(255,255,255,0)');
                g.addColorStop(0.5, 'rgba(255,255,255,1)');
                g.addColorStop(1.0, 'rgba(255,255,255,0)');
                ctx.fillStyle = g;
                ctx.fillRect(0, s/2 - 2, s, 4);
            }),
            pixel: mk(4, (ctx, s) => {
                ctx.fillStyle = '#fff';
                ctx.fillRect(0, 0, s, s);
            }),
        };
    }

    /* ---------- Particle (logic only, display handled by engine) ---------- */
    class Particle {
        constructor() { this._disp = null; this._isText = false; this._isGraphics = false; }

        reset(o) {
            this.x  = o.x  ?? 0;
            this.y  = o.y  ?? 0;
            this.vx = o.vx ?? 0;
            this.vy = o.vy ?? 0;
            this.ax = o.ax ?? 0;
            this.ay = o.ay ?? 0;
            this.friction = o.friction ?? 1;
            this.gravity  = o.gravity  ?? 0;

            this.shape   = o.shape   ?? 'circle';
            this.color   = o.color   ?? '#ffffff';
            this.color2  = o.color2  ?? null;
            this.size    = o.size    ?? 3;
            this.growth  = o.growth  ?? 0;
            this.alpha   = o.alpha   ?? 1;
            this.fade    = o.fade    ?? 0.02;
            this.rotation = o.rotation ?? 0;
            this.spin     = o.spin     ?? 0;
            this.blend    = o.blend    ?? 'lighter';
            this.glow     = o.glow     ?? 0;

            this.life    = o.life ?? 60;
            this.maxLife = this.life;

            // `trail` is ignored on the GPU path; the global motion-blur fade
            // produces an equivalent visual at a fraction of the cost.
            this.trail   = o.trail   ?? 0;

            this.text = o.text ?? '';
            this.font = o.font ?? 'bold 16px Orbitron, sans-serif';
            this.x2   = o.x2   ?? this.x;
            this.y2   = o.y2   ?? this.y;

            this.custom = o.custom ?? null;
            this.data   = o.data   ?? {};

            this.dead = false;
            return this;
        }

        update() {
            this.vx += this.ax;
            this.vy += this.ay + this.gravity;
            this.vx *= this.friction;
            this.vy *= this.friction;
            this.x  += this.vx;
            this.y  += this.vy;

            this.rotation += this.spin;
            this.size     += this.growth;
            this.alpha    -= this.fade;
            this.life--;

            if (this.custom) this.custom(this);

            if (this.life <= 0 || this.alpha <= 0 || this.size <= 0) this.dead = true;
        }
    }

    /* ---------- Engine ---------- */
    class FXEngine {
        constructor(canvas) {
            // PixiJS WebGL application
            this._transparent = !!window.__transparent;
            this.app = new PIXI.Application({
                view: canvas,
                width: window.innerWidth,
                height: window.innerHeight,
                backgroundColor: this._transparent ? 0x000000 : 0x05060b,
                backgroundAlpha: this._transparent ? 0 : 1,
                antialias: false,
                powerPreference: 'high-performance',
                resolution: 1,
                autoDensity: false,
                clearBeforeRender: this._transparent ? true : false,
                preserveDrawingBuffer: this._transparent ? false : true
            });
            this.renderer = this.app.renderer;
            this.stage    = this.app.stage;

            // Full-screen fade rect — dims the previous frame each tick to
            // produce the cinematic motion-blur "trail" look for free.
            this.fadeRect = new PIXI.Graphics();
            this.stage.addChild(this.fadeRect);

            // Layers: separate blend modes so Pixi's renderer can batch
            // efficiently (one draw call per (texture, blend) group).
            this.addLayer      = new PIXI.Container();
            this.normLayer     = new PIXI.Container();
            this.graphicsLayer = new PIXI.Container();
            this.addLayer.sortableChildren  = false;
            this.normLayer.sortableChildren = false;
            this.stage.addChild(this.normLayer);
            this.stage.addChild(this.addLayer);
            this.stage.addChild(this.graphicsLayer);

            this.textures = buildTextures();

            this._pool     = [];      // reusable PIXI.Sprite pool
            this.particles = [];
            this.maxParticles = 6000; // GPU happily handles many more than Canvas-2D
            this.fadeTrail    = 0.22;
            this._onFrame     = [];
            this._fps         = 60;
            this._last        = performance.now();

            this._resizeBound = this._resize.bind(this);
            window.addEventListener('resize', this._resizeBound);
            this._resize();

            // Cap ticker to 60fps — otherwise the GPU renders as fast as it
            // can (often 200+ fps), which pegs the card during long sessions.
            this.app.ticker.maxFPS = 60;
            this.app.ticker.add(() => this._tick());
        }

        _resize() {
            const w = window.innerWidth, h = window.innerHeight;
            this.renderer.resize(w, h);
            this.w = w;
            this.h = h;
        }

        /* ---------- sprite pool ---------- */
        _getSprite(texture) {
            let s;
            if (this._pool.length) {
                s = this._pool.pop();
            } else {
                s = new PIXI.Sprite();
                s.anchor.set(0.5);
            }
            s.texture = texture;
            s.visible = true;
            s.alpha   = 1;
            s.rotation = 0;
            return s;
        }
        _releaseSprite(s) {
            if (s.parent) s.parent.removeChild(s);
            s.visible = false;
            if (this._pool.length < 2000) this._pool.push(s);
        }

        /* ---------- spawn / tear down ---------- */
        spawn(opts) {
            if (this.particles.length >= this.maxParticles) {
                // drop the oldest particle to keep the frame budget stable
                const old = this.particles.shift();
                this._teardown(old);
            }
            const p = new Particle();
            p.reset(opts);
            this._setupDisplay(p);
            this.particles.push(p);
            return p;
        }

        _setupDisplay(p) {
            const shape    = p.shape;
            const additive = p.blend === 'lighter';
            const blendMode = additive ? PIXI.BLEND_MODES.ADD : PIXI.BLEND_MODES.NORMAL;

            if (shape === 'text') {
                const fontSizeMatch = p.font && p.font.match(/(\d+(?:\.\d+)?)px/);
                const fontSize = fontSizeMatch ? parseFloat(fontSizeMatch[1]) : 16;
                const t = new PIXI.Text(p.text || '', {
                    fontFamily: 'Orbitron, Rajdhani, sans-serif',
                    fontSize,
                    fontWeight: '700',
                    fill: colorToInt(p.color),
                });
                t.anchor.set(0.5);
                t.blendMode = blendMode;
                this.graphicsLayer.addChild(t);
                p._disp = t;
                p._isText = true;
                return;
            }

            if (shape === 'bolt' || shape === 'line') {
                const g = new PIXI.Graphics();
                g.blendMode = blendMode;
                this.graphicsLayer.addChild(g);
                p._disp = g;
                p._isGraphics = true;
                return;
            }

            let tex;
            switch (shape) {
                case 'glow':   tex = this.textures.glow;   break;
                case 'ring':   tex = this.textures.ring;   break;
                case 'square': tex = this.textures.square; break;
                case 'star':   tex = this.textures.star;   break;
                case 'shard':  tex = this.textures.shard;  break;
                case 'spark':  tex = this.textures.spark;  break;
                default:       tex = this.textures.dot;    break;
            }
            const s = this._getSprite(tex);
            s.blendMode = blendMode;
            s.tint = colorToInt(p.color);
            (additive ? this.addLayer : this.normLayer).addChild(s);
            p._disp = s;
        }

        _updateDisplay(p) {
            const d = p._disp;
            if (!d) return;
            const alpha = clamp(p.alpha, 0, 1);
            d.alpha = alpha;

            if (p._isText) {
                d.x = p.x; d.y = p.y;
                d.rotation = p.rotation;
                return;
            }
            if (p._isGraphics) {
                d.clear();
                const col = colorToInt(p.color);
                const lw  = Math.max(0.5, p.size);
                d.lineStyle({ width: lw, color: col, alpha, cap: 'round', join: 'round' });
                if (p.shape === 'bolt') {
                    const segs = p.data.segments ?? 8;
                    const amp  = p.data.amp ?? 10;
                    d.moveTo(p.x, p.y);
                    for (let i = 1; i < segs; i++) {
                        const t  = i / segs;
                        const mx = lerp(p.x, p.x2, t) + (Math.random() - 0.5) * amp;
                        const my = lerp(p.y, p.y2, t) + (Math.random() - 0.5) * amp;
                        d.lineTo(mx, my);
                    }
                    d.lineTo(p.x2, p.y2);
                } else {
                    d.moveTo(p.x, p.y);
                    d.lineTo(p.x2, p.y2);
                }
                return;
            }

            // sprite shapes
            d.x = p.x;
            d.y = p.y;
            const sz = Math.max(0.01, p.size);

            // update tint if color changed (rare but supported)
            if (d._lastColor !== p.color) {
                d.tint = colorToInt(p.color);
                d._lastColor = p.color;
            }

            switch (p.shape) {
                case 'spark': {
                    const ang = Math.atan2(p.vy, p.vx);
                    const len = p.data.length ?? 12;
                    d.rotation = ang;
                    d.scale.set(len / 64, Math.max(0.05, sz / 2));
                    break;
                }
                case 'ring':
                    d.rotation = p.rotation;
                    d.scale.set((sz * 2) / 128);
                    break;
                case 'glow':
                    d.rotation = p.rotation;
                    // `size` here acts as a radius for the soft bloom
                    d.scale.set((sz * 3) / 128);
                    break;
                case 'square':
                    d.rotation = p.rotation;
                    d.scale.set(sz / 16);
                    break;
                case 'star':
                    d.rotation = p.rotation;
                    d.scale.set((sz * 2) / 64);
                    break;
                case 'shard':
                    d.rotation = p.rotation;
                    d.scale.set((sz * 2) / 48);
                    break;
                default: // 'circle' / dot
                    d.rotation = p.rotation;
                    d.scale.set((sz * 2.4) / 64);
                    break;
            }
        }

        _teardown(p) {
            const d = p._disp;
            if (!d) return;
            if (p._isText || p._isGraphics) {
                if (d.parent) d.parent.removeChild(d);
                d.destroy({ children: true });
            } else {
                this._releaseSprite(d);
            }
            p._disp = null;
        }

        /* ---------- public ---------- */
        clear() {
            for (const p of this.particles) this._teardown(p);
            this.particles.length = 0;
            // Force a clear on the GL buffer so trails disappear immediately.
            if (!this._transparent) this.renderer.background.color = 0x05060b;
            this.renderer.clear();
        }

        addFrameHook(fn) { this._onFrame.push(fn); }

        _tick() {
            const now = performance.now();
            const dt  = now - this._last;
            this._last = now;
            this._fps  = Math.round(1000 / Math.max(1, dt));

            // Fade previous frame (motion-blur / trail). In transparent overlay
            // mode we clear each frame instead so the desktop shows through.
            this.fadeRect.clear();
            if (!this._transparent) {
                this.fadeRect.beginFill(0x05060b, this.fadeTrail);
                this.fadeRect.drawRect(0, 0, this.w, this.h);
                this.fadeRect.endFill();
            }

            for (const fn of this._onFrame) fn(this);

            // update particles (logic) and sync display transforms
            const arr = this.particles;
            for (let i = arr.length - 1; i >= 0; i--) {
                const p = arr[i];
                p.update();
                if (p.dead) {
                    this._teardown(p);
                    arr.splice(i, 1);
                } else {
                    this._updateDisplay(p);
                }
            }
        }

        get fps()   { return this._fps; }
        get count() { return this.particles.length; }
    }

    /* ---------- expose globals (same API as before) ---------- */
    global.FX = {
        Engine: FXEngine,
        Particle,
        util: { rand, randi, pick, clamp, lerp, TAU, colorToInt }
    };
})(window);
