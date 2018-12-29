import * as vscode from 'vscode';
import * as path from 'path';

import { Config } from './config';
import { AssetsProvider } from './assetsProvider';
import { OutputLogger } from './logger';

export class AssetsView {

  private mDisposables: Array<vscode.Disposable> = [];
  private mAssetsProvider: AssetsProvider;
  private mAssetsView: vscode.TreeView<vscode.TreeItem>;
  private mSelected: vscode.TreeItem | undefined;

  constructor() {
    this.mAssetsProvider = new AssetsProvider();
    this.mAssetsView = vscode.window.createTreeView<vscode.TreeItem>("assetsView", { treeDataProvider: this.mAssetsProvider });
    this.mAssetsView.onDidChangeSelection(selected => this.onDidChangeSelection(selected));

    this.registVSCodeCommand();
  }

  private registVSCodeCommand() {
    let disposable = vscode.commands.registerCommand('assetsView.refresh', () => {
      this.mAssetsProvider.refresh();
    });
    this.mDisposables.push(disposable);

    disposable = vscode.commands.registerCommand('assetsViewItem.insert', (element: vscode.TreeItem) => {
      this.insertOpenImageCode(element.id as string);
    });
    this.mDisposables.push(disposable);
  }

  public onDidChangeSelection(selected: vscode.TreeViewSelectionChangeEvent<vscode.TreeItem> | null) {
    if (selected == null) {
      return;
    }
    if (selected.selection.length > 0 && this.mSelected == selected.selection[0]) {
    }
    this.mSelected = selected.selection[0];
  }

  public dispose() {
    vscode.Disposable.from(...this.mDisposables).dispose();
    this.mAssetsView.dispose();
  }

  public insertOpenImageCode(imageName: string) {
    if (vscode.window.activeTextEditor != undefined) {
      const basename = path.basename(imageName, path.extname(imageName)).split("_")[0];
      const robotmonPath = `getStoragePath()+'/scripts/${Config.getConfig().projectName}/assets/${path.basename(imageName)}'`;
      let snippetString = `var img_${basename} = openImage(${robotmonPath});\n`;
      snippetString += `$0\nreleaseImage(img_${basename});\n`;
      vscode.window.activeTextEditor.insertSnippet(new vscode.SnippetString(snippetString));
    }
  }

}