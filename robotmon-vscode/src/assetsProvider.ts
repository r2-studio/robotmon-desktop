import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class AssetsProvider implements vscode.TreeDataProvider<vscode.TreeItem> {

  private _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem> = new vscode.EventEmitter<vscode.TreeItem>();
	readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem> = this._onDidChangeTreeData.event;

  private mAssets: Array<vscode.TreeItem> = [];

  constructor() {}

  public getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
    return element;
  }

  public getChildren(element?: vscode.TreeItem): Thenable<vscode.TreeItem[]> {
    if (element == undefined) {
      return this.getAssets();
    }
    return Promise.resolve([]);
  }

  public refresh() {
    this._onDidChangeTreeData.fire();
  }

  private getAssets(): Thenable<vscode.TreeItem[]> {
    this.mAssets = [];
    if (vscode.workspace.rootPath == undefined) {
      return Promise.resolve([]);
    }
    const assetsPath = path.join(vscode.workspace.rootPath, 'assets');
    if (!fs.existsSync(assetsPath)) {
      return Promise.resolve([]);
    }
    return new Promise((resolve, reject) => {
      const filenames = fs.readdirSync(assetsPath, {encoding: 'utf8'});
      for (let filename of filenames) {
        const filePath = path.join(assetsPath, filename);
        if (fs.lstatSync(filePath).isFile()) {
          const item = new vscode.TreeItem(filename, vscode.TreeItemCollapsibleState.None);
          item.id = filename;
          item.tooltip = filename;
          this.mAssets.push(item);
        }
      }
      resolve(this.mAssets);
    });
  }

}