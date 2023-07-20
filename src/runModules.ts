import { HDNodeWallet, Wallet } from "ethers";
import { config } from "../config.js";
import { MessageManager } from "./managers/messagesManager.js";
import { NFTContractManager } from "./managers/nftManager.js";
import { Modules, ModulesType, Proxy } from "./types.js";
import { logger } from "./utils/logger.js";
import { shuffleArr } from "./utils/utils.js";

type Module = {
	fn: Function;
	args: any[];
	name: ModulesType;
};

const runNFTContractManager = async (wallet: any, proxy: any) => {
	const nftManager = new NFTContractManager();
	return await nftManager.randomMint(wallet, proxy);
};

const runMessageManager = async (wallet: any) => {
	const messenger = new MessageManager(wallet);
	return await messenger.sendMessage();
};

export async function runModules(wallet: Wallet | HDNodeWallet, proxy: Proxy) {
	const modules: Module[] = [
		{
			fn: runNFTContractManager,
			args: [wallet, proxy],
			name: Modules.NFTBRIDGE,
		},
		{
			fn: runMessageManager,
			args: [wallet],
			name: Modules.MESSENGER,
		},
	];

	if (config.MODULES.ORDER === "random") {
		shuffleArr(modules);
	}

	for (const module of modules) {
		const moduleName = module.name;

		if (config.MODULES[moduleName].ENABLED) {
			try {
				await module.fn(...module.args);
				logger.log`Module ${moduleName} executed successfully.`;
			} catch (error) {
				logger.warn`Module ${moduleName} failed, switching to next one...`;
			}
		}
	}
}
