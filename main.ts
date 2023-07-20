import { ethers } from "ethers";
import { config } from "./config.js";
import { runModules } from "./src/runModules.js";
import { WalletData } from "./src/types.js";
import { countdownTimer } from "./src/utils/countdownTimer.js";
import { errorHandler } from "./src/utils/errorHandler.js";
import { importProxies } from "./src/utils/importProxies.js";
import { logger } from "./src/utils/logger.js";
import { shuffleArr } from "./src/utils/utils.js";

const { EXCLUDED_WALLETS } = config;
const excludedWalletsSet = new Set(EXCLUDED_WALLETS);

const proxies = await importProxies("./proxies.txt");

process.on("unhandledRejection", (reason, promise) => {
	if (reason instanceof Error) {
		errorHandler(reason);
	} else {
		console.error("Unhandled Rejection at:", promise, "reason:", reason);
	}
});

async function processWallet(walletData: WalletData) {
	const { name, privateKey } = walletData;
	const wallet = new ethers.Wallet(privateKey);
	const address = wallet.address;

	logger.setCustomPrepend(`[Name: ${name}][${address}]`);

	if (excludedWalletsSet.has(+name)) {
		logger.info`Skipping wallet as it's in the excluded list.`;
		return;
	}

	const proxy = proxies[name];

	await runModules(wallet, proxy);

	logger.success`Task completed, waiting for next wallet...`;
	await countdownTimer(
		config.MIN_WALLET_WAIT_TIME,
		config.MAX_WALLET_WAIT_TIME
	);
}

async function processWallets(wallets: WalletData[]) {
	for (let i = 0; i < wallets.length; i++) {
		await processWallet(wallets[i]);
	}
	logger.success`Automation job completed`;
}

async function main() {
	const wallets: WalletData[] = shuffleArr(config.SECRET_WALLET_DATA ?? []);

	if (wallets.length === 0) throw new Error("Wallets array is empty");

	await processWallets(wallets);

	process.exit(0);
}

main();
