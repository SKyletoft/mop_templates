import * as path from 'path';
import * as vscode from 'vscode';

export class CustomBuildTaskProvider implements vscode.TaskProvider {
	static CustomBuildScriptType = "md407-build";
	private tasks: vscode.Task[] | undefined;

	constructor(private workspaceRoot: string) { }

	public async provideTasks(): Promise<vscode.Task[]> {
		return this.getTasks();
	}

	public resolveTask(_task: vscode.Task): vscode.Task | undefined {
		const flavor: string = _task.definition.flavor;
		if (flavor) {
			const definition: vscode.TaskDefinition = <any>_task.definition;
			return this.getTask(definition);
		}
		return undefined;
	}

	private getTasks(): vscode.Task[] {
		if (this.tasks === undefined) {
			this.tasks = [this.getTask()];
		}
		return this.tasks;
	}

	private getTask(definition?: vscode.TaskDefinition): vscode.Task {
		if (definition === undefined) {
			definition = {
				type: CustomBuildTaskProvider.CustomBuildScriptType
			};
		}
		const root = vscode.extensions.getExtension("skyletoft.md407-code")?.extensionPath || "";
		const var_separator = process.platform === "win32" ? ";" : ":";
		const path_separator = process.platform === "win32" ? "\\" : "/";
		console.log(root);
		return new vscode.Task(
			definition,
			vscode.TaskScope.Workspace,
			"Build for md407",
			CustomBuildTaskProvider.CustomBuildScriptType,
			new vscode.ShellExecution("make", [], {
				env: { PATH: process.env.PATH + `${var_separator}${root}${path_separator}native_dependencies/bin` }
			})
		);
	}
}
