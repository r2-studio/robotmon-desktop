const DeviceConnection = require('../models/api.js');

const fs = require('fs');
const ejs = require('ejs');
const glob = require('glob');

const DEVICE_TEMPLATE_HTML = 'templates/device_panel.ejs';

class DevicePanel extends DeviceConnection {
  constructor($root, ip) {
    super(ip);
    this.$root = $root;
    this.ip = ip;
    this.id = `device_${this.ip.replace(/\./g, '')}`;
    this.width = 0;
    this.height = 0;
    this.displayWidth = 0;
    this.displayHeight = 0;
    this.isRotation = false;
    this.isSyncScreen = true;
    this.isGetColor = false;
    this.isConnect = false;
    this.isTap = false;
    this.tapMoveTime = 0;
    this.lastImageTime = 0;
    this.onLogMsg = null;

    this.bindView();
    this.connect();
  }

  connect() {
    super.init();
    this.getScreenSize()
    .then((obj) => {
      this.width = obj.width;
      this.height = obj.height;
      this.displayWidth = Math.floor(this.$screenshot.width());
      this.displayHeight = Math.floor((this.height * this.displayWidth) / this.width);
      this.syncScreen();
    })
    .catch((err) => {
      console.log(err);
      this.disconnect();
    });
    this.updateConnectBtn(true);
    this.streamLogs((data) => {
      console.log(data);
      if (this.onLogMsg !== null) {
        this.onLogMsg(data);
      }
    }, () => {
      console.log('end');
    });
  }

  disconnect() {
    super.disconnect();
    this.updateConnectBtn(false);
  }

  bindView() {
    this.$root.append(this.getTemplateHtml());

    this.$panel = this.$root.find(`#${this.id}`);
    this.$screenshot = this.$panel.find('.screenshot');
    this.$btnConnect = this.$panel.find('.btn-connect');
    this.$btnDisconnect = this.$panel.find('.btn-disconnect');
    this.$btnTaskControllerStart = this.$panel.find('.btn-controller-start');
    this.$btnTaskControllerStop = this.$panel.find('.btn-controller-stop');
    this.$btnTaskControllerStatus = this.$panel.find('.btn-controller-status');
    this.$btnRunScript = this.$panel.find('.btn-run-script');
    this.$btnStartService = this.$panel.find('.btn-start-service');
    this.$dropdownToggle = this.$panel.find('.dropdown-toggle');
    this.$dropdownMenu = this.$panel.find('.dropdown-menu');
    this.$textScriptName = this.$panel.find('.text-script-name');
    this.$textPid = this.$panel.find('.text-pid');
    this.$isRotation = this.$panel.find('.checkbox-rotation');
    this.$screenPositionMsg = this.$panel.find('.debug-screen-position');
    this.$isSyncScreen = this.$panel.find('.checkbox-sync-screen');
    this.$isGetColor = this.$panel.find('.checkbox-get-color');
    this.$colorRecords = this.$panel.find('.color-records');
    this.$consolelog = this.$panel.find('.consolelog');
    this.$console = this.$panel.find('#console');

    this.$btnConnect.unbind('click').bind('click', this.connect.bind(this));
    this.$btnDisconnect.unbind('click').bind('click', this.disconnect.bind(this));
    this.updateConnectBtn(false);
    this.$btnTaskControllerStart.unbind('click').bind('click', this.runTaskController.bind(this));
    this.$btnTaskControllerStop.unbind('click').bind('click', this.stopTaskController.bind(this));
    this.$btnTaskControllerStatus.unbind('click').bind('click', this.taskControllerStatus.bind(this));
    this.$btnRunScript.unbind('click').bind('click', this.runScriptCustomer.bind(this));
    this.$dropdownToggle.unbind('click').bind('click', this.initDropdownMenu.bind(this));
    this.$isRotation.unbind('change').bind('change', () => { this.isRotation = !this.isRotation; });
    this.$isSyncScreen.unbind('change').bind('change', () => { this.isSyncScreen = !this.isSyncScreen; });
    this.$isGetColor.unbind('change').bind('change', () => { this.isGetColor = !this.isGetColor; });

    this.$screenshot.on('dragstart', (event) => { event.preventDefault(); });
    this.$screenshot.unbind('mousedown').bind('mousedown', this.onTapDown.bind(this));
    this.$screenshot.unbind('mousemove').bind('mousemove', this.onMoveTo.bind(this));
    this.$screenshot.unbind('mouseup').bind('mouseup', this.onTapUp.bind(this));

    // apis
    this.$runApi = this.$panel.find('.btn-run-api');
    this.$runApi.unbind('click').bind('click', (e) => {
      const $target = this.$panel.find(e.target);
      const cmd = $target.prev('.scripts').val();
      this.runScriptByString(cmd);
      this.onLogMsg = (log) => {
        this.$consolelog.html(log.message);
        this.$console.append(log.message + '\n');
      };
    });
  }

