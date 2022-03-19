# MD407 Templates for use outside of CodeLite

## VS Code users:

Install the extension from the releases page, along with SimServer from gbgmv.se.

**Linux users need to add their user to the `dialout` group or equivalent and reboot (really reboot, for once logging out and in again is not enough). The equivalent on Arch is `uucp`.**

Open VSC in an empty folder and hit `Ctrl + Shift + P` and type `Create new project from Basic template`. Then enter your project name.

You can now run the default program in SimServer by opening SimServer, then going to the debugging tab, selecting your project and hitting the green arrow.

You can also run the default program on Hardware by going to the MD407 Config tab (added by the extension), selecting the port under the ports section and then hitting `Interactive`, `Compile` and `Load` in order and then typing `go` in the now opened terminal. Remember to reset the MD407 between runs. MacOS requires resets between load and `go`.

### Recommended extensions

* clangd by LLVM
* Clang-Format by xaver

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

## VIM / NeoVIM / CLion / Emacs / etc.

Copy the `Basic` folder into your project. Run `make build` to build your project. Do simserver debugging directly in gdb. TUI mode is recommended (`tui enable`), though it's only available on Linux. The `gdbinit` file is provided to automatically run the commands to connect to SimServer.

To communicate with the hardware, the `md407_win_rs` program is provided. Either download it from the releases page or compile it yourself and install with `cargo-install` like any other Rust program. On linux you either need to run it as root or add yourself to the `dialout` group.

## External Links

[SimServer and Eterm8](http://gbgmv.se/studies.html#machprog)

[GCC 10 for Windows/MacOS](https://developer.arm.com/tools-and-software/open-source-software/developer-tools/gnu-toolchain/gnu-rm/downloads)
> Note that while GCC 11 is out, there are issues with it

[Make for Windows](https://github.com/mbuilov/gnumake-windows/raw/d6f3ed158d476c0a509583a6ff09351fbc85505f/gnumake-4.3.exe)
