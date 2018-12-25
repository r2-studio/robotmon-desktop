import * as vscode from 'vscode';
import * as path from 'path';
import { exec, execSync } from 'child_process';

import { Message } from './constVariables';
import { OutputLogger } from './logger';

export class LocalDevice extends vscode.TreeItem {

  constructor(public readonly id: string, public readonly adbPath: string) {
    super(id, vscode.TreeItemCollapsibleState.None);
  }

  public runCommandSync(cmd: string): string {
    return execSync(`${this.adbPath} -s ${this.id} shell '${cmd}'`, {timeout: 3000}).toString().trim();
  }

  public runCommand(cmd: string): Thenable<string> {
    return new Promise((resolve, reject) => {
      exec(`${this.adbPath} -s ${this.id} shell '${cmd}'`, {timeout: 3000}, (error, stdout, stderr) => {
        if (error != null) {
          return reject(error.message);
        }
        if (stderr != "") {
          return reject(stderr.trim());
        }
        return resolve(stdout.trim());
      });
    });
  }

  private getAppProcess(): string {
    const app32 = this.runCommandSync("ls /system/bin/app_process32");
    if (app32.search("No") == -1) {
      return "app_process32";
    }
    return "app_process";
  }

  private getNohub(): string {
    let result1 = this.runCommandSync("ls /system/bin/nohup");
    let result2 = this.runCommandSync("ls /system/xbin/nohup");
    if (result1.search("No") == -1 || result2.search("No") == -1) {
      return "nohup";
    }
    return "";
  }

  private getDaemonize(): string {
    const result1 = this.runCommandSync("ls /system/bin/daemonize");
    const result2 = this.runCommandSync("ls /system/xbin/daemonize");
    if (result1.search("No") == -1 || result2.search("No") == -1) {
      return "daemonize";
    }
    return "";
  }

  private getApkPath(): string {
    const result = this.runCommandSync("pm path com.r2studio.robotmon");
    if (result == "") {
      return "";
    }
    return result.substr(result.search("/"));
  }

  private getLibPath(apkPath: string): string {
    const libs = [
      `${path.dirname(apkPath)}/lib`,
      `${path.dirname(apkPath)}/lib/arm`,
      `${path.dirname(apkPath)}/lib/x86`,
      "/data/app/lib",
      "/data/app/lib/arm",
      "/data/data/com.r2studio.robotmon/lib",
      `/data/app-lib/${path.basename(apkPath).replace(".apk", "")}`,
    ];
    let libPath = "";
    for (let lib of libs) {
      const result = this.runCommandSync(`ls ${lib}`);
      if (result.search("No") == -1) {
        libPath += `:${lib}`;
      }
    }
    if (libPath != "") {
      libPath = "/system/lib" + libPath;
    }
    return libPath;
  }

  private getProcessPid(): Array<string> {
    const result = this.runCommandSync("ps | grep app_process");
    const lines = result.split('\n');
    const pids: Array<string> = [];
    for (let line of lines) {
      const tmps = line.split(' ');
      for (let i = 1; i < tmps.length; i++) {
        if (parseInt(tmps[i]) > 0) {
          pids.push(tmps[i]);
          break;
        } 
      }
    }
    return pids;
  }

  public runStartCommand(): Thenable<string[]> {
    const pids = this.getProcessPid();
    if (pids.length > 0) {
      return Promise.resolve(pids);
    }
    return new Promise((resolve, reject) => {
      let nohup = this.getNohub();
      if (nohup == "") {
        nohup = this.getDaemonize();
      }
      let apkPath = this.getApkPath();
      if (apkPath == "") {
        return reject(Message.apkPathNotFound);
      }
      const appProcess = this.getAppProcess();
      if (appProcess == "") {
        return reject(Message.appProcessNotFound);
      }
      const libPath = this.getLibPath(apkPath);
      if (libPath == "") {
        return reject(Message.libPathNotFound);
      }
      const baseCommand = `LD_LIBRARY_PATH=${libPath} CLASSPATH=${apkPath} ${appProcess} /system/bin com.r2studio.robotmon.Main $@`;
      const cmd = `${nohup} sh -c "${baseCommand}" > /dev/null 2> /dev/null && sleep 1 &`;
      OutputLogger.default.debug(`apkPath: ${apkPath}`);
      OutputLogger.default.debug(`process: ${appProcess}`);
      OutputLogger.default.debug(`libPath: ${libPath}`);
      OutputLogger.default.debug(`baseCommand: ${baseCommand}`);
      OutputLogger.default.debug(`fullCommand: ${cmd}`);
      
      const printPid = () => {
        const pids = this.getProcessPid();
        if (pids.length == 0) {
          return reject(Message.startServiceFailure);
        }
        return resolve(pids);
      };
      this.runCommand(cmd).then(printPid, printPid);
    });
  }

}