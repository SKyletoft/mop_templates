/// startup_crt.c
/// includes: _crt_init, _crt_deinit, _sbrk for malloc-support.
/// template functions for stdio:
#include "startup_crt.h"

__attribute__((naked)) __attribute__((section(".start_section"))) void startup(void) {
	__asm__ volatile(" LDR R0,=__stack_top\n"); /* set stack */
	__asm__ volatile(" MOV SP,R0\n");
	__asm__ volatile(" BL _crt_init\n");   /* init C-runtime library */
	__asm__ volatile(" BL main\n");        /* call main */
	__asm__ volatile(" BL _crt_deinit\n"); /* deinit C-runtime library */
	__asm__ volatile(".L1: B .L1\n");      /* never return */
}

static char *heap_end;

char *_sbrk(int incr) {
	extern char __heap_low; /* Defined by the linker */
	extern char __heap_top; /* Defined by the linker */
	char *      prev_heap_end;
	if (heap_end == 0) {
		heap_end = &__heap_low;
	}
	prev_heap_end = heap_end;
	if (heap_end + incr > &__heap_top) {
		errno = ENOMEM;
		return (char *) -1;
	}
	heap_end += incr;
	return (char *) prev_heap_end;
}

__attribute__((used)) /* Will be optimised away otherwise... */
volatile static void
_crt_init() {
	extern char __heap_low;    /* Defined by the linker */
	extern char __heap_top;    /* Defined by the linker */
	extern char __bss_start__; /* Defined by the linker */
	extern char __bss_end__;   /* Defined by the linker */
	char *      s;
	heap_end = 0;
	s        = &__bss_start__;
	while (s < &__bss_end__)
		*s++ = 0;
	s = &__heap_low;
	while (s < &__heap_top)
		*s++ = 0;
}

__attribute__((used)) /* Will be optimised away otherwise... */
volatile static void
_crt_deinit() {}

/* STDIO-templates */
int _close(int file) {
	return -1;
}
int _open(const char *name, int flags, int mode) {
	return -1;
}
int _isatty(int file) {
	return 1;
}
int _fstat(int file, struct stat *st) {
	st->st_mode = S_IFCHR;
	return 0;
}
int _lseek(int file, int ptr, int dir) {
	return 0;
}
int _read(int file, char *ptr, int len) {
	return 0;
}
int _write(int file, char *ptr, int len) {
	return 0;
}
