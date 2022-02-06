#pragma once

#include "llvm_types.h"
#include "usart.h"

void set_faults();
extern "C" void fault();
extern "C" void __register_exitproc();
extern "C" void exit(int);
extern "C" void end();
__attribute__((naked)) __attribute__((section(".start_section"))) void
startup(void);
