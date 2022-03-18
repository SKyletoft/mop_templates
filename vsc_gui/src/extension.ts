// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { PortConfig } from './port_config';
import { BaudRateConfig } from './baud_rate_config';
import { Actions } from './actions';
import { MD407WinRsWrapper } from './native_com';
import { instanciate_template } from './template_creation';
import { CustomBuildTaskProvider } from './build_task';
import { download } from './download_native';

let port = "";
let baud_rate = "115'200";
const md407_win_rs = new MD407WinRsWrapper();
const workspace_root = (vscode.workspace.workspaceFolders && (vscode.workspace.workspaceFolders.length > 0))
	? vscode.workspace.workspaceFolders[0].uri.fsPath : "~";

function get_baud_rate() {
	let filtered = baud_rate.replace("'", "");
	console.log(baud_rate, filtered);
	return parseInt(filtered);
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	download();

	const build_task = new CustomBuildTaskProvider(workspace_root);
	vscode.tasks.registerTaskProvider(CustomBuildTaskProvider.CustomBuildScriptType, build_task);

	vscode.commands.registerCommand('md407.run', async (entry) => {
		switch (entry.label) {
			case "Compile": {
				//const tasks = await vscode.tasks.fetchTasks();
				//const build_task = tasks.filter((task) => task.name === 'build')[0];
				//console.log(tasks);
				//await vscode.tasks.executeTask(build_task);
				await vscode.tasks.executeTask((await build_task.provideTasks())[0]);
			} break;
			case "Load": {
				if (port === "") {
					vscode.window.showErrorMessage("You have to set a port");
					break;
				}
				md407_win_rs.load(port, get_baud_rate());
			} break;
			case "Go": {
				if (port === "") {
					vscode.window.showErrorMessage("You have to set a port");
					break;
				}
				md407_win_rs.go(port, get_baud_rate());
			} break;
			case "Interactive": {
				if (port === "") {
					vscode.window.showErrorMessage("You have to set a port");
					break;
				}
				const NAME = "md407-interactive";
				const term = vscode.window.terminals.find((t) => t.name === NAME) || vscode.window.createTerminal(NAME);
				term.show();
				if (process.platform === "win32") {
					term.sendText(["cls\n& '" + md407_win_rs.path + "'", "interactive", "--port", port, "--baud-rate", get_baud_rate()].join(" "), true);
				} else {
					term.sendText([md407_win_rs.path, "interactive", "--port", port, "--baud-rate", get_baud_rate()].join(" "), true);
				}
			} break;
		}
		console.log([entry.label, port, baud_rate].join(" "));
	});

	vscode.commands.registerCommand('md407.set_port', (entry) => {
		port = entry.label;
		vscode.window.showInformationMessage("Port set to " + port);
	});

	vscode.commands.registerCommand('md407.set_rate', (entry) => {
		baud_rate = entry.label;
		vscode.window.showInformationMessage("Baud rate set to " + baud_rate);
	});

	vscode.commands.registerCommand('md407.new_basic', () => {
		instanciate_template('basic');
	});

	vscode.commands.registerCommand('md407.new_crt', () => {
		instanciate_template('crt');
	});

	vscode.window.createTreeView(
		'md407-rates', {
		treeDataProvider: new BaudRateConfig(),
		canSelectMany: false,
	});

	vscode.window.createTreeView(
		'md407-actions', {
		treeDataProvider: new Actions(),
		canSelectMany: false,
	});

	const ports = new PortConfig();
	vscode.window.createTreeView(
		'md407-ports', {
		treeDataProvider: ports
	});

	vscode.commands.registerCommand('md407.reload_ports', (entry) => {
		ports.refresh();
	});
}

// this method is called when your extension is deactivated
export function deactivate() { }
