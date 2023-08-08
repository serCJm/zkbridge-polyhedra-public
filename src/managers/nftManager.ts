import {
	BaseContract,
	Contract,
	HDNodeWallet,
	JsonRpcProvider,
	Wallet,
	ethers,
	getAddress,
} from "ethers";
import { setTimeout } from "timers/promises";
import { config } from "../../config.js";
import { BNB_TESTNET_OP_BRIDGE_ABI } from "../../data/ABIs/bnb-testnet-op-bridge-abi.js";
import { NFT_ABI } from "../../data/ABIs/nft-abi.js";
import { ProviderManager } from "../../data/chain-data.js";
import { LayerZeroManager } from "../../data/lzr-data.js";
import { NFT_DATA } from "../../data/nft-data.js";
import { BridgeManager } from "../../data/zkbridge-data.js";
import {
	Chains,
	L0ChainType,
	NFTChainsType,
	Proxy,
	ZKBridgeChainsType,
} from "../types.js";
import { asyncRetry } from "../utils/asyncRetry.js";
import { countdownTimer } from "../utils/countdownTimer.js";
import { logger } from "../utils/logger.js";
import { randomFloat, randomNumber, shuffleArr } from "../utils/utils.js";
import { estimateGas } from "../utils/web3.ts/estimateGas.js";
import { getTransactionState } from "../utils/web3.ts/getTransactionState.js";
import { handleInsufficientBalance } from "../utils/web3.ts/handleInsufficientBalance.js";
import { pollBalance } from "../utils/web3.ts/pollBalance.js";
import { SessionManager } from "./sessionManager.js";

class NFTContract {
	private provider: JsonRpcProvider;
	private walletAddress: string;
	private signer: Wallet | HDNodeWallet;
	private NFTContract: Contract;
	private nftId: number | undefined;
	private lzrBridge: boolean;
	private bridgeContract: Contract;

	constructor(
		private fromChain: ZKBridgeChainsType,
		private toChain: L0ChainType | ZKBridgeChainsType,
		private contractName: string,
		private wallet: Wallet | HDNodeWallet,
		private contract: BaseContract,
		private session: SessionManager | undefined
	) {
		this.fromChain = fromChain;
		this.provider = ProviderManager.getProvider(fromChain);

		this.walletAddress = this.wallet.address;
		this.signer = this.wallet.connect(this.provider);

		this.NFTContract = this.contract.connect(this.signer) as Contract;

		this.nftId;

		this.lzrBridge = this.toChain !== "bnbOp" && this.toChain !== "combo";
		this.bridgeContract = this.lzrBridge
			? BridgeManager.getNFTBridgeContracts(this.fromChain).lzrAddress
			: BridgeManager.getNFTBridgeContracts(this.fromChain).zkAddress;
		this.bridgeContract = this.bridgeContract.connect(
			this.signer
		) as Contract;
	}

	private async mint() {
		try {
			logger.info`Starting NFT mint...`;

			const gas = await estimateGas(
				this.fromChain,
				this.NFTContract,
				"mint"
			);

			logger.info`Minting on contract: ${this.contractName}`;

			const mintTx = await this.NFTContract.mint(gas);

			await getTransactionState(
				mintTx,
				`minting ${this.contractName}`,
				5
			);

			return this;
		} catch (error) {
			console.log(error);
		}
	}

	private async getId(): Promise<NFTContract> {
		const balance = await this.NFTContract.balanceOf(this.walletAddress);
		if (!balance) {
			await this.mint();
			const waitTime = randomNumber(60000, 120000);
			logger.warn`Beep beep simulating human after mint, waiting ${
				waitTime / 1000
			} seconds...`;
			await setTimeout(waitTime);
		}
		logger.info`Getting NFT ID...`;
		const totalSupply = await this.NFTContract.totalSupply();

		const startingRange =
			totalSupply <= BigInt(10000)
				? BigInt(0)
				: totalSupply - BigInt(2000);

		const nfts = await this.NFTContract.tokensOfOwnerIn(
			this.walletAddress,
			Number(startingRange),
			Number(totalSupply)
		);

		this.nftId = nfts[0];
		return this;
	}

