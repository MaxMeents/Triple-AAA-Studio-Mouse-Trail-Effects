const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('overlayBridge', {
  // overlay renderer
  onState:    (cb) => ipcRenderer.on('overlay:state',    (_e, s) => cb(s)),
  onClickAt:  (cb) => ipcRenderer.on('overlay:click-at', (_e, pt) => cb(pt)),
  onClear:    (cb) => ipcRenderer.on('overlay:clear',    () => cb()),
  reportEffects: (lists) => ipcRenderer.send('overlay:effects-ready', lists),

  // browser renderer
  requestEffects: () => ipcRenderer.send('browser:request-effects'),
  onEffectList:   (cb) => ipcRenderer.on('browser:effect-list', (_e, lists) => cb(lists)),
  selectEffect:   (payload) => ipcRenderer.send('browser:select', payload)
});
