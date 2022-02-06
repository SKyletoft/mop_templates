USAGE:

This Visual Studio Code template still requires Codelite and Simserver to be installed from gbgmv.se

1. Install the Native Debug extension (by WebFreak)
2. Open SimServer
3. Open the debug tab and run the Debug profile
    This should compile and start the program and break on entry into the main function

To add additional source files, just add them to the `FILES` variable in `makefile`. Make sure all lines but the last one end with `\`.
