#include "fault.h"

void set_faults() {
	*(VoidFunction *) 0x2001'C010 = fault; // Segfault
	*(VoidFunction *) 0x2001'C014 = fault; // Bus fault
	*(VoidFunction *) 0x2001'C018 = fault; // Unaligned fault

	// Clear UNALGIN_TRP to allow unaligned memory read/write
	volatile u32 *ccr = (volatile u32 *) 0xE000'ED14;
	*ccr &= ~(1 << 3);
}

extern "C" void fault() {
	for (;;) {}
}

extern "C" void __register_exitproc(void) {
}

extern "C" void exit(int _) {
	for (;;) {}
}

extern "C" void end() {
	for (;;) {}
}

__attribute__((naked)) __attribute__((section(".start_section"))) void
startup(void) {
	__asm volatile(" LDR R0,=0x2001C000\n" // Load default stack pointer value
	               " MOV SP,R0\n"          // Actually set stack pointer
	               " BL main\n"            // call main
	               "_exit: B .\n"          // never return
	);
}
