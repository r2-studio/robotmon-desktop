import fp from 'func-pipe';

import ServiceClient from '../modules/service-client';
import { CEditorEB, CLogsEB } from '../modules/event-bus';

import {} from '../styles/global.css';

export default class EditorClient {
  constructor(ip) {
    this.ip = ip;
    this.isConnect = false;
    this.connectState = 'connecting...';

    // sync screen
    this.storagePath = '';

    this.client = new ServiceClient(ip);
    this.client.init();
    this.testConnection();

    this.client.streamLogs((message) => {
      CLogsEB.emit(CLogsEB.EventNewLog, this.ip, CLogsEB.LevelInfo, message.message);
    }, () => {
      CLogsEB.emit(CLogsEB.EventNewLog, this.ip, CLogsEB.LevelWarning, 'Disconnect');
    });
  }

  testConnection() {
    fp
      .pipe(fp.bindObj(this.client.runScript, this.client, 'console.log("Robotmon Desktop Connect");getStoragePath();'))
      .pipe((storagePath) => {
        this.isConnect = true;
        this.connectState = 'connected';
        this.storagePath = storagePath.message;
        CLogsEB.emit(CLogsEB.EventNewLog, this.ip, CLogsEB.LevelWarning, 'Connected');
      })
      .catch(() => {
        this.isConnect = false;
        this.connectState = 'disconnect';
        CLogsEB.emit(CLogsEB.EventNewLog, this.ip, CLogsEB.LevelWarning, 'Disconnected');
      })
      .pipe(() => CEditorEB.emit(CEditorEB.EventClientChanged, this.ip));
  }
}
