import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { Modules } from "./src/types.js";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "PATH TO YOUR WALLET FILE") });

if (!process.env.WALLETS) throw new Error("Missing wallet data");

export const config = {
	MIN_WALLET_WAIT_TIME: 60 * 60 * 0.15, // seconds
	MAX_WALLET_WAIT_TIME: 60 * 60 * 0.25, // seconds
	MIN_SWAP_WAIT_TIME: 60 * 60 * 0.25, // seconds
	MAX_SWAP_WAIT_TIME: 60 * 60 * 0.5, // seconds
	EXCLUDED_WALLETS: [] as number[],
	SECRET_WALLET_DATA: JSON.parse(process.env.WALLETS),
	MODULES: {
		PROXY_ENFORCE: true, // true/false. Enforce proxy usage for zkbridge.com
		ORDER: "random",
		[Modules.MESSENGER]: {
			ENABLED: true, // true/false
			FROM_CHAIN: "random", // bsc, polygon, or random
			TO_CHAIN: [], // Optional. Fill with Chains type: Chains.Nova, etc. See ./data/lzr-data.ts for more options.
			MESSAGE: "ZK light client is live on LayerZero! 🌈", // your message or random
		},
		[Modules.NFTBRIDGE]: {
			ENABLED: true, // true or false
			ENABLE_SESSION: false, // runs login session on zkbridge.com. Proxy usage is recommended.
		},
	},
};
