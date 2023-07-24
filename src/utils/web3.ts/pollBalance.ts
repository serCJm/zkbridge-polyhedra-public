import { ethers } from "ethers";
import { setTimeout } from "timers/promises";
import { ERC_20_AIB } from "../../../data/ABIs/ERC-20-ABI.js";
import { ProviderManager } from "../../../data/chain-data.js";
import { ChainsType } from "../../types.js";
import { logger } from "../logger.js";

const POLL_DELAY = 180000;

type PollBalanceArgs =
	| {
			network: ChainsType;
			walletAddress: string;
			tokenContractAddress?: never;
			decimals?: never;
	  }
	| {
			network: ChainsType;
			walletAddress: string;
			tokenContractAddress: string;
			decimals: number;
	  };

async function pollUntilBalanceIncreases(
	network: ChainsType,
	getBalance: () => Promise<bigint>,
	format: (balance: bigint) => string
) {
	let startBalance = await getBalance();
	while (true) {
		const balance = await getBalance();
		logger.log`Balance on ${network.toUpperCase()} chain: ${format(
			balance
		)}`;
		if (balance > startBalance) {
			break;
		}
		logger.warn`Retry poll in ${POLL_DELAY / 1000}sec...`;
		await setTimeout(POLL_DELAY);
	}
}

export async function pollBalance({
	network,
	walletAddress,
	tokenContractAddress,
	decimals,
}: PollBalanceArgs) {
	try {
		logger.info`Polling balance on ${network.toUpperCase()}...`;
		const providerDestination = ProviderManager.getProvider(network);

		if (!tokenContractAddress) {
			await pollUntilBalanceIncreases(
				network,
				() => providerDestination.getBalance(walletAddress),
				(balance) => ethers.formatEther(balance)
			);
		} else {
			const tokenContractDestination = new ethers.Contract(
				tokenContractAddress,
				ERC_20_AIB,
				providerDestination
			);
			await pollUntilBalanceIncreases(
				network,
				() => tokenContractDestination.balanceOf(walletAddress),
				(balance) => ethers.formatUnits(balance, decimals)
			);
		}
		logger.info`Balance arrived to ${network.toUpperCase()}`;
	} catch (err) {
		logger.error`Error in pollBalance: ${err}`;
	}
}
