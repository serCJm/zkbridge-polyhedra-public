import { Contract, HDNodeWallet, JsonRpcProvider, Wallet } from "ethers";
import { config } from "../../config.js";
import { ProviderManager } from "../../data/chain-data.js";
import { JOKES } from "../../data/jokes.js";
import { LayerZeroManager } from "../../data/lzr-data.js";
import { BridgeManager } from "../../data/zkbridge-data.js";
import { Chains, ZKBridgeChainsType } from "../types.js";
import { asyncRetry } from "../utils/asyncRetry.js";
import { logger } from "../utils/logger.js";
import { randomNumber } from "../utils/utils.js";
import { estimateGas } from "../utils/web3.ts/estimateGas.js";
import { getTransactionState } from "../utils/web3.ts/getTransactionState.js";
import { handleInsufficientBalance } from "../utils/web3.ts/handleInsufficientBalance.js";

const FROM_CHAINS = [Chains.BSC, Chains.Polygon];

export class MessageManager {
	private message: string;
	private chain: ZKBridgeChainsType;
	private provider: JsonRpcProvider;
	private walletAddress: string;
	private signer: Wallet | HDNodeWallet;
	private messageContract: Contract;

	constructor(private wallet: Wallet | HDNodeWallet) {
		this.message =
			config.MODULES.MESSENGER.MESSAGE === "random"
				? JOKES[randomNumber(0, JOKES.length - 1)]
				: config.MODULES.MESSENGER.MESSAGE;

		this.chain =
			config.MODULES.MESSENGER.FROM_CHAIN === "random"
				? FROM_CHAINS[randomNumber(0, FROM_CHAINS.length - 1)]
				: (config.MODULES.MESSENGER.FROM_CHAIN as ZKBridgeChainsType);

		this.provider = ProviderManager.getProvider(this.chain);
		this.walletAddress = this.wallet.address;
		this.signer = this.wallet.connect(this.provider);

		this.messageContract = BridgeManager.getMessageBridgesContract(
			this.chain
		);

		this.messageContract = this.messageContract.connect(
			this.signer
		) as Contract;
	}

	async sendMessage() {
		const operation = async () => {
			logger.info`Sending "${
				this.message
			}" message from ${this.chain.toUpperCase()}...`;

			const configToChain =
				config.MODULES.MESSENGER.TO_CHAIN[
					randomNumber(
						0,
						config.MODULES.MESSENGER.TO_CHAIN.length - 1
					)
				];
			const defaultToChains = [
				Chains.Nova,
				Chains.Polygon,
				Chains.Moonbeam,
			].filter((chain) => chain !== this.chain);

			const toChain =
				configToChain ||
				defaultToChains[randomNumber(0, defaultToChains.length - 1)];

			const zkId = BridgeManager.getChainId(toChain);
			const lzrId = LayerZeroManager.getChainId(toChain);

			const zkFee = await this.messageContract.fees(zkId);
			const nativeFee = await this.messageContract.estimateLzFee(
				lzrId,
				this.walletAddress,
				this.message
			);

			const value = zkFee + nativeFee;

			const txArgs = [
				zkId,
				BridgeManager.getMailbox(toChain),
				lzrId,
				LayerZeroManager.getMailBoxes(toChain),
				nativeFee,
				this.walletAddress,
				this.message,
			];

			const gas = await estimateGas(
				this.chain,
				this.messageContract,
				"sendMessage",
				...txArgs,
				{ value }
			);

			const bridgeTx = await this.messageContract.sendMessage(...txArgs, {
				...gas,
				value,
			});

			await getTransactionState(
				bridgeTx,
				`bridging MESSAGE from ${this.chain.toUpperCase()} to ${(
					toChain as string
				).toUpperCase()}`,
				10
			);
		};

		await asyncRetry(operation, handleInsufficientBalance, [
			"sendMessage",
			this.walletAddress,
			this.chain,
		]);
	}
}
