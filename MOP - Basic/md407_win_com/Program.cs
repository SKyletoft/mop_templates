using System;
using System.IO.Ports;

class Program {
	public static void Main(string[] args) {
		if (args.Length == 0) {
			System.Console.Error.WriteLine("No command specified, doing nothing");
			return;
		}
		var port = get_and_init_port();
		switch (args[0]) {
			case "go":
				go(port);
				read(port);
				break;
			case "load":
				if (args.Length != 2) {
					System.Console.Error.WriteLine("No or too many files supplied, doing nothing");
					break;
				}
				load(port, args[1]);
				read_until_load_done(port);
				break;
		}
		port.Close();
	}

	static SerialPort get_and_init_port() {
		Console.WriteLine("Starting");
		var potential_ports = SerialPort.GetPortNames();
		foreach (var port_name in potential_ports) {
			Console.WriteLine(port_name);
		}
		var baud_rates = new int[] {124400, 115200};
		var port = new SerialPort("COM3", baud_rates[1]);
		port.Open();
		Console.WriteLine("Connected");
		return port;
	}

	static void read(SerialPort port) {
		while (true) {
			System.Console.WriteLine(port.ReadLine());
		}
	}

	static void read_until_load_done(SerialPort port) {
		while (true) {
			var line = port.ReadLine();
			Console.WriteLine(line);
			if (line == "Load Complete") {
				break;
			}
		}
	}

	static void load(SerialPort port, string file_name) {
		port.WriteLine("load");
		var file = System.IO.File.ReadAllLines(file_name);
		foreach (var line in file) {
			port.WriteLine(line);
		}
	}

	static void go(SerialPort port) {
		port.WriteLine("go");
	}
}
