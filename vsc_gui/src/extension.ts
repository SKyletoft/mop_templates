// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { PortConfig } from './port_config';
import { BaudRateConfig } from './baud_rate_config';
import { Actions } from './actions';

let port = "";
let baud_rate = "";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let path = vscode.workspace.workspaceFolders || [];
	vscode.window.createTreeView(
		'md407-ports', {
		treeDataProvider: new PortConfig()
	}).onDidChangeSelection((e) => {
		port = (e.selection[0].label || "").toString();
	});
	vscode.window.createTreeView(
		'md407-rates', {
		treeDataProvider: new BaudRateConfig(),
		canSelectMany: false,
	}).onDidChangeSelection((e) => {
		baud_rate = (e.selection[0].label || "").toString();
	});

	const actions = vscode.window.createTreeView(
		'md407-actions', {
		treeDataProvider: new Actions(),
		canSelectMany: false,
	});
	actions.onDidChangeSelection((e) => {
		let action = (e.selection[0].label || "").toString();
		console.log(action, port, baud_rate);
	});
}

// this method is called when your extension is deactivated
export function deactivate() { }
