const { app, BrowserWindow } = require('electron')
var jsdom = require('jsdom');
$ = require('jquery')(new jsdom.JSDOM().window);

function createWindow () {
  // Create the browser window.
  let win = new BrowserWindow({ width: 800, height: 600 })

  // and load the index.html of the app.
  win.loadFile('index.html')

}

app.on('ready', createWindow)
