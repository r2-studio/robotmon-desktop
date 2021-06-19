import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

import { NotFound, ImageExtenstions } from './constVariables';
import { VSCodeUtils } from './vscodeUtils';

export class AssetsProvider implements vscode.TreeDataProvider<vscode.TreeItem> {

  private _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem> = new vscode.EventEmitter<vscode.TreeItem>();
	readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem> = this._onDidChangeTreeData.event;

  private mAssets: Array<vscode.TreeItem> = [];

  constructor() {}

  public getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
    return element;
  }

  public getChildren(element?: vscode.TreeItem): Thenable<vscode.TreeItem[]> {
    if (element === undefined) {
      return this.getAssets();
    }
    return Promise.resolve([]);
  }

  public refresh() {
    // this._onDidChangeTreeData.fire();
  }

  public getAssetsFilenames(extFilters: Array<string> | undefined = undefined): Array<string> {
    const files: Array<string> = [];
    const workPath = VSCodeUtils.getFirstWorkspaceFolder();
    if (workPath === undefined) {
      return files;
    }
    const assetsPath = path.join(workPath, 'assets');
    if (!fs.existsSync(assetsPath)) {
      return files;
    }
    const filenames = fs.readdirSync(assetsPath, {encoding: 'utf8'});
    for (let filename of filenames) {
      if (extFilters !== undefined && extFilters.length > 0) {
        if (extFilters.indexOf(path.extname(filename)) === NotFound) {
          continue;
        }
      }
      const filePath = path.join(assetsPath, filename);
      if (fs.lstatSync(filePath).isFile()) {
        files.push(filePath);
      }
    }
    files.reverse();
    return files;
  }

  private getAssets(): Thenable<vscode.TreeItem[]> {
    this.mAssets = [];
    return new Promise((resolve) => {
      const filenames = this.getAssetsFilenames(ImageExtenstions);
      for (let filename of filenames) {
        const basename = path.basename(filename);
        const item = new vscode.TreeItem(basename, vscode.TreeItemCollapsibleState.None);
        item.id = basename;
        item.tooltip = basename;
        this.mAssets.push(item);
      }
      resolve(this.mAssets);
    });
  }

}