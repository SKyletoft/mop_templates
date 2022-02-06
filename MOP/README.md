USAGE:

This template requires SimServer to be installed from gbgmv.se. Windows users also need to install CodeLite from the same site.

1. Install the Native Debug extension (by WebFreak) in Visual Studio Code
2. Open SimServer
3. Open the debug tab.
4. Select the appropriate profile for your platform.
5. Hit run.
    This should compile and start the program and break on entry into the main function

To add additional source files, just add them to the `FILES` variable in `makefile`. Make sure all lines but the last one end with `\`.
