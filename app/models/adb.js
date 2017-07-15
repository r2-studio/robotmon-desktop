// const _ = require('lodash');
const os = require('os');
const childProcess = require('child_process');

const START_SERVICE_CMD = 'nohup sh -c "LD_LIBRARY_PATH=/system/lib:/data/app/com.r2sutdio.robotmon-1/lib/arm:/data/app/com.r2sutdio.robotmon-2/lib/arm CLASSPATH=/data/app/com.r2sutdio.robotmon-1/base.apk:/data/app/com.r2sutdio.robotmon-2/base.apk app_process32 /system/bin com.r2sutdio.robotmon.Main $@" > /dev/null 2> /dev/null &';

class ADB {
  static getAdbPath() {
    return `${__dirname}/../bin/adb.${os.platform()}`;
  }

  static adbShellSync(cmd) {
    return childProcess.execSync(`${ADB.getAdbPath()} shell '${cmd}'`).toString();
  }

  static getRobotmonPid() {
    const results = ADB.adbShellSync('ps app_process32').split('\r\n');
    for (let i = 0; i < results.length; i += 1) {
      const r = results[i].match(/[ ]+([0-9]+)[ ]/);
      if (r !== null && r.length > 0) {
        return +r[1];
      }
    }
    return 0;
  }

  static startRobotmonService() {
    let pid = ADB.getRobotmonPid();
    if (pid !== 0) {
      return pid;
    }
    for (let i = 0; i < 10; i += 1) {
      ADB.adbShellSync(START_SERVICE_CMD);
      ADB.adbShellSync('sleep 1');
      pid = ADB.getRobotmonPid();
      if (pid !== 0) {
        break;
      }
    }
    return pid;
  }

  static stopRobotmonService() {
    const pid = ADB.getRobotmonPid();
    if (pid !== 0) {
      ADB.adbShellSync(`kill ${pid}`);
      return pid;
    }
    return 0;
  }
}

module.exports = ADB;
