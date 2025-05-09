const { app, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");
const isDev = process.env.NODE_ENV !== "production";
const fs = require("fs");
const { spawn } = require("child_process");

let mainWindow;
let nextServer;

function createWindow() {
  // 在生产环境启动Next.js服务器
  if (!isDev) {
    const nextDir = path.join(__dirname, ".next");
    if (fs.existsSync(nextDir)) {
      nextServer = spawn("node", ["server.js"], {
        cwd: __dirname,
        stdio: "inherit",
      });
    }
  }

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
    icon: path.join(__dirname, "public/logo-500.png"),
  });

  const startUrl = isDev ? "http://localhost:3000" : "http://localhost:3000";

  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function () {
  if (mainWindow === null) createWindow();
});
