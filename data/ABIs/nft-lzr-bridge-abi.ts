export const NFT_LZR_BRIDGE_ABI = [
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint8",
				name: "version",
				type: "uint8",
			},
		],
		name: "Initialized",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint16",
				name: "_srcChainId",
				type: "uint16",
			},
			{
				indexed: false,
				internalType: "bytes",
				name: "_srcAddress",
				type: "bytes",
			},
			{
				indexed: false,
				internalType: "uint64",
				name: "_nonce",
				type: "uint64",
			},
			{
				indexed: false,
				internalType: "bytes",
				name: "_payload",
				type: "bytes",
			},
			{
				indexed: false,
				internalType: "bytes",
				name: "_reason",
				type: "bytes",
			},
		],
		name: "MessageFailed",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "previousOwner",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "newOwner",
				type: "address",
			},
		],
		name: "OwnershipTransferred",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "uint64",
				name: "sequence",
				type: "uint64",
			},
			{
				indexed: false,
				internalType: "address",
				name: "sourceToken",
				type: "address",
			},
			{
				indexed: false,
				internalType: "address",
				name: "token",
				type: "address",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "tokenID",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "uint16",
				name: "sourceChain",
				type: "uint16",
			},
			{
				indexed: false,
				internalType: "uint16",
				name: "sendChain",
				type: "uint16",
			},
			{
				indexed: false,
				internalType: "address",
				name: "recipient",
				type: "address",
			},
		],
		name: "ReceiveNFT",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint16",
				name: "_srcChainId",
				type: "uint16",
			},
			{
				indexed: false,
				internalType: "bytes",
				name: "_srcAddress",
				type: "bytes",
			},
			{
				indexed: false,
				internalType: "uint64",
				name: "_nonce",
				type: "uint64",
			},
			{
				indexed: false,
				internalType: "bytes32",
				name: "_payloadHash",
				type: "bytes32",
			},
		],
		name: "RetryMessageSuccess",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint16",
				name: "_dstChainId",
				type: "uint16",
			},
			{
				indexed: false,
				internalType: "uint16",
				name: "_type",
				type: "uint16",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "_minDstGas",
				type: "uint256",
			},
		],
		name: "SetMinDstGas",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint16",
				name: "_remoteChainId",
				type: "uint16",
			},
			{
				indexed: false,
				internalType: "bytes",
				name: "_path",
				type: "bytes",
			},
		],
		name: "SetTrustedRemote",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint16",
				name: "_remoteChainId",
				type: "uint16",
			},
			{
				indexed: false,
				internalType: "bytes",
				name: "_remoteAddress",
				type: "bytes",
			},
		],
		name: "SetTrustedRemoteAddress",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "uint64",
				name: "sequence",
				type: "uint64",
			},
			{
				indexed: false,
				internalType: "address",
				name: "token",
				type: "address",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "tokenID",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "uint16",
				name: "recipientChain",
				type: "uint16",
			},
			{
				indexed: false,
				internalType: "address",
				name: "sender",
				type: "address",
			},
			{
				indexed: false,
				internalType: "address",
				name: "recipient",
				type: "address",
			},
		],
		name: "TransferNFT",
		type: "event",
	},
	{
		inputs: [{ internalType: "bytes", name: "_encoded", type: "bytes" }],
		name: "_parseTransfer",
		outputs: [
			{
				components: [
					{
						internalType: "address",
						name: "tokenAddress",
						type: "address",
					},
					{
						internalType: "uint16",
						name: "tokenChain",
						type: "uint16",
					},
					{
						internalType: "bytes32",
						name: "symbol",
						type: "bytes32",
					},
					{ internalType: "bytes32", name: "name", type: "bytes32" },
					{
						internalType: "uint256",
						name: "tokenID",
						type: "uint256",
					},
					{ internalType: "string", name: "uri", type: "string" },
					{ internalType: "address", name: "to", type: "address" },
					{ internalType: "uint16", name: "toChain", type: "uint16" },
				],
				internalType: "struct NFT721Bridge.Transfer721",
				name: "transfer",
				type: "tuple",
			},
		],
		stateMutability: "pure",
		type: "function",
	},
	{
		inputs: [{ internalType: "uint16", name: "", type: "uint16" }],
		name: "chainFee",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "chainId",
		outputs: [{ internalType: "uint16", name: "", type: "uint16" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "claimFees",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "_token", type: "address" },
			{ internalType: "uint256", name: "_tokenId", type: "uint256" },
			{ internalType: "uint16", name: "_recipientChain", type: "uint16" },
			{ internalType: "address", name: "_recipient", type: "address" },
			{ internalType: "bytes", name: "_adapterParams", type: "bytes" },
		],
		name: "estimateFee",
		outputs: [{ internalType: "uint256", name: "fee", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "uint16", name: "", type: "uint16" },
			{ internalType: "bytes", name: "", type: "bytes" },
			{ internalType: "uint64", name: "", type: "uint64" },
		],
		name: "failedMessages",
		outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "uint16", name: "_srcChainId", type: "uint16" },
			{ internalType: "bytes", name: "_srcAddress", type: "bytes" },
		],
		name: "forceResumeReceive",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "uint16", name: "_version", type: "uint16" },
			{ internalType: "uint16", name: "_chainId", type: "uint16" },
			{ internalType: "address", name: "", type: "address" },
			{ internalType: "uint256", name: "_configType", type: "uint256" },
		],
		name: "getConfig",
		outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "uint16", name: "_remoteChainId", type: "uint16" },
		],
		name: "getTrustedRemoteAddress",
		outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "uint16", name: "_chainId", type: "uint16" },
			{ internalType: "address", name: "_endpoint", type: "address" },
		],
		name: "initialize",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "uint16", name: "_srcChainId", type: "uint16" },
			{ internalType: "bytes", name: "_srcAddress", type: "bytes" },
		],
		name: "isTrustedRemote",
		outputs: [{ internalType: "bool", name: "", type: "bool" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "lzEndpoint",
		outputs: [
			{
				internalType: "contract ILayerZeroEndpoint",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "uint16", name: "_srcChainId", type: "uint16" },
			{ internalType: "bytes", name: "_srcAddress", type: "bytes" },
			{ internalType: "uint64", name: "_nonce", type: "uint64" },
			{ internalType: "bytes", name: "_payload", type: "bytes" },
		],
		name: "lzReceive",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "uint16", name: "_srcChainId", type: "uint16" },
			{ internalType: "bytes", name: "_srcAddress", type: "bytes" },
			{ internalType: "uint64", name: "_nonce", type: "uint64" },
			{ internalType: "bytes", name: "_payload", type: "bytes" },
		],
		name: "nonblockingLzReceive",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "operator", type: "address" },
			{ internalType: "address", name: "", type: "address" },
			{ internalType: "uint256", name: "", type: "uint256" },
			{ internalType: "bytes", name: "", type: "bytes" },
		],
		name: "onERC721Received",
		outputs: [{ internalType: "bytes4", name: "", type: "bytes4" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "owner",
		outputs: [{ internalType: "address", name: "", type: "address" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "renounceOwnership",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "uint16", name: "_srcChainId", type: "uint16" },
			{ internalType: "bytes", name: "_srcAddress", type: "bytes" },
			{ internalType: "uint64", name: "_nonce", type: "uint64" },
			{ internalType: "bytes", name: "_payload", type: "bytes" },
		],
		name: "retryMessage",
		outputs: [],
		stateMutability: "payable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "uint16", name: "_version", type: "uint16" },
			{ internalType: "uint16", name: "_chainId", type: "uint16" },
			{ internalType: "uint256", name: "_configType", type: "uint256" },
			{ internalType: "bytes", name: "_config", type: "bytes" },
		],
		name: "setConfig",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "uint16", name: "_dstChainId", type: "uint16" },
			{ internalType: "uint256", name: "_fee", type: "uint256" },
		],
		name: "setFee",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "_lzEndpoint", type: "address" },
		],
		name: "setLzEndpoint",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [{ internalType: "uint16", name: "_version", type: "uint16" }],
		name: "setReceiveVersion",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [{ internalType: "uint16", name: "_version", type: "uint16" }],
		name: "setSendVersion",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "uint16", name: "_srcChainId", type: "uint16" },
			{ internalType: "bytes", name: "_path", type: "bytes" },
		],
		name: "setTrustedRemote",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "uint16", name: "_remoteChainId", type: "uint16" },
			{ internalType: "bytes", name: "_remoteAddress", type: "bytes" },
		],
		name: "setTrustedRemoteAddress",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "uint16", name: "_nativeChainId", type: "uint16" },
			{
				internalType: "address",
				name: "_nativeContract",
				type: "address",
			},
			{ internalType: "address", name: "_wrapper", type: "address" },
		],
		name: "setWrappedAsset",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "_token", type: "address" },
			{ internalType: "uint256", name: "_tokenId", type: "uint256" },
			{ internalType: "uint16", name: "_recipientChain", type: "uint16" },
			{ internalType: "address", name: "_recipient", type: "address" },
			{ internalType: "bytes", name: "_adapterParams", type: "bytes" },
		],
		name: "transferNFT",
		outputs: [{ internalType: "uint64", name: "sequence", type: "uint64" }],
		stateMutability: "payable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "newOwner", type: "address" },
		],
		name: "transferOwnership",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [{ internalType: "uint16", name: "", type: "uint16" }],
		name: "trustedRemoteLookup",
		outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [{ internalType: "address", name: "", type: "address" }],
		name: "wrappedAssetData",
		outputs: [
			{ internalType: "uint16", name: "nativeChainId", type: "uint16" },
			{
				internalType: "address",
				name: "nativeContract",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "uint16", name: "", type: "uint16" },
			{ internalType: "address", name: "", type: "address" },
		],
		name: "wrappedAssets",
		outputs: [{ internalType: "address", name: "", type: "address" }],
		stateMutability: "view",
		type: "function",
	},
];
