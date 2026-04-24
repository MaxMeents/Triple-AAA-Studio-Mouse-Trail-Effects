const { app, BrowserWindow, Tray, Menu, nativeImage, screen, ipcMain, globalShortcut, shell } = require('electron');
const path = require('path');
const fs   = require('fs');
const { spawn } = require('child_process');

// GPU acceleration flags — help transparent + always-on-top windows on Windows
// actually run on the GPU instead of falling back to CPU compositing.
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('ignore-gpu-blocklist');
app.commandLine.appendSwitch('enable-accelerated-2d-canvas');
app.commandLine.appendSwitch('enable-features', 'CanvasOopRasterization');
app.disableHardwareAcceleration ? null : null; // explicitly leave HW accel ON

let tray = null;
const overlays = [];
let browserWin = null;
let watcher = null;
let watcherRetry = null;

// Effects reported by the overlay renderer.
let trailEffects = []; // [{type:'trail', id, name, category}]
let clickEffects = []; // [{type:'click', id, name, category}]

// Persistent settings (stored under %APPDATA%/<app>/settings.json)
const settings = {
  trailEnabled: true,
  clickEnabled: true,
  trailId:      null,   // selected trail effect id (string)
  clickId:      null,   // selected click effect id (string)
  // Per-effect tuning keyed by "<type>:<id>", e.g. { intensity, size, speed, life, alpha }
  customizations: {}
};

let customizeWin = null;
let customizeTarget = null; // { type, id, name }

function defaultCustom() {
  return { intensity: 1, size: 1, speed: 1, life: 1, alpha: 1 };
}
function customKey(type, id) { return `${type}:${id}`; }
function getCustomization(type, id) {
  const saved = (settings.customizations || {})[customKey(type, id)] || {};
  return Object.assign(defaultCustom(), saved);
}
function isDefaultCustom(c) {
  const d = defaultCustom();
  return Object.keys(d).every(k => Math.abs((c[k] ?? d[k]) - d[k]) < 1e-6);
}

function settingsPath() { return path.join(app.getPath('userData'), 'settings.json'); }

function loadSettings() {
  try {
    const raw = fs.readFileSync(settingsPath(), 'utf8');
    Object.assign(settings, JSON.parse(raw));
  } catch (_) { /* first run */ }
}

function saveSettings() {
  try {
    fs.mkdirSync(path.dirname(settingsPath()), { recursive: true });
    fs.writeFileSync(settingsPath(), JSON.stringify(settings, null, 2), 'utf8');
  } catch (e) { console.error('settings save failed:', e.message); }
}

// ---------------------------------------------------------------- tray icon
function makeTrayIcon() {
  const size = 16;
  const buf = Buffer.alloc(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const onTri = y >= Math.abs(x - (size / 2 - 0.5)) * 2;
      const solid = onTri;
      buf[i]     = solid ? 0xff : 0x00;
      buf[i + 1] = solid ? 0xff : 0x00;
      buf[i + 2] = solid ? 0xff : 0x00;
      buf[i + 3] = solid ? 0xff : 0x00;
    }
  }
  return nativeImage.createFromBitmap(buf, { width: size, height: size });
}

// ---------------------------------------------------------------- overlays
function createOverlayForDisplay(display) {
  const { x, y, width, height } = display.bounds;
  const win = new BrowserWindow({
    x, y, width, height,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    movable: false,
    minimizable: false,
    maximizable: false,
    closable: false,
    focusable: false,
    hasShadow: false,
    show: false,
    roundedCorners: false,
    fullscreenable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      backgroundThrottling: false
    }
  });
  // Attach display bounds so click routing can map screen → client coords.
  win._displayBounds = display.bounds;

  win.setAlwaysOnTop(true, 'screen-saver');
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  win.setIgnoreMouseEvents(true, { forward: true });
  win.setMenuBarVisibility(false);

  win.loadFile(path.join(__dirname, 'overlay.html'));

  win.once('ready-to-show', () => {
    win.showInactive();
    win.webContents.send('overlay:state', currentState());
  });

  win.on('blur', () => {
    if (win.isDestroyed()) return;
    win.setAlwaysOnTop(true, 'screen-saver');
    win.moveTop();
  });

  overlays.push(win);
  return win;
}

