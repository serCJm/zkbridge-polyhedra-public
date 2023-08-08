import { JsonRpcProvider, ethers } from "ethers";
import { Chains, ChainsDataType, ChainsType } from "../src/types.js";
import { logger } from "../src/utils/logger.js";

export const CHAIN_DATA: ChainsDataType = {
	[Chains.BSC]: {
		rpc: "https://rpc.ankr.com/bsc",
		explorer: "https://bscscan.com",
		id: 56,
	},
	[Chains.Arbitrum]: {
		rpc: "https://arbitrum-one.publicnode.com",
		explorer: "https://arbiscan.io",
		id: 42161,
	},
	[Chains.Avalanche]: {
		rpc: "https://avalanche-c-chain.publicnode.com",
		explorer: "https://snowtrace.io",
		id: 43114,
	},
	[Chains.Optimism]: {
		rpc: "https://endpoints.omniatech.io/v1/op/mainnet/public",
		explorer: "https://optimistic.etherscan.io",
		id: 10,
	},
	[Chains.Polygon]: {
		rpc: "https://polygon-mainnet.public.blastapi.io",
		explorer: "https://polygonscan.com",
		id: 137,
	},
	[Chains.Core]: {
		rpc: "https://rpc.coredao.org",
		explorer: "https://scan.coredao.org",
		id: 1116,
	},
	[Chains.Nova]: {
		rpc: "https://arbitrum-nova.publicnode.com",
		explorer: "https://nova.arbiscan.io/",
		id: 42170,
	},
	[Chains.BNBTestnet]: {
		rpc: "https://bsc-testnet.publicnode.com",
		explorer: "https://testnet.bscscan.com/",
		id: 97,
	},
	[Chains.BNBOp]: {
		rpc: "https://opbnb-testnet-rpc.bnbchain.org",
		explorer: "http://opbnbscan.com/",
		id: 5611,
	},
	[Chains.Moonbeam]: {
		rpc: "https://rpc.ankr.com/moonbeam",
		explorer: "https://moonscan.io/",
		id: 1284,
	},
	[Chains.Celo]: {
		rpc: "https://forno.celo.org",
		explorer: "https://celoscan.io/",
		id: 42220,
	},
	[Chains.Mantle]: {
		rpc: "https://mantle.publicnode.com",
		explorer: "https://explorer.mantle.xyz/",
		id: 5000,
	},
	[Chains.Combo]: {
		rpc: "https://test-rpc.combonetwork.io",
		explorer: "https://combotrace-testnet.nodereal.io/",
		id: 91715,
	},
};

export class ProviderManager {
	private static explorers: Partial<Record<ChainsType, string>> = {};
	private static chainIds: Partial<Record<ChainsType, number>> = {};
	private static providers: Partial<
		Record<ChainsType, ethers.JsonRpcProvider>
	> = {};

	public static getExplorer(chain: ChainsType) {
		return this.explorers[chain];
	}

	public static getChainId(chain: ChainsType) {
		return this.chainIds[chain];
	}

	public static getProvider(chain: ChainsType): JsonRpcProvider {
		if (this.providers[chain]) {
			return this.providers[chain]!;
		}
		throw new Error("Provider not found");
	}

	public static getExplorerByChainId(chainId: number) {
		for (const chain in this.chainIds) {
			if (this.chainIds[chain as ChainsType] === chainId) {
				return this.explorers[chain as ChainsType];
			}
		}
		logger.warn`No explorer record of a given chainId: ${chainId}`;
	}

	public static initializeProviderManager() {
		for (const chain in CHAIN_DATA) {
			try {
				this.providers[chain as ChainsType] =
					new ethers.JsonRpcProvider(
						CHAIN_DATA[chain as ChainsType].rpc
					);
				this.explorers[chain as ChainsType] =
					CHAIN_DATA[chain as ChainsType].explorer;
				this.chainIds[chain as ChainsType] =
					CHAIN_DATA[chain as ChainsType].id;
			} catch (error) {
				logger.error`Error initializing provider for chain ${chain}: ${error}`;
			}
		}
	}
}

ProviderManager.initializeProviderManager();
