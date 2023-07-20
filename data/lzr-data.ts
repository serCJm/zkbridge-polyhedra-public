import {
	Chains,
	ChainsType,
	L0ChainDataType,
	L0ChainType,
} from "../src/types.js";
import { logger } from "../src/utils/logger.js";

export const LAYER_ZERO_DATA: L0ChainDataType = {
	[Chains.Avalanche]: {
		chainId: 106,
		endpoint: "0x3c2269811836af69497E5F486A85D7316753cf62",
	},
	[Chains.Arbitrum]: {
		chainId: 110,
		endpoint: "0x3c2269811836af69497E5F486A85D7316753cf62",
	},
	[Chains.Optimism]: {
		chainId: 111,
		endpoint: "0x3c2269811836af69497E5F486A85D7316753cf62",
	},
	[Chains.Polygon]: {
		chainId: 109,
		endpoint: "0x3c2269811836af69497E5F486A85D7316753cf62",
		lzrMailbox: "0x2647D579ebc9e1eC5e01c32030d8e69e4a678dEB",
	},
	[Chains.BSC]: {
		chainId: 102,
		endpoint: "0x3c2269811836af69497E5F486A85D7316753cf62",
		lzrMailbox: "0x39dad2E89a213626a99Ae09b808b4A79c0d3EC16",
	},
	[Chains.Core]: {
		chainId: 153,
		endpoint: "0x9740FF91F1985D8d2B71494aE1A2f723bb3Ed9E4",
	},
	[Chains.Nova]: {
		chainId: 175,
		endpoint: "0x4EE2F9B7cf3A68966c370F3eb2C16613d3235245",
		lzrMailbox: "0x2dED59F685f18ee016a93d1CeCc5b7eA0322aFED",
	},
	[Chains.Moonbeam]: {
		chainId: 126,
		endpoint: "0x9740FF91F1985D8d2B71494aE1A2f723bb3Ed9E4",
		lzrMailbox: "0xe6eb0b3A1b0c542aCCB40a86565786Fcf8a42EF0",
	},
};

export class LayerZeroManager {
	private static chainIds: Partial<Record<ChainsType, number>> = {};
	private static lzrMailboxes: Partial<Record<ChainsType, string>> = {};

	public static getChainId(chain: ChainsType) {
		if (!this.chainIds[chain])
			throw new Error(`No Layer Zero chain Id found for chain ${chain}`);
		return this.chainIds[chain];
	}
	public static getMailBoxes(chain: ChainsType) {
		if (!this.lzrMailboxes[chain])
			throw new Error(
				`No Layer Zero lzrMailbox found for chain ${chain}`
			);
		return this.lzrMailboxes[chain];
	}

	public static initializeProviderManager() {
		for (const chain in LAYER_ZERO_DATA) {
			try {
				this.chainIds[chain as L0ChainType] =
					LAYER_ZERO_DATA[chain as L0ChainType].chainId;
				this.lzrMailboxes[chain as L0ChainType] =
					LAYER_ZERO_DATA[chain as L0ChainType].lzrMailbox;
			} catch (error) {
				logger.error`Error initializing provider for chain ${chain}: ${error}`;
			}
		}
	}
}

LayerZeroManager.initializeProviderManager();
