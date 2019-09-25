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
      result = execSync(`${this.adbPath} -s ${this.id} shell "${cmd}"`, { timeout: 3000 }).toString().trim();
    } catch (e) {
      // ignore error
    }
    return result;
  }

  public runAdbCommand(cmd: string): Thenable<string> {
    return new Promise((resolve, reject) => {
      exec(`${this.adbPath} -s ${this.id} shell "${cmd}"`, { timeout: 3000 }, (error, stdout, stderr) => {
        if (error !== null) {
          return reject(error.message);
        }
        if (stderr !== "") {
          return reject(stderr.trim());
        }
        return resolve(stdout.trim());
      });
    });
  }

  public updateServiceState(pids: Array<string> | undefined = undefined) {
    if (pids === undefined) {
      pids = this.getProcessPid();
    }
    if (pids.length === 2) {
      this.description = Message.serviceStarted;
    } else {
      this.description = Message.serviceStopped;
    }
  }

  private getAppProcess(): [boolean, boolean, boolean] {
    const app = this.runAdbCommandSync("ls /system/bin/app_process").search("No") === -1;
    const app32 = this.runAdbCommandSync("ls /system/bin/app_process32").search("No") === -1;
    const app64 = this.runAdbCommandSync("ls /system/bin/app_process64").search("No") === -1;
    return [app, app32, app64];
  }

  private getNohub(): string {
    let result1 = this.runAdbCommandSync("ls /system/bin/nohup");
    let result2 = this.runAdbCommandSync("ls /system/xbin/nohup");
    if (result1 === "" && result2 === "") {
      return "";
    }
    if (result1.search("No") === -1 || result2.search("No") === -1) {
      return "nohup";
    }
    return "";
  }

  private getDaemonize(): string {
    const result1 = this.runAdbCommandSync("ls /system/bin/daemonize");
    const result2 = this.runAdbCommandSync("ls /system/xbin/daemonize");
    if (result1.search("No") === -1 || result2.search("No") === -1) {
      return "daemonize";
    }
    return "";
  }

  private getApkPath(): string {
    const result = this.runAdbCommandSync("pm path com.r2studio.robotmon");
    if (result === "") {
      return "";
    }
    return result.substr(result.search("/"));
  }

  private getProcessPid(): Array<string> {
    let result = this.runAdbCommandSync("ps | grep app_process");
    if (result === "") {
      result = this.runAdbCommandSync("ps -A | grep app_process");
    }
    const lines = result.split('\n');
    const pids: Array<string> = [];
    for (let line of lines) {
      if (line.search("app_process") === NotFound) {
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

  private getABI(): string {
    const result = this.runAdbCommandSync("pm dump com.r2studio.robotmon");
    const lines = result.split("\n");
    for (const line of lines) {
      if (line.indexOf("primaryCpuAbi") === -1) {
        continue;
      }
      if (line.indexOf("x86") !== -1) {
        return "x86";
      } else if (line.indexOf("arm64-v8a") !== -1) {
        return "arm64-v8a";
      }
    }
    return "armeabi-v7a";
  }

  public startRobotmonService(): Thenable<Array<string>> {
    const pids = this.getProcessPid();
    if (pids.length > 0) {
      return Promise.resolve(pids);
    }
    return new Promise((resolve, reject) => {
      let nohup = this.getNohub();
      if (nohup === "") {
        nohup = this.getDaemonize();
      }
      let apkPath = this.getApkPath();
      if (apkPath === "") {
        return reject(Message.apkPathNotFound);
      }
      OutputLogger.default.debug(`apkPath: ${apkPath}`);

      const apkDir = path.dirname(apkPath);
      const abi = this.getABI();
      OutputLogger.default.debug(`apkABI: ${abi}`);

      const [app, app32, app64] = this.getAppProcess();
      if (!app && !app32 && !app64) {
        return reject(Message.appProcessNotFound);
      }
      OutputLogger.default.debug(`process: app_process: ${app}, app_process32: ${app32}, app_process64: ${app64}`);

      let classPath = "CLASSPATH=" + apkPath;
      let ldPath = "LD_LIBRARY_PATH=";
      let appProcess = "";

      if (abi === "arm64-v8a") {
        ldPath += "/system/lib64:/system/lib:";
        ldPath += apkDir + "/lib:" + apkDir + "/lib/arm64";
        if (app64) {
          appProcess = "app_process64";
        } else if (app) {
          appProcess = "app_process";
        } else {
          appProcess = "app_process32";
        }
      } else if (abi === "x86") {
        ldPath += "/system/lib:/data/data/com.r2studio.robotmon/lib:";
        ldPath += apkDir + "/lib:" + apkDir + "/lib/x86";
        if (app32) {
          appProcess = "app_process32";
        } else {
          appProcess = "app_process";
        }
      } else {
        ldPath += "/system/lib:/data/data/com.r2studio.robotmon/lib:";
        ldPath += apkDir + "/lib:" + apkDir + "/lib/arm";
        if (app32) {
          appProcess = "app_process32";
        } else {
          appProcess = "app_process";
        }
      }
      OutputLogger.default.debug(`classPath: ${classPath}`);
      OutputLogger.default.debug(`ldPath: ${ldPath}`);

      const baseCommand = `${ldPath} ${classPath} ${appProcess} /system/bin com.r2studio.robotmon.Main $@`;
      const cmd = `${nohup} sh -c '${baseCommand}' > /dev/null 2> /dev/null && sleep 1 &`;

      OutputLogger.default.debug(`baseCommand: ${baseCommand}`);
      OutputLogger.default.debug(`fullCommand: ${cmd}`);

      const printPid = () => {
        const pids = this.getProcessPid();
        if (pids.length === 0) {
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
    if (pids.length === 0) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      for (let pid of pids) {
        OutputLogger.default.debug(`kill process ${pid}...`);
        this.runAdbCommandSync(`kill ${pid}`);
      }
      const nPids = this.getProcessPid();
      if (nPids.length === 0) {
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
        const result = execSync(`${this.adbPath} -s ${this.id} forward --no-rebind tcp:${p} tcp:8080`, { timeout: 3000 }).toString().trim();
        if (result.search("error") === NotFound) {
          return `${p}`;
        }
      } catch (e) {
        // ignore error
      }
    }
    return "";
  }

  public tcpip(): boolean {
    try {
      const result = execSync(`${this.adbPath} -s ${this.id} tcpip 5555`, { timeout: 3000 }).toString().trim();
      if (result.search("error") === NotFound) {
        return true;
      }
    } catch (e) {
      return false;
    }
    return false;
  }

}