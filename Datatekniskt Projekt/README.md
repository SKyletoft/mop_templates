USAGE:

This is a cross platform file
Windows and Mac rely on the toolchain from codelite, other (= Linux/*BSD) rely on the toolchains being on $PATH

This template does not support in-vsc debugging

All shared code lives in the `shared`, the provided library lives in the `lib` folder. All device specific code goes in a copy of `specific_unit` for that device.

Source files are added to the makefile at the appropriate place. Note that `SRC` files are compiled as C++ and `LIB_SRC` as C.

The `shared/src/fault.cpp` file is included to handle oddities with embedded C++ and various linker errors caused by using C++ instead of C. This file must always be included in a build.

To build an executable, run `make build` in the `specific_unit` folder for debug mode and `make build-release` for release mode.

Linux users are recommended to use https://github.com/Enayaaa/md407 instead of Eterm8 to communicate with the MD407 board
