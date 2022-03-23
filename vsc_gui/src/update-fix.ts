import * as vscode from 'vscode';
import { EXTENSION_ROOT, FOLDER_NAME_REGEX, REGEX_LENGTH, WORKSPACE_ROOT } from './constants';

const fs = require('fs');

export function fix_gdb_paths() {
	const configs = find_configs(WORKSPACE_ROOT);

	for (const config of configs) {
		const contents: string = fs.readFileSync(config, 'utf8');
		const fixed: string = contents.split('"').map(fix_string).join('"');
		if (fixed !== contents) {
			fs.writeFileSync(config, fixed);
		}
	}

	console.log(configs);
}

function find_configs(src: string): string[] {
	return fs.readdirSync(src)
		.map((f: string) => {
			const file = `${src}/${f}`;
			if (f === "launch.json") {
				return [file];
			} else if (fs.lstatSync(file).isDirectory()) {
				return find_configs(file);
			} else {
				return [];
			}
		})
		.flat();
}

function fix_string(s: string): string {
	const matches = s.match(FOLDER_NAME_REGEX);
	if (matches === null || matches === undefined) {
		return s;
	}
	const index = matches.index ?? 0;
	const end = s.substring(index + matches[0].length);
	return `${EXTENSION_ROOT}${end}`;
}
