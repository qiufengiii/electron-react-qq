// 引入electron并创建一个Browserwindow
const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron')
const path = require('path')
const url = require('url')

// 保持window对象的全局引用,避免JavaScript对象被垃圾回收时,窗口被自动关闭.
let mainWindow
let tray
function createWindow() {
  //创建浏览器窗口,宽高自定义具体大小你开心就好
  mainWindow = new BrowserWindow({
    width: 436,
    height: 336,
    frame: false,
    transparent: true,
    webPreferences: {
      nodeIntegration: true // 是否集成 Nodejs
    },
    alwaysOnTop: true
  })

  mainWindow.removeMenu()
  mainWindow.loadURL('http://localhost:3000');
  mainWindow.on('closed', function () {
    tray.destroy()
    mainWindow = null
  })
  mainWindow.webContents.openDevTools()

  tray = new Tray(path.resolve(__dirname, 'public/images/QQ.png'))
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '退出', click: _ => {
        mainWindow.destroy()
      }
    }
  ])
  tray.setToolTip('QQ2006')
  tray.setContextMenu(contextMenu)
  tray.on('click', _ => {
    !mainWindow.isVisible() && mainWindow.show()
    !mainWindow.isVisible() && mainWindow.setSkipTaskbar(true)
  })
}

// 当 Electron 完成初始化并准备创建浏览器窗口时调用此方法
app.on('ready', _ => setTimeout(createWindow, 10))

// 所有窗口关闭时退出应用.
app.on('window-all-closed', function () {
  // macOS中除非用户按下 `Cmd + Q` 显式退出,否则应用与菜单栏始终处于活动状态.
  if (process.platform !== 'darwin') {
    app.quit()
  }
  tray.destroy()
})

app.on('activate', function () {
  // macOS中点击Dock图标时没有已打开的其余应用窗口时,则通常在应用中重建一个窗口
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('login', function() {
  mainWindow.loadURL('http://localhost:8080');
})