function broadcast(channel, payload) {
  for (const w of overlays) {
    if (!w.isDestroyed()) w.webContents.send(channel, payload);
  }
}

// ---------------------------------------------------------------- selection
function findEffect(type, id) {
  const list = (type === 'click') ? clickEffects : trailEffects;
  return list.find(e => String(e.id) === String(id));
}

function currentState() {
  return {
    trailEnabled: !!settings.trailEnabled,
    clickEnabled: !!settings.clickEnabled,
    trailId:      settings.trailId,
    clickId:      settings.clickId,
    trailCustom:  getCustomization('trail', settings.trailId),
    clickCustom:  getCustomization('click', settings.clickId)
  };
}

function applyState() {
  broadcast('overlay:state', currentState());
  rebuildTray();
  saveSettings();
}

function selectEffect(type, id) {
  if (type === 'click') {
    settings.clickId = String(id);
    settings.clickEnabled = true;  // choosing an effect implies "on"
  } else {
    settings.trailId = String(id);
    settings.trailEnabled = true;
  }
  applyState();
}

function setEnabled(type, enabled) {
  if (type === 'click') settings.clickEnabled = !!enabled;
  else                  settings.trailEnabled = !!enabled;
  applyState();
}

// ---------------------------------------------------------------- customize
function customizeWindowPayload() {
  if (!customizeTarget) return null;
  return {
    type:     customizeTarget.type,
    id:       customizeTarget.id,
    name:     customizeTarget.name,
    values:   getCustomization(customizeTarget.type, customizeTarget.id),
    defaults: defaultCustom()
  };
}

