import * as vscode from 'vscode';
import * as path from 'path';
import { execFile, execFileSync } from 'child_process';

import { Message, NotFound } from './constVariables';
import { OutputLogger } from './logger';
import { ADB, adbInstance } from './adb';

export class LocalDevice extends vscode.TreeItem {
  private mAdb = adbInstance;

  constructor(public readonly id: string) {
    super(id, vscode.TreeItemCollapsibleState.None);
    // !! adbPath should exist !!
    this.updateServiceState();
    // const deviceInfo = this.runAdbCommandSync("getprop ro.build.version.release; getprop ro.product.manufacturer; getprop ro.product.model");
    // OutputLogger.default.debug(`Android Info: \n${deviceInfo}`);
  }

  public async updateServiceState(pids: Array<string> | undefined = undefined) {
    const processes = await this.mAdb.getProcessPids(this.id);
    if (processes.length === 2) {
      this.description = Message.serviceStarted;
    } else {
      this.description = Message.serviceStopped;
    }
  }

  public async startRobotmonService(): Promise<[number, number]> {
    return await this.mAdb.startRobotmonService(this.id, []);
  }

  public async stopRobotmonService(): Promise<void> {
    return await this.mAdb.killAllAppProcesses(this.id);
  }

  // will test 10 port
  public async forwardPort(fromPort: number): Promise<number> {
    for (let p = fromPort; p < fromPort + 10; p++) {
      try {
        if (await this.mAdb.forwardPort(this.id, 8080, p)) {
          return p;
        }
      } catch (e) {}
    }
    return 0;
  }

  public async tcpip(): Promise<boolean> {
    try {
      await this.mAdb.getClient().tcpip(this.id, 5555);
      return true;
    } catch (e) {
      return false;
    }
  }
}
