import { EventEmitter } from 'fbemitter';

const GlobalEB = new EventEmitter();

class CServiceControllerEventBus extends EventEmitter {
  constructor() {
    super();
    this.EventNewItem = 'newItem';
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

export {
  GlobalEB,
  CServiceControllerEB,
  CAppEB,
  CEditorEB,
};
