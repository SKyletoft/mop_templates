GCCPATH := C:/cseapp/CodeLite/tools/gcc-arm/bin

FILES := \
	main.c \
	startup.c

build:
	-mkdir debug
	$(GCCPATH)/arm-none-eabi-gcc -c $(FILES) -g -O0 -w -mthumb -march=armv6-m  -mfloat-abi=soft -std=gnu17 -I. -I.
	$(GCCPATH)/arm-none-eabi-g++ -o debug/MOP -L. *.o -lgcc -lc_nano  -Tmd407-ram.x -LC:/cseapp/CodeLite/tools/gcc-arm/lib/gcc/arm-none-eabi/9.2.1/thumb/v6-m/nofp -nostartfiles
	$(GCCPATH)/arm-none-eabi-objcopy -S -O srec  debug/MOP debug/MOP.s19
	$(GCCPATH)/arm-none-eabi-objdump -D -S debug/MOP > debug/MOP.dass
	-rm *.o

clean:
	rm -rf debug
	mkdir debug
	touch debug/startup.c.o
