# Add files here and remember the backslash on all but the last line
FILES := \
	src/main.c \
	src/startup.c \
	src/debug.c

#                       +---------------------------------------------------------------------------+
#                       |                                                                           |
#                       | If you're just using the templates, there's nothing to look at below this |
#                       |                                                                           |
#                       +---------------------------------------------------------------------------+

# Yes, this is hacky and doesn't allow anything to be cached. I'm not gonna do the research to figure that one out for programs of this scale.
# Merge requests welcome though

build:
	-mkdir debug
	arm-none-eabi-gcc -c $(FILES) -g -O0 \
		-Wall -Wextra -Wpedantic \
		-mthumb -march=armv6-m -mno-unaligned-access -mfloat-abi=soft \
		-std=gnu17 -I. -I ./inc
	arm-none-eabi-g++ -o debug/MOP -L. *.o -lgcc -lc_nano -Tmd407-ram.x -nostartfiles\
		-L 'C:/Program Files (x86)/GNU Arm Embedded Toolchain/10 2021.10/lib/gcc/arm-none-eabi/10.3.1/thumb/v6-m/nofp' \
		-L /usr/include/newlib/c++/9.2.1/arm-none-eabi/thumb/v6-m/nofp -L/usr/lib/arm-none-eabi/newlib/thumb/v6-m/nofp \
		-L /usr/lib/gcc/arm-none-eabi/9.2.1/thumb/v6-m/nofp
	arm-none-eabi-objcopy -S -O srec debug/MOP debug/MOP.s19
	arm-none-eabi-objdump -D -S debug/MOP > debug/MOP.dass
	-mv *.o debug   # Unix
	-move *.o debug # Windows

build-release:
	-mkdir release
	arm-none-eabi-gcc -c $(FILES) -g -Os \
		-Wall -Wextra -Werror \
		-mthumb -march=armv6-m -mno-unaligned-access -mfloat-abi=soft \
		-std=gnu17 -I. -I ./inc
	arm-none-eabi-g++ -o release/MOP -L. *.o -lgcc -lc_nano -Tmd407-ram.x -nostartfiles\
		-L 'C:/Program Files (x86)/GNU Arm Embedded Toolchain/10 2021.10/lib/gcc/arm-none-eabi/10.3.1/thumb/v6-m/nofp' \
		-L /usr/include/newlib/c++/9.2.1/arm-none-eabi/thumb/v6-m/nofp -L/usr/lib/arm-none-eabi/newlib/thumb/v6-m/nofp \
		-L /usr/lib/gcc/arm-none-eabi/9.2.1/thumb/v6-m/nofp
	arm-none-eabi-objcopy -S -O srec release/MOP release/MOP.s19
	arm-none-eabi-objdump -D -S release/MOP > release/MOP.dass
	-mv *.o release   # Unix
	-move *.o release # Windows

