using System;
using System.IO;
using System.IO.Ports;

class Program {
	public static void Main(string[] args) {
		if (args.Length == 0) {
			Console.Error.WriteLine("No command specified, doing nothing");
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
					Console.Error.WriteLine("No or too many files supplied, doing nothing");
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
		// Yes, we're assuming there's at least one port. I get COM1 in my VM with nothing connected, so I'm trusting that for real hardware
		string port_name = potential_ports[0];
		if (potential_ports.Length > 1) {
			Console.WriteLine("Potential ports:");
			foreach (var pot_port in potential_ports) {
				Console.WriteLine(pot_port);
			}
			Console.Write("> ");
			port_name = Console.ReadLine() ?? port_name;
			if (!potential_ports.Contains(port_name)) {
				Console.Error.WriteLine("Not a valid port name, trying anyway");
			}
		}
		// Some boards use the first value, though seemingly most of them use the second
		var baud_rates = new int[] {124400, 115200};
		var port = new SerialPort(port_name, baud_rates[1]);
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
		var file = File.ReadAllLines(file_name);
		foreach (var line in file) {
			port.WriteLine(line);
		}
	}

	static void go(SerialPort port) {
		port.WriteLine("go");
	}
}
