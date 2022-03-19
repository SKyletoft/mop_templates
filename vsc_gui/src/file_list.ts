import * as vscode from 'vscode';

const fs = require('fs');

type TreeItem = vscode.TreeItem;

export class FileList implements vscode.TreeDataProvider<TreeItem> {
	constructor() { }

	getTreeItem(element: TreeItem): TreeItem {
		return element;
	}

	getChildren(element?: TreeItem): Thenable<TreeItem[]> {
		const workspace_root = (vscode.workspace.workspaceFolders && (vscode.workspace.workspaceFolders.length > 0))
			? vscode.workspace.workspaceFolders[0].uri.fsPath : "";
		const folders = fs.readdirSync(workspace_root)
			.filter((folder: string) => fs.existsSync(`${workspace_root}/${folder}/makefile`))
			.map((s: string) => new vscode.TreeItem(s, vscode.TreeItemCollapsibleState.None));
		return Promise.resolve(folders);
	}

	private _onDidChangeTreeData: vscode.EventEmitter<TreeItem | undefined | null | void> = new vscode.EventEmitter<TreeItem | undefined | null | void>();
	readonly onDidChangeTreeData: vscode.Event<TreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}
}
