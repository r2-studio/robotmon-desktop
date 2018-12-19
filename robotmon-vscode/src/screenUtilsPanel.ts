import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

import { RemoteDevice } from './remoteDevice';


export class ScreenUtilsPanel {

  static createScreenSyncPanel(device: RemoteDevice): ScreenUtilsPanel {
    const webviewPanel = vscode.window.createWebviewPanel("robotmonScreenUtils", `${device.ip}`, vscode.ViewColumn.Active, {
      enableScripts: true,
    });
    const screenSyncPanel = new ScreenUtilsPanel(device, webviewPanel);
    return screenSyncPanel;
  }

  constructor(private mDevice: RemoteDevice, private mWebviewPanel: vscode.WebviewPanel) {
    this.initWebviewContent();
    console.log(this.mDevice, this.mWebviewPanel);
  }

  public getWebviewPanel(): vscode.WebviewPanel {
    return this.mWebviewPanel;
  }

  private initWebviewContent() {
    const htmlPath = path.join(__filename, '..', '..', 'res', 'screenUtilsPanel.html');
    this.mWebviewPanel.webview.html = fs.readFileSync(htmlPath).toString();
  }

}