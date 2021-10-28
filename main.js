const { app, Menu, BrowserWindow, webContents } = require('electron');
const path = require('path');
require('@electron/remote/main').initialize();

app.name = "KHL parser";



function createWindow() {
   const win = new BrowserWindow({
      width: 1350,
      //height: 1700,
      icon: './img/icon.png',
      resizable: true,
      webPreferences: {
         preload: path.join(__dirname, 'preload.js'),
         devTools: true,
         nodeIntegration: true,
         contextIsolation: false,
      }
   });
   win.loadFile('index.html');
   //win.removeMenu();
   require('@electron/remote/main').enable(win.webContents);
}

app.whenReady().then(() => {
   createWindow();

   app.on('activate', () => { // Для MacOS
      if (BrowserWindow.getAllWindows().length === 0) {
         createWindow();
      }
   });
});

app.on('window-all-closed', () => {
   if (process.platform !== 'darwin') { // Кроме MacOS
      app.quit();
   }
});

// const isMac = process.platform === 'darwin'

// const template = [
//   // { role: 'appMenu' }
//   ...(isMac ? [{
//     label: app.name,
//     submenu: [
//       { role: 'about' },
//       { type: 'separator' },
//       { role: 'services' },
//       { type: 'separator' },
//       { role: 'hide' },
//       { role: 'hideOthers' },
//       { role: 'unhide' },
//       { type: 'separator' },
//       { role: 'quit' }
//     ]
//   }] : []),
//   // { role: 'fileMenu' }
//   {
//     label: 'File',
//     submenu: [
//       isMac ? { role: 'close' } : { role: 'quit' }
//     ]
//   },
//   // { role: 'editMenu' }
//   {
//     label: 'Edit',
//     submenu: [
//       { role: 'undo' },
//       { role: 'redo' },
//       { type: 'separator' },
//       { role: 'cut' },
//       { role: 'copy' },
//       { role: 'paste' },
//       ...(isMac ? [
//         { role: 'pasteAndMatchStyle' },
//         { role: 'delete' },
//         { role: 'selectAll' },
//         { type: 'separator' },
//         {
//           label: 'Speech',
//           submenu: [
//             { role: 'startSpeaking' },
//             { role: 'stopSpeaking' }
//           ]
//         }
//       ] : [
//         { role: 'delete' },
//         { type: 'separator' },
//         { role: 'selectAll' }
//       ])
//     ]
//   },
//   // { role: 'viewMenu' }
//   {
//     label: 'View',
//     submenu: [
//       { role: 'reload' }
//     ]
//   },
//   // { role: 'windowMenu' }
//   {
//     label: 'Window',
//     submenu: [
//       { role: 'minimize' },
//       ...(isMac ? [
//         { type: 'separator' },
//         { role: 'front' },
//         { type: 'separator' },
//         { role: 'window' }
//       ] : [
//         { role: 'close' }
//       ])
//     ]
//   }
// ]

// const menu = Menu.buildFromTemplate(template)
// Menu.setApplicationMenu(menu)
