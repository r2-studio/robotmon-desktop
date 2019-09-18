import * as vscode from 'vscode';

import { SnippetProvider } from './snippetProvider';
import { VSCodeUtils } from './vscodeUtils';

export class SnippetView {

  private mDisposables: Array<vscode.Disposable> = [];
  private mSnippetProvider: SnippetProvider;
  private mSnippetView: vscode.TreeView<vscode.TreeItem>;
  private mSelected: vscode.TreeItem | undefined;
  private mLanguage: string = "en";

  constructor() {
    this.mSnippetProvider = new SnippetProvider();
    this.mSnippetView = vscode.window.createTreeView<vscode.TreeItem>("snippetView", { treeDataProvider: this.mSnippetProvider });
    this.mSnippetView.onDidChangeSelection(selected => this.onDidChangeSelection(selected));
    this.registCompletionItems();

    let disposable = vscode.commands.registerCommand('snippetViewItem.insert', (element: vscode.TreeItem) => {
      const editor = VSCodeUtils.findTextEditor();
      if (editor !== undefined) {
        const ending = (editor.document.eol === vscode.EndOfLine.CRLF) ? `\r\n` : `\n`;
        const body = this.mSnippetProvider.searchDocBody(element.label as string);
        editor.insertSnippet(new vscode.SnippetString(body.join(ending)));
      }
    });
    this.mDisposables.push(disposable);
  }

  private registCompletionItems() {
    let disposable = vscode.languages.registerCompletionItemProvider({language: 'javascript', scheme: 'file'}, this);
    this.mDisposables.push(disposable);
  }

  public onDidChangeSelection(selected: vscode.TreeViewSelectionChangeEvent<vscode.TreeItem> | null) {
    if (selected === null) {
      return;
    }
    if (selected.selection.length > 0 && this.mSelected === selected.selection[0]) {
    }
    this.mSelected = selected.selection[0];
  }

  public provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
    const rawApiSnippets = this.getRawApiSnippets(this.mSnippetProvider.getRawApiDoc(), document.eol);

    const simpleCompletion = new vscode.CompletionItem('openImage2', vscode.CompletionItemKind.Function);
    simpleCompletion.insertText = new vscode.SnippetString('var ${1:varName} = openimage(${2|".jpg",getStoragePath()|});');
    simpleCompletion.filterText = "robotmon_raw_api_openImage2";

    return [simpleCompletion, ...rawApiSnippets];
  }

  private getRawApiSnippets(doc: any, eol: vscode.EndOfLine = vscode.EndOfLine.CRLF) {
    const ending = (eol === vscode.EndOfLine.CRLF) ? `\r\n` : `\n`;
    const snippets: Array<vscode.CompletionItem> = [];
    for (const key in doc) {
      let scopes = key.split(':');
      const functionName = scopes[scopes.length - 1];
      const completionItem = new vscode.CompletionItem(functionName, vscode.CompletionItemKind.Function);
      completionItem.filterText = scopes.join('_');
      completionItem.insertText = new vscode.SnippetString(doc[key].body.join(ending));
      if (doc[key][`description_${this.mLanguage}`] !== undefined) {
        completionItem.documentation = new vscode.MarkdownString(doc[key][`description_${this.mLanguage}`]);
      } else {
        completionItem.documentation = new vscode.MarkdownString(doc[key].description || "");
      }
      completionItem.sortText = functionName;
      snippets.push(completionItem);
    }
    return snippets;
  }

  public dispose() {
    vscode.Disposable.from(...this.mDisposables).dispose();
    this.mSnippetView.dispose();
  }

}