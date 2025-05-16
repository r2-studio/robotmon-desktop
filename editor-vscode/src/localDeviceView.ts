import * as vscode from 'vscode';

import { Message } from './constVariables';
import { LocalDevice } from './localDevice';
import { LocalDeviceProvider } from './localDeviceProvider';
import { OutputLogger } from './logger';

export class LocalDeviceView {
  private mDisposables: Array<vscode.Disposable> = [];
  private mLocalDeviceProvider: LocalDeviceProvider;
  private mLocalDeviceView: vscode.TreeView<LocalDevice>;

  constructor() {
    this.mLocalDeviceProvider = new LocalDeviceProvider();
    this.mLocalDeviceView = vscode.window.createTreeView<LocalDevice>('localDeviceView', {
      treeDataProvider: this.mLocalDeviceProvider,
    });
    this.registVSCodeCommand();
  }

  private registVSCodeCommand() {
    // Local Device View - scan
    let disposable = vscode.commands.registerCommand('localDeviceView.scan', () => {
      this.scan();
    });
    this.mDisposables.push(disposable);
    // Local Device View - add
    disposable = vscode.commands.registerCommand('localDeviceView.add', () => {
      this.tcpConnect();
    });
    this.mDisposables.push(disposable);

    // Local Device Item - startService
    disposable = vscode.commands.registerCommand('localDeviceViewItem.startService', async (element: LocalDevice) => {
      try {
        const pids = await element.startRobotmonService();
        vscode.window.showInformationMessage(`${Message.startServiceSuccess}, ${pids[0]}:${pids[1]}`);
        element.updateServiceState();
        this.mLocalDeviceProvider.notifyItemChanged();
      } catch (e) {
        vscode.window.showWarningMessage(`${e}`);
      }
    });
    this.mDisposables.push(disposable);

    // Local Device Item - stopService
    disposable = vscode.commands.registerCommand('localDeviceViewItem.stopService', (element: LocalDevice) => {
      element.stopRobotmonService().then(
        () => {
          element.updateServiceState();
          this.mLocalDeviceProvider.notifyItemChanged();
        },
        () => {
          element.updateServiceState();
          this.mLocalDeviceProvider.notifyItemChanged();
        }
      );
    });
    this.mDisposables.push(disposable);

    // Local Device Item - forwardPort
    disposable = vscode.commands.registerCommand('localDeviceViewItem.forwardPort', async (element: LocalDevice) => {
      const rPort = await element.forwardPort(8080);
      if (rPort !== 0) {
        vscode.commands.executeCommand('remoteDeviceView.addDevice', rPort);
        vscode.window.showInformationMessage(`${element.id} forward port from local ${rPort} to remote 8080 succeeded`);
      } else {
        vscode.window.showErrorMessage(`${element.id} try to forward port from local 8080~8089 to remote 8080 failed`);
      }
    });

    // Local Device Item - tcpip
    disposable = vscode.commands.registerCommand('localDeviceViewItem.tcpip', async (element: LocalDevice) => {
      if (await element.tcpip()) {
        vscode.window.showInformationMessage(`${element.id} "adb tcpip 5555" success`);
      } else {
        vscode.window.showErrorMessage(`${element.id} "adb tcpip 5555" Failed`);
      }
    });
    this.mDisposables.push(disposable);

    this.mDisposables.push(disposable);
  }

  public scan() {
    this.mLocalDeviceProvider.scan();
  }

  public tcpConnect() {
    const inputBox = vscode.window.createInputBox();
    let prompt = 'If use emulator, you should know emulator port.';
    prompt += '127.0.0.1:62001 (nox 1), 127.0.0.1:62025 (nox2), ';
    prompt += '127.0.0.1:5555 (bs 1), 127.0.0.1:5565  (bs 2), 5575 (bs 3), 5585 (bs 4)...';
    inputBox.placeholder = 'Input device IP:PORT. 127.0.0.1:62001 or 127.0.0.1:5555';
    inputBox.prompt = prompt;

    inputBox.onDidAccept(() => {
      let rx1 = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}\:[0-9]{1,5}$/;
      if (rx1.test(inputBox.value)) {
        const tmp = inputBox.value.split(':');
        inputBox.prompt = 'Connecting... please wait';
        inputBox.busy = true;
        inputBox.enabled = false;
        this.mLocalDeviceProvider.tcpConnect(tmp[0], tmp[1]).then(
          () => {
            vscode.window.showInformationMessage(`Connect to ${inputBox.value} success`);
            OutputLogger.default.debug(`Connect to ${inputBox.value} success`);
            inputBox.dispose();
            this.scan();
          },
          err => {
            inputBox.prompt = `${err}`;
            inputBox.busy = false;
            inputBox.enabled = true;
          }
        );
      } else {
        // inputBox.validationMessage = `IP is not available: ${inputBox.value}`;
        inputBox.prompt = `IP is not available: ${inputBox.value}`;
      }
    });
    inputBox.onDidHide(() => {
      inputBox.dispose();
    });
    inputBox.show();
  }

  public dispose() {
    vscode.Disposable.from(...this.mDisposables).dispose();
    this.mLocalDeviceView.dispose();
  }

  public installAdb() {
    // TODO download adb binary
  }
}
