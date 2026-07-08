const { app, BrowserWindow, screen, Tray, Menu, nativeImage, globalShortcut } = require('electron');
const path = require('path');

let win;
let tray;

function setupAppBehavior() {
  if (process.platform === 'darwin') {
    app.dock.hide();
  }
  console.log("Running");
  app.setLoginItemSettings({
    openAtLogin: true,
    openAsHidden: true,
  });
}

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  win = new BrowserWindow({
    width,
    height,
    x: 0,
    y: 0,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    movable: false,
    fullscreenable: false,
    skipTaskbar: true,
    hasShadow: false,
    focusable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Float above everything, including other fullscreen apps
  win.setAlwaysOnTop(true, 'screen-saver');
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

  // Click-through: clicks pass to whatever is beneath the overlay
  win.setIgnoreMouseEvents(true, { forward: true });

  win.loadFile('index.html');

  win.on('closed', () => {
    win = null;
  });
}

function createTray() {
  // No icon file needed — just show an emoji in the macOS menu bar
  tray = new Tray(nativeImage.createEmpty());
  tray.setTitle('🐶');
  tray.setToolTip('Dog Overlay (Cmd+Shift+Q to quit)');
  tray.setContextMenu(
    Menu.buildFromTemplate([{ label: 'Quit Dog Overlay', click: () => app.quit() }])
  );
}

app.whenReady().then(() => {
  setupAppBehavior();
  createWindow();
  createTray();
  globalShortcut.register('Command+Shift+Q', () => app.quit());
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  // Keep running even with no windows until Quit is chosen (it's a background overlay)
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
