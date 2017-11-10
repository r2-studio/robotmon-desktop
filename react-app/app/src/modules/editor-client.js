import fp from 'func-pipe';

import ServiceClient from '../modules/service-client';
import { CEditorEB, CLogsEB, CServiceControllerEB } from '../modules/event-bus';

import {} from '../styles/global.css';

export default class EditorClient {
  constructor(ip) {
    this.ip = ip;
    this.isConnect = false;
    this.connectState = CServiceControllerEB.TagStateConnecting;

    // sync screen
    this.storagePath = '';

    this.client = new ServiceClient(ip);
    this.client.init();
    this.testConnection();

    this.client.streamLogs((message) => {
      CLogsEB.emit(CLogsEB.EventNewLog, this.ip, CLogsEB.LevelInfo, message.message);
    }, () => {
      CLogsEB.emit(CLogsEB.EventNewLog, this.ip, CLogsEB.LevelWarning, CServiceControllerEB.TagStateDisconnected);
    });
  }

  testConnection() {
    fp
      .pipe(fp.bindObj(this.client.runScript, this.client, 'console.log("Robotmon Desktop Connect");getStoragePath();'))
      .pipe((storagePath) => {
        this.isConnect = true;
        this.connectState = CServiceControllerEB.TagStateConnected;
        this.storagePath = storagePath.message;
        CLogsEB.emit(CLogsEB.EventNewLog, this.ip, CLogsEB.LevelWarning, this.connectState);
      })
      .catch(() => {
        this.isConnect = false;
        this.connectState = CServiceControllerEB.TagStateDisconnected;
        CLogsEB.emit(CLogsEB.EventNewLog, this.ip, CLogsEB.LevelWarning, this.connectState);
      })
      .pipe(() => CEditorEB.emit(CEditorEB.EventClientChanged, this.ip));
  }
}
