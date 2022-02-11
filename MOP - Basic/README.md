USAGE:

This template requires SimServer to be installed from gbgmv.se.
The Clangd (and not Microsoft's C/C++) and Clang-format extensions are recommended but not required.

Windows users also need to install CodeLite from the same site.

Debian based Linux users require the following packages from the repo:

`gdb-multiarch` `make` `gcc-arm-none-eabi` `libnewlib-arm-none-eabi` `libnewlib-nano-arm-none-eabi`

Users of other distributions may need to update program names in `.vscode/launch.json`, `.vscode/tasks.json` and `makefile`

All linux users need to make sure they have non-sudo access to `/dev/ttyUSB*`. This is typically done by adding your current user to the `dialout` group.

Simserver instructions
1. Install the Native Debug extension (by WebFreak) in Visual Studio Code
2. Open SimServer
3. Open the debug tab.
4. Select the appropriate profile for your platform.
5. Hit run.
    This should compile and start the program and break on entry into the main function

Hardware instructions
1. Hit Ctrl + Shift + P and type `Run Task`
2. Select query_linux/windows
3. Edit the `LINUX`/`WINDOWS_PORT` variable in `makefile` to reflect the query output. Hopefully the default is already correct
4. Hit Ctrl + Shift + P and type `Run Task`
5. Press the reset button on the md407
6. Select `run_hardware_linux`/`windows`
    This should compile and start the program on the md407. Type `go` to start your program or `dbg` to use the hardware debugging capabilities


To add additional source files, just add them to the `FILES` variable in `makefile`. Make sure all lines but the last one end with `\`.

Users who prefer to use GDB directly in the terminal can copy in the .gdbinit file from the top level to automate loading and connecting to simserver
