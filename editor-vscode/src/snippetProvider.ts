import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

export class SnippetProvider implements vscode.TreeDataProvider<vscode.TreeItem> {

  private _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem> = new vscode.EventEmitter<vscode.TreeItem>();
	readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem> = this._onDidChangeTreeData.event;

  private mDisposables: Array<vscode.Disposable> = [];
  
  private mRawApiDoc: any;
  private mRawApiTreeTitle: vscode.TreeItem;
  private mRawApiTreeItems: Array<vscode.TreeItem>;

  constructor() {
    const rawApiPath = path.join(__filename, '..', '..', 'res', 'snippetRawAPI.yml');
    this.mRawApiDoc = yaml.safeLoad(fs.readFileSync(rawApiPath, 'utf8'));

    // prepare tree items
    this.mRawApiTreeTitle = new vscode.TreeItem("RawAPI", vscode.TreeItemCollapsibleState.Expanded);
    this.mRawApiTreeItems = this.getTreeItems(this.mRawApiDoc);
  }

  public getRawApiDoc(): any {
    return this.mRawApiDoc;
  }

  public getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
    return element;
  }

  public getChildren(element?: vscode.TreeItem): Thenable<vscode.TreeItem[]> {
    if (element === undefined) {
      return Promise.resolve([
        this.mRawApiTreeTitle
      ]);
    } else if (element === this.mRawApiTreeTitle) {
      return Promise.resolve(this.mRawApiTreeItems);
    }
    return Promise.resolve([]);
  }

  private getTreeItems(doc: any): Array<vscode.TreeItem> {
    const items: Array<vscode.TreeItem> = [];
    for (const key in doc) {
      let scopes = key.split(':');
      const functionName = scopes[scopes.length - 1] as string;
      const item = new vscode.TreeItem(functionName, vscode.TreeItemCollapsibleState.None);
      item.contextValue = "snippetItem";
      const description = doc[key].description || "";
      item.description = description.substring(description.indexOf("("), description.indexOf(")")+1);
      item.tooltip = description;
      items.push(item);
    }
    return items;
  }

  public searchDocBody(searchFunction: string): string[] {
    for (const key in this.mRawApiDoc) {
      let scopes = key.split(':');
      const functionName = scopes[scopes.length - 1] as string;
      if (functionName === searchFunction) {
        return this.mRawApiDoc[key].body as string[];
      }
    }
    return [];
  }

  public dispose() {
    vscode.Disposable.from(...this.mDisposables).dispose();
  }

}