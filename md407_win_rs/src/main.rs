use std::{io::Write, os::raw::c_int as int, slice, thread, time::Duration};

use clap::Parser;
use crossterm::{
	event::{self, Event, KeyCode, KeyEvent, KeyModifiers},
	terminal, ExecutableCommand,
};
use serialport::SerialPort;

mod error;

#[derive(Debug, PartialEq, Copy, Clone)]
enum Mode {
	Load,
	Go,
	Interactive,
}

#[derive(Parser, Debug, PartialEq, Clone)]
#[clap(author, about)]
struct Args {
	/// Usually /dev/ttyUSB0 on Linux and COM3 on Windows
	#[clap(short, long)]
	port: String,

	/// Usually 115200, but some cards use 124400
	#[clap(short, long, default_value_t = 115_200)]
	baud_rate: u32,

	#[clap(short, long, default_value_t = Mode::Interactive)]
	mode: Mode,
}

fn main() {
	let args = Args::parse();
	let stdout = std::io::stdout();
	let mut stdout = stdout.lock();
	let mut small_buffer = b'\0';

	let mut port = serialport::new(&args.port, args.baud_rate)
		.open()
		.expect("Failed to open port");
	port.set_timeout(Duration::from_millis(50))
		.expect("Couldn't set timeout");

	terminal::enable_raw_mode().expect("Couldn't enter raw mode");

	loop {
		// Check for input from user
		if event::poll(Duration::from_millis(1)).expect("input error") {
			match event::read().expect("input error") {
				Event::Key(KeyEvent {
					code: KeyCode::Char('c'),
					modifiers: KeyModifiers::CONTROL,
				}) => break,
				Event::Key(KeyEvent { code, .. }) => {
					let mut byte_rep = match code {
						KeyCode::Char(c) => c as u8,
						KeyCode::Enter => 0x0D,
						KeyCode::Backspace => 0x08,
						_ => continue,
					};
					port.write(slice::from_mut(&mut byte_rep))
						.expect("Write error");
				}
				_ => {}
			}
		}

		// Check for input from device
		if let Ok(0) = port.bytes_to_read() {
		} else {
			let _ = port
				.read(slice::from_mut(&mut small_buffer))
				.expect("Read error");

			stdout
				.write(slice::from_ref(&small_buffer))
				.expect("Error writing to stdout");
			// libc::putchar(small_buffer as int);
			if small_buffer == b'\n' {
				stdout
					.write(b"\r")
					.expect("Error writing to stdout");
			}
			stdout.flush().expect("Error flushing stdout");
		}
	}

	terminal::disable_raw_mode().expect("Couldn't exit raw mode");
	println!();
}
