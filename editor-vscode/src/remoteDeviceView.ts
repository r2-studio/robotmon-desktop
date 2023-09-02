import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { spawn } from 'child_process';

import { Config } from './config';
import { RemoteDeviceProvider } from './remoteDeviceProvider';
import { RemoteDevice } from './remoteDevice';
import { Message } from './constVariables';
import { ScreenUtilsPanel } from './screenUtilsPanel';
import { VSCodeUtils } from './vscodeUtils';
import { OutputLogger } from './logger';

export class RemoteDeviceView {
  private mDisposables: Array<vscode.Disposable> = [];
  private mRemoteDeviceProvider: RemoteDeviceProvider;
  private mRemoteDeviceView: vscode.TreeView<RemoteDevice>;
  private mSelections: Array<RemoteDevice> = [];

  private mStatusBarItems: Array<vscode.StatusBarItem> = [];
  private mRunItem: vscode.StatusBarItem;
  private mRunBuildItem: vscode.StatusBarItem;
  private mStopItem: vscode.StatusBarItem;
  private mScreenshotItem: vscode.StatusBarItem;
  private mControlItem: vscode.StatusBarItem;
  // private mPauseItem: vscode.StatusBarItem;
  private mResumeItem: vscode.StatusBarItem;
  private mSettingItem: vscode.StatusBarItem;

  constructor() {
    this.mRemoteDeviceProvider = new RemoteDeviceProvider();
    this.mRemoteDeviceView = vscode.window.createTreeView<RemoteDevice>('remoteDeviceView', {
      treeDataProvider: this.mRemoteDeviceProvider,
    });
    this.mRemoteDeviceView.onDidChangeSelection(selected => this.onDidChangeSelection(selected));

    this.mRunItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
    this.mRunBuildItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
    this.mStopItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
    this.mScreenshotItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
    this.mControlItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
    // this.mPauseItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
    this.mResumeItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
    this.mSettingItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);

