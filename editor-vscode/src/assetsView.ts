import * as vscode from 'vscode';
import * as path from 'path';

import { ImageExtenstions } from './constVariables';
import { Config } from './config';
import { AssetsProvider } from './assetsProvider';
import { AssetsPanel } from './assetsPanel';
import { VSCodeUtils } from './vscodeUtils';

export class AssetsView {

  private mDisposables: Array<vscode.Disposable> = [];
  private mAssetsProvider: AssetsProvider;
  private mAssetsView: vscode.TreeView<vscode.TreeItem>;
  private mAssetsPanel: AssetsPanel | undefined;
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
      this.updatePanel();
    });
    this.mDisposables.push(disposable);

    disposable = vscode.commands.registerCommand('assetsView.openPanel', () => {
      this.openPanel();
    });
    this.mDisposables.push(disposable);

    disposable = vscode.commands.registerCommand('assetsViewItem.insert', (element: vscode.TreeItem) => {
      this.insertOpenImageCode(element.id as string);
    });
    this.mDisposables.push(disposable);
  }

  public openPanel() {
    if (this.mAssetsPanel === undefined || this.mAssetsPanel.isWebViewClosed) {
      this.mAssetsPanel = AssetsPanel.createAssetsPanel();
    }
    this.mAssetsPanel.update(this.mAssetsProvider.getAssetsFilenames(ImageExtenstions));
  }

  public updatePanel() {
    if (this.mAssetsPanel === undefined || this.mAssetsPanel.isWebViewClosed) {
      return;
    }
    this.mAssetsPanel.update(this.mAssetsProvider.getAssetsFilenames(ImageExtenstions));
  }

  public onDidChangeSelection(selected: vscode.TreeViewSelectionChangeEvent<vscode.TreeItem> | null) {
    if (selected === null) {
      return;
    }
    if (selected.selection.length > 0 && this.mSelected === selected.selection[0]) {
    }
    this.mSelected = selected.selection[0];
  }

  public dispose() {
    vscode.Disposable.from(...this.mDisposables).dispose();
    this.mAssetsView.dispose();
  }

  public insertOpenImageCode(imageName: string) {
    const editor = VSCodeUtils.findTextEditor();
    if (editor !== undefined) {
      const basename = path.basename(imageName, path.extname(imageName)).split("_")[0];
      const robotmonPath = `getStoragePath()+'/scripts/${Config.getConfig().projectName}/assets/${path.basename(imageName)}'`;
      let snippetString = `var img_${basename} = openImage(${robotmonPath});\n`;
      snippetString += `$0\nreleaseImage(img_${basename});\n`;
      editor.insertSnippet(new vscode.SnippetString(snippetString));
    }
  }

}