/* global $ */

// const DeviceController = require('./device_controller.js');
const DeviceManager = require('./device_manager.js');

// const punt = require('punt');

// broadcastReceiver = punt.bind('0.0.0.0:8082');

// console.log('receive');
// broadcastReceiver.on('message', (msg, info) => {
//   console.log(msg, info);
// });
// const deviceList = {};

// function updateDeviceList() {
//   const now = Date.now();
//   $('#deviceList').html('');
//   for (const ip in deviceList) {
//     const time = deviceList[ip];
//     if ((now - time) < 10 * 1000) {
//       $('#deviceList').append(`<div class="device-item">${ip}</div>`);
//     }
//   }
//   $('.device-item').unbind('click').bind('click', function () {
//     const ip = $(this).html();
//     const deviceController = new DeviceController($, ip);
//     const html = deviceController.getTemplateHtml();
//     $('#devices').append(html);
//   });
// }

// const dgram = require('dgram');

// const server = dgram.createSocket('udp4');
// server.bind(8082);
// server.on('message', (msg, info) => {
//   if (msg.toString() === 'robotmon') {
//     deviceList[info.address] = Date.now();
//     updateDeviceList();
//   }
// });


// You can also require other files to run in this process

// const d = new DeviceConnection('10.116.214.252');
// d.getScreenSize()
// .then((obj) => {
//   console.log(obj);
// });
// d.getScreenshot(108, 192)
// .then((obj) => {
//   const base64Image = `data:image/png;base64,${obj.image.toString('base64')}`;
//   // console.log(base64Image);
//   $('#abc').attr('src', base64Image);
// });
// d.streamLogs((data) => {
//   console.log(data);
// }, () => {
//   console.log('end');
// });
// d.runScript('sleep(1000);console.log(1);sleep(1000);console.log(2);');


$(() => {
  deviceManager = new DeviceManager($('#deviceList'), $('#devices'));
});
