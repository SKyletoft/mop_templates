{ pkgs ? import <nixpkgs> {} }:
pkgs.mkShell rec {
	buildInputs = with pkgs; [
		libudev
	];
	nativeBuildInputs = with pkgs; [
		pkg-config
		rustup
	];
	shellHook = ''
		PS1="\e[32;1mnix-shell: \e[34m\w \[\033[00m\]\n↳ "
	'';
}
