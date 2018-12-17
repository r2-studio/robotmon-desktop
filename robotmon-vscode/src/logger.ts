import * as vscode from 'vscode';

export class OutputLogger {

  static defaultName = "Robotmon";
  static default = new OutputLogger(OutputLogger.defaultName, true);

  private mOutputChannel: vscode.OutputChannel | undefined;

  constructor(public readonly name: string, open: boolean = false) {
    if (open) {
      this.open();
    }
  }

  public open() {
    this.mOutputChannel = vscode.window.createOutputChannel(this.name);
    this.mOutputChannel.show();
  }

  public close() {
    if (this.mOutputChannel != undefined) {
      this.mOutputChannel.dispose();
    }
  }

  public rLog(msg: string) {
    this.log(msg);
  }

  public debug(msg: string) {
    this.log(`[Debug] ${msg}`);
  }

  public warn(msg: string) {
    this.log(`[Warn] ${msg}`);
    this.show();
  }

  public error(msg: string) {
    this.log(`[Error] ${msg}`);
    this.show();
  }

  public dispose() {
    this.close();
  }

  private log(msg: string) {
    if (this.mOutputChannel != undefined) {
      this.mOutputChannel.appendLine(msg);
    } else {
      OutputLogger.default.rLog(msg);
    }
  }

  private show() {
    if (this.mOutputChannel != undefined) {
      this.mOutputChannel.show();
    } else {
      OutputLogger.default.show();
    }
  }

}