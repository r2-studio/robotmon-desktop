import * as vscode from 'vscode';
import { exec, execSync } from 'child_process';
import * as fs from 'fs';

import { Message, NotFound } from './constVariables';
import { Config } from './config';
import { LocalDevice } from './localDevice';
import { OutputLogger } from './logger';

export class LocalDeviceProvider implements vscode.TreeDataProvider<LocalDevice>  {

  private _onDidChangeTreeData: vscode.EventEmitter<LocalDevice | undefined> = new vscode.EventEmitter<LocalDevice | undefined>();
	readonly onDidChangeTreeData: vscode.Event<LocalDevice | undefined> = this._onDidChangeTreeData.event;
  private mAdbPath: string = "";

  constructor() {
    this.findAdb();
  }

  public getTreeItem(element: LocalDevice): LocalDevice {
    return element;
  }

  public getChildren(element?: LocalDevice): Thenable<LocalDevice[]> {
    if (element === undefined) {
      return this.getDeviceIds();
    }
    return Promise.resolve([]);
  }

  private findAdb() {
    if (fs.existsSync(Config.getConfig().adbPath)) {
      return Config.getConfig().adbPath;
    }
    this.mAdbPath = execSync("which adb").toString().trim();
  }

  public scan() {
    if (this.mAdbPath === "") {
      return vscode.window.showWarningMessage(Message.adbPathNotFound);
    }
    this._onDidChangeTreeData.fire();
  }

  public notifyItemChanged() {
    this._onDidChangeTreeData.fire();
  }

  public getDeviceIds(): Thenable<Array<LocalDevice>> {
    if (this.mAdbPath === "") {
      return Promise.resolve([]);
    }
    return new Promise((resolve, reject) => {
      const deviceIds: Array<LocalDevice> = [];
      exec(`${this.mAdbPath} devices`, (error, stdout, stderr) => {
        if (error !== null) {
          OutputLogger.default.error(error.message);
          return reject();
        }
        if (stderr !== "") {
          OutputLogger.default.warn(stderr);
        }
        if (stdout !== "") {
          const lines = stdout.split("\n");
          for (let line of lines) {
            if (line.search('offline') !== NotFound) {
              continue;
            }
            const tabs = line.split("\t");
            if (tabs.length >= 2) {
              deviceIds.push(new LocalDevice(tabs[0], this.mAdbPath));
            }
          }
        }
        resolve(deviceIds);
      });  
    });
  }

}