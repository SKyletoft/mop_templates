import * as vscode from 'vscode';

type TreeItem = vscode.TreeItem;

export class Actions implements vscode.TreeDataProvider<TreeItem> {
	constructor() { }

	getTreeItem(element: TreeItem): TreeItem {
		return element;
	}

	getChildren(element?: TreeItem): Thenable<TreeItem[]> {
		const f = (s: string) => new vscode.TreeItem(s, vscode.TreeItemCollapsibleState.None);
		// Any change to these labels needs to be propagated to extension.ts
		return Promise.resolve(["Compile", "Load", "Go", "Interactive"].map(f));
	}
}
