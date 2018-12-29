import * as vscode from 'vscode';

import { Message } from './constVariables';
import { LocalDevice } from './localDevice';
import { LocalDeviceProvider } from './localDeviceProvider';

export class LocalDeviceView {

  private mDisposables: Array<vscode.Disposable> = [];
  private mLocalDeviceProvider: LocalDeviceProvider;
  private mLocalDeviceView: vscode.TreeView<LocalDevice>;
 
  constructor() {
    this.mLocalDeviceProvider = new LocalDeviceProvider();
    this.mLocalDeviceView = vscode.window.createTreeView<LocalDevice>("localDeviceView", { treeDataProvider: this.mLocalDeviceProvider });
    this.registVSCodeCommand();
  }

  private registVSCodeCommand() {
    // Local Device View - scan
    let disposable = vscode.commands.registerCommand('localDeviceView.scan', () => {
      this.scan();
    });
    this.mDisposables.push(disposable);

    // Local Device Item - startService
    disposable = vscode.commands.registerCommand('localDeviceViewItem.startService', (element: LocalDevice) => {
      element.startRobotmonService().then((pids: Array<string>) => {
        vscode.window.showInformationMessage(`${Message.startServiceSuccess}, ${pids[0]}:${pids[1]}`);
        element.updateServiceState();
        this.mLocalDeviceProvider.notifyItemChanged();
      }, (e) => {
        vscode.window.showWarningMessage(`${e}`);
      });
    });
    this.mDisposables.push(disposable);

    // Local Device Item - stopService
    disposable = vscode.commands.registerCommand('localDeviceViewItem.stopService', (element: LocalDevice) => {
      element.stopRobotmonService().then(() => {
        element.updateServiceState();
        this.mLocalDeviceProvider.notifyItemChanged();
      }, () => {
        element.updateServiceState();
        this.mLocalDeviceProvider.notifyItemChanged();
      });
    });
    this.mDisposables.push(disposable);

    // Local Device Item - forwardPort
    disposable = vscode.commands.registerCommand('localDeviceViewItem.forwardPort', (element: LocalDevice) => {
      const rPort = element.forwardPort("8080");
      if (rPort != "") {
        vscode.window.showInformationMessage(`${element.id} forward port: ${rPort} success`);
      } else {
        vscode.window.showErrorMessage(`${element.id} Forward port: ${rPort} failed`);
      }
    });
    this.mDisposables.push(disposable);
  }

  public scan() {
    this.mLocalDeviceProvider.scan();
  }

  public dispose() {
    vscode.Disposable.from(...this.mDisposables).dispose();
    this.mLocalDeviceView.dispose();
  }

  public installAdb() {
    // TODO download adb binary
  }

}