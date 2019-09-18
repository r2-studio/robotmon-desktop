const _ = require('lodash');
const os = require('os');
const fp = require('func-pipe');
const adb = require('adbkit');

class ServiceManager {
  constructor() {
    // TODO check path after packing this app
    this.client = adb.createClient({ bin: `${process.cwd()}/app/bin/adb.${os.platform()}` });
    this.usbDevices = [];
  }

  getStartServieCommand(serial) {
    // nohup sh -c "LD_LIBRARY_PATH=/system/lib:/data/data/com.r2studio.robotmon/lib:/data/app/com.r2studio.robotmon-1/lib/arm:/data/app/com.r2studio.robotmon-2/lib/arm CLASSPATH=/data/app/com.r2studio.robotmon-1/base.apk app_process32 /system/bin com.r2studio.robotmon.Main $@" > /dev/null 2> /dev/null &
    return fp
    // get apk path
      .pipe(fp.bindObj(this.client.shell, this.client, serial, 'pm path com.r2studio.robotmon;'))
      .pipe(adb.util.readAll)
      .pipe(buf => buf.toString())
      .pipe(result => result.split(':'))
      .pipe(result => (_.isUndefined(result[1]) ? '' : result[1].trim()), fp.out(13))
    // get app_process version
      .pipe(fp.bindObj(this.client.shell, this.client, serial, 'ls /system/bin/app_process32'))
      .pipe(adb.util.readAll)
      .pipe(buf => buf.toString())
      .pipe(result => (result.trim() === '/system/bin/app_process32' ? 'app_process32' : 'app_process'), fp.out(9))
    // check nohup
      .pipe(fp.bindObj(this.client.shell, this.client, serial, 'ls /system/bin/nohup'))
      .pipe(adb.util.readAll)
      .pipe(buf => buf.toString())
      .pipe(result => (result.trim() === '/system/bin/nohup' ? 'nohup' : undefined), fp.out(5))
    // check daemonize
      .pipe(fp.bindObj(this.client.shell, this.client, serial, 'ls /system/bin/daemonize'))
      .pipe(adb.util.readAll)
      .pipe(buf => buf.toString())
      .pipe(result => (result.trim() === '/system/bin/daemonize' ? 'daemonize' : undefined), fp.out(1))
      .pipe((apk, appProcess, nohup, daemonize) => {
        const bgCmd = nohup || daemonize || '';
        const command = `${bgCmd} sh -c "LD_LIBRARY_PATH=/system/lib:/data/data/com.r2studio.robotmon/lib:/data/app/com.r2studio.robotmon-1/lib/arm:/data/app/com.r2studio.robotmon-2/lib/arm CLASSPATH=${apk} ${appProcess} /system/bin com.r2studio.robotmon.Main $@" > /dev/null 2> /dev/null && sleep 1 &`;
        return command;
      })
      .promise();
}

  startService(serial) {
    return fp
      .pipe(fp.bindObj(this.getStartServieCommand, this, serial))
      .pipe(fp.bindObj(this.client.shell, this.client, serial, _), fp.mapIndex(0, 1))
      .pipe(fp.bindObj(this.scanService, this))
      .promise();
}

  stopService(serial) {
    return fp
      .pipe(fp.bindObj(this.getServicePid, this, serial))
      .pipe(pid => `kill ${pid}`)
      .pipe(fp.bindObj(this.client.shell, this.client, serial, _))
      .pipe(fp.bindObj(this.scanService, this))
      .promise();
}

  getDeviceInfo(serial) {
    return fp
      .pipe(fp.bindObj(this.getServicePid, this, serial), fp.out(2))
      .pipe(fp.bindObj(this.client.getDHCPIpAddress, this.client, serial, 'wlan0'))
      .catchThen(() => undefined)
      .pipe((pid, ip) => ({ pid, ip }))
      .promise();
}

  getServicePid(serial) {
    return fp
      .pipe(fp.bindObj(this.client.shell, this.client, serial, 'ps | grep app_process'))
      .pipe(adb.util.readAll)
      .pipe(buf => buf.toString())
      .pipe((result) => {
        const results = result.split('\n');
        for (let i = 0; i < results.length; i += 1) {
          const r = results[i].match(/[ ]+([0-9]+)[ ]/);
          if (r !== null && r.length > 0) {
            return +r[1];
          }
        }
        return 0;
      })
      .promise();
}

  scanService() {
    return fp
      .pipe(fp.bindObj(this.client.listDevices, this.client))
      .pipeMap(device => device.id)
      .pipeMap(fp.bindObj(this.getDeviceInfo, this, _))
      .promise();
}
}

module.exports = (new ServiceManager());
