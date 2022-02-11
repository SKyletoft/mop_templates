{ pkgs ? import <nixpkgs> {} }:
let
	custom-node = pkgs.nodejs.withPackages(pkgs: with pkgs; [
		yo
	]);
in pkgs.mkShell {
	# nativeBuildInputs is usually what you want -- tools you need to run
	nativeBuildInputs = with pkgs; [
		nodejs
		nodePackages.yo
		nodePackages.generator-code
	];
	shellHook = ''
		PS1="\e[32;1mnix-shell: \e[34m\w \[\033[00m\]\n↳ "
		run () { ghc $1 -o a.out; ./a.out; }
	'';
}

