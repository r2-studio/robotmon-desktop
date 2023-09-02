import * as vscode from 'vscode';
import * as process from 'process';
import * as path from 'path';
import * as fs from 'fs';

export class VSCodeUtils {
  
  static findTextEditor(): vscode.TextEditor | undefined {
    const editors: vscode.TextEditor[] = [...vscode.window.visibleTextEditors];
    let matchEditor: vscode.TextEditor | undefined = undefined;
    for (let editor of editors) {
      if (editor.document.languageId === "Log") {
        continue;
      }
      if (matchEditor === undefined) {
        matchEditor = editor;
        continue;
      }
      if (matchEditor.document.languageId === "javascript") {
        matchEditor = editor;
        continue;
      }
    }
    return matchEditor;
  }

  static getFirstWorkspaceFolder(): string | undefined {
    if (vscode.workspace.workspaceFolders !== undefined) {
      for (const workPath of vscode.workspace.workspaceFolders) {
        return workPath.uri.fsPath;
      }
    }
    return undefined;
  }

  static lookupPath(filename: string, envPaths: string[] | undefined): string | undefined {
    if (envPaths === undefined) {
      envPaths = [];
    }
    const envPathString = process.env['PATH'] || process.env['Path'] || '';
    // parse path
    if (process.platform === 'win32') {
      envPaths = envPaths.concat(envPathString.split(';'));
    } else {
      envPaths = envPaths.concat(envPathString.split(':'));
    }
    for (const dir of envPaths) {
      const filePath = path.join(dir, filename);
      try {
        fs.accessSync(filePath, fs.constants.X_OK);
        return filePath;
      } catch(e) {}
      if (process.platform === 'win32' && filePath.search('.exe') === -1) {
        try {
          fs.accessSync(`${filePath}.exe`, fs.constants.X_OK);
          return `${filePath}.exe`;
        } catch(e) {}
      }
    }
    return undefined;
  }
}