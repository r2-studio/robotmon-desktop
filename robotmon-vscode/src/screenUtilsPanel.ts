import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

import { Config } from './config';
import { Message } from './constVariables';
import { RemoteDevice } from './remoteDevice';

export class ScreenUtilsPanel {

  static createScreenSyncPanel(device: RemoteDevice): ScreenUtilsPanel {
    const webviewPanel = vscode.window.createWebviewPanel("robotmonScreenUtils", `${device.ip}`, vscode.ViewColumn.Two, {
      enableScripts: true,
    });
    const screenSyncPanel = new ScreenUtilsPanel(device, webviewPanel);
    return screenSyncPanel;
  }

  private mIsSyncing = false;

  constructor(private mDevice: RemoteDevice, private mWebviewPanel: vscode.WebviewPanel) {
    this.initWebviewContent();
    this.mWebviewPanel.onDidDispose(() => {
      this.dispose();
    });
    // console.log(this.mDevice, this.mWebviewPanel);
  }

  public getWebviewPanel(): vscode.WebviewPanel {
    return this.mWebviewPanel;
  }

  private initWebviewContent() {
    // TODO check screen rotation and reset screen size
    const htmlPath = path.join(__filename, '..', '..', 'res', 'html', 'screenUtilsPanel.html');
    this.mWebviewPanel.webview.html = fs.readFileSync(htmlPath).toString();
    this.mWebviewPanel.webview.onDidReceiveMessage(message => {
      switch (message.command) {
      case 'ready':
        this.mWebviewPanel.webview.postMessage({
          command: 'setScreenSize',
          width: this.mDevice.width,
          height: this.mDevice.height,
        });
        break;
      case 'startSyncScreen':
        this.mIsSyncing = true;
        this.syncScreen();
        break;
      case 'stopSyncScreen':
        this.mIsSyncing = false;
        break;
      case 'corpImage':
        const localPath = vscode.workspace.rootPath;
        if (localPath == undefined) {
          return vscode.window.showWarningMessage(Message.notifyOpenFolder);
        }
        const imagePath = path.join(localPath, 'assets');
        if (!fs.existsSync(imagePath)) {
          fs.mkdirSync(imagePath);
        }
        const c = Config.getConfig();
        const name = message.name || Date.now().toString();
        const rw = message.cw * message.resizeRatio;
        const rh = message.ch * message.resizeRatio;
        this.mDevice.getScreenshot(message.cx, message.cy, message.cw, message.ch, rw, rh, c.syncScreenImageQuality, false).then((bs) => {
          const filename = `${name}_${rw}x${rh}_xy${message.cx}x${message.cy}_wh${message.cw}x${message.ch}.jpg`; 
          const fullpath = path.join(imagePath, filename);
          fs.writeFileSync(fullpath, new Buffer(bs as Uint8Array));
          vscode.window.showInformationMessage(Message.screenshotSuccess);
          vscode.commands.executeCommand("assetsView.refresh");
        });
        break;
      case 'tapDown':
        this.mDevice.tapDown(message.x, message.y);
        break;
      case 'moveTo':
        this.mDevice.moveTo(message.x, message.y);
        break;
      case 'tapUp':
        this.mDevice.tapUp(message.x, message.y);
        break;
      case 'printInfo':
        const x = message.x;
        const y = message.y;
        const script = `var _timg_ = getScreenshotModify(${x}, ${y}, ${x+1}, ${y+1}, 1, 1, 100); var _tc_ = getImageColor(_timg_, 0, 0); releaseImage(_timg_); JSON.stringify(_tc_);`;
        this.mDevice.runScript(script).then((msg: string) => {
          const c = JSON.parse(msg);
          this.mDevice.getLogger().debug(`{x: ${x}, y: ${y}, r: ${c.r}, g: ${c.g}, b: ${c.b}}`)
        });
        break;
      }
    }, this);
  }

  private syncScreen() {
    if (!this.mIsSyncing) {
      return;
    }
    const c = Config.getConfig();
    const w = this.mDevice.width;
    const h = this.mDevice.height;
    const rw = Math.floor(this.mDevice.width * c.syncScreenImageSizeRatio);
    const rh = Math.floor(this.mDevice.height * c.syncScreenImageSizeRatio);
    this.mDevice.getScreenshot(0, 0, w, h, rw, rh, c.syncScreenImageQuality, true).then((bs) => {
      if (!this.mIsSyncing) {
        return;
      }
      this.mWebviewPanel.webview.postMessage({command: 'setScreenImage', base64: bs as string});
      this.syncScreen();
    });
  }

  public dispose() {
    this.mIsSyncing = false;
    this.mWebviewPanel.dispose();
  }

}