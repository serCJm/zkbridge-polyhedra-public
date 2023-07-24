// ALL CHAINS
export const Chains = {
	Polygon: "polygon",
	Optimism: "optimism",
	BSC: "bsc",
	Arbitrum: "arbitrum",
	Avalanche: "avalanche",
	Core: "core",
	Nova: "nova",
	BNBTestnet: "bnbTestnet",
	BNBOp: "bnbOp",
	Moonbeam: "moonbeam",
	Celo: "celo",
} as const;
export type ChainsType = (typeof Chains)[keyof typeof Chains];
export type ChainsTypeKey = keyof typeof Chains;
export type ChainsData = {
	rpc: string;
	explorer: string;
	id: number;
};
export type ChainsDataType = Record<ChainsType, ChainsData>;

// NFT CHAINS
export const {
	Arbitrum,
	Avalanche,
	Optimism,
	Nova,
	BNBTestnet: BNBTestnetNFT,
	BNBOp: BNBOpNFT,
	Moonbeam: MoonbeamNFT,
	...NFTChains
} = Chains;
export type NFTChainsType = Exclude<
	(typeof NFTChains)[keyof typeof NFTChains],
	| "Arbitrum"
	| "Avalanche"
	| "Optimism"
	| "Nova"
	| "BNBTestnet"
	| "BNBOp"
	| "Moonbeam"
>;
export type NFTChainsKey = keyof typeof NFTChains;

export type NFTData = {
	[key: string]: string;
};

export type NFTDataType = Record<NFTChainsType, NFTData>;

// ZKBRIDGE CHAINS
export const { BNBTestnet: BNBTestnetZK, ...ZKBridgeChains } = Chains;
export type ZKBridgeChainsType = Exclude<
	(typeof ZKBridgeChains)[keyof typeof ZKBridgeChains],
	"BNBTestnet"
>;
export type ZKBridgeChainsKey = keyof typeof ZKBridgeChains;

export type ZKBridgeData = {
	nftBridge?: string;
	lzrNFTBridge?: string;
	id?: number;
	nftClaim?: string;
	messageBridge?: string;
	mailbox?: string;
};

export type ZKBridgeDataType = Record<ZKBridgeChainsType, ZKBridgeData>;

// L0 CHAINS
export const { BNBTestnet: BNBTestnetL0, BNBOp: BNBOpL0, ...L0Chains } = Chains;
export type L0ChainType = Exclude<
	(typeof L0Chains)[keyof typeof L0Chains],
	"BNBTestnet" | "BNBOp"
>;
export type L0ChainKey = keyof typeof L0Chains;
export type L0Data = {
	chainId: number;
	endpoint: string;
	lzrMailbox?: string;
};
export type L0ChainDataType = Record<L0ChainType, L0Data>;

// PROXY
export type Proxy = {
	ip: string;
	port: string;
	username: string;
	password: string;
};

export type Proxies = {
	[name: string]: Proxy;
};

// MISC
// export type WalletData = {
// 	name: number;
// 	address: string;
// 	signer: Wallet | HDNodeWallet;
// };

export type WalletData = {
	name: string;
	privateKey: string;
};

// MODULES
export const Modules = {
	NFTBRIDGE: "NFTBRIDGE",
	MESSENGER: "MESSENGER",
} as const;
export type ModulesType = (typeof Modules)[keyof typeof Modules];
