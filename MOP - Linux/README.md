USAGE:

Please note that this version is for Debian-based systems.
Other distros might have different names for the packages, both in the repos and when installed. (For example: `gdb-arm-none-eabi` on Fedora)
This will require changes in `.vscode/launch.json`, `.vscode/tasks.json` and `makefile`

This Visual Studio Code template still requires Simserver to be installed from gbgmv.se
Required packages from the repos are: `gdb-multiarch` `make` `gcc-arm-none-eabi` `libnewlib-arm-none-eabi` `libnewlib-nano-arm-none-eabi`

1. Install the Native Debug extension (by WebFreak)
2. Open SimServer
3. Open the debug tab and run the Debug profile
    This should compile and start the program and break on entry into the main function

To add additional source files, just add them to the `FILES` variable in `makefile`. Make sure all lines but the last one end with `\`.
