// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { PortConfig } from './port_config';
import { BaudRateConfig } from './baud_rate_config';
import { Actions } from './actions';

let port = "";
let baud_rate = "115'200";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	vscode.commands.registerCommand('md407.run', (entry) => {
		switch (entry.label) {
			case "Compile": break;
			case "Load": break;
			case "Go": break;
			case "Interactive": break;
		}
		console.log([entry.label, port, baud_rate].join(" "));
	});

	vscode.commands.registerCommand('md407.set_port', (entry) => {
		port = entry.label;
		vscode.window.showInformationMessage("Port set to " + port);
	});

	vscode.commands.registerCommand('md407.set_rate', (entry) => {
		baud_rate = entry.label;
		vscode.window.showInformationMessage("Baud rate set to " + baud_rate);
	});

	vscode.window.createTreeView(
		'md407-ports', {
		treeDataProvider: new PortConfig()
	});

	vscode.window.createTreeView(
		'md407-rates', {
		treeDataProvider: new BaudRateConfig(),
		canSelectMany: false,
	});

	vscode.window.createTreeView(
		'md407-actions', {
		treeDataProvider: new Actions(),
		canSelectMany: false,
	});
}

// this method is called when your extension is deactivated
export function deactivate() { }
