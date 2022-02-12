import * as vscode from 'vscode';

type TreeItem = vscode.TreeItem;

export class Actions implements vscode.TreeDataProvider<TreeItem> {
	constructor() { }

	getTreeItem(element: TreeItem): TreeItem {
		return element;
	}

	getChildren(element?: TreeItem): Thenable<TreeItem[]> {
		return Promise.resolve([
			new vscode.TreeItem("Compile", vscode.TreeItemCollapsibleState.None),
			new vscode.TreeItem("Load", vscode.TreeItemCollapsibleState.None),
			new vscode.TreeItem("Go", vscode.TreeItemCollapsibleState.None),
			new vscode.TreeItem("Interactive", vscode.TreeItemCollapsibleState.None),
		]);
	}
}
