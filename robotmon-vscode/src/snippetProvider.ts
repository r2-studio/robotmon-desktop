import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

export class SnippetProvider {

  private mDisposables: Array<vscode.Disposable> = [];
  private mLanguage: string = "en";
  private mRawApiDoc: any;

  constructor() {
    let disposable = vscode.languages.registerCompletionItemProvider({language: 'javascript', scheme: 'file'}, this);
    this.mDisposables.push(disposable);

    const rawApiPath = path.join(__filename, '..', '..', 'res', 'snippetRawAPI.yml');
    this.mRawApiDoc = yaml.safeLoad(fs.readFileSync(rawApiPath, 'utf8'));
    // this.getRawApiSnippets(this.mRawApiDoc);
  }

  private getRawApiSnippets(doc: any, eol: vscode.EndOfLine = vscode.EndOfLine.CRLF) {
    const ending = (eol == vscode.EndOfLine.CRLF) ? `\r\n` : `\n`;
    const snippets: Array<vscode.CompletionItem> = [];
    for (const key in doc) {
      let scopes = key.split(':');
      const functionName = scopes[scopes.length - 1];
      const completionItem = new vscode.CompletionItem(functionName, vscode.CompletionItemKind.Function);
      completionItem.filterText = scopes.join('_');
      completionItem.insertText = new vscode.SnippetString(doc[key].body.join(ending));
      if (doc[key][`description_${this.mLanguage}`] != undefined) {
        completionItem.documentation = new vscode.MarkdownString(doc[key][`description_${this.mLanguage}`]);
      } else {
        completionItem.documentation = new vscode.MarkdownString(doc[key].description || "");
      }
      completionItem.sortText = functionName;
      snippets.push(completionItem);
    }
    return snippets;
  }

  provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
    const rawApiSnippets = this.getRawApiSnippets(this.mRawApiDoc, document.eol);

    const simpleCompletion = new vscode.CompletionItem('openImage2', vscode.CompletionItemKind.Function);
    simpleCompletion.insertText = new vscode.SnippetString('var ${1:varName} = openimage(${2|".jpg",getStoragePath()|});');
    simpleCompletion.filterText = "robotmon_raw_api_openImage2";

    // return rawApiSnippets;
    return [simpleCompletion, ...rawApiSnippets];
  }

  public dispose() {
    vscode.Disposable.from(...this.mDisposables).dispose();
  }

}