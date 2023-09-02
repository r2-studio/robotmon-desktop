import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

import { NotFound, ImageExtenstions } from './constVariables';
import { VSCodeUtils } from './vscodeUtils';

export class RunProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem> = new vscode.EventEmitter<vscode.TreeItem>();
  readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem> = this._onDidChangeTreeData.event;

  private mPackageJSONs: Array<vscode.TreeItem> = [];

  constructor() {}

  public getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
    return element;
  }

  public getChildren(element?: vscode.TreeItem): Thenable<vscode.TreeItem[]> {
    if (element === undefined) {
      return this.getAssets();
    }
    if (element.id !== undefined) {
      return this.getPackageScripts(element.id);
    }
    return Promise.resolve([]);
  }

  public refresh() {
    // this._onDidChangeTreeData.fire();
  }

  public getPackageFilenames(): Array<string> {
    const packageJSONs: Array<string> = [];
    const workPath = VSCodeUtils.getFirstWorkspaceFolder();
    if (workPath === undefined) {
      return packageJSONs;
    }
    const rootPackageJSON = path.join(workPath, 'package.json');
    if (fs.existsSync(rootPackageJSON)) {
      packageJSONs.push('package.json');
    }
    const files = fs.readdirSync(workPath);
    for (const file of files) {
      const stat = fs.lstatSync(path.join(workPath, file));
      if (stat.isDirectory()) {
        const packageJSON = path.join(workPath, file, 'package.json');
        if (fs.existsSync(packageJSON)) {
          packageJSONs.push(path.join(file, 'package.json'));
        }
      }
    }
    return packageJSONs;
  }

  public getPackageScripts(packagePath: string): Thenable<vscode.TreeItem[]> {
    return new Promise(resolve => {
      const workPath = VSCodeUtils.getFirstWorkspaceFolder();
      if (workPath === undefined) {
        return resolve([]);
      }
      const packageJSONPath = path.join(workPath, packagePath);
      if (!fs.existsSync(packageJSONPath)) {
        return resolve([]);
      }
      try {
        const packageJSON = JSON.parse(fs.readFileSync(packageJSONPath, 'utf8'));
        const scripts = packageJSON.scripts;
        if (scripts === undefined) {
          return resolve([]);
        }
        const items: vscode.TreeItem[] = [];
        for (const script of Object.keys(scripts)) {
          const id = `${packageJSONPath},${script}`;
          const item = new vscode.TreeItem(id, vscode.TreeItemCollapsibleState.None);
          item.collapsibleState = vscode.TreeItemCollapsibleState.None;
          item.id = id;
          item.label = script;
          item.tooltip = id;
          item.contextValue = 'runViewItemScript';
          items.push(item);
        }
        return resolve(items);
      } catch (e) {}

      return resolve([]);
    });
  }

  private getAssets(): Thenable<vscode.TreeItem[]> {
    this.mPackageJSONs = [];
    return new Promise(resolve => {
      const filenames = this.getPackageFilenames();
      for (let filename of filenames) {
        const item = new vscode.TreeItem(filename, vscode.TreeItemCollapsibleState.None);
        item.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
        item.id = filename;
        item.tooltip = filename;
        this.mPackageJSONs.push(item);
      }
      resolve(this.mPackageJSONs);
    });
  }
}
