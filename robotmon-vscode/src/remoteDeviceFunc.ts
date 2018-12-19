import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { RemoteDevice } from './remoteDevice';
import { Message } from './constVariables';

export class RemoteDeviceFunc extends vscode.TreeItem {

  private mIsConnecting = false;

  constructor(public readonly label: string, private getDevice: () => RemoteDevice) {
    super(label);
    this.command = {
      title: "",
      command: "remoteDevicesFunc.screenshot",
      arguments: [this],
    };
  }

  public screenshot() {
    if (this.mIsConnecting) {
      vscode.window.showWarningMessage(Message.deviceBusy);
      return;
    }
    const localPath = vscode.workspace.rootPath ;
    if (localPath == undefined) {
      vscode.window.showWarningMessage(Message.notifyOpenFolder);
      return;
    }
    const screenshotPath = path.join(localPath, 'screenshot');
    if (!fs.existsSync(screenshotPath)) {
      fs.mkdirSync(screenshotPath);
    }
    
    const device = this.getDevice();
    this.mIsConnecting = true;
    device.getScreenshot(0, 0, device.width, device.height, device.width, device.height, 100)
    .then((bs) => {
      const filename = Date.now().toString() + '.jpg'; 
      const fullpath = path.join(screenshotPath, filename);
      console.log(fullpath);
      fs.writeFileSync(fullpath, new Buffer(bs));
      
      // const webviewPanel = vscode.window.createWebviewPanel("", filename, vscode.ViewColumn.Active);
      // webviewPanel.webview.html = "Hello";
      vscode.window.showInformationMessage(Message.screenshotSuccess);
      this.mIsConnecting = false;
    })
    .catch(() => {
      this.mIsConnecting = false;
    })
  }

  public dispose() {
    
  }

}