USAGE:

This template requires SimServer to be installed from gbgmv.se.
The C/C++ and Clang-format extensions are recommended but not required.

Windows users also need to install CodeLite from the same site.

Debian based Linux users require the following packages from the repo:

`gdb-multiarch` `make` `gcc-arm-none-eabi` `libnewlib-arm-none-eabi` `libnewlib-nano-arm-none-eabi`

Users of other distributions may need to update program names in `.vscode/launch.json`, `.vscode/tasks.json` and `makefile`

1. Install the Native Debug extension (by WebFreak) in Visual Studio Code
2. Open SimServer
3. Open the debug tab.
4. Select the appropriate profile for your platform.
5. Hit run.
    This should compile and start the program and break on entry into the main function

To add additional source files, just add them to the `FILES` variable in `makefile`. Make sure all lines but the last one end with `\`.

Users who prefer to use GDB directly in the terminal can copy in the .gdbinit file from the top level to automate loading and connecting to simserver