    this.registVSCodeCommand();
    this.initStatusBarItems();
    this.displayStatusBarItems(false);
  }

  public onDidChangeSelection(selected: vscode.TreeViewSelectionChangeEvent<RemoteDevice> | null) {
    if (selected !== null) {
      this.mSelections = selected.selection;
    }
    // TODO allow multi-selestions
    let statusBarTitle = '';
    for (let remoteDevice of this.mSelections) {
      if (remoteDevice.isConnecting()) {
        statusBarTitle += `[${remoteDevice.ip}]`;
      }
    }
    if (statusBarTitle !== '') {
      this.mDisposables.push(vscode.window.setStatusBarMessage('Targets ' + statusBarTitle));
      this.displayStatusBarItems(true);
    } else {
      this.mDisposables.push(vscode.window.setStatusBarMessage('Targets []'));
      this.displayStatusBarItems(false);
    }
  }

  public clear() {
    this.mSelections = [];
    this.mRemoteDeviceProvider.clear();
    this.mRemoteDeviceProvider.refresh();
    this.onDidChangeSelection(null);
  }

  public refresh() {
    this.mRemoteDeviceProvider.refresh();
    this.onDidChangeSelection(null);
  }

  public getRemoteDeviceProvider(): RemoteDeviceProvider {
    return this.mRemoteDeviceProvider;
  }

  public dispose() {
    vscode.Disposable.from(...this.mDisposables).dispose();
    vscode.Disposable.from(...this.mStatusBarItems).dispose();
    this.mRemoteDeviceProvider.dispose();
  }

  public runScript() {
    const editor = vscode.window.activeTextEditor;
    if (editor === undefined) {
      vscode.window.showWarningMessage(Message.notifyNoEditor);
      return;
    }
    const script = editor.document.getText();
    if (script === '' || editor.document.languageId === 'Log') {
      vscode.window.showWarningMessage(Message.notifyScriptEmpty);
      return;
    }
    for (let device of this.mSelections) {
      RemoteDeviceView.runScriptFromEditor(device, script).then(
        () => {
          vscode.window.showInformationMessage(`${Message.runScriptSuccess} ${device.ip}`);
        },
        e => {
          vscode.window.showWarningMessage(`${Message.runScriptFailure} ${device.ip} ${e}`);
        }
      );
    }
  }

  public pauseScript() {
    for (let device of this.mSelections) {
      device.pause().then(
        () => {
          device.getLogger().debug(Message.pauseScriptSuccess);
        },
        e => {
          vscode.window.showWarningMessage(`${Message.pauseScriptFailure} ${device.ip} ${e}`);
        }
      );
    }
  }

  public resumeScript() {
    for (let device of this.mSelections) {
      device.resume().then(
        () => {
          device.getLogger().debug(Message.resumeScriptSuccess);
        },
        e => {
          vscode.window.showWarningMessage(`${Message.resumeScriptFailure} ${device.ip} ${e}`);
        }
      );
    }
  }

  public stopScript() {
    for (let device of this.mSelections) {
      device.reset().then(
        () => {
          device.getLogger().debug(Message.stopScriptSuccess);
        },
        e => {
          vscode.window.showWarningMessage(`${Message.stopScriptFailure} ${device.ip} ${e}`);
        }
      );
    }
  }

  public async runBuildScript(workPath: string | undefined = undefined, script: string | undefined = undefined) {
    const shell = process.env.SHELL || 'bash';
    if (workPath === undefined) {
      workPath = VSCodeUtils.getFirstWorkspaceFolder() || '';
    }
    if (script === undefined) {
      script = 'build';
    }
    console.log(`runBuildScript ${workPath} ${script}`);

    if (this.mSelections.length === 0) {
      vscode.window.showWarningMessage(`Please select a device`);
      return;
    }

    for (let device of this.mSelections) {
      const outputLogger = device.getLogger();
      outputLogger.debug(`current path: ${workPath}`);
      outputLogger.debug(`npm run build`);

      await new Promise<void>(resolve => {
        const p = spawn(shell, ['-i', '-c', `npm run ${script}`], { cwd: workPath, env: process.env });
        p.on('error', e => {
          outputLogger.error(`${e}`);
        });
        p.stdout.on('data', function (data) {
          outputLogger.rLog(data);
        });

        p.stderr.on('data', function (data) {
          outputLogger.error(data);
        });
        p.on('close', () => {
          outputLogger.debug('run command finished');
          resolve();
        });
      });
      const indexPath = `${workPath}/dist/index.js`;

      if (!fs.existsSync(indexPath)) {
        outputLogger.error(`build index.js path: ${indexPath} not found`);
        continue;
      }
      outputLogger.debug(`build index.js path: ${indexPath}, run script ...`);
      try {
        const script = fs.readFileSync(indexPath).toString();
        await device.runScriptAsync(script);
        outputLogger.debug(`run script done`);
      } catch (e) {
        outputLogger.error((e as Error).message);
      }
    }
  }

  public screenshot() {
    for (let device of this.mSelections) {
      RemoteDeviceView.screenshot(device).then(
        () => {
          vscode.window.showInformationMessage(`${Message.screenshotSuccess} ${device.ip}`);
        },
        e => {
          vscode.window.showWarningMessage(`${Message.screenshotFailure} ${device.ip} ${e}`);
        }
      );
    }
  }

  public controlPanel() {
    for (let device of this.mSelections) {
      ScreenUtilsPanel.createScreenSyncPanel(device);
    }
  }

  private registVSCodeCommand() {
    // Remote Device View - addDevice
    let disposable = vscode.commands.registerCommand('remoteDeviceView.addDevice', (localPort: string | undefined) => {
      if (localPort !== undefined) {
        this.mRemoteDeviceProvider.addDevice('127.0.0.1', localPort);
        return;
      }
      const inputBox = vscode.window.createInputBox();
      inputBox.placeholder = 'Input device IP. 10.0.1.10 or 127.0.0.1:8080';
      inputBox.onDidAccept(() => {
        let rx1 = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}\:[0-9]{1,5}$/;
        let rx2 = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}/;
        if (rx1.test(inputBox.value)) {
          const tmp = inputBox.value.split(':');
          this.mRemoteDeviceProvider.addDevice(tmp[0], tmp[1]);
          inputBox.dispose();
        } else if (rx2.test(inputBox.value)) {
          this.mRemoteDeviceProvider.addDevice(inputBox.value);
          inputBox.dispose();
        } else {
          vscode.window.showWarningMessage(`IP is not available: ${inputBox.value}`);
        }
      });
      inputBox.onDidHide(() => {
        inputBox.dispose();
      });
      inputBox.show();
    });
    this.mDisposables.push(disposable);

    // Remote Device View - clear
    disposable = vscode.commands.registerCommand('remoteDeviceView.clear', () => {
      this.clear();
    });
    this.mDisposables.push(disposable);

    // Remote Device View - refresh
    disposable = vscode.commands.registerCommand('remoteDeviceView.refresh', () => {
      this.refresh();
    });
    this.mDisposables.push(disposable);

    // Remote Device Item - connect
    disposable = vscode.commands.registerCommand('remoteDeviceViewItem.connect', (element: RemoteDevice) => {
      element.connect().then(() => {
        vscode.window.showInformationMessage(`Successfully connect. ${element.ip}`);
      });
    });
    this.mDisposables.push(disposable);

    // Remote Device Item - disconnect
    disposable = vscode.commands.registerCommand('remoteDeviceViewItem.disconnect', (element: RemoteDevice) => {
      vscode.window.showInformationMessage(`Disconnect. ${element.ip}`);
      element.disconnect();
    });
    this.mDisposables.push(disposable);

    // Remote Device Item - install
    disposable = vscode.commands.registerCommand('remoteDeviceViewItem.install', (element: RemoteDevice) => {
      vscode.window.showWarningMessage(`Install not implement`);
    });
    this.mDisposables.push(disposable);
  }

  private initStatusBarItems() {
    this.mSettingItem.text = `$(gear) Setting`;
    this.mSettingItem.command = 'remoteDevice.openSetting';
    this.mStatusBarItems.push(this.mSettingItem);
    this.mDisposables.push(
      vscode.commands.registerCommand(this.mSettingItem.command, () => {
        vscode.commands.executeCommand('config.openSettings');
      })
    );

    this.mRunItem.text = `$(zap) Run`;
    this.mRunItem.command = 'remoteDevice.runScript';
    this.mStatusBarItems.push(this.mRunItem);
    this.mDisposables.push(
      vscode.commands.registerCommand(this.mRunItem.command, () => {
        this.runScript();
      })
    );

    this.mRunBuildItem.text = `$(zap) RunBuild`;
    this.mRunBuildItem.command = 'remoteDevice.runBuildScript';
    this.mStatusBarItems.push(this.mRunBuildItem);
    this.mDisposables.push(
      vscode.commands.registerCommand(this.mRunBuildItem.command, () => {
        this.runBuildScript();
      })
    );

    // this.mPauseItem.text = `$(clock) Pause`;
    // this.mPauseItem.command = "remoteDevice.pauseScript";
    // this.mStatusBarItems.push(this.mPauseItem);
    // this.mDisposables.push(vscode.commands.registerCommand(this.mPauseItem.command, () => {
    //   this.pauseScript();
    // }));

    this.mResumeItem.text = `$(history) Resume`;
    this.mResumeItem.command = 'remoteDevice.resumeScript';
    this.mStatusBarItems.push(this.mResumeItem);
    this.mDisposables.push(
      vscode.commands.registerCommand(this.mResumeItem.command, () => {
        this.resumeScript();
      })
    );

    this.mStopItem.text = `$(circle-slash) Stop`;
    this.mStopItem.command = 'remoteDevice.stopScript';
    this.mStatusBarItems.push(this.mStopItem);
    this.mDisposables.push(
      vscode.commands.registerCommand(this.mStopItem.command, () => {
        this.stopScript();
      })
    );

    this.mScreenshotItem.text = `$(file-media) Screenshot`;
    this.mScreenshotItem.command = 'remoteDevice.screenshot';
    this.mStatusBarItems.push(this.mScreenshotItem);
    this.mDisposables.push(
      vscode.commands.registerCommand(this.mScreenshotItem.command, () => {
        this.screenshot();
      })
    );

    this.mControlItem.text = `$(device-mobile) Control`;
    this.mControlItem.command = 'remoteDevice.controlPanel';
    this.mStatusBarItems.push(this.mControlItem);
    this.mDisposables.push(
      vscode.commands.registerCommand(this.mControlItem.command, () => {
        this.controlPanel();
      })
    );
  }

  public displayStatusBarItems(show: boolean) {
    for (let item of this.mStatusBarItems) {
      if (show) {
        item.show();
      } else {
        item.hide();
      }
    }
    this.mSettingItem.show();
  }

  static runScriptFromEditor(device: RemoteDevice, script: string | undefined = undefined) {
    return new Promise<string>((resolve, reject) => {
      if (script === undefined) {
        const editor = vscode.window.activeTextEditor;
        if (editor === undefined) {
          return reject(Message.notifyNoEditor);
        }
        script = editor.document.getText();
        if (script === '' || editor.document.languageId === 'Log') {
          return reject(Message.notifyScriptEmpty);
        }
      }
      device.runScriptAsync(script).then(
        () => {
          return resolve('');
        },
        (e: string) => {
          return reject(e);
        }
      );
    });
  }

  static screenshot(device: RemoteDevice): Thenable<string> {
    return new Promise<string>((resolve, reject) => {
      const localPath = VSCodeUtils.getFirstWorkspaceFolder();
      if (localPath === undefined) {
        return reject(Message.notifyOpenFolder);
      }
      const screenshotPath = path.join(localPath, 'screenshot');
      if (!fs.existsSync(screenshotPath)) {
        fs.mkdirSync(screenshotPath);
      }
      const resizeWidth = Math.floor(device.width * Config.getConfig().screenshotSizeRatio);
      const resizeHeight = Math.floor(device.height * Config.getConfig().screenshotSizeRatio);
      const quality = Config.getConfig().screenshotQuality;
      device
        .getScreenshot(0, 0, device.width, device.height, resizeWidth, resizeHeight, quality, false)
        .then(bs => {
          const filename = Date.now().toString() + '.jpg';
          const fullpath = path.join(screenshotPath, filename);
          console.log(fullpath);
          fs.writeFileSync(fullpath, Buffer.from(bs));
          // const webviewPanel = vscode.window.createWebviewPanel("", filename, vscode.ViewColumn.Active);
          // webviewPanel.webview.html = "Hello";
          return resolve(Message.screenshotSuccess);
        })
        .catch((e: string) => {
          return reject(e);
        });
    });
  }
}