function openCustomize(type) {
  const id = type === 'click' ? settings.clickId : settings.trailId;
  if (!id) return;
  const eff = findEffect(type, id);
  customizeTarget = { type, id, name: eff ? eff.name : String(id) };

  if (customizeWin && !customizeWin.isDestroyed()) {
    customizeWin.show(); customizeWin.focus();
    customizeWin.webContents.send('customize:data', customizeWindowPayload());
    return;
  }
  customizeWin = new BrowserWindow({
    width: 440, height: 540,
    title: 'Customize Effect',
    skipTaskbar: true,
    alwaysOnTop: true,
    resizable: false,
    minimizable: false,
    maximizable: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  customizeWin.setMenuBarVisibility(false);
  customizeWin.loadFile(path.join(__dirname, 'customize.html'));
  customizeWin.on('closed', () => { customizeWin = null; customizeTarget = null; });
}

function updateCustomization(type, id, values) {
  const key = customKey(type, id);
  const merged = Object.assign(getCustomization(type, id), values || {});
  if (isDefaultCustom(merged)) delete settings.customizations[key];
  else                         settings.customizations[key] = merged;
  // Live preview: push new state to overlays immediately.
  applyState();
}

function resetCustomization(type, id) {
  delete settings.customizations[customKey(type, id)];
  applyState();
  if (customizeWin && !customizeWin.isDestroyed()) {
    customizeWin.webContents.send('customize:data', customizeWindowPayload());
  }
}

ipcMain.on('customize:request', (evt) => {
  evt.sender.send('customize:data', customizeWindowPayload());
});
ipcMain.on('customize:set', (_e, payload) => {
  if (!payload || !payload.type || payload.id == null) return;
  updateCustomization(payload.type, payload.id, payload.values || {});
});
ipcMain.on('customize:reset', (_e, payload) => {
  if (!payload) return;
  resetCustomization(payload.type, payload.id);
});

// ---------------------------------------------------------------- tray menu
function buildCategorySubmenu(list, type) {
  const groups = {};
  for (const eff of list) {
    const cat = eff.category || 'Uncategorized';
    (groups[cat] ||= []).push(eff);
  }
  const selectedId = type === 'click' ? settings.clickId : settings.trailId;
  return Object.keys(groups).sort().map(cat => ({
    label: cat,
    submenu: groups[cat].map(eff => ({
      label: eff.name,
      type: 'radio',
      checked: String(eff.id) === String(selectedId),
      click: () => selectEffect(type, eff.id)
    }))
  }));
}

function summaryLabel() {
  const t = findEffect('trail', settings.trailId);
  const c = findEffect('click', settings.clickId);
  const ts = `Trail: ${settings.trailEnabled ? (t ? t.name : '—') : 'off'}`;
  const cs = `Click: ${settings.clickEnabled ? (c ? c.name : '—') : 'off'}`;
  return `${ts}   |   ${cs}`;
}

function rebuildTray() {
  if (!tray) return;
  const template = [
    { label: 'Triple-A Mouse FX', enabled: false },
    { type: 'separator' },
    { label: summaryLabel(), enabled: false },
    { type: 'separator' },
    {
      label: 'Enable Trail Effects',
      type: 'checkbox',
      checked: !!settings.trailEnabled,
      click: (mi) => setEnabled('trail', mi.checked)
    },
    {
      label: 'Enable Click Effects',
      type: 'checkbox',
      checked: !!settings.clickEnabled,
      click: (mi) => setEnabled('click', mi.checked)
    },
    { type: 'separator' },
    {
      label: 'Trail Effects',
      submenu: trailEffects.length
        ? buildCategorySubmenu(trailEffects, 'trail')
        : [{ label: '(loading…)', enabled: false }]
    },
    {
      label: 'Click Effects',
      submenu: clickEffects.length
        ? buildCategorySubmenu(clickEffects, 'click')
        : [{ label: '(loading…)', enabled: false }]
    },
    { type: 'separator' },
    {
      label: 'Customize Trail Effect…',
      enabled: !!settings.trailId,
      click: () => openCustomize('trail')
    },
    {
      label: 'Customize Click Effect…',
      enabled: !!settings.clickId,
      click: () => openCustomize('click')
    },
    { type: 'separator' },
    { label: 'Open Effect Browser…', click: openBrowserWindow },
    { label: 'Clear Particles',      click: () => broadcast('overlay:clear') },
    { label: 'Bring to Current Desktop  (Ctrl+Alt+M)', click: bringToCurrentDesktop },
    { label: 'Toggle Overlay Visible', click: () => {
        for (const w of overlays) {
          if (w.isDestroyed()) continue;
          if (w.isVisible()) w.hide(); else w.showInactive();
        }
      }
    },
    { type: 'separator' },
    { label: 'Quit', click: () => quitApp() }
  ];
  tray.setContextMenu(Menu.buildFromTemplate(template));
  tray.setToolTip(summaryLabel());
}

// ---------------------------------------------------------------- effects-ready
ipcMain.on('overlay:effects-ready', (_evt, lists) => {
  if (!lists) return;
  trailEffects = lists.trail || [];
  clickEffects = lists.click || [];

  // Default selections on first run.
  if (!settings.trailId && trailEffects.length) settings.trailId = String(trailEffects[0].id);
  if (!settings.clickId && clickEffects.length) settings.clickId = String(clickEffects[0].id);

  applyState();
  pushEffectListToBrowser();
});

// ---------------------------------------------------------------- desktop-persistence
function reassertAllOnTop() {
  for (const w of overlays) {
    if (w.isDestroyed()) continue;
    if (!w.isVisible()) w.showInactive();
    w.setAlwaysOnTop(true, 'screen-saver');
    w.moveTop();
  }
}

function bringToCurrentDesktop() {
  for (const w of overlays) {
    if (w.isDestroyed()) continue;
    w.hide();
    w.showInactive();
    w.setAlwaysOnTop(true, 'screen-saver');
    w.moveTop();
  }
}

// ---------------------------------------------------------------- click routing
function routeScreenClick(screenX, screenY) {
  if (!settings.clickEnabled) return;
  for (const w of overlays) {
    if (w.isDestroyed()) continue;
    const b = w._displayBounds;
    if (!b) continue;
    if (screenX >= b.x && screenX < b.x + b.width &&
        screenY >= b.y && screenY < b.y + b.height) {
      w.webContents.send('overlay:click-at', { x: screenX - b.x, y: screenY - b.y });
      return;
    }
  }
}

// ---------------------------------------------------------------- watcher
function startWatcher() {
  if (process.platform !== 'win32') return;
  if (!overlays.length || overlays[0].isDestroyed()) return;

  const hwndBuf = overlays[0].getNativeWindowHandle();
  const hwnd = hwndBuf.length === 8
    ? hwndBuf.readBigInt64LE(0).toString()
    : hwndBuf.readInt32LE(0).toString();

  const scriptPath = path
    .join(__dirname, 'watcher.ps1')
    .replace(`${path.sep}app.asar${path.sep}`, `${path.sep}app.asar.unpacked${path.sep}`);

  watcher = spawn(
    'powershell.exe',
    ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', scriptPath, '-Hwnd', hwnd],
    { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] }
  );

  let buf = '';
  watcher.stdout.on('data', chunk => {
    buf += chunk.toString('ascii');
    let idx;
    while ((idx = buf.indexOf('\n')) !== -1) {
      const line = buf.slice(0, idx).trim();
      buf = buf.slice(idx + 1);
      if (line === 'OFF') { bringToCurrentDesktop(); continue; }
      if (line === 'ON')  { continue; }
      if (line.startsWith('CLICK ')) {
        const parts = line.split(' ');
        const x = parseInt(parts[1], 10);
        const y = parseInt(parts[2], 10);
        if (!Number.isNaN(x) && !Number.isNaN(y)) routeScreenClick(x, y);
      }
    }
  });

  watcher.on('exit', () => {
    watcher = null;
    if (!app.isQuitting) {
      clearTimeout(watcherRetry);
      watcherRetry = setTimeout(startWatcher, 2000);
    }
  });
}

// ---------------------------------------------------------------- effect browser
function openBrowserWindow() {
  if (browserWin && !browserWin.isDestroyed()) {
    browserWin.show(); browserWin.focus(); return;
  }
  browserWin = new BrowserWindow({
    width: 1100,
    height: 760,
    title: 'Triple-A Effect Browser',
    skipTaskbar: true,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  browserWin.setMenuBarVisibility(false);
  browserWin.loadFile(path.join(__dirname, 'browser.html'));
  browserWin.on('closed', () => { browserWin = null; });
}

ipcMain.on('browser:select', (_e, payload) => {
  if (!payload || !payload.type || payload.id == null) return;
  selectEffect(payload.type, payload.id);
});

ipcMain.on('browser:request-effects', (evt) => {
  evt.sender.send('browser:effect-list', { trail: trailEffects, click: clickEffects });
});

function pushEffectListToBrowser() {
  if (browserWin && !browserWin.isDestroyed()) {
    browserWin.webContents.send('browser:effect-list', { trail: trailEffects, click: clickEffects });
  }
}

// ---------------------------------------------------------------- app
app.whenReady().then(() => {
  loadSettings();

  for (const d of screen.getAllDisplays()) createOverlayForDisplay(d);

  tray = new Tray(makeTrayIcon());
  tray.setToolTip('Mouse Trail Lab');
  rebuildTray();
  tray.on('click', () => tray.popUpContextMenu());

  screen.on('display-added',  (_e, d) => createOverlayForDisplay(d));
  screen.on('display-removed', () => {
    for (let i = overlays.length - 1; i >= 0; i--) {
      if (overlays[i].isDestroyed()) overlays.splice(i, 1);
    }
  });

  setInterval(reassertAllOnTop, 1500);
  globalShortcut.register('Control+Alt+M', bringToCurrentDesktop);

  setTimeout(startWatcher, 800);
});

function quitApp() {
  app.isQuitting = true;
  // Kill watcher subprocess first (else PS may delay shutdown).
  if (watcher) { try { watcher.kill(); } catch (_) {} watcher = null; }
  clearTimeout(watcherRetry);
  globalShortcut.unregisterAll();
  // Overlay windows are created with closable:false and focusable:false,
  // so a normal close() is refused. Destroy them directly.
  for (const w of overlays) {
    if (!w.isDestroyed()) { try { w.destroy(); } catch (_) {} }
  }
  if (browserWin && !browserWin.isDestroyed()) { try { browserWin.destroy(); } catch (_) {} }
  if (customizeWin && !customizeWin.isDestroyed()) { try { customizeWin.destroy(); } catch (_) {} }
  if (tray && !tray.isDestroyed()) { try { tray.destroy(); } catch (_) {} }
  // Force-exit in case something still holds the loop open.
  setTimeout(() => app.exit(0), 150);
}

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
  if (watcher) { try { watcher.kill(); } catch (_) {} watcher = null; }
  clearTimeout(watcherRetry);
});

app.on('window-all-closed', (e) => { if (!app.isQuitting) e.preventDefault?.(); });
