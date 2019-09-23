import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

import { Message } from './constVariables';
import { VSCodeUtils } from './vscodeUtils';

export class Config {

  private static config = new Config();
  static getConfig() {
    return Config.config;
  }

  public projectName: string = "ScriptTest";
  public adbPath: string = "adb";
  public syncScreenImageQuality: number = 90;
  public syncScreenImageSizeRatio: number = 0.75;
  public screenshotQuality: number = 90;
  public screenshotSizeRatio: number = 1.0;
  public emulatorPort: number = 62001;
  
  private mDisposes: Array<vscode.Disposable> = [];

  constructor() {
    // Config - listen robotmon-settings.json saved
    let event = vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
      if (this.getSettingPath() === document.fileName) {
        this.onSettingFileSaved();
      }
    });
    this.mDisposes.push(event);
    
    // Load settings
    this.loadSettings();
  }

  public openSetting() {
    const settingsPath = this.getSettingPath();
    if (settingsPath === "") {
      return vscode.window.showWarningMessage(Message.notifyOpenFolder);
    }
    if (!fs.existsSync(settingsPath)) {
      const settingContent = this.getDefaultSettingsJSON();
      fs.writeFileSync(settingsPath, settingContent);
      vscode.window.showInformationMessage(Message.createNewSettingFile);
    }
    vscode.workspace.openTextDocument(settingsPath).then((document: vscode.TextDocument) => {
      vscode.window.showTextDocument(document);
    });
  }

  public loadSettings() {
    const settingsPath = this.getSettingPath();
    if (settingsPath === "") {
      return;
    }
    if (!fs.existsSync(settingsPath)) {
      return;
    }
    const content = fs.readFileSync(settingsPath).toString('utf-8');
    try {
      const obj = JSON.parse(content);
      for (let name in this) {
        if (name[0] !== 'm' && obj[name] !== undefined) {
          this[name] = obj[name];
        }
      }
      vscode.window.showInformationMessage(Message.parseSettingsSuccess);
    } catch {
      vscode.window.showWarningMessage(Message.parseSettingsError);
    }
  }

  // listen
  public onSettingFileSaved() {
    this.loadSettings();
  }

  public dispose() {
    vscode.Disposable.from(...this.mDisposes).dispose();
  }

  private getSettingPath(): string {
    const localPath = VSCodeUtils.getFirstWorkspaceFolder();
    if (localPath === undefined) {
      return "";
    }
    return path.join(localPath, Message.robotmonSettingsFilename);
  }

  private getDefaultSettingsJSON() {
    const allowVariables: Array<string> = [];
    for (let name in this) {
      if (name[0] !== 'm') {
        allowVariables.push(name);
      }
    }
    return JSON.stringify(this, allowVariables, 4);
  }

}