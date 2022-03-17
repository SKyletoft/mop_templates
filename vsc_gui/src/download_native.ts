import * as vscode from 'vscode';
const fs = require('fs');
const https = require('https');
const unzip = require('adm-zip');
const request = require('request');
const progress = require('request-progress');

const ROOT: string = vscode.extensions.getExtension("skyletoft.md407-code")?.extensionPath || "";
const LINUX_URL: string = "https://u.dtek.se/mop_deps_linux";
const WINDOWS_URL: string = "https://u.dtek.se/mop_deps_windows";
const MAC_URL: string = "https://u.dtek.se/mop_deps_mac";

const TMP_FILE: string = ROOT + "/files.zip";

export function download() {
	// Todo: create native_deps folder
	const downloaded_before = fs.existsSync(ROOT + "/native_dependencies/done");
	if (downloaded_before) { return; }

	let url;
	switch (process.platform) {
		case "linux":
			url = LINUX_URL;
			break;
		case "win32":
			url = WINDOWS_URL;
			break;
		case "darwin":
			url = MAC_URL;
			break;
	}

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
			console.log(1);
			console.log(TMP_FILE);
			const zip = new unzip(TMP_FILE);
			console.log(3);
			zip.extractAllTo(ROOT + "/native_dependencies", true);
			console.log(4);
			fs.createWriteStream(ROOT + "/native_dependencies/done").close(); // Create file to mark that we don't need to redownload
			console.log(`File downloaded!`);
			vscode.window.showInformationMessage("File extracted");
		})
		.pipe(fs.createWriteStream(TMP_FILE));
}
