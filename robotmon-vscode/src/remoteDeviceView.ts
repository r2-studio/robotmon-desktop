import * as vscode from 'vscode';

import { RemoteDeviceProvider } from './remoteDeviceProvider';
import { RemoteDeviceUtils } from './remoteDeviceUtils';
import { RemoteDevice } from './remoteDevice';
import { Message } from './constVariables';
import { ScreenUtilsPanel } from './screenUtilsPanel'

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
  private mPauseItem: vscode.StatusBarItem;
  private mResumeItem: vscode.StatusBarItem;
  private mSettingItem: vscode.StatusBarItem;

  constructor() {
    this.mRemoteDeviceProvider = new RemoteDeviceProvider();
    this.mRemoteDeviceView = vscode.window.createTreeView<RemoteDevice>("remoteDevicesMenu", { treeDataProvider: this.mRemoteDeviceProvider });
    this.mRemoteDeviceView.onDidChangeSelection(selected => this.onDidChangeSelection(selected));
    
    this.mRunItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
    this.mStopItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
    this.mScreenshotItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
    this.mControlItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
    this.mPauseItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
    this.mResumeItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
    this.mSettingItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
    
    this.initStatusBarItems();
    this.displayStatusBarItems(false);
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
      this.mDisposables.push(vscode.window.setStatusBarMessage("Targets []"));
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
      RemoteDeviceUtils.runScriptFromEditor(device, script).then(() => {
        vscode.window.showInformationMessage(`${Message.runScriptSuccess} ${device.ip}`);
      }, (e) => {
        vscode.window.showWarningMessage(`${Message.runScriptFailure} ${device.ip} ${e}`);
      });
    }
  }

  public pauseScript() {
    for (let device of this.mSelections) {
      device.pause().then(() => {
        device.getLogger().debug(Message.pauseScriptSuccess);
      }, (e) => {
        vscode.window.showWarningMessage(`${Message.pauseScriptFailure} ${device.ip} ${e}`);
      });
    }
  }

  public resumeScript() {
    for (let device of this.mSelections) {
      device.resume().then(() => {
        device.getLogger().debug(Message.resumeScriptSuccess);
      }, (e) => {
        vscode.window.showWarningMessage(`${Message.resumeScriptFailure} ${device.ip} ${e}`);
      });
    }
  }

  public stopScript() {
    for (let device of this.mSelections) {
      device.reset().then(() => {
        device.getLogger().debug(Message.stopScriptSuccess);
      }, (e) => {
        vscode.window.showWarningMessage(`${Message.stopScriptFailure} ${device.ip} ${e}`);
      });
    }
  }

  public screenshot() {
    for (let device of this.mSelections) {
      RemoteDeviceUtils.screenshot(device).then(() => {
        vscode.window.showInformationMessage(`${Message.screenshotSuccess} ${device.ip}`);
      }, (e) => {
        vscode.window.showWarningMessage(`${Message.screenshotFailure} ${device.ip} ${e}`);
      });
    }
  }

  public controlPanel() {
    for (let device of this.mSelections) {
      ScreenUtilsPanel.createScreenSyncPanel(device);
    }
  }

  private initStatusBarItems() {
    this.mSettingItem.text = `$(gear) Setting`;
    this.mSettingItem.command = "remoteDevices.openSetting";
    this.mStatusBarItems.push(this.mSettingItem);
    this.mDisposables.push(vscode.commands.registerCommand(this.mSettingItem.command, () => {
      vscode.commands.executeCommand("config.openSettings");
    }));

    this.mRunItem.text = `$(zap) Run`;
    this.mRunItem.command = "remoteDevices.runScript";
    this.mStatusBarItems.push(this.mRunItem);
    this.mDisposables.push(vscode.commands.registerCommand(this.mRunItem.command, () => {
        this.runScript();
    }));

    this.mPauseItem.text = `$(clock) Pause`;
    this.mPauseItem.command = "remoteDevices.pauseScript";
    this.mStatusBarItems.push(this.mPauseItem);
    this.mDisposables.push(vscode.commands.registerCommand(this.mPauseItem.command, () => {
      this.pauseScript();
    }));

    this.mResumeItem.text = `$(history) Resume`;
    this.mResumeItem.command = "remoteDevices.resumeScript";
    this.mStatusBarItems.push(this.mResumeItem);
    this.mDisposables.push(vscode.commands.registerCommand(this.mResumeItem.command, () => {
      this.resumeScript();
    }));

    this.mStopItem.text = `$(circle-slash) Stop`;
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
    this.mSettingItem.show();
  }

}