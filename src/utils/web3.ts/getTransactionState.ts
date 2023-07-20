import { TransactionReceipt, TransactionResponse } from "ethers";
import { setTimeout } from "timers/promises";
import { logger } from "../logger.js";
import { ProviderManager } from "./../../../data/chain-data.js";

export async function getTransactionState(
	transactionResponse: TransactionResponse,
	customMessage?: string,
	confirmations: number = 1,
	timeout: number = 120000
): Promise<TransactionReceipt> {
	const receipt = await getTransactionReceipt(
		transactionResponse,
		confirmations,
		timeout
	);

	if (!receipt) {
		throw new Error("Transaction not found.");
	}

	const link = await getExplorerLink(
		Number(transactionResponse.chainId),
		receipt.hash
	);

	switch (receipt.status) {
		case 1:
			logger.success`Transaction ${customMessage} was successful: ${link}`;
			return receipt;
		case 0:
			logger.error`Transaction failed: ${link}. Receipt: ${receipt}`;
			throw new Error("Transaction failed with status 0");
		default:
			throw new Error("Unknown transaction status.");
	}
}

function delay(timeout: number): Promise<never> {
	const timeoutError: Error & { code?: string } = new Error(
		"Timeout error. Transaction was not mined within the specified time."
	);
	timeoutError.code = "ETIMEOUT";
	return setTimeout(timeout, undefined).then(() => {
		throw timeoutError;
	});
}

async function getTransactionReceipt(
	transactionResponse: TransactionResponse,
	confirmations: number,
	timeout: number
): Promise<TransactionReceipt | null> {
	try {
		return await Promise.race([
			transactionResponse.wait(confirmations),
			delay(timeout),
		]);
	} catch (error: any) {
		if (error.code === "ETIMEOUT") {
			throw error;
		}
		throw new Error(
			`An error occurred while waiting for the transaction: ${error}`
		);
	}
}

async function getExplorerLink(
	chainId: number,
	hash: string
): Promise<string | undefined> {
	const explorer = ProviderManager.getExplorerByChainId(chainId);
	return explorer ? `${explorer}/tx/${hash}` : undefined;
}
