// if dlopen error, rebuild it, https://electron.atom.io/docs/tutorial/using-native-node-modules/
// ./node_modules/.bin/electron-rebuild
const electron = window.require('electron').remote;
const grpc = electron.require('grpc');

const PORT = ':8081';

const protoDescriptor = grpc.load(`${__dirname}/../grpc.proto`);
const RPC = protoDescriptor.rpc;

export default class ServiceClient {
  constructor(ip) {
    this.ip = ip;
  }

  init() {
    this.client = new RPC.GrpcService(this.ip + PORT, grpc.credentials.createInsecure());
  }

  runScript(script) {
    return new Promise((resolve, reject) => {
      this.client.runScript({ script }, (err, obj) => {
        if (err === null) {
          resolve(obj);
        } else {
          reject(err);
        }
      });
    });
  }

  getScreenshot(cx = 0, cy = 0, cw = 0, ch = 0, rw = 0, rh = 0, q = 80) {
    const request = {
      cropX: cx,
      cropY: cy,
      cropWidth: cw,
      cropHeight: ch,
      resizeWidth: rw,
      resizeHeight: rh,
      quality: q,
    };
    return new Promise((resolve, reject) => {
      this.client.getScreenshot(request, (err, obj) => {
        if (err === null) {
          resolve(obj);
        } else {
          reject(err);
        }
      });
    });
  }

  getScreenSize() {
    const request = {};
    return new Promise((resolve, reject) => {
      this.client.getScreenSize(request, (err, obj) => {
        if (err === null) {
          resolve(obj);
        } else {
          reject(err);
        }
      });
    });
  }

  tap(x, y, during) {
    const request = { x, y, during };
    return new Promise((resolve, reject) => {
      this.client.tap(request, (err, obj) => {
        if (err === null) {
          resolve(obj);
        } else {
          reject(err);
        }
      });
    });
  }

  tapUp(x, y, during) {
    const request = { x, y, during };
    return new Promise((resolve, reject) => {
      this.client.tapUp(request, (err, obj) => {
        if (err === null) {
          resolve(obj);
        } else {
          reject(err);
        }
      });
    });
  }

  tapDown(x, y, during) {
    const request = { x, y, during };
    return new Promise((resolve, reject) => {
      this.client.tapDown(request, (err, obj) => {
        if (err === null) {
          resolve(obj);
        } else {
          reject(err);
        }
      });
    });
  }

  moveTo(x, y, during) {
    const request = { x, y, during };
    return new Promise((resolve, reject) => {
      this.client.moveTo(request, (err, obj) => {
        if (err === null) {
          resolve(obj);
        } else {
          reject(err);
        }
      });
    });
  }

  streamLogs(onData, onEnd) {
    const request = {};
    const call = this.client.logs(request);
    call.on('data', onData);
    call.on('end', onEnd);
  }

  disconnect() {
    grpc.closeClient(this.client);
  }
}
