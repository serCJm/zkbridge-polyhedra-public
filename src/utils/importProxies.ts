import fs from "fs/promises";
import { Proxies, Proxy } from "../types.js";
export async function importProxies(path: string) {
	const text = await fs.readFile(path, "utf8");

	const lines = text.split("\n");

	const proxies: Proxies = {};

	for (const line of lines) {
		const cleanedLine = line.replace("\r", ""); // Remove the carriage return character
		const [name, ip, port, username, password] = cleanedLine.split(":");

		const proxy: Proxy = {
			ip,
			port,
			username,
			password,
		};

		proxies[name] = proxy;
	}
	return proxies;
}
