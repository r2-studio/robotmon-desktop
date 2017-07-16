const _ = require('lodash');
const fs = require('fs');
const ejs = require('ejs');
const dgram = require('dgram');

const adb = require('../models/adb.js');
const DevicePanel = require('./device_panel.js');

const DEVICE_LIST_ITEM_TEMPLATE_HTML = 'templates/device_list_item.ejs';
const DEVICE_USB_LIST_ITEM_TEMPLATE_HTML = 'templates/device_usb_list_item.ejs';
const DEVICE_LIST_TEMPLATE_HTML = 'templates/device_list.ejs';

const ONLINE = {
  NOW: 5,
  SLEEPING: 10,
  OFFLINE: 20,
};

class DeviceListItem {
  constructor($root, $devices, ip) {
    this.$root = $root;
    this.$devices = $devices;
    this.ip = ip;
    this.id = `device_list_item_${this.ip.replace(/\./g, '')}`;
    this.updateTime = Date.now();
    this.deviceController = undefined;

    this.bindView();
  }

  update() {
    this.updateTime = Date.now();
  }

  updateUI() {
    const during = (Date.now() - this.updateTime) / 1000;
    this.$listItem.removeClass('alert-success', 'alert-warning', 'alert-danger');
    if (during < ONLINE.NOW) {
      this.$listItem.show();
      this.$listItem.addClass('alert-success');
    } else if (during < ONLINE.SLEEPING) {
      this.$listItem.show();
      this.$listItem.addClass('alert-warning');
    } else if (during < ONLINE.OFFLINE) {
      this.$listItem.show();
      this.$listItem.addClass('alert-danger');
    } else {
      this.$listItem.hide();
    }
  }

  bindView() {
    this.$root.append(this.getTemplateHtml());

    this.$listItem = this.$root.find(`#${this.id}`);
    this.$connectBtn = this.$listItem.find('.connect');
    this.$connectBtn.unbind('click').bind('click', () => {
      if (this.deviceController === undefined) {
        this.deviceController = new DevicePanel(this.$devices, this.ip);
      } else {
        this.deviceController.show();
      }
    });
    this.$hideBtn = this.$listItem.find('.btn-hide');
    this.$hideBtn.unbind('click').bind('click', () => {
      this.deviceController.hide();
    });
  }

  getTemplateHtml() {
    const tpl = fs.readFileSync(`${__dirname}/${DEVICE_LIST_ITEM_TEMPLATE_HTML}`);
    return ejs.render(tpl.toString(), this);
  }

}

class UsbDeviceListItem {
  constructor($root, id) {
    this.$root = $root;
    this.id = id;
    this.pid = 0;

    this.bindView();
    this.update();
  }

  update() {
    this.pid = adb.getRobotmonPid(this.id);
    this.pidText.html(this.pid);
  }

  bindView() {
    this.$root.append(this.getTemplateHtml());

    this.$listItem = this.$root.find(`#${this.id}`);
    this.pidText = this.$listItem.find('.text-pid');
    this.$startBtn = this.$listItem.find('.btn-start');
    this.$startBtn.unbind('click').bind('click', () => {
      this.pid = adb.startRobotmonService(this.id);
      this.pidText.html(this.pid);
    });
    this.$stopBtn = this.$listItem.find('.btn-stop');
    this.$stopBtn.unbind('click').bind('click', () => {
      this.pid = adb.stopRobotmonService(this.id);
      this.pidText.html(0);
    });
  }

  getTemplateHtml() {
    const tpl = fs.readFileSync(`${__dirname}/${DEVICE_USB_LIST_ITEM_TEMPLATE_HTML}`);
    return ejs.render(tpl.toString(), this);
  }
}

class DeviceManager {
  constructor($root, $devices) {
    this.$root = $root;
    this.$devices = $devices;
    this.deviceList = {};
    this.usbDevices = {};
    this.receiver = dgram.createSocket('udp4');
    this.bind();

    this.bindView();

    this.updateListLoopId = setInterval(() => { this.updateList(); }, 1000);
  }

  addListItem(ip) {
    let listItem = this.deviceList[ip];
    if (_.isUndefined(this.deviceList[ip])) {
      listItem = new DeviceListItem(this.$deviceManager, this.$devices, ip);
      this.deviceList[ip] = listItem;
    }
    listItem.update();
  }

  bind() {
    this.receiver.bind(8082);
    this.receiver.on('message', (msg, info) => {
      if (msg.toString() === 'robotmon') {
        this.addListItem(info.address);
      }
    });
  }

  updateList() {
    _.forEach(this.deviceList, (deviceListItem) => {
      deviceListItem.updateUI();
    });
  }

  bindView() {
    this.$root.append(this.getTemplateHtml());

    this.$deviceManager = this.$root.find('#deviceManager');
    this.$usbDeviceManager = this.$root.find('#usbDeviceManager');
    this.$textIp = this.$root.find('.text-ip');
    this.$connectIpBtn = this.$root.find('.connect-ip');
    this.$connectIpBtn.unbind('click').bind('click', () => {
      const ip = this.$textIp.val();
      this.addListItem(ip);
    });
    this.$scanStatusText = this.$root.find('.text-scan-status');
    this.$scanUsbBtn = this.$root.find('.scan-usb');
    this.$scanUsbBtn.unbind('click').bind('click', () => {
      this.$usbDeviceManager.html('');
      this.usbDevices = {};
      this.$scanStatusText.html('Scanning');
      const devices = adb.getUsbDevices();
      _.forEach(devices, (id) => {
        this.usbDevices[id] = new UsbDeviceListItem(this.$usbDeviceManager, id);
      });
      this.$scanStatusText.html('');
    });
  }


  getTemplateHtml() {
    const tpl = fs.readFileSync(`${__dirname}/${DEVICE_LIST_TEMPLATE_HTML}`);
    return ejs.render(tpl.toString(), this);
  }

}

module.exports = DeviceManager;
