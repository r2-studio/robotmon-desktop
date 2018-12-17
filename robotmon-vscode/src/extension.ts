'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { RemoteDeviceMenu } from './menuRemoteDevices';

import { grpc } from "grpc-web-client";
import { NodeHttpTransport } from 'grpc-web-node-http-transport';
import { RemoteDevice } from './remoteDevice';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    grpc.setDefaultTransport(NodeHttpTransport());

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "robotmon-vscode" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.sayHello', () => {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World! 2');
    });
    context.subscriptions.push(disposable);

    // New Remote Device Menu
    const remoteDeviceMenu = new RemoteDeviceMenu(context, vscode.workspace.rootPath);
    disposable = vscode.Disposable.from(remoteDeviceMenu);
    context.subscriptions.push(disposable);

    disposable = vscode.window.registerTreeDataProvider("remoteDevicesMenu", remoteDeviceMenu);
    context.subscriptions.push(disposable);

    // New Remote Device Menu - addDevice
    disposable = vscode.commands.registerCommand('remoteDevicesMenu.addDevice', () => {
        const inputBox = vscode.window.createInputBox();
        inputBox.placeholder = "Input device IP. 10.0.1.10 or 127.0.0.1:8080";
        inputBox.onDidAccept(() => {
            let rx1 = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}\:[0-9]{1,5}$/;
            let rx2 = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}/;
            if (rx1.test(inputBox.value)) {
                const tmp = inputBox.value.split(":");
                remoteDeviceMenu.addDevice(tmp[0], tmp[1]);
                inputBox.dispose();
            } else if (rx2.test(inputBox.value)) {
                remoteDeviceMenu.addDevice(inputBox.value);
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
    context.subscriptions.push(disposable);

    // New Remote Device Menu - refresh
    disposable = vscode.commands.registerCommand('remoteDevicesMenu.refresh', () => {
        remoteDeviceMenu.clear();
        remoteDeviceMenu.refresh();
    });
    context.subscriptions.push(disposable);

    // New Remote Device Menu - RemoteDevice - connect
    disposable = vscode.commands.registerCommand('remoteDevicesMenu.connect', (element: RemoteDevice) => {
        element.connect().then(() => {
            vscode.window.showInformationMessage(`Successfully connect. ${element.ip}`);
            remoteDeviceMenu.refresh();
        });
    });
    context.subscriptions.push(disposable);

    // New Remote Device Menu - RemoteDevice - disconnect
    disposable = vscode.commands.registerCommand('remoteDevicesMenu.disconnect', (element: RemoteDevice) => {
        vscode.window.showInformationMessage(`disconnect. ${element.ip}`);
        element.disconnect();
        remoteDeviceMenu.refresh();
    });
    context.subscriptions.push(disposable);

    // New Remote Device Menu - RemoteDevice - runScript
    disposable = vscode.commands.registerCommand('remoteDevicesMenu.runScript', (element: RemoteDevice) => {
        const editor = vscode.window.activeTextEditor;
        if (editor == undefined) {
            vscode.window.showWarningMessage("no text editor found");
            return;
        }
        const script = editor.document.getText();
        if (script == "" || editor.document.languageId == "Log") {
            vscode.window.showWarningMessage("script is empty");
            return;
        }
        element.runScriptAsync(script).then(v => console.log(v)); 
    });
    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}