	private async approve() {
		logger.info`Starting approve...`;

		const bridgeAddress = getAddress(
			await this.bridgeContract.getAddress()
		);

		const approvedAddress = getAddress(
			await this.NFTContract.getApproved(this.nftId)
		);

		if (approvedAddress === bridgeAddress) {
			logger.warn`NFT is already approved`;
			return;
		}

		const txArgs = [bridgeAddress, this.nftId];

		const gas = await estimateGas(
			this.fromChain,
			this.NFTContract,
			"approve",
			...txArgs
		);

		logger.info`Approving for contract: ${this.contractName}`;

		const approveTx = await this.NFTContract.approve(...txArgs, gas);
		await getTransactionState(
			approveTx,
			`approving ${this.contractName.toUpperCase()} with ID ${
				this.nftId
			} for bridge on ${this.fromChain.toUpperCase()}`
		);
	}

	async bridge() {
		const operation = async () => {
			await this.getId();

			if (this.contractName === "greenfield") {
				logger.warn`Don't need to bridge ${this.contractName}`;
				return;
			}

			await this.approve();

			logger.info`Starting bridge from ${this.fromChain.toUpperCase()} for ${this.contractName.toUpperCase()}...`;

			const tokenAddress = await this.NFTContract.getAddress();

			let bridgeTx;

			if (this.lzrBridge) {
				const lzrChainId = LayerZeroManager.getChainId(this.toChain);

				const txArgs = [
					tokenAddress,
					this.nftId,
					lzrChainId,
					this.walletAddress,
					"0x000100000000000000000000000000000000000000000000000000000000001b7740",
				];

				const value = await this.bridgeContract.estimateFee(...txArgs);

				const gas = await estimateGas(
					this.fromChain,
					this.bridgeContract,
					"transferNFT",
					...txArgs,
					{ value }
				);

				bridgeTx = await this.bridgeContract.transferNFT(...txArgs, {
					...gas,
					value,
				});

				await getTransactionState(
					bridgeTx,
					`bridging with lzrBridge, NFT ${this.contractName.toUpperCase()} with ID ${
						this.nftId
					} from ${this.fromChain.toUpperCase()} to ${this.toChain.toUpperCase()}`,
					10
				);
			} else {
				const toZKId = BridgeManager.getChainId(
					this.toChain as ZKBridgeChainsType
				);
				const fee = await this.bridgeContract.fee(toZKId);

				const recipient = `0x000000000000000000000000${this.walletAddress.slice(
					2
				)}`;

				const txArgs = [
					tokenAddress,
					this.nftId,
					toZKId,
					recipient,
					{
						value: fee,
					},
				];

				const gas = await estimateGas(
					this.fromChain,
					this.bridgeContract,
					"transferNFT",
					...txArgs
				);

				bridgeTx = await this.bridgeContract.transferNFT(
					...txArgs.slice(0, -1),
					{
						...gas,
						value: fee,
					}
				);

				await getTransactionState(
					bridgeTx,
					`bridging with zkBridge, NFT ${this.contractName.toUpperCase()} with ID ${
						this.nftId
					} from ${this.fromChain.toUpperCase()} to ${this.toChain.toUpperCase()}`,
					10
				);
			}
			if (this.session)
				await this.claimSession(this.toChain, bridgeTx.hash);
		};

		await asyncRetry(operation, handleInsufficientBalance, [
			"bridge",
			this.walletAddress,
			this.fromChain,
		]);
		return this;
	}

	private async bridgeTestnetBNBtoBNBOp() {
		logger.info`Starting bridgeTestnetBNBtoBNBOp...`;
		const provider = ProviderManager.getProvider(Chains.BNBTestnet);

		const signer = this.signer.connect(provider);
		const contract = new ethers.Contract(
			"0x677311fd2ccc511bbc0f581e8d9a07b033d5e840",
			BNB_TESTNET_OP_BRIDGE_ABI,
			signer
		);

		const txArgs = [200000, "0x"];

		const value = ethers.parseEther(randomFloat(0.08, 0.09, 2).toString());

		const gas = await estimateGas(
			Chains.BNBTestnet,
			contract,
			"depositETH",
			...txArgs,
			{ value }
		);

		const bridgeTx = await contract.depositETH(...txArgs, {
			...gas,
			value,
		});

		await getTransactionState(bridgeTx, `bridge BNB from testnet to OP`);

		await pollBalance({
			network: Chains.BNBOp,
			walletAddress: signer.address,
		});
	}

