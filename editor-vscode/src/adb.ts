import dgram from 'dgram';
import path from 'path';
import adb from 'adbkit';
import { Utils } from './utils';

type Client = ReturnType<typeof adb['createClient']>;

export interface Process {
  user: string;
  pid: number;
  ppid: number;
  vsize: number;
  rss: number;
  name: string;
}

export class ADB {
  public static RobotmonPackage = 'com.r2studio.robotmon';

  private client: Client;
  // private udpReceiver = dgram.createSocket({ type: 'udp4', reuseAddr: true });
  private servicePingTimes: { [address: string]: number } = {};
  private locatStreams: {
    [serial: string]: {
      logcat: any;
      onMessage: (address: string, message: string) => void;
      onClose: () => void;
    };
  } = {};

  public constructor() {
    this.client = adb.createClient();
    // this.udpReceiver.bind(8082);
    // this.udpReceiver.on('message', (msg, info) => {
    //   if (msg.toString() === 'robotmon') {
    //     this.servicePingTimes[info.address] = Date.now();
    //   }
    // });
  }

  public getServicePingTime(ip: string): number {
    return this.servicePingTimes[ip] || 0;
  }

  public getClient(): Client {
    return this.client;
  }

  public async getDevices(): Promise<string[]> {
    const devices = await this.client.listDevices();
    const serials: string[] = [];
    for (const device of devices) {
      if (device.type !== 'offline') {
        serials.push(device.id);
      }
    }
    return serials;
  }

  public async connect(ip: string, port: number): Promise<string> {
    const devices = await this.getDevices();
    if (devices.indexOf(`${ip}:${port}`) !== -1) {
      return `${ip}:${port}`;
    }
    const serialPromise = this.client.connect(ip, port);
    const timeoutPromise = Utils.sleep(3000);
    const serial = await Promise.race([serialPromise, timeoutPromise]);
    if (serial === undefined || serial === '') {
      throw new Error('AdbConnectFailed');
    }
    return serial;
  }

  // getIPAddress iface maybe wlan0, eth1
  public async getIPAddress(serial: string, ifaces: string[] = ['wlan0', 'eth1']): Promise<string> {
    for (const iface of ifaces) {
      try {
        const ip = await this.client.getDHCPIpAddress(serial, iface);
        return ip;
      } catch {}
    }
    return '';
  }

  public async shell(serial: string, command: string): Promise<string> {
    const stream = await this.client.shell(serial, command);
    const result = (await adb.util.readAll(stream)).toString().trim();
    return result;
  }

  public async forwardPort(serial: string, devicePort: number, pcPort: number): Promise<boolean> {
    return await this.client.forward(serial, `tcp:${pcPort}`, `tcp:${devicePort}`);
  }

  public async listForwards(serial: string): Promise<{ devicePort: number; pcPort: number }[]> {
    // local = pc, remote = device
    const forwards = await this.client.listForwards(serial);
    const results: { devicePort: number; pcPort: number }[] = [];
    for (const forward of forwards) {
      const pcTabs = forward.local.split(':');
      const deviceTabs = forward.remote.split(':');
      results.push({
        pcPort: Number.parseInt(pcTabs[1]) || 0,
        devicePort: Number.parseInt(deviceTabs[1]) || 0,
      });
    }
    return results;
  }

  public async shellNoResult(serial: string, command: string): Promise<void> {
    const stream = await this.client.shell(serial, command);
    stream.destroy();
  }

  public async isFileExist(serial: string, path: string): Promise<boolean> {
    try {
      const stat = await this.client.stat(serial, path);
      return stat.isFile() || stat.isSymbolicLink() || stat.isDirectory();
    } catch (e) {}
    return false;
  }

  public async getNohubPath(serial: string): Promise<string> {
    if (await this.isFileExist(serial, '/system/bin/nohup')) {
      return '/system/bin/nohup';
    } else if (await this.isFileExist(serial, '/system/xbin/nohup')) {
      return '/system/xbin/nohup';
    } else if (await this.isFileExist(serial, '/system/bin/daemonize')) {
      return '/system/bin/daemonize';
    } else if (await this.isFileExist(serial, '/system/xbin/daemonize')) {
      return '/system/xbin/daemonize';
    }
    return '';
  }

