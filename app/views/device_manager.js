const _ = require('lodash');
const fs = require('fs');
const ejs = require('ejs');
const dgram = require('dgram');

const DeviceController = require('./device_controller.js');

const DEVICE_LIST_ITEM_TEMPLATE_HTML = 'templates/device_list_item.ejs';
const DEVICE_LIST_TEMPLATE_HTML = 'templates/device_list.ejs';

const ONLINE = {
  NOW: 5,
  SLEEPING: 15,
  OFFLINE: 30,
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
      this.deviceController = new DeviceController(this.$devices, this.ip);
    });
  }

  getTemplateHtml() {
    const tpl = fs.readFileSync(`${__dirname}/${DEVICE_LIST_ITEM_TEMPLATE_HTML}`);
    return ejs.render(tpl.toString(), this);
  }

}

class DeviceManager {
  constructor($root, $devices) {
    this.$root = $root;
    this.$devices = $devices;
    this.deviceList = {};
    this.receiver = dgram.createSocket('udp4');
    this.bind();

    this.bindView();

    this.updateListLoopId = setInterval(() => { this.updateList(); }, 1000);
  }

  bind() {
    this.receiver.bind(8082);
    this.receiver.on('message', (msg, info) => {
      if (msg.toString() === 'robotmon') {
        let listItem = this.deviceList[info.address];
        if (_.isUndefined(this.deviceList[info.address])) {
          listItem = new DeviceListItem(this.$deviceManager, this.$devices, info.address);
          this.deviceList[info.address] = listItem;
        }
        listItem.update();
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
    this.$textIp = this.$root.find('.text-ip');
    this.$connectIpBtn = this.$root.find('.connect-ip');
    this.$connectIpBtn.unbind('click').bind('click', () => {
      const ip = this.$textIp.val();
      const tmp = new DeviceController(this.$devices, ip);
    });
  }

  getTemplateHtml() {
    const tpl = fs.readFileSync(`${__dirname}/${DEVICE_LIST_TEMPLATE_HTML}`);
    return ejs.render(tpl.toString(), this);
  }

}

module.exports = DeviceManager;
