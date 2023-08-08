import { Contract, ethers } from "ethers";
import { Chains, ZKBridgeChainsType, ZKBridgeDataType } from "../src/types.js";
import { logger } from "../src/utils/logger.js";
import { MESSAGE_BRIDGE_ABI } from "./ABIs/message-bridge-abi.js";
import { NFT_BRIDGE_ABI } from "./ABIs/nft-bridge-abi.js";
import { NFT_CLAIM_ABI } from "./ABIs/nft-claim-abi.js";
import { NFT_LZR_BRIDGE_ABI } from "./ABIs/nft-lzr-bridge-abi.js";

export const ZK_BRIDGE_DATA: ZKBridgeDataType = {
	[Chains.BSC]: {
		id: 3,
		nftBridge: "0xe09828f0da805523878be66ea2a70240d312001e",
		lzrNFTBridge: "0x3668c325501322CEB5a624E95b9E16A019cDEBe8",
		messageBridge: "0xfd3f4d96378072db0862a6f76cc258c2b7ea36cc",
	},
	[Chains.Arbitrum]: {},
	[Chains.Avalanche]: {},
	[Chains.Optimism]: {},
	[Chains.Polygon]: {
		id: 4,
		nftClaim: "0xa25bE50be65070c2Ad96d5eD639061de31c45e12",
		nftBridge: "0xffdf4fe05899c4bdb1676e958fa9f21c19ecb9d5",
		lzrNFTBridge: "0xffdf4fe05899c4bdb1676e958fa9f21c19ecb9d5",
		messageBridge: "0xdB6fb08DD8Ce406DA8Ff53FAe65Bd374e3d68681",
		mailbox: "0xCcE1E39f2Ef1e69E6B61Cf79212E96C92C4aFf9a",
	},
	[Chains.Core]: {
		id: 17,
		nftBridge: "0x5c5979832a60c17bb06676fa906bedd1a013e18c",
		lzrNFTBridge: "0x3701c5897710f16f1f75c6eae258bf11ee189a5d",
	},
	[Chains.Nova]: {
		id: 14,
		nftClaim: "0xf7497304AC73c1A52d10f719dd27580a0Db7F932",
		mailbox: "0x52c491c2afdA8b6FB361404213122644D98e0AA0",
	},
	[Chains.BNBOp]: {
		id: 116,
		nftClaim: "0x4CC870C8fDfBC512943FE60c29c98d515f868EBF",
	},
	[Chains.Moonbeam]: {
		id: 9,
		mailbox: "0xAf83500eA01d098F4FEBE94d54a5Dc51C41e46eD",
	},
	[Chains.Celo]: {
		id: 18,
		lzrNFTBridge: "0xe47b0a5f2444f9b360bd18b744b8d511cfbf98c6",
	},
	[Chains.Combo]: {
		id: 114,
		nftClaim: "0x2ed78a532c2bfdb8d739f1f27bad87d5e27cccd1",
	},
};

type NFTBridgesType = {
	lzrAddress: Contract | undefined;
	zkAddress: Contract | undefined;
};

type GetNFTBridgeContractsType = {
	lzrAddress: Contract;
	zkAddress: Contract;
};

type BridgeManagerType = {
	nftBridges: Record<ZKBridgeChainsType, NFTBridgesType>;
	messageBridges: Record<ZKBridgeChainsType, Contract>;
	nftClaims: Record<ZKBridgeChainsType, Contract>;
	id: Record<ZKBridgeChainsType, number | undefined>;
	mailbox: Record<ZKBridgeChainsType, string>;

	getNFTBridgeContracts: (chain: ZKBridgeChainsType) => {
		lzrAddress: Contract;
		zkAddress: Contract;
	};
	getChainId: (chain: ZKBridgeChainsType) => number | undefined;
	getNFTClaimContract: (chain: ZKBridgeChainsType) => Contract;
	getMessageBridgesContract: (chain: ZKBridgeChainsType) => Contract;
	getMailbox: (chain: ZKBridgeChainsType) => string;
};

export const BridgeManager: BridgeManagerType = {
	nftBridges: {} as Record<ZKBridgeChainsType, NFTBridgesType>,
	messageBridges: {} as Record<ZKBridgeChainsType, Contract>,
	nftClaims: {} as Record<ZKBridgeChainsType, Contract>,
	id: {} as Record<ZKBridgeChainsType, number | undefined>,
	mailbox: {} as Record<ZKBridgeChainsType, string>,

	getNFTBridgeContracts(chain: ZKBridgeChainsType) {
		if (
			!this.nftBridges[chain].lzrAddress &&
			!this.nftBridges[chain].zkAddress
		)
			throw new Error(
				`Missing lzrAddress and zkAddress contract for chain: ${chain}`
			);

		return this.nftBridges[chain] as GetNFTBridgeContractsType;
	},

	getChainId(chain: ZKBridgeChainsType) {
		return this.id[chain];
	},

	getNFTClaimContract(chain: ZKBridgeChainsType) {
		if (!this.nftClaims[chain])
			throw new Error(`Missing nftClaims contract for chain: ${chain}`);
		return this.nftClaims[chain];
	},

	getMessageBridgesContract(chain: ZKBridgeChainsType) {
		if (!this.messageBridges[chain])
			throw new Error(
				`Missing messageBridges contract for chain: ${chain}`
			);
		return this.messageBridges[chain];
	},

	getMailbox(chain: ZKBridgeChainsType) {
		if (!this.mailbox[chain]) {
			throw new Error(`No mailbox address found for chain ${chain}`);
		}
		return this.mailbox[chain];
	},
};

(() => {
	function initializeBridges(chain: ZKBridgeChainsType): void {
		try {
			const chainData = ZK_BRIDGE_DATA[chain];
			BridgeManager.id[chain] = chainData.id;

			const nftLzrBridgeAddress = chainData.lzrNFTBridge;
			const nftBridgeAddress = chainData.nftBridge;

			BridgeManager.nftBridges[chain] =
				BridgeManager.nftBridges[chain] || {};

			if (nftLzrBridgeAddress) {
				BridgeManager.nftBridges[chain].lzrAddress =
					new ethers.Contract(
						nftLzrBridgeAddress,
						NFT_LZR_BRIDGE_ABI
					);
			}
			if (nftBridgeAddress) {
				BridgeManager.nftBridges[chain].zkAddress = new ethers.Contract(
					nftBridgeAddress,
					NFT_BRIDGE_ABI
				);
			}

			const nftClaimAddress = chainData.nftClaim;
			if (nftClaimAddress) {
				BridgeManager.nftClaims[chain] = new ethers.Contract(
					nftClaimAddress,
					NFT_CLAIM_ABI
				);
			}

			const messageBridgeAddress = chainData.messageBridge;
			if (messageBridgeAddress) {
				BridgeManager.messageBridges[chain] = new ethers.Contract(
					messageBridgeAddress,
					MESSAGE_BRIDGE_ABI
				);
			}

			if (chainData.mailbox)
				BridgeManager.mailbox[chain] = chainData.mailbox;
		} catch (error) {
			logger.error`Error initializing NFT Bridge for chain ${chain}: ${error}`;
		}
	}

	for (const chain in ZK_BRIDGE_DATA) {
		initializeBridges(chain as ZKBridgeChainsType);
	}
})();
