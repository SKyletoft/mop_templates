# MD407 Templates for use outside of CodeLite

## Usage

**Linux users need to add their user to the `dialout` group or equivalent and reboot (really reboot, for once logging out and in again is not enough). The equivalent on Arch is `uucp`.**

Open VSC in an empty folder and hit `Ctrl + Shift + P` and type `Create new project from Basic template`. Then enter your project name.

You can now run the default program in SimServer by opening SimServer, then going to the debugging tab, selecting your project and hitting the green arrow.

You can also run the default program on Hardware by going to the MD407 Config tab (added by the extension), selecting the port under the ports section and then hitting `Interactive`, `Compile` and `Load` in order and then typing `go` in the now opened terminal. Remember to reset the MD407 between runs. MacOS requires resets between load and `go`.

## Required packages for Linux users (bundled for Windows/Mac)

### Debian based systems

* `gdb-multiarch`
* `make`
* `gcc-arm-none-eabi`
* `libnewlib-arm-none-eabi`
* `libnewlib-nano-arm-none-eabi`

### Arch based systems

* `arm-none-eabi-gdb` (needs to be aliased to `gdb-multiarch` or have `.vscode/launch.json` changed)
* `arm-none-eabi-gcc`
* `arm-none-eabi-newlib`

## External Links

[SimServer and Eterm8](http://gbgmv.se/studies.html#machprog)

## Changelog

* *1.0.2*

	Added option to uninstall the toolchain (will still try to download on launch though)

	Stop project names from containing spaces

	Fix for hardcoded gdb path with version number.
	(Well, it's still there, because of technical reasons, but it's now automatically updated)
	
	Updated generated readmes to contain more up to date instructions

* *1.0.1*
	
	Fixed readme

* *1.0.0*
	
	Initial release
