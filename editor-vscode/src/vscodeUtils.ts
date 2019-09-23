import * as vscode from 'vscode';

export class VSCodeUtils {
  
  static findTextEditor(): vscode.TextEditor | undefined {
    const editors: vscode.TextEditor[] = vscode.window.visibleTextEditors;
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
        return workPath.uri.path;
      }
    }
    return undefined;
  }

}