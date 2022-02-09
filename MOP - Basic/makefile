# Yes, these are hacky and don't allow anything to be cached. I'm not gonna do the research to figure that one out for programs of this scale.
# Merge requests welcome though

# Windows path
GCCPATH := C:/cseapp/CodeLite/tools/gcc-arm/bin
RUN     := ".\.vscode\windows_hardware_deps\net6.0\win-x86\MOP - Basic.exe"
FILES := \
	main.c \
	startup.c

build_windows:
	-mkdir debug
	$(GCCPATH)/arm-none-eabi-gcc -c $(FILES) -g -O0 -w -mthumb -march=armv6-m -mno-unaligned-access -mfloat-abi=soft -std=gnu17 -I. -I.
	$(GCCPATH)/arm-none-eabi-g++ -o debug/MOP -L. *.o -lgcc -lc_nano  -Tmd407-ram.x -LC:/cseapp/CodeLite/tools/gcc-arm/lib/gcc/arm-none-eabi/9.2.1/thumb/v6-m/nofp -nostartfiles
	$(GCCPATH)/arm-none-eabi-objcopy -S -O srec  debug/MOP debug/MOP.s19
	$(GCCPATH)/arm-none-eabi-objdump -D -S debug/MOP > debug/MOP.dass
	-rm *.o

build_linux:
	-mkdir debug
	arm-none-eabi-gcc -c $(FILES) -g -O0 -w -mthumb -march=armv6-m -mno-unaligned-access -mfloat-abi=soft -std=gnu17 -I. -I.
	arm-none-eabi-g++ -o debug/MOP -L. *.o -lgcc -lc_nano  -Tmd407-ram.x -L/usr/include/newlib/c++/9.2.1/arm-none-eabi/thumb/v6-m/nofp -L/usr/lib/arm-none-eabi/newlib/thumb/v6-m/nofp -L/usr/lib/gcc/arm-none-eabi/9.2.1/thumb/v6-m/nofp -nostartfiles
	arm-none-eabi-objcopy -S -O srec  debug/MOP debug/MOP.s19
	arm-none-eabi-objdump -D -S debug/MOP > debug/MOP.dass
	-rm *.o

run_windows:
	C:/cseapp/CodeLite/mingw32-make build_windows
	$(RUN) load ./debug/MOP.s19
	$(RUN) go
