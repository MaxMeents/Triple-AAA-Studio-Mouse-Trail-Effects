# Triple-A FX Forge — 50 Cinematic Mouse Click Effects

A slick, game-studio-style canvas playground. Pick one of 50 named click effects from the side panel, then click (or drag) anywhere on the canvas to unleash it.

## Features
- **50 named effects** across 10 categories: Kinetic, Energy, Magic, Fire, Ice, Cosmic, Shadow, Light, Electric, Tech, Time, Impact, Celebration.
- **Custom particle engine** (`js/particle.js`) with shape types: `circle`, `glow`, `square`, `ring`, `line`, `spark`, `star`, `shard`, `bolt`, `text`. Supports trails, gravity, friction, custom per-frame callbacks, and additive blending.
- **Searchable button grid**, live HUD (active effect / particle count / FPS), collapsible panel, clear button.
- **Drag to spray** — hold and drag to continuously emit.
- Zero build step. Pure HTML / CSS / vanilla JS. Google Fonts (Orbitron + Rajdhani) via CDN.

## File Structure
```
index.html           Main page + layout
css/style.css        Sci-fi HUD / panel styling
js/particle.js       Particle + FXEngine classes
js/effects.js        All 50 effects (one object each)
js/main.js           UI wiring, click handling, HUD updates
```

## Run
Open `index.html` directly in a browser, or serve it (e.g. via WAMP). No install.

## Effect List
Shockwave Pulse · Plasma Burst · Arcane Sigil · Dragon's Breath · Frost Nova · Void Rift · Stellar Collapse · Phoenix Flare · Thunder Strike · Shadow Warp · Holy Smite · Nether Bloom · Cyber Glitch · Neon Ripple · Blood Splatter · Crystal Shatter · Quantum Flux · Ember Cascade · Ion Storm · Chrono Freeze · Runic Circle · Gravity Well · Solar Flare · Lunar Eclipse · Spectral Wisp · Volcanic Erupt · Abyssal Maw · Kinetic Slam · Prism Refract · Starburst Nova · Crimson Vortex · Electric Arc · Mystic Portal · Nebula Swirl · Bullet Impact · Confetti Cannon · Digital Dissolve · Ghost Trail · Spirit Bloom · Supernova · Magma Splash · Tesla Coil · Meteor Impact · Time Ripple · Particle Storm · Ink Splash · Glass Break · Firework Burst · Black Hole · Rainbow Cascade

## Extending
Add a new effect by appending to `js/effects.js`:
```js
add({
    name: 'My Effect', category: 'Custom', colors: ['#ff0', '#0ff'],
    run(engine, x, y) {
        engine.spawn({ x, y, shape: 'glow', size: 40, color: '#ff0', fade: 0.05, life: 30 });
    }
});
```
It auto-registers with a new id and appears in the button grid.
