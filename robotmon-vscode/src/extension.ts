'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { grpc } from "grpc-web-client";
import { LocalDeviceView } from './localDeviceView';
import { RemoteDeviceView } from './remoteDeviceView';
import { AssetsView } from './assetsView';
import { SnippetView } from './snippetView';
import { NodeHttpTransport } from 'grpc-web-node-http-transport';
import { Config } from './config';
// import { RemoteDeviceFunc } from './remoteDeviceController';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    grpc.setDefaultTransport(NodeHttpTransport());

    // New Local Device View
    const localDeviceView = new LocalDeviceView();
    let disposable = vscode.Disposable.from(localDeviceView);
    context.subscriptions.push(disposable);

    // New Remote Device View
    const remoteDeviceView = new RemoteDeviceView();
    disposable = vscode.Disposable.from(remoteDeviceView);
    context.subscriptions.push(disposable);

    // New Assets View
    const asstesView = new AssetsView();
    disposable = vscode.Disposable.from(asstesView);
    context.subscriptions.push(disposable);

    // Config - openSettings
    disposable = vscode.commands.registerCommand('config.openSettings', () => {
        Config.getConfig().openSetting();
    });
    context.subscriptions.push(disposable);

    const snippetView = new SnippetView();
    disposable = vscode.Disposable.from(snippetView);
    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
    Config.getConfig().dispose();
}
