/// main.c

#include "debug.h"
#include "startup.h"

void main(void) {
	long long x = 15;
	long long y = 13;
	long long z = x + y;
	if (z > 67) {
		x = 1;
	} else {
		y = 1;
	}

	print("\nHello world\n");
}
