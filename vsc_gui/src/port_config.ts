import * as vscode from 'vscode';
import { MD407_WIN_RS } from './constants';

type TreeItem = vscode.TreeItem;

export class PortConfig implements vscode.TreeDataProvider<TreeItem> {
	constructor() { }

	getTreeItem(element: TreeItem): TreeItem {
		return element;
	}

	getChildren(element?: TreeItem): Thenable<TreeItem[]> {
		const query = MD407_WIN_RS
			.query()
			.split('\n')
			.filter((line: string) => line.length !== 0)
			.map((line: string) => new vscode.TreeItem(line, vscode.TreeItemCollapsibleState.None));
		return Promise.resolve(query);
	}

	private _onDidChangeTreeData: vscode.EventEmitter<TreeItem | undefined | null | void> = new vscode.EventEmitter<TreeItem | undefined | null | void>();
	readonly onDidChangeTreeData: vscode.Event<TreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}
}
