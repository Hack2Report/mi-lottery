const { app, BrowserWindow, Menu, shell, ipcMain, dialog } = require('electron');
const path = require('path');
const fs   = require('fs');

// ── Security: disable remote module ──────────────────────────────────────────
app.disableHardwareAcceleration = false;

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width:  1100,
    height: 760,
    minWidth:  800,
    minHeight: 600,
    title: 'MI Lottery Analytics',
    backgroundColor: '#0a0e1a',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    // Show window only after content is ready (no white flash)
    show: false,
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.once('ready-to-show', () => mainWindow.show());

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

// ── App menu ──────────────────────────────────────────────────────────────────
function buildMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Export picks as CSV…',
          accelerator: 'CmdOrCtrl+E',
          click: () => mainWindow.webContents.send('menu:export-csv'),
        },
        { type: 'separator' },
        { label: 'Quit', accelerator: 'CmdOrCtrl+Q', role: 'quit' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { label: 'Reload', accelerator: 'CmdOrCtrl+R', role: 'reload' },
        { type: 'separator' },
        { label: 'Actual size',   accelerator: 'CmdOrCtrl+0', role: 'resetZoom'  },
        { label: 'Zoom in',       accelerator: 'CmdOrCtrl+=', role: 'zoomIn'     },
        { label: 'Zoom out',      accelerator: 'CmdOrCtrl+-', role: 'zoomOut'    },
        { type: 'separator' },
        { label: 'Toggle fullscreen', accelerator: 'F11', role: 'togglefullscreen' },
        ...(process.env.NODE_ENV === 'development'
          ? [{ type: 'separator' }, { label: 'DevTools', accelerator: 'F12', role: 'toggleDevTools' }]
          : []),
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About',
          click: () => dialog.showMessageBox(mainWindow, {
            type: 'info',
            title: 'About MI Lottery Analytics',
            message: 'MI Lottery Analytics v1.0.0',
            detail:
              'Analytics dashboard for Michigan Lottery.\n\n' +
              '⚠️  DISCLAIMER: Lottery draws are random.\n' +
              'This app does NOT guarantee winnings.\n' +
              'For entertainment and statistical exploration only.',
            buttons: ['OK'],
          }),
        },
      ],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

// ── IPC: save CSV dialog ──────────────────────────────────────────────────────
ipcMain.handle('save-csv', async (_event, csvContent, defaultName) => {
  const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
    title: 'Save picks as CSV',
    defaultPath: defaultName ?? 'mi-lottery-picks.csv',
    filters: [{ name: 'CSV Files', extensions: ['csv'] }],
  });
  if (canceled || !filePath) return { ok: false };
  try {
    fs.writeFileSync(filePath, csvContent, 'utf-8');
    return { ok: true, filePath };
  } catch (err) {
    return { ok: false, error: err.message };
  }
});

// ── Lifecycle ─────────────────────────────────────────────────────────────────
app.whenReady().then(() => {
  buildMenu();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
