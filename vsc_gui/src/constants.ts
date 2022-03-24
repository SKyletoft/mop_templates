import * as vscode from 'vscode';
import { MD407WinRsWrapper } from './native_com';

export const FOLDER_NAME_REGEX: RegExp = /(skyletoft\.md407-code-[0-9]+\.[0-9]+\.[0-9]+)|(mop_templates\/vsc_gui)/;
export const REGEX_LENGTH: number = FOLDER_NAME_REGEX.toString().length;
export const EXTENSION_ROOT: string = vscode.extensions.getExtension("skyletoft.md407-code")?.extensionPath || "";
export const WORKSPACE_ROOT: string = (() => {
	let root = vscode.workspace.workspaceFolders?.map((folder) => folder.uri.path)[0] ?? "~";
	// WHY, NodeJS, WHY!?
	if (process.platform === "win32" && root.startsWith("/")) {
		return root.substring(1);
	}
	return root;
})();
export const MD407_WIN_RS = new MD407WinRsWrapper();
