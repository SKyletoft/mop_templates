#                       +-------------------------------------------------------------------- +
#                       |                                                                     |
#                       | If you're just using the templates, there's nothing to look at here |
#                       |                                                                     |
#                       +---------------------------------------------------------------------+

# Yes, this is hacky and doesn't allow anything to be cached. I'm not gonna do the research to figure that one out for programs of this scale.
# Merge requests welcome though

build:
	-mkdir debug
	-cls
	-clear
	arm-none-eabi-gcc -c *.c -g -O0 -w -mthumb -march=armv6-m -mno-unaligned-access -mfloat-abi=soft -std=gnu17 -I. -I ./inc
	arm-none-eabi-g++ -o debug/MOP -L. *.o -lgcc -lc_nano  -Tmd407-ram.x  -nostartfiles
	arm-none-eabi-objcopy -S -O srec  debug/MOP debug/MOP.s19
	arm-none-eabi-objdump -D -S debug/MOP > debug/MOP.dass
	-rm *.o
	-del *.o
	echo Success
