// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

const { execSync, execFileSync } = require('child_process');
const fs = require('fs');

export class MD407WinRsWrapper {
	path: string;

	constructor() {
		this.path = get_path();
	}

	query(): string {
		return execFileSync(this.path, ['query']).toString('utf8');
	}

	load(port: string, baud_rate: number) {
		let workspace_folder = vscode.workspace.workspaceFolders?.map((folder) => folder.uri.path)[0] || "~";
		if (process.platform === "win32" && workspace_folder.startsWith("/")) {
			workspace_folder = workspace_folder.substring(1);
		}

		const out_path = workspace_folder + "/" + "debug/MOP.s19";
		const exists = fs.existsSync(out_path);

		if (!exists) {
			vscode.window.showErrorMessage("No file to send. Have you compiled?");
			return;
		}

		const out = execFileSync(
			this.path,
			['load', '--filename', out_path.replace(" ", "\ "), '--port', port, '--baud-rate', baud_rate.toString()],
			{ timeout: 60000 } // One minute
		).toString('utf8');
		console.log(out);
		vscode.window.showInformationMessage("Load complete");
	}

	go(port: string, baud_rate: number): string {
		return execFileSync(this.path, ['go', '--port', port, '--baud-rate', baud_rate.toString()]).toString('utf8');
	}
}

function get_path(): string {
	const root: string = vscode.extensions.getExtension("skyletoft.md407-code")?.extensionPath || "";
	const linux = "/native_dependencies/bin/hardware-com-linux";
	const windows = "/native_dependencies/bin/hardware-com-windows.exe";
	const darwin = "/native_dependencies/bin/hardware-com-darwin";
	switch (process.platform) {
		case "linux": return root + linux;
		case "win32": return root + windows;
		case "darwin": return root + darwin;
		default: return "";
	}
}
