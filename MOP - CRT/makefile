# Windows path
GCCPATH := C:/cseapp/CodeLite/tools/gcc-arm/bin

FILES := \
	main.c \
	startup_crt.c

build_windows:
	-mkdir debug
	$(GCCPATH)/arm-none-eabi-gcc -c $(FILES) -g -O0 -w -mthumb -march=armv6-m  -mfloat-abi=soft -std=gnu17 -I. -I.
	$(GCCPATH)/arm-none-eabi-g++ -o debug/MOP -L. *.o -lgcc -lc_nano  -Tmd407-ram-crt.x -LC:/cseapp/CodeLite/tools/gcc-arm/lib/gcc/arm-none-eabi/9.2.1/thumb/v6-m/nofp -nostartfiles
	$(GCCPATH)/arm-none-eabi-objcopy -S -O srec  debug/MOP debug/MOP.s19
	$(GCCPATH)/arm-none-eabi-objdump -D -S debug/MOP > debug/MOP.dass
	-rm *.o

build_linux:
	-mkdir debug
	arm-none-eabi-gcc -c $(FILES) -g -O0 -w -mthumb -march=armv6-m  -mfloat-abi=soft -std=gnu17 -I. -I.
	arm-none-eabi-g++ -o debug/MOP -L. *.o -lgcc -lc_nano  -Tmd407-ram-crt.x -L/usr/include/newlib/c++/9.2.1/arm-none-eabi/thumb/v6-m/nofp -L/usr/lib/arm-none-eabi/newlib/thumb/v6-m/nofp -L/usr/lib/gcc/arm-none-eabi/9.2.1/thumb/v6-m/nofp -nostartfiles
	arm-none-eabi-objcopy -S -O srec  debug/MOP debug/MOP.s19
	arm-none-eabi-objdump -D -S debug/MOP > debug/MOP.dass
	-rm *.o
