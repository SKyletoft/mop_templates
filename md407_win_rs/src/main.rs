use std::{os::raw::c_int as int, time::Duration};
use clap::Parser;

use serialport::SerialPort;

#[derive(Parser, Debug, PartialEq)]
#[clap(author, about)]
struct Args {

	/// Usually /dev/ttyUSB0 on linux and COM3 on Windows
	#[clap(short, long)]
	port: String,

	/// Usually 115200, but some cards use 124400
	#[clap(short, long, default_value_t = 115_200)]
	baud_rate: u32,
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
