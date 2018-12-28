import * as vscode from 'vscode';


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
    // Local Device Menu - scan
    let disposable = vscode.commands.registerCommand('localDeviceView.scan', () => {
      this.scan();
    });
    this.mDisposables.push(disposable);

    // Local Device Item - startService
    disposable = vscode.commands.registerCommand('localDeviceViewItem.startService', () => {
    
    });
    this.mDisposables.push(disposable);

    // Local Device Item - stopService
    disposable = vscode.commands.registerCommand('localDeviceViewItem.stopService', () => {
    
    });
    this.mDisposables.push(disposable);

    // Local Device Item - forwardPort
    disposable = vscode.commands.registerCommand('localDeviceViewItem.forwardPort', () => {
    
    });
    this.mDisposables.push(disposable);
  }

  public scan() {
    this.mLocalDeviceProvider.scan();
  }

  public dispose() {
    vscode.Disposable.from(...this.mDisposables).dispose();
  }

  public installAdb() {
    // TODO download adb binary
  }

}