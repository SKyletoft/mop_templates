// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
const fs = require('fs');
const comment_json = require('comment-json');

const extension_root: string = vscode.extensions.getExtension("skyletoft.md407-code")?.extensionPath || "";
let workspace_root: string = vscode.workspace.workspaceFolders?.map((folder) => folder.uri.path)[0] || "~";

// WHY, NodeJS, WHY!?
if (process.platform === "win32" && workspace_root.startsWith("/")) {
	workspace_root = workspace_root.substring(1);
}

export function instanciate_template(template_name: string, new_name: string) {
	console.log(new_name);

	const vscode_path = `${workspace_root}/.vscode`;
	if (!fs.existsSync(vscode_path)) {
		fs.mkdirSync(vscode_path);
	}

	const launch_path = `${workspace_root}/.vscode/launch.json`;
	if (!fs.existsSync(launch_path)) {
		fs.copyFileSync(`${extension_root}/templates/.vscode/launch.json`, launch_path);
	}
	let file = fs.readFileSync(launch_path, "utf-8");
	let launch = comment_json.parse(file);
	const new_config = {
		linux: {
			// Needs to be arm-none-eabi-gdb on non Debian
			gdbpath: "gdb-multiarch"
		},
		windows: {
			gdbpath: "arm-none-eabi-gdb"
		},
		name: `${new_name} - SimServer`,
		type: "gdb",
		request: "attach",
		executable: `${new_name}/debug/MOP`,
		target: ":1234",
		remote: true,
		cwd: "${workspaceRoot}",
		valuesFormatting: "parseText",
		autorun: [
			`file ${new_name}/debug/MOP`,
			"target extended-remote :1234",
			"load",
			"monitor restart",
			"b main",
		],
		preLaunchTask: `build ${new_name}`
	};
	launch.configurations = launch.configurations.concat(new_config);
	file = comment_json.stringify(launch, null, '\t');
	fs.writeFileSync(launch_path, file);

	const tasks_path = `${workspace_root}/.vscode/tasks.json`;
	if (!fs.existsSync(tasks_path)) {
		fs.copyFileSync(`${extension_root}/templates/.vscode/tasks.json`, tasks_path);
	}
	file = fs.readFileSync(tasks_path, "utf-8");
	let tasks = comment_json.parse(file);
	const new_task = {
		type: "md407-build",
		problemMatcher: [],
		label: `build ${new_name}`,
		directory: new_name,
		group: {
			kind: "build",
			isDefault: false
		}
	};
	tasks.tasks = tasks.tasks.concat(new_task);
	file = comment_json.stringify(tasks, null, '\t');
	fs.writeFileSync(tasks_path, file);

	const src = extension_root + "/templates/" + template_name;
	const dest = `${workspace_root}/${new_name}`;
	fs.mkdirSync(dest);
	copy_folder(src, dest);
}


function copy_folder(src: string, dest: string) {
	const files = fs.readdirSync(src);

	for (const file of files) {
		const full_src = `${src}/${file}`;
		const full_dest = `${dest}/${file}`;
		if (fs.lstatSync(full_src).isDirectory()) {
			fs.mkdirSync(full_dest);
			copy_folder(full_src, full_dest);
		} else {
			fs.copyFileSync(full_src, full_dest);
		}
	}
}
