#
# Created by Jonathan Widén on 2021-09-10.
# makefile with four jobs:
# * build (to make a debug build)
# * build-release (to make a release build)
# * clean (to clean output directories)
#
# Backported to my "original" version (totally not mostly stolen from codelite) by Samuel Kyletoft on 14/9-21.
# Non-mac unix now relies on $PATH.
# Removed the all build because it's stupid
# Also put all my alignment back so I can actually read it
# Added C++ support
#

SHARED   := ../shared
LIB      := ../lib
SRC      := \
	src/specific_unit.cpp \
	$(SHARED)/src/fault.cpp
LIB_SRC  := \
	$(LIB)/src/misc.c \
	$(LIB)/src/stm32f4xx_gpio.c \
	$(LIB)/src/stm32f4xx_usart.c \
	$(LIB)/src/stm32f4xx_rcc.c \
	$(LIB)/src/stm32f4xx_exti.c \
	$(LIB)/src/stm32f4xx_syscfg.c \
	$(LIB)/src/stm32f4xx_tim.c \
	$(LIB)/src/stm32f4xx_can.c \
	$(LIB)/src/stm32f4xx_rng.c
INCLUDES := \
	-isystem $(LIB)/inc \
	-isystem $(LIB)/cmsis \
	-I $(SHARED)/inc \
	-I inc

SYSTEM_CFLAGS  := \
	-mthumb -march=armv7e-m -mfloat-abi=soft
USER_CFLAGS    := \
	-Wall -Wextra -Wno-main -Wno-write-strings -Wno-unused-parameter -fno-exceptions -fno-rtti -fno-use-cxa-atexit -std=gnu++17
LIB_CFLAGS     := -w -std=gnu17
DEBUG_CFLAGS   := -O0 -g -D DEBUG
RELEASE_CFLAGS := -Os -Werror
LINKER_FLAGS   := -L. -lgcc -lc_nano -L. -specs=nano.specs -specs=nosys.specs

LINKER_SCRIPT  := -T ../md407-ram.x
DEBUG_DIR      := debug
RELEASE_DIR    := release
OUT_NAME       := outer

ifeq ($(OS), Windows_NT)
#	WINDOWS
	MOVE                  := move
	REMOVE_MULTIPLE_FILES := del
	REMOVE_DIRECTORY      := rmdir /Q /S
	CODELITE_DIR          := C:/cseapp/CodeLite
	BIN                   := $(CODELITE_DIR)/tools/gcc-arm/bin
	CC                    := $(BIN)/arm-none-eabi-gcc
	CCXX                  := $(BIN)/arm-none-eabi-g++
	OBJCOPY               := $(BIN)/arm-none-eabi-objcopy
	OBJDUMP               := $(BIN)/arm-none-eabi-objdump
	STRIP                 := $(BIN)/arm-none-eabi-strip
	SYSTEM_LIB_INCLUDES   := \
		-L $(CODELITE_DIR)/tools/gcc-arm/arm-none-eabi/lib/thumb/v7e-m/nofp \
		-L $(CODELITE_DIR)/tools/gcc-arm/lib/gcc/arm-none-eabi/9.2.1/thumb/v7e-m/nofp \
		-nostartfiles

else
#	UNIX
	UNAME_S               := $(shell uname -s)
	MOVE                  := mv
	REMOVE_MULTIPLE_FILES := rm -f
	REMOVE_DIRECTORY      := rm -rf
	ifeq ($(UNAME_S), Darwin)
#	MAC
		CODELITE_DIR        := /Applications/codelite.app/Contents/SharedSupport/
		BIN                 := $(CODELITE_DIR)/tools/gcc-arm/bin
		CC                  := $(BIN)/arm-none-eabi-gcc
		CCXX                := $(BIN)/arm-none-eabi-g++
		OBJCOPY             := $(BIN)/arm-none-eabi-objcopy
		OBJDUMP             := $(BIN)/arm-none-eabi-objdump
		STRIP               := $(BIN)/arm-none-eabi-strip
		SYSTEM_LIB_INCLUDES := \
			-L $(CODELITE_DIR)/tools/gcc-arm/arm-none-eabi/lib/thumb/v7e-m/nofp \
			-L $(CODELITE_DIR)/tools/gcc-arm/lib/gcc/arm-none-eabi/9.2.1/thumb/v7e-m/nofp \
			-nostartfiles
	else
#	OTHER (Assumed to be on $PATH)
		CC                  := arm-none-eabi-gcc
		CCXX                := arm-none-eabi-g++
		OBJCOPY             := arm-none-eabi-objcopy
		OBJDUMP             := arm-none-eabi-objdump
		STRIP               := arm-none-eabi-strip
		SYSTEM_LIB_INCLUDES := \
			-L /usr/include/newlib/c++/9.2.1/arm-none-eabi/thumb/v7e-m/nofp \
			-L /usr/lib/arm-none-eabi/newlib/thumb/v7e-m/nofp \
			-L /usr/lib/gcc/arm-none-eabi/9.2.1/thumb/v7e-m/nofp \
			-nostartfiles
	endif
endif

build-release:
	-make clean
	-mkdir $(RELEASE_DIR)
	$(CCXX) -c $(SRC)     $(SYSTEM_CFLAGS) $(RELEASE_CFLAGS) $(USER_CFLAGS) $(INCLUDES)
	$(CC)   -c $(LIB_SRC) $(SYSTEM_CFLAGS) $(RELEASE_CFLAGS) $(LIB_CFLAGS)  $(INCLUDES)
	$(MOVE) *.o $(RELEASE_DIR)
	$(CCXX) $(RELEASE_DIR)/*.o -o $(RELEASE_DIR)/$(OUT_NAME) $(LINKER_FLAGS) $(LINKER_SCRIPT) $(SYSTEM_LIB_INCLUDES)
	$(OBJCOPY) -S -O srec $(RELEASE_DIR)/$(OUT_NAME)   $(RELEASE_DIR)/$(OUT_NAME).s19
	$(OBJDUMP) -D -S      $(RELEASE_DIR)/$(OUT_NAME) > $(RELEASE_DIR)/$(OUT_NAME).dass
	$(STRIP) $(RELEASE_DIR)/$(OUT_NAME)

build:
	-make clean
	-mkdir $(DEBUG_DIR)
	$(CCXX) -c $(SRC)     $(SYSTEM_CFLAGS) $(DEBUG_CFLAGS) $(USER_CFLAGS) $(INCLUDES)
	$(CC)   -c $(LIB_SRC) $(SYSTEM_CFLAGS) $(DEBUG_CFLAGS) $(LIB_CFLAGS)  $(INCLUDES)
	$(MOVE) *.o $(DEBUG_DIR)
	$(CCXX) $(DEBUG_DIR)/*.o -o $(DEBUG_DIR)/$(OUT_NAME) $(LINKER_FLAGS) $(LINKER_SCRIPT) $(SYSTEM_LIB_INCLUDES)
	$(OBJCOPY) -S -O srec $(DEBUG_DIR)/$(OUT_NAME)   $(DEBUG_DIR)/$(OUT_NAME).s19
	$(OBJDUMP) -D -S      $(DEBUG_DIR)/$(OUT_NAME) > $(DEBUG_DIR)/$(OUT_NAME).dass

clean:
	-$(REMOVE_MULTIPLE_FILES) *.o
	-$(REMOVE_DIRECTORY) $(DEBUG_DIR)
	-$(REMOVE_DIRECTORY) $(RELEASE_DIR)
