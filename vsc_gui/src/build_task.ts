import * as path from 'path';
import * as vscode from 'vscode';

interface CustomBuildTaskDefinition extends vscode.TaskDefinition {
	/// The directory containing the makefile. Directly corresponds with `make -C`
	directory: string;
}

export class CustomBuildTaskProvider implements vscode.TaskProvider {
	static CustomBuildScriptType = "md407-build";
	private tasks: vscode.Task[] | undefined;

	constructor(private workspaceRoot: string) { }

	public async provideTasks(): Promise<vscode.Task[]> {
		return this.getTasks();
	}

	public resolveTask(_task: vscode.Task): vscode.Task | undefined {
		const directory: string = _task.definition.directory;
		if (directory) {
			const definition: CustomBuildTaskDefinition = <any>_task.definition;
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

	private getTask(definition?: CustomBuildTaskDefinition): vscode.Task {
		if (definition === undefined) {
			definition = {
				type: CustomBuildTaskProvider.CustomBuildScriptType,
				directory: "."
			};
		}

		return new vscode.Task(
			definition,
			vscode.TaskScope.Workspace,
			"Build for md407",
			CustomBuildTaskProvider.CustomBuildScriptType,
			new vscode.ShellExecution("make", ["-C", definition.directory])
		);
	}
}
