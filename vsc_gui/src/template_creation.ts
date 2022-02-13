// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
const fs = require('fs');

export function instanciate_template(template_name: string) {
	const extension_root: string = vscode.extensions.getExtension("skyletoft.md407-code")?.extensionPath || "";
	let workspace_root: string = vscode.workspace.workspaceFolders?.map((folder) => folder.uri.path)[0] || "~";

	// WHY, NodeJS, WHY!?
	if (process.platform === "win32" && workspace_root.startsWith("/")) {
		workspace_root = workspace_root.substring(1);
	}

	const src = extension_root + "/templates/" + template_name;
	copy_folder(src, workspace_root);
}

function copy_folder(src: string, dest: string) {
	const files = fs.readdirSync(src);

	for (const file of files) {
		const full_src = src + "/" + file;
		const full_dest = dest + "/" + file;
		if (fs.lstatSync(full_src).isDirectory()) {
			fs.mkdirSync(full_dest);
			copy_folder(full_src, full_dest);
		} else {
			fs.copyFileSync(full_src, full_dest);
		}
	}
}
