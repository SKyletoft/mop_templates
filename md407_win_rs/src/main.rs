use std::{fmt::Display, os::raw::c_int as int, str::FromStr, time::Duration};

use clap::Parser;
use serialport::SerialPort;

#[derive(Debug, PartialEq, Copy, Clone)]
enum Mode {
	Load,
	Go,
	Interactive,
}

impl FromStr for Mode {
	type Err = Error;

	fn from_str(s: &str) -> Result<Self, Self::Err> {
		let lowercase = s.to_lowercase();
		let res = match lowercase.as_str() {
			"load" => Mode::Load,
			"go" => Mode::Go,
			"interactive" => Mode::Interactive,
			_ => return Err(Error),
		};
		Ok(res)
	}
}

impl Display for Mode {
	fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
		write!(f, "{self:?}")
	}
}

#[derive(Debug, Copy, Clone, PartialEq)]
struct Error;

impl Display for Error {
	fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
		write!(f, "Error")
	}
}

impl std::error::Error for Error {}

#[derive(Parser, Debug, PartialEq, Clone)]
#[clap(author, about)]
struct Args {
	/// Usually /dev/ttyUSB0 on linux and COM3 on Windows
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

	let mut port = serialport::new(&args.port, args.baud_rate)
		.open_native()
		.expect("Failed to open port");
	port.set_timeout(Duration::from_millis(50))
		.expect("Couldn't set timeout");

	let mut reader = port.try_clone().expect("Error creating reader");
	let mut writer = port;

	let _reader_thread = std::thread::spawn(move || read_from_device(reader.as_mut()));
	write_to_device(&mut writer);
}

fn read_from_device(port: &mut dyn SerialPort) -> ! {
	loop {
		let mut small_buffer = [b'\0'];
		while let Ok(0) = port.bytes_to_read() {}
		let _ = port.read(&mut small_buffer).expect("Read error");

		// Safety: None, and that's the point. I'm purposefully avoioding locking stdin and stdout
		unsafe {
			libc::putchar(small_buffer[0] as int);
		}
	}
}

fn write_to_device(port: &mut dyn SerialPort) -> ! {
	loop {
		// Safety: None, and that's the point. I'm purposefully avoioding locking stdin and stdout
		let mut c = unsafe { libc::getchar() } as u8;
		port.write(std::slice::from_mut(&mut c))
			.expect("Write error");
	}
}
