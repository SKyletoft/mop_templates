# Yes, these are hacky and don't allow anything to be cached. I'm not gonna do the research to figure that one out for programs of this scale.
# Merge requests welcome though

FILES := \
	main.c \
	startup.c

WINDOWS_PORT := COM3
LINUX_PORT := /dev/ttyUSB0

#                       +---------------------------------------------------------------------------+
#                       |                                                                           |
#                       | If you're just using the templates, there's nothing to look at below this |
#                       |                                                                           |
#                       +---------------------------------------------------------------------------+

GCCPATH := C:/cseapp/CodeLite/tools/gcc-arm/bin
RUN_W   := "./.vscode/hardware-com-windows.exe"
RUN_L   := "./.vscode/hardware-com-linux"

build_windows:
	-mkdir debug
	-cls
	$(GCCPATH)/arm-none-eabi-gcc -c $(FILES) -g -O0 -w -mthumb -march=armv6-m -mno-unaligned-access -mfloat-abi=soft -std=gnu17 -I. -I.
	$(GCCPATH)/arm-none-eabi-g++ -o debug/MOP -L. *.o -lgcc -lc_nano  -Tmd407-ram.x -LC:/cseapp/CodeLite/tools/gcc-arm/lib/gcc/arm-none-eabi/9.2.1/thumb/v6-m/nofp -nostartfiles
	$(GCCPATH)/arm-none-eabi-objcopy -S -O srec  debug/MOP debug/MOP.s19
	$(GCCPATH)/arm-none-eabi-objdump -D -S debug/MOP > debug/MOP.dass
	-rm *.o

build_linux:
	-mkdir debug
	-clear
	arm-none-eabi-gcc -c $(FILES) -g -O0 -w -mthumb -march=armv6-m -mno-unaligned-access -mfloat-abi=soft -std=gnu17 -I. -I.
	arm-none-eabi-g++ -o debug/MOP -L. *.o -lgcc -lc_nano  -Tmd407-ram.x -L/usr/include/newlib/c++/9.2.1/arm-none-eabi/thumb/v6-m/nofp -L/usr/lib/arm-none-eabi/newlib/thumb/v6-m/nofp -L/usr/lib/gcc/arm-none-eabi/9.2.1/thumb/v6-m/nofp -nostartfiles
	arm-none-eabi-objcopy -S -O srec  debug/MOP debug/MOP.s19
	arm-none-eabi-objdump -D -S debug/MOP > debug/MOP.dass
	-rm *.o

run_windows:
	C:/cseapp/CodeLite/mingw32-make build_windows
	-cls
	$(RUN_W) load -p $(WINDOWS_PORT) -f debug/MOP.s19
	$(RUN_W) interactive -p $(WINDOWS_PORT)

run_linux:
	make build_linux
	-clear
	$(RUN_L) load -p $(LINUX_PORT) -f debug/MOP.s19
	$(RUN_L) interactive -p $(LINUX_PORT)

query_windows:
	-cls
	$(RUN_W) query

query_linux:
	-clear
	$(RUN_L) query
