@
@    mom1.asm
@

.section text.start_section
start:	LDR	R0,=0x55555555
	LDR	R1,=0x40020C00
	STR	R0,[R1]

	LDR	R1,=0x40020C14
	LDR	R2,=0x40021010

.section text.text
main:	LDR	R0,[R2]
	STR	R0,[R1]
	B	main
