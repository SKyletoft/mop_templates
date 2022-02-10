use std::{io::Read, os::raw::c_int as int, time::Duration};

use serialport::SerialPort;

fn main() {
	let ports = serialport::available_ports().expect("No ports found!");
	dbg!(&ports);

	#[cfg(windows)]
	let port_name = "COM3";
	#[cfg(not(windows))]
	let port_name = "/dev/ttyUSB0";

	let mut port = serialport::new(port_name, 115_200)
		.open_native()
		.expect("Failed to open port");
	port.set_timeout(Duration::from_millis(5000))
		.expect("Couldn't set timeout");

	let mut reader = port.try_clone().expect("Error creating reader");
	let mut writer = port;

	let reader_thread = std::thread::spawn(move || read_from_device(reader.as_mut()));
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
