import * as vscode from 'vscode';

type TreeItem = vscode.TreeItem;
const { execSync, execFileSync } = require('child_process');

export class PortConfig implements vscode.TreeDataProvider<TreeItem> {
	constructor() { }

	getTreeItem(element: TreeItem): TreeItem {
		return element;
	}

	getChildren(element?: TreeItem): Thenable<TreeItem[]> {
		const query = execFileSync('git/mop_templates/vsc_gui/native_dependencies/hardware-com-linux', ['query'])
			.toString('utf8')
			.split('\n')
			.filter((line: string) => line.length !== 0)
			.map((line: string) => new vscode.TreeItem(line, vscode.TreeItemCollapsibleState.None));
		return Promise.resolve(query);
	}
}
