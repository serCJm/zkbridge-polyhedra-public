import fs from "fs/promises";

export class logger {
	private static logFilePath = "log.txt";
	private static customPrepend: string = "";

	public static setCustomPrepend(info: string): void {
		this.customPrepend = info;
	}

	public static log(strings: TemplateStringsArray, ...values: any[]): void {
		this.logWithLevel("log", this.applyLavenderStyle, strings, values);
	}

	public static error(strings: TemplateStringsArray, ...values: any[]): void {
		this.logWithLevel("error", this.applyRedStyle, strings, values);
	}

	public static warn(strings: TemplateStringsArray, ...values: any[]): void {
		this.logWithLevel("warn", this.applyYellowStyle, strings, values);
	}

	public static info(strings: TemplateStringsArray, ...values: any[]): void {
		this.logWithLevel("info", this.applyCyanStyle, strings, values);
	}

	public static success(
		strings: TemplateStringsArray,
		...values: any[]
	): void {
		this.logWithLevel(
			"success",
			this.applyMatrixGreenStyle,
			strings,
			values
		);
	}

	private static logWithLevel(
		level: "log" | "error" | "warn" | "info" | "success",
		styleFn: (text: string) => string,
		strings: TemplateStringsArray,
		values: any[]
	): void {
		let logLevel = level;
		const styledLevel = styleFn.call(this, `[${level.toUpperCase()}]`);
		const timestamp = this.getFormattedTimestamp();
		const styledTimestamp = styleFn.call(this, timestamp);
		if (level === "success") logLevel = "info";

		const formattedValues = values.map((value) =>
			typeof value === "object" && !(value instanceof Error)
				? JSON.stringify(value, null, 2)
				: value
		);

		const formatString = strings
			.map((string, index) => `${string}${formattedValues[index] || ""}`)
			.join("");

		const logEntry = `${styledLevel} ${styledTimestamp} ${this.customPrepend} ${formatString}`;

		console[logLevel as "log" | "error" | "warn" | "info"](logEntry);

		if (level === "success" || level === "error")
			this.writeToFile(logEntry);
	}

	private static getFormattedTimestamp(): string {
		const now = new Date();
		const day = this.pad(now.getDate());
		const month = this.pad(now.getMonth() + 1);
		const year = now.getFullYear().toString().substring(2);
		const hours = this.pad(now.getHours());
		const minutes = this.pad(now.getMinutes());
		const seconds = this.pad(now.getSeconds());

		return `[${day}-${month}-${year} ${hours}:${minutes}:${seconds}]`;
	}

	private static pad(num: number): string {
		return num.toString().padStart(2, "0");
	}

	private static applyMatrixGreenStyle(text: string): string {
		const matrixGreen = "\x1b[32m"; // ANSI escape code for green text
		const resetColor = "\x1b[0m"; // ANSI escape code to reset color
		return `${matrixGreen}${text}${resetColor}`;
	}

	private static applyRedStyle(text: string): string {
		const red = "\x1b[31m"; // ANSI escape code for red text
		const resetColor = "\x1b[0m"; // ANSI escape code to reset color
		return `${red}${text}${resetColor}`;
	}

	private static applyYellowStyle(text: string): string {
		const yellow = "\x1b[33m"; // ANSI escape code for yellow text
		const resetColor = "\x1b[0m"; // ANSI escape code to reset color
		return `${yellow}${text}${resetColor}`;
	}

	private static applyCyanStyle(text: string): string {
		const cyan = "\x1b[36m"; // ANSI escape code for cyan text
		const resetColor = "\x1b[0m"; // ANSI escape code to reset color
		return `${cyan}${text}${resetColor}`;
	}

	private static applyLavenderStyle(text: string): string {
		const lavenderColorCode = "\x1b[38;5;140m"; // ASCII escape code for lavender color
		const resetColorCode = "\x1b[0m";
		return `${lavenderColorCode}${text}${resetColorCode}`;
	}

	private static async writeToFile(content: string): Promise<any> {
		try {
			await fs.appendFile(this.logFilePath, content + "\n");
		} catch (err) {
			console.error("Error writing log to file:", err);
		}
	}
}