	private async claimNFT(orderData: any) {
		logger.info`Starting claimNFT...`;
		const { chain_id, proof_index, proof_blob, block_hash } = orderData;

		const txArgs = [chain_id, block_hash, proof_index, proof_blob];

		const chain = Chains.Nova;
		const claimContract = BridgeManager.getNFTClaimContract(chain).connect(
			this.signer
		) as Contract;

		const gas = estimateGas(
			chain,
			claimContract,
			"validateTransactionProof",
			...txArgs
		);

		logger.info`Claiming NFT...`;

		let claimTx = await claimContract.validateTransactionProof(
			...txArgs,
			gas
		);
		await getTransactionState(claimTx, `claiming tokens from ${chain}`);
		return claimTx.hash;
	}

	private async claimSession(
		toChain: L0ChainType | ZKBridgeChainsType,
		hash: string
	) {
		logger.info`Starting claimSession...`;

		if (!this.session)
			throw new Error("ZKBridge website session was not started");

		const orderId = await this.session.runSession(
			this.fromChain,
			toChain,
			hash,
			await this.NFTContract.getAddress(),
			this.nftId!,
			this.lzrBridge
		);

		if (config.MODULES.NFTBRIDGE.ENABLE_CLAIM && !this.lzrBridge) {
			const orderData = await this.session.generateProof(
				hash,
				this.fromChain
			);
			const claimHash = await this.claimNFT(orderData);

			await this.session.claimOrder(claimHash, orderId);

			logger.success`NFT claimed`;
		}
	}
}

export class NFTContractManager {
	#excludedChains: string[] = [];
	#contracts: Record<NFTChainsType, { [key: string]: BaseContract }> =
		{} as Record<NFTChainsType, { [key: string]: BaseContract }>;

	constructor() {
		for (const chain in NFT_DATA) {
			this.#contracts[chain as NFTChainsType] = {};
			for (const contractName in NFT_DATA[chain as NFTChainsType]) {
				const address = NFT_DATA[chain as NFTChainsType][contractName];

				this.#contracts[chain as NFTChainsType][contractName] =
					new ethers.Contract(address, NFT_ABI);
			}
		}
	}

	async #getExcludedChains(address: string, contractName: string) {
		this.#excludedChains = [];
		for (const chain in this.#contracts) {
			if (this.#contracts[chain as NFTChainsType][contractName]) {
				const pandaContract = this.#contracts[chain as NFTChainsType][
					contractName
				].connect(
					ProviderManager.getProvider(chain as NFTChainsType)
				) as Contract;

				const balance = await pandaContract.balanceOf(address);

				if (balance) this.#excludedChains.push(chain);
			} else {
				logger.warn`Missing contract address for ${contractName} on ${chain}`;
				continue;
			}
		}
	}

	async randomMint(wallet: Wallet | HDNodeWallet, proxy?: Proxy) {
		const fromData = shuffleArr([
			{ fromChain: Chains.BSC, contractName: "pandaCode" },
			{ fromChain: Chains.Polygon, contractName: "pandaPixel" },
			{ fromChain: Chains.Core, contractName: "pandaMelody" },
			{ fromChain: Chains.Celo, contractName: "pandaGuardian" },
		]);

		let session;
		if (config.MODULES.NFTBRIDGE.ENABLE_SESSION) {
			session = new SessionManager(wallet, proxy);
			await session.startSession();
		}

		for (const { contractName, fromChain } of fromData) {
			await this.#getExcludedChains(wallet.address, contractName);

			if (fromChain === Chains.Celo || fromChain === Chains.Core) {
				this.#excludedChains.push(Chains.Mantle, Chains.Core);
			}

			let toChains = [
				Chains.BSC,
				Chains.Polygon,
				Chains.Core,
				Chains.Celo,
				Chains.Mantle,
				Chains.BNBOp,
				Chains.Combo,
			].filter(
				(chain) =>
					!this.#excludedChains.includes(chain) && chain !== fromChain
			);

			for (const toChain of toChains) {
				const contract = new NFTContract(
					fromChain,
					toChain,
					contractName,
					wallet,
					this.#contracts[fromChain as NFTChainsType][contractName],
					session
				);

				await contract.bridge();

				await countdownTimer(
					config.MIN_BRIDGE_WAIT_TIME,
					config.MAX_BRIDGE_WAIT_TIME
				);
			}
		}
	}
}
