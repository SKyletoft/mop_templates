USAGE:

This template requires SimServer to be installed from gbgmv.se.

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
1. Open the `MD407 Config` tab
2. Set port. Hopefully there'll only be one to choose from, but if there are several you will just have to try them all
3. Press `Do` next to `Compile`, `Load` and `Interactive` in that order. Wait for `Load` to complete before starting `Interactive`
4. Type `go` in the terminal
