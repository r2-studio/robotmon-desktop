import * as vscode from 'vscode';

import { RemoteDeviceProvider } from './remoteDeviceProvider';
import { RemoteDeviceController } from './remoteDeviceController';
import { RemoteDevice } from './remoteDevice';
import { Message } from './constVariables';

export class RemoteDeviceView {

  private mDisposables: Array<vscode.Disposable> = [];
  private mRemoteDeviceProvider: RemoteDeviceProvider;
  private mRemoteDeviceView: vscode.TreeView<RemoteDevice>;
  private mSelections: Array<RemoteDevice> = [];
  
  private mStatusBarItems: Array<vscode.StatusBarItem> = [];
  private mRunItem: vscode.StatusBarItem;
  private mStopItem: vscode.StatusBarItem;
  private mScreenshotItem: vscode.StatusBarItem;
  private mControlItem: vscode.StatusBarItem;

  constructor() {
    this.mRemoteDeviceProvider = new RemoteDeviceProvider();
    this.mRemoteDeviceView = vscode.window.createTreeView<RemoteDevice>("remoteDevicesMenu", { treeDataProvider: this.mRemoteDeviceProvider });
    this.mRemoteDeviceView.onDidChangeSelection(selected => this.onDidChangeSelection(selected));
    
    this.mRunItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
    this.mStopItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
    this.mScreenshotItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
    this.mControlItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
    
    this.initStatusBarItems();
  }

  public onDidChangeSelection(selected: vscode.TreeViewSelectionChangeEvent<RemoteDevice> | null) {
    if (selected != undefined) {
      this.mSelections = selected.selection;
    }
    // TODO allow multi-selestions
    let statusBarTitle = "";
    for (let remoteDevice of this.mSelections) {
      if (remoteDevice.isConnecting()) {
        statusBarTitle += `[${remoteDevice.ip}]`;
      }
    }
    if (statusBarTitle != "") {
      this.mDisposables.push(vscode.window.setStatusBarMessage("Targets " + statusBarTitle));
      this.displayStatusBarItems(true);
    } else {
      this.displayStatusBarItems(false);
    }
  }

  public clear() {
    this.mSelections = [];
    this.mRemoteDeviceProvider.clear();
    this.mRemoteDeviceProvider.refresh();
    this.onDidChangeSelection(null);
  }

  public refresh() {
    this.mRemoteDeviceProvider.refresh();
    this.onDidChangeSelection(null);
  }

  public getRemoteDeviceProvider(): RemoteDeviceProvider {
    return this.mRemoteDeviceProvider;
  }

  public dispose() {
    vscode.Disposable.from(...this.mDisposables).dispose();
    vscode.Disposable.from(...this.mStatusBarItems).dispose();
    this.mRemoteDeviceProvider.dispose();
  }

  public runScript() {
    const editor = vscode.window.activeTextEditor;
    if (editor == undefined) {
        vscode.window.showWarningMessage(Message.notifyNoEditor);
        return;
    }
    const script = editor.document.getText();
    if (script == "" || editor.document.languageId == "Log") {
        vscode.window.showWarningMessage(Message.notifyScriptEmpty);
        return;
    }
    for (let device of this.mSelections) {
      RemoteDeviceController.runScriptFromEditor(device, script).then(() => {
        vscode.window.showInformationMessage(`${Message.runScriptSuccess} ${device.ip}`);
      }, (e) => {
        vscode.window.showWarningMessage(`${Message.runScriptFailure} ${device.ip} ${e}`);
      });
    }
  }

  public stopScript() {
    for (let device of this.mSelections) {
      RemoteDeviceController.runScriptFromEditor(device, "").then(() => {
        vscode.window.showInformationMessage(`${Message.stopScriptSuccess} ${device.ip}`);
      }, (e) => {
        vscode.window.showWarningMessage(`${Message.stopScriptFailure} ${device.ip} ${e}`);
      });
    }
  }

  public screenshot() {
    for (let device of this.mSelections) {
      RemoteDeviceController.screenshot(device).then(() => {
        vscode.window.showInformationMessage(`${Message.screenshotSuccess} ${device.ip}`);
      }, (e) => {
        vscode.window.showWarningMessage(`${Message.screenshotFailure} ${device.ip} ${e}`);
      });
    }
  }

  public controlPanel() {

  }

  private initStatusBarItems() {
    this.mRunItem.text = `$(zap) Run`;
    this.mRunItem.command = "remoteDevices.runScript";
    this.mStatusBarItems.push(this.mRunItem);
    this.mDisposables.push(vscode.commands.registerCommand(this.mRunItem.command, () => {
        this.runScript();
    }));

    this.mStopItem.text = `$(stop) Stop`;
    this.mStopItem.command = "remoteDevices.stopScript";
    this.mStatusBarItems.push(this.mStopItem);
    this.mDisposables.push(vscode.commands.registerCommand(this.mStopItem.command, () => {
      this.stopScript();
    }));

    this.mScreenshotItem.text = `$(file-media) Screenshot`;
    this.mScreenshotItem.command = "remoteDevices.screenshot";
    this.mStatusBarItems.push(this.mScreenshotItem);
    this.mDisposables.push(vscode.commands.registerCommand(this.mScreenshotItem.command, () => {
      this.screenshot();
    }));

    this.mControlItem.text = `$(device-mobile) Control`;
    this.mControlItem.command = "remoteDevices.controlPanel";
    this.mStatusBarItems.push(this.mControlItem);
    this.mDisposables.push(vscode.commands.registerCommand(this.mControlItem.command, () => {
      this.controlPanel();
    }));
  }

  public displayStatusBarItems(show: boolean) {
    for (let item of this.mStatusBarItems) {
      if (show) {
        item.show();
      } else {
        item.hide();
      }
    }
  }

}