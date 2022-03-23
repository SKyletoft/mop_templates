import * as vscode from 'vscode';
import { EXTENSION_ROOT, FOLDER_NAME_REGEX, REGEX_LENGTH, WORKSPACE_ROOT } from './constants';

export function fix_gdb_paths() {

}

function fix_string(s: string): string {
	const matches = s.match(FOLDER_NAME_REGEX);
	if (matches === null || matches === undefined) {
		return s;
	}
	const end = s.substring(matches.index ?? 0 + matches[0].length);
	return `${EXTENSION_ROOT}${end}`;
}
