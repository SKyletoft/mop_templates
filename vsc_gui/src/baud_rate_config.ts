import * as vscode from 'vscode';

type TreeItem = vscode.TreeItem;

export class BaudRateConfig implements vscode.TreeDataProvider<TreeItem> {
	constructor() { }

	getTreeItem(element: TreeItem): TreeItem {
		return element;
	}

	getChildren(element?: TreeItem): Thenable<TreeItem[]> {
		return Promise.resolve([
			new vscode.TreeItem("115'200", vscode.TreeItemCollapsibleState.None),
			new vscode.TreeItem("124'400", vscode.TreeItemCollapsibleState.None),
		]);
	}
}
