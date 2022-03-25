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
	arm-none-eabi-as *.s -g3
	arm-none-eabi-ld a.out -T md407-ram.x -o debug/MOP
	arm-none-eabi-objcopy -S -O srec  debug/MOP debug/MOP.s19
	arm-none-eabi-objdump -D -S debug/MOP > debug/MOP.dass
	-rm *.out
	-del *.o
	echo Success
