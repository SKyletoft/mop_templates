import * as vscode from 'vscode';

type TreeItem = vscode.TreeItem;

export class BaudRateConfig implements vscode.TreeDataProvider<TreeItem> {
	constructor() { }

	getTreeItem(element: TreeItem): TreeItem {
		return element;
	}

	getChildren(element?: TreeItem): Thenable<TreeItem[]> {
		const f = (s: string) => new vscode.TreeItem(s, vscode.TreeItemCollapsibleState.None);
		return Promise.resolve(["115'200", "124'400"].map(f));
	}
}
