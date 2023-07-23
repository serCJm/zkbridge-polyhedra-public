import { Contract, parseUnits } from "ethers";
import { Chains, ChainsType } from "../../types.js";
import { gotWithHeaders } from "../gotHeadersProxy.js";
import { logger } from "../logger.js";
import { ProviderManager } from "./../../../data/chain-data.js";

type GasFees = {
	maxPriorityFee: number;
	maxFee: number;
};

type GasInfoResponse = {
	safeLow: GasFees;
	standard: GasFees;
	fast: GasFees;
	estimatedBaseFee: number;
	blockTime: number;
	blockNumber: number;
};

type EstimateGasReturnProps = {
	gasLimit?: bigint;
	maxPriorityFeePerGas?: bigint;
	maxFeePerGas?: bigint;
	gasPrice?: bigint;
};

export async function estimateGas(
	chain: ChainsType,
	contract: Contract,
	methodName: string,
	...args: any[]
): Promise<EstimateGasReturnProps> {
	logger.info`Running estimateGas...`;
	try {
		if (chain === Chains.Celo)
			return {
				gasLimit: BigInt(300000),
			};

		const provider = ProviderManager.getProvider(chain);

		const block = await provider.getBlock("latest");
		const baseFee = block?.baseFeePerGas;
		const feeData = await provider.getFeeData();

		let gasPrice;
		let maxPriorityFeePerGas = feeData.maxPriorityFeePerGas || undefined;

		if (chain === Chains.Polygon) {
			const MATIC_GAS_INFO = await gotWithHeaders.get<GasInfoResponse>(
				"https://gasstation.polygon.technology/v2",
				{
					responseType: "json",
				}
			);
			maxPriorityFeePerGas = parseUnits(
				Math.ceil(MATIC_GAS_INFO.body.fast.maxPriorityFee).toString(),
				"gwei"
			);
		} else if (chain === Chains.BSC) {
			gasPrice = parseUnits("1", "gwei");
		}

		let maxFeePerGas;
		if (baseFee && maxPriorityFeePerGas)
			maxFeePerGas = baseFee + maxPriorityFeePerGas;

		let gasLimit;
		try {
			gasLimit = await contract[methodName].estimateGas(...args);
		} catch (err) {
			logger.error`Error while trying to estimate gasLimit: ${err}`;
			gasLimit = BigInt(350000);
		}

		return {
			...(gasLimit !== undefined && {
				gasLimit: gasLimit + BigInt(25000),
			}),
			...(maxPriorityFeePerGas !== undefined && { maxPriorityFeePerGas }),
			...(maxFeePerGas !== undefined && { maxFeePerGas }),
			...(gasPrice !== undefined && { gasPrice }),
		};
	} catch (err) {
		logger.error`Error in estimateGas: ${err}`;
		return {};
	}
}
