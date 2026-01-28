import { app, BrowserWindow } from "electron";
import path from "path";
import registerIPC from "./ipc/registerIPC";

const isDev = process.env.ELECTRON_START_URL !== undefined || !app.isPackaged;

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (isDev) {

    const startUrl = process.env.METRO_ELECTRON_SERVER as string
  
    mainWindow.loadURL(startUrl);
    mainWindow.webContents.openDevTools();

  } else {

    // Production: load built files
    // The dist folder will be in the app's resources
    const distPath = path.join(process.resourcesPath, '.electron', 'build', 'static', 'index.html');
    mainWindow.loadFile(distPath);

  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  registerIPC()
  createWindow()
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
