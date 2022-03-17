import * as path from 'path';
import * as vscode from 'vscode';

export class CustomBuildTaskProvider implements vscode.TaskProvider {
	static CustomBuildScriptType = 'custombuildscript';
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
		return new vscode.Task(
			definition,
			vscode.TaskScope.Workspace,
			"Build for md407",
			CustomBuildTaskProvider.CustomBuildScriptType,
			new vscode.ShellExecution("make", ["build"], { env: { PATH: process.env.PATH + `:${root}/native_dependencies` } })
		);
	}
}
