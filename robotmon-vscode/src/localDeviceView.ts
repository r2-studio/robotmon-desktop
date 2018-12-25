import * as vscode from 'vscode';


import { LocalDevice } from './localDevice';
import { LocalDeviceProvider } from './localDeviceProvider';


export class LocalDeviceView {

  
  private mDisposables: Array<vscode.Disposable> = [];
  private mLocalDeviceProvider: LocalDeviceProvider;
  private mLocalDeviceView: vscode.TreeView<LocalDevice>;
 
  constructor() {
    this.mLocalDeviceProvider = new LocalDeviceProvider();
    this.mLocalDeviceView = vscode.window.createTreeView<LocalDevice>("localDevicesMenu", { treeDataProvider: this.mLocalDeviceProvider });
  }

  public scan() {
    this.mLocalDeviceProvider.scan();
  }

  public dispose() {

  }

  public installAdb() {
    // TODO download adb binary
  }

}