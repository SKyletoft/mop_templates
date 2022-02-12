import * as vscode from 'vscode';
import { MD407WinRsWrapper } from './native_com';

type TreeItem = vscode.TreeItem;
const { execSync, execFileSync } = require('child_process');

export class PortConfig implements vscode.TreeDataProvider<TreeItem> {
	constructor() { }

	getTreeItem(element: TreeItem): TreeItem {
		return element;
	}

	getChildren(element?: TreeItem): Thenable<TreeItem[]> {
		const md407_win_rs = new MD407WinRsWrapper();
		const query = md407_win_rs
			.query()
			.split('\n')
			.filter((line: string) => line.length !== 0)
			.map((line: string) => new vscode.TreeItem(line, vscode.TreeItemCollapsibleState.None));
		return Promise.resolve(query);
	}
}
