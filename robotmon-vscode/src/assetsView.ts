import * as vscode from 'vscode';

import { AssetsProvider } from './assetsProvider';

export class AssetsView {

  // private mDisposables: Array<vscode.Disposable> = [];
  private mAssetsProvider: AssetsProvider;
  private mAssetsView: vscode.TreeView<vscode.TreeItem>;

  constructor() {
    this.mAssetsProvider = new AssetsProvider();
    this.mAssetsView = vscode.window.createTreeView<vscode.TreeItem>("assetsView", { treeDataProvider: this.mAssetsProvider });
    this.registVSCodeCommand();
  }

  private registVSCodeCommand() {

  }

  public dispose() {
    this.mAssetsView.dispose();
  }


}