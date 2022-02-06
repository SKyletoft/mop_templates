#pragma once
/*
 * 	startup-crt.c
 *  includes: _crt_init, _crt_deinit, _sbrk for malloc-support.
 *  template functions for stdio:
 */
#include <errno.h>
#include <stdio.h>
#include <stdlib.h>
#include <sys/stat.h>
#include <unistd.h>

__attribute__((naked)) __attribute__((section(".start_section"))) void startup(void);
char *_sbrk(int incr);
__attribute__((used))
volatile static void
_crt_init();
__attribute__((used))
volatile static void
_crt_deinit();

/* STDIO-templates */
int _close(int file);
int _open(const char *name, int flags, int mode);
int _isatty(int file);
int _fstat(int file, struct stat *st);
int _lseek(int file, int ptr, int dir);
int _read(int file, char *ptr, int len);
int _write(int file, char *ptr, int len);
