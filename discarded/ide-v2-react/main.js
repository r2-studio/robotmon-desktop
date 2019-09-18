const {
  app, shell, Menu, BrowserWindow,
} = require('electron');

const path = require('path');
const url = require('url');

try {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
  });
} catch (ex) {
  console.log('production');
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
const minWindowWidth = 950;
const minWindowHeight = 600;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: minWindowWidth, height: minWindowHeight });

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(`${__dirname}/app`, 'index.html'),
    protocol: 'file:',
    slashes: true,
  }));

  // Set minimum size of the window
  mainWindow.setMinimumSize(minWindowWidth, minWindowHeight);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// Create default menu.
app.once('ready', () => {
  const template = [
    {
      label: 'Edit',
      submenu: [
        {
          role: 'undo',
        },
        {
          role: 'redo',
        },
        {
          type: 'separator',
        },
        {
          role: 'cut',
        },
        {
          role: 'copy',
        },
        {
          role: 'paste',
        },
        {
          role: 'pasteandmatchstyle',
        },
        {
          role: 'delete',
        },
        {
          role: 'selectall',
        },
      ],
    },
    {
      label: 'View',
      submenu: [
        {
          role: 'reload',
        },
        {
          role: 'forcereload',
        },
        {
          role: 'toggledevtools',
        },
        {
          type: 'separator',
        },
        {
          role: 'resetzoom',
        },
        {
          role: 'zoomin',
        },
        {
          role: 'zoomout',
        },
        {
          type: 'separator',
        },
        {
          role: 'togglefullscreen',
        },
      ],
    },
    {
      role: 'window',
      submenu: [
        {
          role: 'minimize',
        },
        {
          role: 'close',
        },
      ],
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Documentation',
          click() {
            shell.openExternal('https://github.com/r2-studio/robotmon-desktop/blob/master/README.md');
          },
        },
        {
          label: 'Search Issues',
          click() {
            shell.openExternal('https://github.com/r2-studio/robotmon-desktop/issues');
          },
        },
      ],
    },
  ];

  if (process.platform === 'darwin') {
    template.unshift({
      label: 'Robotmon',
      submenu: [
        {
          role: 'about',
        },
        {
          type: 'separator',
        },
        {
          role: 'services',
          submenu: [],
        },
        {
          type: 'separator',
        },
        {
          role: 'hide',
        },
        {
          role: 'hideothers',
        },
        {
          role: 'unhide',
        },
        {
          type: 'separator',
        },
        {
          role: 'quit',
        },
      ],
    });
    template[1].submenu.push(
      {
        type: 'separator',
      },
      {
        label: 'Speech',
        submenu: [
          {
            role: 'startspeaking',
          },
          {
            role: 'stopspeaking',
          },
        ],
      },
    );
    template[3].submenu = [
      {
        role: 'close',
      },
      {
        role: 'minimize',
      },
      {
        role: 'zoom',
      },
      {
        type: 'separator',
      },
      {
        role: 'front',
      },
    ];
  } else {
    template.unshift({
      label: 'File',
      submenu: [
        {
          role: 'quit',
        },
      ],
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
});
