// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

const { execSync, execFileSync } = require('child_process');

export class MD407WinRsWrapper {
	path: string;

	constructor() {
		this.path = get_path();
	}

	query(): string {
		return execFileSync(this.path, ['query']).toString('utf8');
	}

	load(port: string, baud_rate: number): string {
		const workspace_path = vscode.workspace.workspaceFolders || ["~"];
		const out_path = workspace_path[0] + "/debug/MOP.s19";
		return execFileSync(this.path, ['load', '--filename', out_path, '--port', port, '--baud-rate', baud_rate.toString()]).toString('utf8');
	}

	go(port: string, baud_rate: number): string {
		return execFileSync(this.path, ['go', '--port', port, '--rate', baud_rate.toString()]).toString('utf8');
	}
}

function get_path(): string {
	const root: string = vscode.extensions.getExtension("skyletoft.md407-code")?.extensionPath || "";
	const linux = "/native_dependencies/hardware-com-linux";
	const windows = "/native_dependencies/hardware-com-windows.exe";
	switch (process.platform) {
		case "linux": return root + linux;
		case "win32": return root + windows;
		default: return "";
	}
}