  // getPackageABI may return armeabi, armeabi-v7a, arm64-v8a, x86, x86_64, mips
  public async getPackageABI(serial: string, packageName: string): Promise<string> {
    const result = await this.shell(serial, `pm dump ${packageName}`);
    const lines = result.split('\n');
    for (const line of lines) {
      if (line.indexOf('primaryCpuAbi') !== -1) {
        const tabs = line.split('=');
        if (tabs.length > 1) {
          return tabs[1].replace(/[^0-9a-z-A-Z ]/g, '');
        }
      }
    }
    throw new Error('AppNotInstalled');
  }

  public async getAppProcess(serial: string, packageName: string): Promise<string> {
    const abi = await this.getPackageABI(serial, packageName);
    if (abi === 'arm64-v8a' || abi === 'x86_64') {
      if (await this.isFileExist(serial, '/system/bin/app_process64')) {
        return '/system/bin/app_process64';
      } else if (await this.isFileExist(serial, '/system/bin/app_process')) {
        return '/system/bin/app_process';
      }
    } else if (abi === 'armeabi' || abi === 'armeabi-v7a' || abi === 'x86') {
      if (await this.isFileExist(serial, '/system/bin/app_process64')) {
        return '/system/bin/app_process32';
      } else if (await this.isFileExist(serial, '/system/bin/app_process')) {
        return '/system/bin/app_process';
      }
    } else {
      throw new Error('ABIUnknown');
    }
    throw new Error('UnknownAppProcess');
  }

  public async getPackagePath(serial: string, packageName: string): Promise<string> {
    const result = await this.shell(serial, `pm path ${packageName}`);
    const splits = result.split(':');
    if (splits.length >= 2) {
      return splits[1];
    }
    throw new Error('AppNotInstalled');
  }

  public async getRobotmonStartCommand(serial: string, args: string[]): Promise<string> {
    const nohupPath = await this.getNohubPath(serial);
    const apkPath = await this.getPackagePath(serial, ADB.RobotmonPackage);
    const appProcess = await this.getAppProcess(serial, ADB.RobotmonPackage);
    const apkDirPath = path.dirname(apkPath);

    console.log(`[StartCommand][nohupPath]: ${nohupPath}`);
    console.log(`[StartCommand][apkPath]: ${apkPath}`);
    console.log(`[StartCommand][appProcess]: ${appProcess}`);
    console.log(`[StartCommand][apkDirPath]: ${apkDirPath}`);

    const possibleLibraryPaths: string[] = [
      '/data/data/com.r2studio.robotmon/lib',
      '/data/data/com.r2studio.robotmon/lib/arm64',
      '/data/data/com.r2studio.robotmon/lib/arm',
      '/data/data/com.r2studio.robotmon/lib/x86',
      '/data/data/com.r2studio.robotmon/lib/x86_64',
      '/data/data/com.r2studio.robotmon/lib/x64',
      `${apkDirPath}/lib`,
      `${apkDirPath}/lib/arm64`,
      `${apkDirPath}/lib/arm`,
      `${apkDirPath}/lib/x86`,
      `${apkDirPath}/lib/x86_64`,
      `${apkDirPath}/lib/x64`,
    ];

    const cmdClassPath = `CLASSPATH=${apkPath}`;
    let cmdLibraryPath = `LD_LIBRARY_PATH=/system/lib64:/system/lib`;
    for (const libPath of possibleLibraryPaths) {
      const exist = await this.isFileExist(serial, libPath);
      if (exist) {
        cmdLibraryPath += `:${libPath}`;
      }
    }
    console.log(`[StartCommand][cmdClassPath]: ${cmdClassPath}`);
    console.log(`[StartCommand][cmdLibraryPath]: ${cmdLibraryPath}`);
    const baseCommand = `${cmdLibraryPath} ${cmdClassPath} ${appProcess} /system/bin com.r2studio.robotmon.Main`;
    const fullCommand = `${nohupPath} sh -c "${baseCommand} ${args.join(' ')}" > /dev/null 2> /dev/null && sleep 2 &`;

    console.log(`[StartCommand][baseCommand]: ${baseCommand}`);
    console.log(`[StartCommand][fullCommand]: ${fullCommand}`);

    return fullCommand;
  }

