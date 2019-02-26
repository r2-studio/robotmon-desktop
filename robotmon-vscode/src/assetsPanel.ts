import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

import { OutputLogger } from './logger';
import { Config } from './config';
import { VSCodeUtils } from './vscodeUtils';

class AssetItem {

  public readonly filename: string;
  public readonly filePath: string;
  public readonly fileExt: string;
  public readonly name: string;
  public readonly width: number = 0;
  public readonly height: number = 0;
  public readonly originX: number = 0;
  public readonly originY: number = 0;
  public readonly originW: number = 0;
  public readonly originH: number = 0;
  public base64: string | undefined;

  constructor(fullPath: string) {
    this.filename = path.basename(fullPath);
    this.filePath = fullPath;
    this.fileExt = path.extname(this.filename);
    const tmps = this.filename.split('_');
    this.name = this.filename;
    if (tmps.length === 4) {
      this.name = tmps[0];
      let vs = tmps[1].split('x');
      this.width = parseInt(vs[0]);
      this.height = parseInt(vs[1]);
      vs = tmps[2].substr(2).split('x');
      this.originX = parseInt(vs[0]);
      this.originY = parseInt(vs[1]);
      vs = tmps[3].substr(2).split('x');
      this.originW = parseInt(vs[0]);
      this.originH = parseInt(vs[1]);
    }
  }
  
}

export class AssetsPanel {

  static createAssetsPanel(): AssetsPanel {
    const webviewPanel = vscode.window.createWebviewPanel("robotmonAssets", `Assets`, vscode.ViewColumn.Three, {
      enableScripts: true,
    });
    const screenSyncPanel = new AssetsPanel(webviewPanel);
    return screenSyncPanel;
  }

  public isWebViewClosed: boolean = false;
  private mIsWebVewReady: boolean = false;
  private mAssetItems: Array<AssetItem> = [];

  constructor(private mWebviewPanel: vscode.WebviewPanel) {
    this.initWebviewContent();
    this.mWebviewPanel.onDidDispose(() => {
      this.dispose();
    });
  }

  private initWebviewContent() {
    const htmlPath = path.join(__filename, '..', '..', 'res', 'html', 'assetsPanel.html');
    this.mWebviewPanel.webview.html = fs.readFileSync(htmlPath).toString();
    this.mWebviewPanel.webview.onDidReceiveMessage(message => {
      switch (message.command) {
      case 'ready':
        this.mIsWebVewReady = true;
        this.notifyAssetsChanged();
        break;
      case 'insertCode':
        const editor = VSCodeUtils.findTextEditor();
        if (editor !== undefined) {
          const imageName = message.filename;
          const basename = path.basename(imageName, path.extname(imageName)).split("_")[0];
          const robotmonPath = `getStoragePath()+'/scripts/${Config.getConfig().projectName}/assets/${path.basename(imageName)}'`;
          let snippetString = `var img_${basename} = openImage(${robotmonPath});\n`;
          snippetString += `$0\nreleaseImage(img_${basename});\n`;
          editor.insertSnippet(new vscode.SnippetString(snippetString));
        }
        break;
      }
    }, this);
  }

  public update(filePaths: Array<string>) {
    // TODO more efficency, not clear all
    this.mAssetItems = [];
    for (let filePath of filePaths) {
      this.mAssetItems.push(new AssetItem(filePath));
    }
    if (this.mIsWebVewReady) {
      this.notifyAssetsChanged();
    }
  }

  private notifyAssetsChanged() {
    if (this.mAssetItems.length === 0) {
      return;
    }
    this.mWebviewPanel.webview.postMessage({command: 'clearAssets'});
    for (let assetItem of this.mAssetItems) {
      try {
        assetItem.base64 = fs.readFileSync(assetItem.filePath, {encoding: 'base64'}) as string;
        this.mWebviewPanel.webview.postMessage({command: 'addNewAsset', asset: assetItem});
      } catch(e) {
        OutputLogger.default.error(e.message);
      }
    }
  }

  public dispose() {
    this.isWebViewClosed = true;
    this.mIsWebVewReady = false;
    this.mWebviewPanel.dispose();
  }

}