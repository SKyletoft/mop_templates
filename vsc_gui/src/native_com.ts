// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { EXTENSION_ROOT } from './constants';

const child_process = require('child_process');
const fs = require('fs');

export class MD407WinRsWrapper {
	path: string;

	constructor() {
		this.path = get_path();
	}

	query(): string {
		return child_process.execFileSync(this.path, ['query']).toString('utf8');
	}

	load(port: string, baud_rate: number, project: string) {
		let workspace_folder = vscode.workspace.workspaceFolders?.map((folder) => folder.uri.path)[0] || "~";
		if (process.platform === "win32" && workspace_folder.startsWith("/")) {
			workspace_folder = workspace_folder.substring(1);
		}

		const out_path = `${workspace_folder}/${project}/debug/MOP.s19`;
		const exists = fs.existsSync(out_path);

		if (!exists) {
			vscode.window.showErrorMessage("No file to send. Have you compiled?");
			return;
		}

		const out = child_process.execFileSync(
			this.path,
			['load', '--filename', out_path.replace(" ", "\ "), '--port', port, '--baud-rate', baud_rate.toString()],
			{ timeout: 60000 } // One minute
		).toString('utf8');
		console.log(out);
		vscode.window.showInformationMessage("Load complete");
	}

	go(port: string, baud_rate: number): string {
		return child_process.execFileSync(this.path, ['go', '--port', port, '--baud-rate', baud_rate.toString()]).toString('utf8');
	}
}

function get_path(): string {
	const linux = "/native_dependencies/bin/hardware-com-linux";
	const windows = "/native_dependencies/bin/hardware-com-windows.exe";
	const darwin = "/native_dependencies/bin/hardware-com-darwin";
	switch (process.platform) {
		case "linux": return EXTENSION_ROOT + linux;
		case "win32": return EXTENSION_ROOT + windows;
		case "darwin": return EXTENSION_ROOT + darwin;
		default: return "";
	}
}