  hide() {
    this.$panel.hide();
  }

  show() {
    this.$panel.show();
  }

  updateConnectBtn(isConnect) {
    this.isConnect = isConnect;
    if (this.isConnect) {
      this.$btnConnect.hide();
      this.$btnDisconnect.show();
    } else {
      this.$btnConnect.show();
      this.$btnDisconnect.hide();
    }
  }

  syncScreen() {
    if (!this.isSyncScreen) {
      setTimeout(() => { this.syncScreen(); }, 1000);
      return;
    }
    let fetchWidth = this.displayWidth * 2;
    let fetchHeight = this.displayHeight * 2;
    if (this.isRotation) {
      fetchWidth = this.displayHeight * 2;
      fetchHeight = this.displayWidth * 2;
    }

    this.getScreenshot(0, 0, 0, 0, fetchWidth, fetchHeight, 80)
    .then((obj) => {
      if (this.isConnect) {
        const now = Date.now();
        const during = now - this.lastImageTime;
        this.lastImageTime = now;
        // console.log('during', during, 'length', obj.image.length);
        const base64Image = `data:image/jpg;base64,${obj.image.toString('base64')}`;
        this.$screenshot.attr('src', base64Image);

        setTimeout(() => { this.syncScreen(); }, 0);
      }
    })
    .catch((err) => {
      console.log(err);
      this.disconnect();
    });
  }

  toScreenXY(x, y) {
    if (this.isRotation) {
      const sx = Math.floor((x / this.$screenshot.width()) * this.height);
      const sy = Math.floor((y / this.$screenshot.height()) * this.width);
      return [sx, sy];
    }
    const sx = Math.floor((x / this.$screenshot.width()) * this.width);
    const sy = Math.floor((y / this.$screenshot.height()) * this.height);
    return [sx, sy];
  }

  onTapDown(event) {
    const [x, y] = this.toScreenXY(event.offsetX, event.offsetY);
    if (!this.isGetColor) {
      this.isTap = true;
      this.tapDown(x, y, 50);
    } else {
      this.runScriptByString(`
        var onTapDownImg = getScreenshot();
        var onTapDownImgColor = getImageColor(onTapDownImg, ${x}, ${y});
        console.log(JSON.stringify(onTapDownImgColor));
        releaseImage(onTapDownImg);
      `);
      this.onLogMsg = (log) => {
        this.$colorRecords.append(`<div>x:${x}, y:${y} ${log.message}</div>`);
        this.onLogMsg = null;
      };
    }
  }

  onMoveTo(event) {
    const now = Date.now();
    const during = now - this.tapMoveTime;
    const [x, y] = this.toScreenXY(event.offsetX, event.offsetY);
    if (this.isTap && during > 200) {
      this.tapMoveTime = now;
      this.moveTo(x, y, 100);
    }
    this.$screenPositionMsg.html(`x: ${x}, y: ${y}`);
  }

  onTapUp(event) {
    if (!this.isGetColor) {
      this.isTap = false;
      const [x, y] = this.toScreenXY(event.offsetX, event.offsetY);
      this.tapUp(x, y, 50);
    }
  }

  getTemplateHtml() {
    const tpl = fs.readFileSync(`${__dirname}/${DEVICE_TEMPLATE_HTML}`);
    return ejs.render(tpl.toString(), this);
  }

  runTaskController() {
    this.runScriptByFilename('tasks.js');
  }

  stopTaskController() {
    this.runScriptByString('gTaskController.removeAllTasks();');
  }

  taskControllerStatus() {
    this.runScriptByString('gTaskController.addTask(printTaskStatus);');
  }

  runScriptCustomer() {
    this.runScriptByFilename(this.$textScriptName.val());
  }

  setScriptFile(event) {
    const filename = this.$panel.find(event.target).html();
    this.$textScriptName.val(filename);
  }

  initDropdownMenu() {
    this.$dropdownMenu.empty();
    glob(`${__dirname}/../../scripts/**/*.js`, (er, files) => {
      files.forEach((file) => {
        const filePath = file.split('scripts/')[1];
        this.$dropdownMenu.append(`<li><a href="#" class="btn-quick-run">${filePath}</a></li>`);
      });
      this.$btnQuickRunScripts = this.$panel.find('.btn-quick-run');
      this.$btnQuickRunScripts.unbind('click').bind('click', this.setScriptFile.bind(this));
    });
  }

  runScriptByString(js) {
    this.runScript(js)
    .then(() => {
      console.log('run tasks success', js);
    })
    .catch((err) => {
      console.log('run tasks failed err:', err, js);
    });
  }

  runScriptByFilename(filename) {
    const js = fs.readFileSync(`${__dirname}/../../scripts/${filename}`);
    this.runScript(js.toString())
    .then(() => {
      console.log('run tasks success', filename);
    })
    .catch((err) => {
      console.log('run tasks failed err:', err, filename);
    });
  }
}

module.exports = DevicePanel;
