import { ChainsType } from "../../types.js";
import { logger } from "../logger.js";
import { pollBalance } from "./pollBalance.js";

export async function handleInsufficientBalance(
	error: any,
	operationName: string,
	address: string,
	fromChain: ChainsType
) {
	logger.error`Error in ${operationName}: ${error}`;

	if (
		error.message?.toLowerCase().includes("insufficient") ||
		error.reason?.toLowerCase().includes("not enough native")
	) {
		await pollBalance({
			network: fromChain,
			walletAddress: address,
		});
	}
}
