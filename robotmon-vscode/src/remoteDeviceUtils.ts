import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { RemoteDevice } from './remoteDevice';
import { Message } from './constVariables';

export class RemoteDeviceUtils {

  static runScriptFromEditor(device: RemoteDevice, script: string | undefined = undefined) {
    return new Promise<string>((resolve, reject) => {
      if (script == undefined) {
        const editor = vscode.window.activeTextEditor;
        if (editor == undefined) {
          return reject(Message.notifyNoEditor);
        }
        script = editor.document.getText();
        if (script == "" || editor.document.languageId == "Log") {
          return reject(Message.notifyScriptEmpty);
        }
      }
      device.runScriptAsync(script).then(() => {
        return resolve("");
      }, (e: string) => {
        return reject(e);
      });
    });
  }

  static screenshot(device: RemoteDevice): Thenable<string> {
    return new Promise<string>((resolve, reject) => {
      const localPath = vscode.workspace.rootPath;
      if (localPath == undefined) {
        return reject(Message.notifyOpenFolder);
      }
      const screenshotPath = path.join(localPath, 'screenshot');
      if (!fs.existsSync(screenshotPath)) {
        fs.mkdirSync(screenshotPath);
      }
      device.getScreenshot(0, 0, device.width, device.height, device.width, device.height, 100, false)
      .then((bs) => {
        const filename = Date.now().toString() + '.jpg'; 
        const fullpath = path.join(screenshotPath, filename);
        console.log(fullpath);
        fs.writeFileSync(fullpath, new Buffer(bs as Uint8Array));
        // const webviewPanel = vscode.window.createWebviewPanel("", filename, vscode.ViewColumn.Active);
        // webviewPanel.webview.html = "Hello";
        return resolve(Message.screenshotSuccess);
      })
      .catch((e: string) => {
        return reject(e);
      });
    });
  }

  public dispose() {
    
  }

}