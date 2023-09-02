import * as vscode from 'vscode';
import { RunProvider } from './runProvider';
import { RemoteDeviceView } from './remoteDeviceView';
import path from 'path';

export class RunView {
  private mDisposables: Array<vscode.Disposable> = [];
  private mRunProvider: RunProvider;
  private mRunView: vscode.TreeView<vscode.TreeItem>;
  private mSelected: vscode.TreeItem | undefined;
  private mRemoteDeviceView: RemoteDeviceView;

  constructor(remoteDeviceView: RemoteDeviceView) {
    this.mRemoteDeviceView = remoteDeviceView;
    this.mRunProvider = new RunProvider();
    this.mRunView = vscode.window.createTreeView<vscode.TreeItem>('runView', {
      treeDataProvider: this.mRunProvider,
    });
    this.mRunView.onDidChangeSelection(selected => this.onDidChangeSelection(selected));

    // Run View Item - connect
    let disposable = vscode.commands.registerCommand('runViewItem.run', (element: vscode.TreeItem) => {
      const id = element.id;
      if (id === undefined) {
        return;
      }
      const jsonPath = id.split(',')[0];
      const scriptName = id.split(',')[1];
      const workPath = path.dirname(jsonPath);
      this.mRemoteDeviceView.runBuildScript(workPath, scriptName);
    });
    this.mDisposables.push(disposable);
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
    this.mRunView.dispose();
  }
}