  public async getProcessPids(serial: string): Promise<Process[]> {
    let result: string = '';
    let lines: string[] = [];
    try {
      result = await this.shell(serial, 'ps -A');
      lines = result.split('\n');
      if (lines.length === 1) {
        throw new Error('NoResult');
      }
    } catch (e) {
      result = await this.shell(serial, 'ps');
      lines = result.split('\n');
    }

    const processes: Process[] = [];
    for (let i = 1; i < lines.length; i++) {
      const tabs = Utils.mergeSpaces(lines[i]);

      if (tabs.length >= 9) {
        processes.push({
          user: tabs[0],
          pid: Number.parseInt(tabs[1]) || 0,
          ppid: Number.parseInt(tabs[2]) || 0,
          vsize: Number.parseInt(tabs[3]) || 0,
          rss: Number.parseInt(tabs[4]) || 0,
          name: tabs[8],
        });
      }
    }
    return processes;
  }

  public async killAllAppProcesses(serial: string): Promise<void> {
    const allPids = await this.getProcessPids(serial);
    for (const process of allPids) {
      if (process.name.indexOf('app_process') !== -1) {
        try {
          await this.shell(serial, `kill ${process.pid}`);
        } catch (e) {}
        try {
          await this.shell(serial, `kill -9 ${process.pid}`);
        } catch (e) {}
      }
    }
  }

  public async getRobotmonProcessPids(serial: string): Promise<[number, number]> {
    const allPids = await this.getProcessPids(serial);
    const appProcessPids: Process[] = [];
    for (const process of allPids) {
      if (process.name.indexOf('app_process') !== -1) {
        appProcessPids.push(process);
      }
    }
    if (appProcessPids.length <= 1) {
      return [-1, -1];
    }
    appProcessPids.sort((a, b) => a.pid - b.pid);
    for (const pprocess of appProcessPids) {
      const cprocess = appProcessPids.find(process => {
        if (process.pid === pprocess.pid) {
          return false;
        }
        if (process.ppid === pprocess.pid) {
          return true;
        }
        return false;
      });
      if (cprocess !== undefined) {
        return [pprocess.pid, cprocess.pid];
      }
    }
    return [-1, -1];
  }

  public async startRobotmonService(serial: string, args: string[]): Promise<[number, number]> {
    let [ppid, pid] = await this.getRobotmonProcessPids(serial);
    if (ppid !== -1 && pid !== -1) {
      // console.log(`[StartService][AlreadyStarted][${serial}] ${ppid}, ${pid}`);
      return [ppid, pid];
    }
    // kill all first
    await this.killAllAppProcesses(serial);
    const command = await this.getRobotmonStartCommand(serial, args);
    try {
      // await this.shellNoResult(serial, command);
      this.shell(serial, command);
      console.log(`[StartService][Starting]`);
    } catch (e) {
      console.log(`[StartService][Failed] ${(e as Error).message}`);
      throw new Error(`StartServiceFailed: ${(e as Error).message}`);
    }
    await Utils.sleep(5000);
    [ppid, pid] = await this.getRobotmonProcessPids(serial);
    if (ppid !== -1 && pid !== -1) {
      console.log(`[StartService][Successed][${serial}] ${ppid}, ${pid}`);
      return [ppid, pid];
    }
    throw new Error(`StartServiceFailed ${ppid} ${ppid}`);
  }

  public async getPackageVersionCode(serial: string, packageName: string): Promise<string> {
    const result = await this.shell(serial, `dumpsys package ${packageName} | grep versionCode`);
    const versionCode = Utils.clipString(result, 'versionCode=', ' ');
    // console.log(`getPackageVersionCode ${packageName} ${versionCode}`);
    return versionCode;
  }

  public async logcat(
    serial: string,
    tag: string,
    onMessage: (address: string, message: string) => void,
    onClose: () => void
  ) {
    if (this.locatStreams[serial] !== undefined) {
      this.locatStreams[serial].onMessage = onMessage;
      this.locatStreams[serial].onClose = onClose;
      return;
    }
    this.locatStreams[serial] = {
      logcat: undefined,
      onMessage,
      onClose,
    };
    const logcat: any = (this.locatStreams[serial].logcat = await this.getClient().openLogcat(serial, { clear: true }));
    logcat.excludeAll();
    logcat.include(tag);
    logcat.on('error', (err: Error) => {
      console.log(`logcat error ${serial} ${err.message}`);
    });
    logcat.on('end', () => {
      console.log(`logcat end ${serial}`);
      onClose();
      delete this.locatStreams[serial];
    });
    logcat.on('entry', (entry: any) => {
      onMessage(serial, entry.message);
    });
  }
}

export const adbInstance = new ADB();
