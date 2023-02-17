// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.convertToLangKey', () => {
        // Get the currently selected text
		let editor = vscode.window.activeTextEditor!;
		let selection = editor.selection;
		let text = editor.document.getText(selection);

        // Generate the language key
        let langKey = `__('${text.replace(/\s+/g, '_').toLowerCase()}')`;

        // Add the key to the .json files in the resources/lang directory
        let langDir = path.join(vscode.workspace.rootPath || '', 'resources', 'lang');
        fs.readdir(langDir, (err, files) => {
            if (err) {
                vscode.window.showErrorMessage(`Error reading language files: ${err.message}`);
                return;
            }
            files.filter(f => f.endsWith('.json')).forEach(f => {
                let filePath = path.join(langDir, f);
                fs.readFile(filePath, 'utf-8', (err, data) => {
                    if (err) {
                        vscode.window.showErrorMessage(`Error reading file ${filePath}: ${err.message}`);
                        return;
                    }
                    let jsonObj = JSON.parse(data);
                    jsonObj[langKey] = text;
                    fs.writeFile(filePath, JSON.stringify(jsonObj, null, 4), (err) => {
                        if (err) {
                            vscode.window.showErrorMessage(`Error writing to file ${filePath}: ${err.message}`);
                        }
                    });
                });
            });
        });
    });

    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
