import * as vscode from 'vscode';

import { RemoteDeviceProvider } from './remoteDeviceProvider';
import { RemoteDevice } from './remoteDevice';

export class RemoteDeviceView {

  private mRemoteDeviceProvider: RemoteDeviceProvider;
  private mRemoteDeviceView: vscode.TreeView<RemoteDevice>;

  constructor() {
    this.mRemoteDeviceProvider = new RemoteDeviceProvider();
    this.mRemoteDeviceView = vscode.window.createTreeView<RemoteDevice>("remoteDevicesMenu", { treeDataProvider: this.mRemoteDeviceProvider });
  }

  public getRemoteDeviceProvider(): RemoteDeviceProvider {
    return this.mRemoteDeviceProvider;
  }

  public dispose() {
    this.mRemoteDeviceProvider.dispose();
  }

}