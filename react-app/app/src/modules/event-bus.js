import { EventEmitter } from 'fbemitter';

const GlobalEB = new EventEmitter();

class CServiceController extends EventEmitter {}
CServiceController.EventNewItem = 'newItem';

const CServiceControllerEB = new CServiceController();

export {
  GlobalEB,
  CServiceControllerEB,
};
