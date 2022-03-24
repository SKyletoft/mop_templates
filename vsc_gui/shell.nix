{ pkgs ? import <nixpkgs> {} }:
let
	# node2nix -i <(echo '["vsce", "esbuild", "yo", "generator-code", "prebuild-install"]') --include-peer-dependencies
	custom_npm = import ./vsce_nix/default.nix {};
in pkgs.mkShell {
	buildInputs = with pkgs; [  ];	
	nativeBuildInputs = with pkgs; [
		custom_npm.yo
		custom_npm.generator-code
		custom_npm.esbuild
		custom_npm.prebuild-install
		custom_npm.vsce

		pkgconfig
		libsecret.dev
		libsecret.out
		nodejs
		clang-tools # Clang format
	];
	shellHook = ''
		ln -s $NODE_PATH node_modules
		PS1="\e[32;1mnix-shell: \e[34m\w \[\033[00m\]\n↳ "
	'';
}
