import * as vscode from 'vscode';
import * as path from 'path';
import { exec, execSync } from 'child_process';

import { Message, NotFound } from './constVariables';
import { OutputLogger } from './logger';

export class LocalDevice extends vscode.TreeItem {

  constructor(public readonly id: string, public readonly adbPath: string) {
    super(id, vscode.TreeItemCollapsibleState.None);
    // !! adbPath should exist !!
    this.updateServiceState();
    // const deviceInfo = this.runAdbCommandSync("getprop ro.build.version.release; getprop ro.product.manufacturer; getprop ro.product.model");
    // OutputLogger.default.debug(`Android Info: \n${deviceInfo}`);
  }

  public runAdbCommandSync(cmd: string): string {
    let result = "";
    try {
      result = execSync(`${this.adbPath} -s ${this.id} shell '${cmd};exit 0;'`, {timeout: 3000}).toString().trim();
    } catch(e) {
      // ignore error
    }
    return result;
  }

  public runAdbCommand(cmd: string): Thenable<string> {
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

  public updateServiceState(pids: Array<string> | undefined = undefined) {
    if (pids == undefined) {
      pids = this.getProcessPid();
    }
    if (pids.length == 2) {
      this.description = Message.serviceStarted;
    } else {
      this.description = Message.serviceStopped;
    }
  }

  private getAppProcess(): string {
    const app32 = this.runAdbCommandSync("ls /system/bin/app_process32");
    if (app32.search("No") == -1) {
      return "app_process32";
    }
    return "app_process";
  }

  private getNohub(): string {
    let result1 = this.runAdbCommandSync("ls /system/bin/nohup");
    let result2 = this.runAdbCommandSync("ls /system/xbin/nohup");
    if (result1 == "" && result2 == "") {
      return "";
    }
    if (result1.search("No") == -1 || result2.search("No") == -1) {
      return "nohup";
    }
    return "";
  }

  private getDaemonize(): string {
    const result1 = this.runAdbCommandSync("ls /system/bin/daemonize");
    const result2 = this.runAdbCommandSync("ls /system/xbin/daemonize");
    if (result1.search("No") == -1 || result2.search("No") == -1) {
      return "daemonize";
    }
    return "";
  }

  private getApkPath(): string {
    const result = this.runAdbCommandSync("pm path com.r2studio.robotmon");
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
      const result = this.runAdbCommandSync(`ls ${lib}`);
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
    const result = this.runAdbCommandSync("ps | grep app_process");
    const lines = result.split('\n');
    const pids: Array<string> = [];
    for (let line of lines) {
      if (line.search("app_process") == NotFound) {
        continue;
      }
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

  public startRobotmonService(): Thenable<Array<string>> {
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
      OutputLogger.default.debug(`apkPath: ${apkPath}`);

      const appProcess = this.getAppProcess();
      if (appProcess == "") {
        return reject(Message.appProcessNotFound);
      }
      OutputLogger.default.debug(`process: ${appProcess}`);

      const libPath = this.getLibPath(apkPath);
      if (libPath == "") {
        return reject(Message.libPathNotFound);
      }
      OutputLogger.default.debug(`libPath: ${libPath}`);

      const baseCommand = `LD_LIBRARY_PATH=${libPath} CLASSPATH=${apkPath} ${appProcess} /system/bin com.r2studio.robotmon.Main $@`;
      const cmd = `${nohup} sh -c "${baseCommand}" > /dev/null 2> /dev/null && sleep 1 &`;
      OutputLogger.default.debug(`baseCommand: ${baseCommand}`);
      OutputLogger.default.debug(`fullCommand: ${cmd}`);
      
      const printPid = () => {
        const pids = this.getProcessPid();
        if (pids.length == 0) {
          return reject(Message.startServiceFailure);
        }
        for (let pid of pids) {
          OutputLogger.default.debug(`service pid: ${pid}`);
        }
        return resolve(pids);
      };
      this.runAdbCommand(cmd).then(printPid, printPid);
    });
  }

  public stopRobotmonService(): Thenable<void> {
    const pids = this.getProcessPid();
    if (pids.length == 0) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      for (let pid of pids) {
        OutputLogger.default.debug(`kill process ${pid}...`);
        this.runAdbCommandSync(`kill ${pid}`);
      }
      const nPids = this.getProcessPid();
      if (nPids.length == 0) {
        resolve();
      } else {
        reject();
      }
    });
  }

  // will test 10 port
  public forwardPort(fromPort: string): string {
    let port = parseInt(fromPort);
    for (let p = port; p < port + 10; p++) {
      OutputLogger.default.debug(`Test forward port: ${p}`);
      try {
        const result = execSync(`${this.adbPath} -s ${this.id} forward --no-rebind tcp:${p} tcp:8080;`, {timeout: 3000}).toString().trim();
        if (result.search("error") == NotFound) {
          return `${p}`;
        }
      } catch(e) {
        // ignore error
      }
    }
    return "";
  }

}