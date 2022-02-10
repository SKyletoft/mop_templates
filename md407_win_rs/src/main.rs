use std::io::Read;
use std::io::Write;
use std::time::Duration;
use serialport::SerialPort;

fn main() {
	let ports = serialport::available_ports().expect("No ports found!");
	dbg!(&ports);
	
	let mut port = serialport::new("COM3", 115_200)
		.open_native()
		.expect("Failed to open port");
	port.set_timeout(Duration::from_millis(5000))
		.expect("Couldn't set timeout");

	let mut big_buffer = Vec::new();
	let buffer_limit = 12;
	loop {
		let mut small_buffer = [ b'\0' ];
		while let Ok(0) = port.bytes_to_read() {}
		let bytes_read = port.read(&mut buffer).expect("Read error");
		print!("{}", buffer[0]);
		std::io::stdout().flush();
	}
}
