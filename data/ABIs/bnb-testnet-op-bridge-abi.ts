export const BNB_TESTNET_OP_BRIDGE_ABI = [
	{
		constant: false,
		inputs: [
			{
				name: "_l2Gas",
				type: "uint32",
			},
			{
				name: "_data",
				type: "bytes",
			},
		],
		name: "depositETH",
		outputs: [],
		payable: true,
		stateMutability: "payable",
		type: "function",
	},
];
