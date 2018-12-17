import * as vscode from 'vscode';
import { grpc } from "grpc-web-client";
import * as pb from "./grpc/grpc_pb"
import * as path from 'path';

import { GrpcService } from "./grpc/grpc_pb_service"
import { OutputLogger } from "./logger"

export class RemoteDevice extends vscode.TreeItem {

  public width: number = 0;
  public height: number = 0;

  private mAddress: string
  private mLogConn: grpc.Request | undefined;
  private mLogger: OutputLogger;
  private mIsConnected = false;

  constructor(public readonly ip: string, public readonly port: string) {
    super(ip, vscode.TreeItemCollapsibleState.None);
    this.mAddress = `http://${ip}:${port}`;
    this.mLogger = new OutputLogger(`Robotmon ${this.ip}`);
  }

  public connect(): Thenable<void> {
    this.mLogger.open();
    return new Promise<void>((resolve) => {
      this.getScreenSize().then(() => {
        this.mIsConnected = true;
        this.updateDescription();
        this.mLogger.debug(`Connect to ${this.ip} ... Done`);
        resolve();
      });
      this.listenLogs();
    });
  }

  public disconnect() {
    this.mLogger.debug(`Disonnect to ${this.ip} ...`);
    if (this.mIsConnected) {
      this.mIsConnected = false;
      this.width = 0;
      this.height = 0;
    }
    if (this.mLogConn != undefined) {
      this.mLogConn.close();
      this.mLogConn = undefined;
    }
    if (this.mLogger != undefined) {
      this.mLogger.close();
    }
    this.updateDescription();
  }

  public dispose() {
    this.disconnect();
  }

  public listenLogs() {
    return new Promise<string>((resolve, reject) => {
      const request = new pb.Empty();
      this.mLogConn = grpc.invoke(GrpcService.Logs, {
        request: request,
        host: this.mAddress,
        onMessage: (message: pb.Response) => {
          this.mLogger.rLog(`${message.getMessage()}`)
        },
        onEnd: (code: grpc.Code, msg: string | undefined, trailers: grpc.Metadata) => {
          if (code != grpc.Code.OK) {
            this.mLogger.error(`Error listenLogs ${code}, ${msg}, ${trailers}`);
            this.disconnect();
            reject(msg);
          }
        }
      });
    });
  }

  public getScreenSize(): Thenable<{width: number, height: number}> {
    return new Promise<{width: number, height: number}>((resolve, reject) => {
      const request = new pb.Empty();
      grpc.invoke(GrpcService.GetScreenSize, {
        request: request,
        host: this.mAddress,
        onMessage: (message: pb.ResponseScreenSize) => {
          this.width = message.getWidth();
          this.height = message.getHeight();
          resolve({width: this.width, height: this.height});
        },
        onEnd: (code: grpc.Code, msg: string | undefined, trailers: grpc.Metadata) => {
          if (code != grpc.Code.OK) {
            this.mLogger.error(`Error listenLogs ${code}, ${msg}, ${trailers}`);
            reject();
          }
        }
      });
    });
  }

  public runScript(script: string): Thenable<string> {
    return new Promise<string>((resolve, reject) => {
      const request = new pb.RequestRunScript();
      request.setScript(script);
      grpc.invoke(GrpcService.RunScript, {
        request: request,
        host: this.mAddress,
        onMessage: (message: pb.Response) => {
          resolve(message.getMessage());
        },
        onEnd: (code: grpc.Code, msg: string | undefined, trailers: grpc.Metadata) => {
          if (code != grpc.Code.OK) {
            this.mLogger.error(`Error listenLogs ${code}, ${msg}, ${trailers}`);
            reject(msg);
          }
        }
      });
    });
  }

  public runScriptAsync(script: string): Thenable<string> {
    return new Promise<string>((resolve, reject) => {
      const request = new pb.RequestRunScript();
      request.setScript(script);
      grpc.invoke(GrpcService.RunScriptAsync, {
        request: request,
        host: this.mAddress,
        onMessage: (message: pb.Response) => {
          resolve(message.getMessage());
        },
        onEnd: (code: grpc.Code, msg: string | undefined, trailers: grpc.Metadata) => {
          if (code != grpc.Code.OK) {
            this.mLogger.error(`Error listenLogs ${code}, ${msg}, ${trailers}`);
            reject(msg);
          }
        }
      });
    });
  }

  private updateDescription() {
    if (this.mIsConnected) {
      this.iconPath = {
        light: path.join(__filename, '..', '..', 'res', 'light_connect.svg'),
        dark: path.join(__filename, '..', '..', 'res', 'dark_connect.svg')
      };
      this.description = `${this.width}x${this.height}`;
    } else {
      this.iconPath = undefined;
      this.description = "";
    }
  }
  
}