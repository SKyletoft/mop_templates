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

export function download() {
	const downloaded_before = fs.existsSync(DONE);
	if (downloaded_before) {
		console.log("Already downloaded, cancelling download");
		return;
	}

	if (!fs.existsSync(NATIVE_FOLDER)) {
		fs.mkdirSync(NATIVE_FOLDER);
	}

	let url;
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
	vscode.window.showInformationMessage("Download starting (~200MB, and I don't have a progress bar yet)");
	progress(request(url))
		.on('progress', function (state: any) {
			console.log('progress', state.percent);
		})
		.on('error', function (err: any) {
			vscode.window.showErrorMessage("Download failed");
			console.log("Error: ", err.message);
		})
		.on('end', () => {
			vscode.window.showInformationMessage("Download complete");
			const zip = new unzip(TMP_FILE);
			zip.extractAllTo(NATIVE_FOLDER, true);
			fs.createWriteStream(DONE).close(); // Create file to mark that we don't need to redownload
			console.log(`File extracted!`);
			vscode.window.showInformationMessage("File extracted");
		})
		.pipe(fs.createWriteStream(TMP_FILE));
}
