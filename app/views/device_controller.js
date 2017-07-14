const DeviceConnection = require('../models/api.js');

const fs = require('fs');
const ejs = require('ejs');

const DEVICE_TEMPLATE_HTML = 'templates/device_panel.ejs';

class DeviceController extends DeviceConnection {
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
    this.isConnect = false;
    this.isTap = false;
    this.tapMoveTime = 0;
    this.lastImageTime = 0;

    this.bindView();
  }

  connect() {
    super.init();
    this.getScreenSize()
    .then((obj) => {
      this.width = obj.width;
      this.height = obj.height;
      this.displayWidth = this.$screenshot.width();
      this.displayHeight = (this.height * this.displayWidth) / this.width;
      this.$screenshot.width(this.displayWidth);
      this.$screenshot.height(this.displayHeight);
      this.syncScreen();
    })
    .catch((err) => {
      console.log(err);
      this.disconnect();
    });
    this.updateConnectBtn(true);
    this.streamLogs((data) => {
      console.log(data);
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
    this.$btnQuickRunScripts = this.$panel.find('.btn-quick-run');
    this.$textScriptName = this.$panel.find('.text-script-name');
    this.$isRotation = this.$panel.find('.checkbox-rotation');
    this.$screenPositionMsg = this.$panel.find('.debug-screen-position');
    this.$isSyncScreen = this.$panel.find('.checkbox-sync-screen');

    this.$btnConnect.unbind('click').bind('click', this.connect.bind(this));
    this.$btnDisconnect.unbind('click').bind('click', this.disconnect.bind(this));
    this.updateConnectBtn(false);
    this.$btnTaskControllerStart.unbind('click').bind('click', this.runTaskController.bind(this));
    this.$btnTaskControllerStop.unbind('click').bind('click', this.stopTaskController.bind(this));
    this.$btnTaskControllerStatus.unbind('click').bind('click', this.taskControllerStatus.bind(this));
    this.$btnRunScript.unbind('click').bind('click', this.runScriptCustomer.bind(this));
    this.$btnQuickRunScripts.unbind('click').bind('click', this.quickRunScripts.bind(this));
    this.$isRotation.unbind('change').bind('change', () => { this.isRotation = !this.isRotation; });
    this.$isSyncScreen.unbind('change').bind('change', () => { this.isSyncScreen = !this.isSyncScreen; });

    this.$screenshot.on('dragstart', (event) => { event.preventDefault(); });
    this.$screenshot.unbind('mousedown').bind('mousedown', this.onTapDown.bind(this));
    this.$screenshot.unbind('mousemove').bind('mousemove', this.onMoveTo.bind(this));
    this.$screenshot.unbind('mouseup').bind('mouseup', this.onTapUp.bind(this));
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
    this.getScreenshot(0, 0)
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
    if (!this.isRotation) {
      const sx = Math.floor((x / this.displayWidth) * this.width);
      const sy = Math.floor((y / this.displayHeight) * this.height);
      return [sx, sy];
    }
    const sy = Math.floor(((this.displayWidth - x) / this.displayWidth) * this.width);
    const sx = Math.floor((y / this.displayHeight) * this.height);
    return [sx, sy];
  }

  onTapDown(event) {
    this.isTap = true;
    const [x, y] = this.toScreenXY(event.offsetX, event.offsetY);
    this.tapDown(x, y, 50);
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
    this.isTap = false;
    const [x, y] = this.toScreenXY(event.offsetX, event.offsetY);
    this.tapUp(x, y, 50);
  }

  getTemplateHtml() {
    const tpl = fs.readFileSync(`${__dirname}/${DEVICE_TEMPLATE_HTML}`);
    return ejs.render(tpl.toString(), this);
  }

  runTaskController() {
    this.runScriptByFilename('tasks_controller.js');
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

  quickRunScripts(event) {
    const filename = this.$panel.find(event.target).html();
    this.runScriptByFilename(filename);
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

module.exports = DeviceController;
