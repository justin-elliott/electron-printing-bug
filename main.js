'use strict';

const { app, BrowserWindow } = require('electron');

app.on('ready', () => {
  const win = new BrowserWindow({
    width: 1024,
    height: 768
  });
  win.loadFile('index.html');
});