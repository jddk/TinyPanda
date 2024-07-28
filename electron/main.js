const path = require("path");
const { app, Menu, BrowserWindow } = require("electron");
const isDev = process.env.IS_DEV == "true" ? true : false;

let main;
app.whenReady().then(() => {
  createWindow();
  // 去除菜单栏
  Menu.setApplicationMenu(null);
});

function createWindow() {
  main = new BrowserWindow({
    width: 900,
    height: 710,
    webPreferences: {},
  });
  main.loadURL(
    isDev
      ? "http://localhost:3001"
      : `file://${path.join(__dirname, "../dist/index.html")}`
  );
}
