use std::{borrow::Cow, io::Write, slice, time::Duration};

use anyhow::Result;
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

	if let Err(e) = match args {
		Mode::Load {
			port,
			baud_rate,
			filename,
		} => connect(&port, baud_rate).and_then(|connection| load_mode(connection, &filename)),
		Mode::Go { port, baud_rate } => connect(&port, baud_rate).and_then(go_mode),
		Mode::Interactive { port, baud_rate } => {
			connect(&port, baud_rate).and_then(interactive_mode)
		}
		Mode::Query => query_mode(),
	} {
		eprintln!("Error: {e:?}");
	}
}

fn connect(name: &str, baud_rate: u32) -> Result<impl SerialPort> {
	let mut port = serialport::new(musl_fix(name), baud_rate).open_native()?;
	port.set_timeout(Duration::from_millis(50))?;
	Ok(port)
}

fn query_mode() -> Result<()> {
	let ports = serialport::available_ports()?;
	for port in ports.iter() {
		println!("{}", musl_fix(&port.port_name));
	}
	Ok(())
}

fn load_mode(mut port: impl SerialPort, filename: &str) -> Result<()> {
	let file = std::fs::read(filename)?;
	port.write_all(b"load\n")?;
	port.write_all(&file)?;

	// Testing with hardware shows that this is required
	#[cfg(not(target_os = "linux"))]
	port.write_all(b"\n")?;

	println!("Load complete");
	Ok(())
}

fn go_mode(mut port: impl SerialPort) -> Result<()> {
	port.write_all(b"go\n")?;
	Ok(())
}

fn interactive_mode(mut port: impl SerialPort) -> Result<()> {
	terminal::enable_raw_mode()?;
	let stdout = std::io::stdout();
	let mut stdout = stdout.lock();
	let mut small_buffer = b'\0';

	port.write_all(b"\n")?;
	port.flush()?;

	loop {
		// Check for input from user
		if event::poll(Duration::from_millis(1))? {
			match event::read()? {
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
					port.write_all(slice::from_mut(&mut byte_rep))?;
				}
				_ => {}
			}
		}

		// Check for input from device
		if matches!(port.bytes_to_read(), Ok(n) if n != 0) {
			// We only read a single byte at a time because the hardware times
			// out otherwise
			let _ = port.read(slice::from_mut(&mut small_buffer))?;

			// Windows can't handle printing 0xFF
			if small_buffer == u8::MAX {
				continue;
			}

			stdout.write_all(slice::from_ref(&small_buffer))?;

			// Because we're in raw mode
			if small_buffer == b'\n' {
				stdout.write_all(b"\r")?;
			}
			stdout.flush()?;
		}
	}
	terminal::disable_raw_mode()?;
	writeln!(stdout)?;

	Ok(())
}

/// Hack to replace /sys/class/tty with /dev with musl
fn musl_fix(filename: &str) -> Cow<str> {
	#[cfg(target_os = "linux")]
	{
		if let Some(device_name) = filename.strip_prefix("/sys/class/tty") {
			(String::from("/dev") + device_name).into()
		} else {
			filename.into()
		}
	}

	#[cfg(not(target_os = "linux"))]
	filename.into()
}
