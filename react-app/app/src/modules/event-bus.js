import { EventEmitter } from 'fbemitter';

const GlobalEB = new EventEmitter();

class CServiceControllerEventBus extends EventEmitter {
  constructor() {
    super();
    this.EventNewItem = 'newItem';
    this.EventDeviceStateChanged = 'deviceStateChanged';
    this.TagStateConnecting = 0;
    this.TagStateConnected = 1;
    this.TagStateDisconnected = 2;
  }
}
const CServiceControllerEB = new CServiceControllerEventBus();

class CAppEventBus extends EventEmitter {
  constructor() {
    super();
    this.EventNewEditor = 'newEditor';
  }
}
const CAppEB = new CAppEventBus();

class CEditor extends EventEmitter {
  constructor() {
    super();
    this.EventClientChanged = 'clientChanged';
  }
}
const CEditorEB = new CEditor();

class CScreenCrops extends EventEmitter {
  constructor() {
    super();
    this.EventAppNameChanged = 'AppNameChanged';
    this.EventNewImageCropped = 'NewImageCropped';
  }
}
const CScreenCropsEB = new CScreenCrops();

class CLogs extends EventEmitter {
  constructor() {
    super();
    this.EventNewLog = 'newLog';
    this.TagDesktop = 'Desktop';
    this.TagDebug = 'Debug';
    this.LevelError = 'levelError';
    this.LevelWarning = 'levelWarning';
    this.LevelInfo = 'levelInfo';
  }
}
const CLogsEB = new CLogs();

export {
  GlobalEB,
  CServiceControllerEB,
  CAppEB,
  CEditorEB,
  CLogsEB,
  CScreenCropsEB,
};
