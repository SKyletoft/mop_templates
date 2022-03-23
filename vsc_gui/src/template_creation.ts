// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {WORKSPACE_ROOT, EXTENSION_ROOT} from './constants';
const fs = require('fs');
const comment_json = require('comment-json');


export function instanciate_template(template_name: string, new_name: string) {
	console.log(new_name);
	new_name = new_name.replaceAll(" ", "_");

	const vscode_path = `${WORKSPACE_ROOT}/.vscode`;
	if (!fs.existsSync(vscode_path)) {
		fs.mkdirSync(vscode_path);
	}

	const launch_path = `${WORKSPACE_ROOT}/.vscode/launch.json`;
	if (!fs.existsSync(launch_path)) {
		fs.copyFileSync(`${EXTENSION_ROOT}/templates/.vscode/launch.json`, launch_path);
	}
	let file = fs.readFileSync(launch_path, "utf-8");
	let launch = comment_json.parse(file);
	const new_config = {
		linux: {
			// Needs to be arm-none-eabi-gdb on non Debian
			gdbpath: "gdb-multiarch"
		},
		windows: {
			// This is horrid, but as the debugger is a different extension, it cannot read changes we make to $PATH
			gdbpath: `${EXTENSION_ROOT}/native_dependencies/bin/arm-none-eabi-gdb.exe`
		},
		osx: {
			gdbpath: `${EXTENSION_ROOT}/native_dependencies/bin/arm-none-eabi-gdb`
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

	const tasks_path = `${WORKSPACE_ROOT}/.vscode/tasks.json`;
	if (!fs.existsSync(tasks_path)) {
		fs.copyFileSync(`${EXTENSION_ROOT}/templates/.vscode/tasks.json`, tasks_path);
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

	const src = EXTENSION_ROOT + "/templates/" + template_name;
	const dest = `${WORKSPACE_ROOT}/${new_name}`;
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
