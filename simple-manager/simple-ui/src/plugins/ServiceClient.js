import { GrpcServicePromiseClient } from '../apprpc/grpc_grpc_web_pb';
import { Empty, RequestRunScript, RequestScreenshot } from "../apprpc/grpc_pb";

class Client {

  static NetClient(serial, address) {
    if (this.devices === undefined) {
      this.devices = {};
    }
    if (this.devices[serial] !== undefined) {
      return this.devices[serial];
    }
    const client = new Client(serial, address);
    this.devices[serial] = client;
    return client;
  }

  static DeleteClient(serial) {
    if (this.devices === undefined) {
      return;
    }
    if (this.devices[serial] === undefined) {
      return;
    }
    const device = this.devices[serial];
    device.deInit();
    delete this.devices[serial]
  }

  static GetClient(serial) {
    if (this.devices === undefined) {
      return undefined;
    }
    return this.devices[serial];
  }

  constructor(serial, address) {
    this.serial = serial;
    this.address = address;
    this.client = new GrpcServicePromiseClient(address);
    this.logStream = undefined;
    this.logListener = undefined;
    this.init();
  }

  getHost() {
    return this.client.hostname_;
  }

  async getScreenSize() {
    const screenSize = await this.client.getScreenSize(new Empty());
    return {width: screenSize.getWidth(), height: screenSize.getHeight()};
  }

  async getScreenshot() {
    const size = await this.getScreenSize();
    const req = new RequestScreenshot();
    req.setCropx(0);
    req.setCropy(0);
    req.setCropwidth(size.width);
    req.setCropheight(size.height);
    req.setResizewidth(size.width);
    req.setResizeheight(size.height);
    req.setQuality(100);
    
    const result = await this.client.getScreenshot(req);
    const bytes = result.getImage();
    const deviceWidth = result.getDevicewidth();
    const deviceHeight = result.getDeviceheight();
    return {bytes, deviceWidth, deviceHeight};
  }

  async runScriptSync(script) {
    const scriptReq = new RequestRunScript();
    scriptReq.setScript(script);
    const resp = await this.client.runScript(scriptReq);
    return resp.getMessage();
  }

  async runScriptAsync(script) {
    const scriptReq = new RequestRunScript();
    scriptReq.setScript(script);
    const resp = await this.client.runScriptAsync(scriptReq);
    return resp.getMessage();
  }

  init() {
    // init logger
    this.logStream = this.client.logs(new Empty());
    this.logStream.on('data', (response) => {
      if (this.logListener !== undefined) {
        this.logListener(this.serial, this.address, response.getMessage());
      }
    });
    this.logStream.on('status', (status) => {
      if (this.logListener !== undefined) {
        this.logListener(this.serial, this.address, `${status.code} ${status.details} ${status.metadata}`);
      }
    });
    this.logStream.on('error', (e) => {
      if (this.logListener !== undefined) {
        this.logListener(this.serial, this.address, `Error: ${e.message}`);
      }
      this.logStream = undefined;
    });
    this.logStream.on('end', () => {
      if (this.logListener !== undefined) {
        this.logListener(this.serial, this.address, `Disconnected`);
      }
      this.logStream = undefined;
    });
  }

  deInit() {
    if (this.logStream !== undefined) {
      this.logStream.cancel();
    }
    this.logListener = undefined;
  }

  setLogListener(listener) {
    this.logListener = listener;
  }

}

export default Client;