import * as vscode from 'vscode';
import { execFile, execFileSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as process from 'process';
import AdmZip from 'adm-zip';

import { Message, NotFound, ADBDownloadURL } from './constVariables';
import { Config } from './config';
import { LocalDevice } from './localDevice';
import { OutputLogger } from './logger';
import { VSCodeUtils } from './vscodeUtils';
import { ADB, adbInstance } from './adb';

export class LocalDeviceProvider implements vscode.TreeDataProvider<LocalDevice> {
  private _onDidChangeTreeData: vscode.EventEmitter<LocalDevice | undefined> = new vscode.EventEmitter<
    LocalDevice | undefined
  >();
  readonly onDidChangeTreeData: vscode.Event<LocalDevice | undefined> = this._onDidChangeTreeData.event;
  private mAdbPath: string = '';
  private mAdb: ADB = adbInstance;

  constructor() {
    this.init();
  }

  private async init() {
    // await this.findAdb();
    // if (this.mAdbPath === '') {
    //   OutputLogger.default.debug(`adb currently not found`);
    //   await this.downloadAdb();
    //   await this.findAdb();
    //   if (this.mAdbPath !== '') {
    //     OutputLogger.default.debug(`Found adb path: ${this.mAdbPath}`);
    //   } else {
    //     OutputLogger.default.debug(`adb not found, you should install adb your self`);
    //   }
    // } else {
    //   OutputLogger.default.debug(`Found adb path: ${this.mAdbPath}`);
    // }
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

  private async findAdb() {
    let additionalPaths: string[] = [];
    if (fs.existsSync(Config.getConfig().adbPath)) {
      additionalPaths.push(Config.getConfig().adbPath);
    }
    if (process.platform === 'win32') {
      additionalPaths.push('C:\\Program Files\\Nox\\bin');
      additionalPaths.push('D:\\Program Files\\Nox\\bin');
      additionalPaths.push('C:\\Program Files (x86)\\Nox\\bin');
      additionalPaths.push('D:\\Program Files (x86)\\Nox\\bin');
    }
    if (vscode.workspace.workspaceFolders !== undefined) {
      for (const workPath of vscode.workspace.workspaceFolders) {
        additionalPaths.push(path.join(workPath.uri.fsPath, 'bin'));
      }
    }
    const adbPath = VSCodeUtils.lookupPath('adb', additionalPaths);
    if (adbPath !== undefined) {
      this.mAdbPath = adbPath;
    }
  }

  private downloadAdb() {
    return new Promise((resolve, reject) => {
      const workPath = VSCodeUtils.getFirstWorkspaceFolder();
      if (workPath === undefined) {
        return reject();
      }
      const platform = process.platform;
      let downloadURL = '';
      if (platform === 'win32') {
        downloadURL = ADBDownloadURL.windows;
      } else if (platform === 'darwin') {
        downloadURL = ADBDownloadURL.darwin;
      } else if (platform === 'linux') {
        downloadURL = ADBDownloadURL.linux;
      }
      const binPath = path.join(workPath, 'bin');
      if (!fs.existsSync(binPath)) {
        fs.mkdirSync(binPath);
      }
      const adbZipPath = path.join(binPath, 'adb.zip');
      const adbZipFile = fs.createWriteStream(adbZipPath);
      OutputLogger.default.debug(`Download ${downloadURL} ...`);
      https
        .get(downloadURL, function (response) {
          response.pipe(adbZipFile);
          adbZipFile
            .on('finish', () => {
              adbZipFile.close();
              const zip = new AdmZip(adbZipPath);
              zip.extractAllTo(binPath);
              fs.unlinkSync(adbZipPath);
              fs.chmodSync(path.join(binPath, 'adb'), 755);
              if (platform === 'win32') {
                fs.renameSync(path.join(binPath, 'adb'), path.join(binPath, 'adb.exe'));
              }
              OutputLogger.default.debug(`Extract ${downloadURL} Done`);
              resolve(true);
            })
            .on('error', err => {
              OutputLogger.default.error(`Download Error: ${err}`);
            });
        })
        .on('error', function (err) {
          fs.unlinkSync(adbZipPath);
          OutputLogger.default.error(`Download Error: ${err}`);
          reject();
        });
    });
  }

  public scan() {
    // if (this.mAdbPath === '') {
    //   return vscode.window.showWarningMessage(Message.adbPathNotFound);
    // }
    console.log('scammmmmmm')
    this._onDidChangeTreeData.fire(undefined);
  }

  public notifyItemChanged() {
    this._onDidChangeTreeData.fire(undefined);
  }

  public async getDeviceIds(): Promise<LocalDevice[]> {
    // if (this.mAdbPath === '') {
    //   return Promise.resolve([]);
    // }
    const devices: Array<LocalDevice> = [];
    const deviceIds = await this.mAdb.getDevices();
    deviceIds.sort();
    for (const deviceId of deviceIds) {
      devices.push(new LocalDevice(deviceId));
    }
    return devices;
  }

  public async tcpConnect(ip: string, fromPort: string): Promise<void> {
    let port = parseInt(fromPort);
    await this.mAdb.connect(ip, port);
  }
}
