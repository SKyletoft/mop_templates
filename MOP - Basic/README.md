USAGE:

Same dependencies as the VSC extension:

* The GCC Cross-compilation toolchain
* make
* SimServer
* md407_win_rs (download on the releases page) / the traditional script / eterm8 (**doesn't work on linux with larger files**)

Edit your code in whatever you like
Compile with `make -s build`
Run in SimServer by opening SimServer and starting gdb from this folder
Run on hardware by uploading the .s19 file to the device and running `go`. The `--help` page should explain it well enough

Please use clang-format and clang-tidy for your own sanity if this is your first time using C.

