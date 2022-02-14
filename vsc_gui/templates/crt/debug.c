/// debug.c

#include "debug.h"

typedef struct {
	volatile unsigned short sr;
	volatile unsigned short _unused0;
	volatile unsigned short dr;
	volatile unsigned short _unused1;
	volatile unsigned short brr;
	volatile unsigned short _unused2;
	volatile unsigned short cr1;
	volatile unsigned short _unused3;
	volatile unsigned short cr2;
	volatile unsigned short _unused4;
	volatile unsigned short cr3;
	volatile unsigned short _unused5;
	volatile unsigned short gtpr;
} Usart;

#define USART1 ((Usart *) 0x40011000)

static void print_char(char c) {
	// write character to usart1
	while ((USART1->sr & 0x80) == 0)
		;
	USART1->dr = (unsigned short) c;
	if (c == '\n') {
		print_char('\r');
	}
}

void print(char *s) {
	while (*s != '\0') {
		print_char(*(s++));
	}
}
