import { stringify } from 'querystring';
import * as vscode from 'vscode';
const fs = require('fs');
const https = require('https');
const unzip = require('adm-zip');
const request = require('request');
const progress = require('request-progress');

const ROOT: string = vscode.extensions.getExtension("skyletoft.md407-code")?.extensionPath || "";
const LINUX_URL: string = "https://github.com/SKyletoft/cross_gcc_distrubution/releases/download/v10.3.1/linux_deps.zip";
const WINDOWS_URL: string = "https://github.com/SKyletoft/cross_gcc_distrubution/releases/download/v10.3.1/windows_deps.zip";
const MAC_URL: string = "https://github.com/SKyletoft/cross_gcc_distrubution/releases/download/v10.3.1/mac_deps.zip";

const TMP_FILE: string = ROOT + "/native_dependencies/files.zip";
const NATIVE_FOLDER: string = ROOT + "/native_dependencies";
const DONE: string = ROOT + "/native_dependencies/done";

export function uninstall() {
	fs.rmdirSync(NATIVE_FOLDER, { recursive: true });
	vscode.window.showInformationMessage("Uninstalled");
}

export function download() {
	const downloaded_before = fs.existsSync(DONE);
	if (downloaded_before) {
		console.log("Already downloaded, cancelling download");
		return;
	}

	if (!fs.existsSync(NATIVE_FOLDER)) {
		fs.mkdirSync(NATIVE_FOLDER);
	}

	let url: string;
	switch (process.platform) {
		case "linux":
			url = LINUX_URL;
			break;
		case "darwin":
			url = MAC_URL;
			break;
		default:
			url = WINDOWS_URL;
			break;
	}

	console.log(`Downloading: ${url}`);

	vscode.window.showInformationMessage("Download started, progress bar may not show up");

	return vscode.window.withProgress({
		location: vscode.ProgressLocation.Notification,
		title: "Downloading GCC toolchain",
		cancellable: true
	}, (vsc_progress, token) => {
		token.onCancellationRequested(() => {
			console.log("Download cancelled");
		});

		vsc_progress.report({ increment: 0 });

		const p = new Promise<void>(resolve => {
			let last = 0;
			progress(request(url))
				.on('progress', function (state: any) {
					console.log('progress', state.percent);
					const delta = state.percent - last;
					last = state.percent;
					vsc_progress.report({ increment: delta * 100 });
				})
				.on('error', function (err: any) {
					vscode.window.showErrorMessage("Download failed");
					console.log("Error: ", err.message);
				})
				.on('end', () => {
					vscode.window.showInformationMessage("Download complete");
					const zip = new unzip(TMP_FILE);
					zip.extractAllTo(NATIVE_FOLDER, true);
					console.log(`File extracted!`);
					vscode.window.showInformationMessage("File extracted");

					mark_executables(NATIVE_FOLDER);

					fs.createWriteStream(DONE).close(); // Create file to mark that we don't need to redownload
					vscode.window.showInformationMessage("Setup complete");

					resolve();
				})
				.pipe(fs.createWriteStream(TMP_FILE));
		});

		return p;
	});
}

/// Returns true if the name ends with ".exe" or doesn't contain a "." at all
function is_executable(file: string) {
	// Better solution: Check if a file starts with the magic values for ELF, EXE or a Shebang
	if (file.endsWith(".exe") || file.endsWith(".elf")) { return true; }
	const name_starts_at = Math.max(file.lastIndexOf("/"), file.lastIndexOf("\\"));
	const name = file.substring(name_starts_at);
	return name.indexOf(".") === -1;
}

/// Recursively finds executables and sets the executable bit (relevant for Unix systems)
function mark_executables(path: string) {
	const files = fs.readdirSync(path);

	for (const file of files) {
		const full_file = `${path}/${file}`;
		if (fs.lstatSync(full_file).isDirectory()) {
			mark_executables(full_file);
		} else if (is_executable(full_file)) {
			console.log(`modding ${file}`);
			fs.chmodSync(full_file, 0o777);
		} else {
			console.log(`leaving ${file} alone`);
		}
	}
}
