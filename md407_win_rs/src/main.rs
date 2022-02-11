use std::{io::Write, slice, time::Duration};

use clap::Parser;
use crossterm::{
	event::{self, Event, KeyCode, KeyEvent, KeyModifiers},
	terminal,
};
use serialport::SerialPort;

#[derive(Parser, Debug, PartialEq, Clone)]
#[clap(author, about)]
enum Mode {
	/// Load a .s19 file to the device
	Load {
		/// Usually /dev/ttyUSB0 on Linux and COM3 on Windows
		#[clap(short, long)]
		port: String,

		/// Usually 115200, but some cards use 124400
		#[clap(short, long, default_value_t = 115_200)]
		baud_rate: u32,

		#[clap(short, long)]
		filename: String,
	},
	/// Start the loaded program
	Go {
		/// Usually /dev/ttyUSB0 on Linux and COM3 on Windows
		#[clap(short, long)]
		port: String,

		/// Usually 115200, but some cards use 124400
		#[clap(short, long, default_value_t = 115_200)]
		baud_rate: u32,
	},
	/// Start an interactive terminal
	Interactive {
		/// Usually /dev/ttyUSB0 on Linux and COM3 on Windows
		#[clap(short, long)]
		port: String,

		/// Usually 115200, but some cards use 124400
		#[clap(short, long, default_value_t = 115_200)]
		baud_rate: u32,
	},
	/// Query the OS for connected Serial Devices
	Query,
}

fn main() {
	let args = Mode::parse();

	match args {
		Mode::Load {
			port,
			baud_rate,
			filename,
		} => load_mode(connect(&port, baud_rate), &filename),
		Mode::Go { port, baud_rate } => go_mode(connect(&port, baud_rate)),
		Mode::Interactive { port, baud_rate } => interactive_mode(connect(&port, baud_rate)),
		Mode::Query => query_mode(),
	}
}

fn connect(name: &str, baud_rate: u32) -> impl SerialPort {
	let mut port = serialport::new(name, baud_rate)
		.open_native()
		.expect("Failed to open port");
	port.set_timeout(Duration::from_millis(50))
		.expect("Couldn't set timeout");
	port
}

fn query_mode() {
	let ports = serialport::available_ports().expect("Failed to query ports");
	for port in ports.iter() {
		println!("{}", port.port_name);
	}
}

fn load_mode(mut port: impl SerialPort, filename: &str) {
	let file = std::fs::read(filename).expect("Could not read file. Does it exist?");
	port.write_all(b"load\n").expect("Write error");
	port.write_all(&file).expect("Write error");
	port.write_all(b"\n").expect("Write error");
}

fn go_mode(mut port: impl SerialPort) {
	port.write_all(b"go\n").expect("Write error");
}

fn interactive_mode(mut port: impl SerialPort) {
	terminal::enable_raw_mode().expect("Couldn't enter raw mode");
	let stdout = std::io::stdout();
	let mut stdout = stdout.lock();
	let mut small_buffer = b'\0';

	port.write_all(b"\n").expect("Write error");
	port.flush().expect("Write error");

	loop {
		// Check for input from user
		if event::poll(Duration::from_millis(1)).expect("input error") {
			match event::read().expect("input error") {
				Event::Key(KeyEvent {
					// Lower case on Linux, upper case on Windows
					code: KeyCode::Char('c' | 'C'),
					modifiers: KeyModifiers::CONTROL,
				}) => break,
				Event::Key(KeyEvent { code, .. }) => {
					let mut byte_rep = match code {
						KeyCode::Char(c) => c as u8,
						KeyCode::Enter => 0x0D,
						KeyCode::Backspace => 0x08,
						_ => continue,
					};
					port.write_all(slice::from_mut(&mut byte_rep))
						.expect("Write error");
				}
				_ => {}
			}
		}

		// Check for input from device
		if matches!(port.bytes_to_read(), Ok(n) if n != 0) {
			// We only read a single byte at a time because the hardware times
			// out otherwise
			let _ = port
				.read(slice::from_mut(&mut small_buffer))
				.expect("Read error");

			// Windows can't handle printing 0xFF
			if small_buffer == u8::MAX {
				continue;
			}

			stdout
				.write_all(slice::from_ref(&small_buffer))
				.expect("Error writing to stdout");

			// Because we're in raw mode
			if small_buffer == b'\n' {
				stdout.write_all(b"\r").expect("Error writing to stdout");
			}
			stdout.flush().expect("Error flushing stdout");
		}
	}
	terminal::disable_raw_mode().expect("Couldn't exit raw mode");
	writeln!(stdout).expect("Error writing to stdout");
}
