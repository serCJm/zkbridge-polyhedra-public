import { setTimeout } from "timers/promises";
import { logger } from "./logger.js";

export async function asyncRetry<T, E, U extends any[]>(
	operation: (...operationArgs: T[]) => Promise<void>,
	errorHandler: (error: E, ...errorHandlerArgs: U) => Promise<void>,
	errorHandlerArgs: U,
	maxRetries: number = 3,
	retryDelayMs: number = 10000
) {
	logger.info`Running asyncRetry...`;
	let retries = 0;

	while (retries < maxRetries) {
		try {
			await operation();
			return;
		} catch (error: any) {
			retries++;

			if (retries < maxRetries) {
				logger.info`Retrying operation in ${
					retryDelayMs / 1000
				} seconds...`;
				if (
					error.message?.toLowerCase().includes("insufficient") ||
					error.reason?.toLowerCase().includes("not enough native")
				)
					retries = 0;
				await errorHandler(error, ...errorHandlerArgs);
				await setTimeout(retryDelayMs);
			} else {
				throw error;
			}
		}
	}

	throw new Error("Maximum number of retries reached.");
}
