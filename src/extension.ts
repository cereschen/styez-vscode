// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { transform } from "styez";
import { reComma } from "styez/dist/utils";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// 注册鼠标悬停提示
	context.subscriptions.push(vscode.languages.registerHoverProvider('vue', {
		provideHover
	}));

}

// this method is called when your extension is deactivated
export function deactivate() { }


const provideHover: vscode.HoverProvider['provideHover'] = (document, position, token) => {
	const name = vscode.workspace.getConfiguration().get<string>('styez.name')
	let lineText = document.lineAt(position.line).text
	const match = lineText.match(new RegExp(`${name}\`([^]*?)\``))
	if (match && match.index) {
		let start = match.index
		let end = start + match[0].length
		if (position.character > start && position.character < end) {
			let res = transform(...match[1].split(reComma))
			if (res) {
				res = res.replace(/;/g, ';\n') + ';'
				return new vscode.Hover(new vscode.MarkdownString('```css\nresult {\n ' + res + '\n}\n```'));
			}
		}
	}
	return null
}