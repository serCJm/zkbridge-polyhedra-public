import { setTimeout } from "timers/promises";
import { randomNumber } from "./utils.js";

function formatTime(seconds: number): string {
	const hours: number = Math.floor(seconds / 3600);
	const minutes: number = Math.floor((seconds % 3600) / 60);
	const remainingSeconds: number = seconds % 60;

	return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
		.toString()
		.padStart(2, "0")}`;
}

export async function countdownTimer(
	minSeconds: number,
	maxSeconds: number = minSeconds
): Promise<void> {
	const progressBarWidth: number = 60; // Adjust the width of the progress bar here

	const seconds: number = randomNumber(minSeconds, maxSeconds);

	let remainingSeconds: number = seconds;

	process.stdout.write("\x1b[32m");

	while (remainingSeconds >= 0) {
		const formattedTime: string = formatTime(remainingSeconds);
		const progress: number = Math.round(
			(remainingSeconds / seconds) * progressBarWidth
		);
		const progressBar: string = "\x1b[42m".concat(
			" ".repeat(progress),
			"\x1b[0m".concat(" ".repeat(progressBarWidth - progress))
		);

		process.stdout.cursorTo?.(0);
		process.stdout.write(`Countdown: ${formattedTime} [${progressBar}]`);
		remainingSeconds--;

		await setTimeout(1000);
	}

	process.stdout.clearLine?.(0);
	process.stdout.cursorTo?.(0);

	// Reset console color to default
	process.stdout.write("\x1b[0m");

	process.stdout.write("Countdown complete!");
	process.stdout.write("\n");
}
