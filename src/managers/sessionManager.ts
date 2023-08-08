import { HDNodeWallet, Wallet } from "ethers";
import { Got } from "got";
import { config } from "../../config.js";
import { BridgeManager } from "../../data/zkbridge-data.js";
import { ChainsType, Proxy, ZKBridgeChainsType } from "../types.js";
import { gotWithProxy } from "../utils/gotHeadersProxy.js";
import { logger } from "../utils/logger.js";
import { ProviderManager } from "./../../data/chain-data.js";
import { L0ChainType } from "./../types.js";

type AuthResponse = {
	status: string;
	message: string;
};

type SignInResponse = {
	code: number;
	expire: string;
	token: string;
};

type StartSessionResponse = {
	id: string;
};

type CreateOrderResponse = {
	id: string;
};

type GenerateProofResponse = {
	chain_id: string;
};

type ClaimOrderResponse = {
	status: number;
};

export class SessionManager {
	private signer: Wallet | HDNodeWallet;
	private address: string;
	private proxy?: Proxy;
	private gotProxy: Got;
	private sessionStarted: boolean | undefined;

	constructor(wallet: Wallet | HDNodeWallet, proxy?: Proxy) {
		this.signer = wallet;
		this.address = wallet.address;
		if (config.MODULES.PROXY_ENFORCE && !proxy)
			throw new Error("PROXIES MUST BE USED");
		if (!proxy) logger.warn`PROXY IS NOT SET`;
		this.proxy = proxy;

		this.gotProxy = gotWithProxy(proxy).extend({
			headers: {
				authority: "api.zkbridge.com",
				origin: "https://zkbridge.com",
				referer: "https://zkbridge.com",
			},
		});
	}

	async testProxy() {
		try {
			const response = await this.gotProxy.get(
				"https://api64.ipify.org?format=json"
			);
			logger.log`Proxy IP: ${JSON.parse(response.body).ip}`;
		} catch (error) {
			logger.error`Error testing proxy: ${error}`;
		}
	}

	private async auth() {
		await this.testProxy();

		const payload = {
			publicKey: this.address.toLowerCase(),
		};

		const response: AuthResponse = await this.gotProxy
			.post("https://api.zkbridge.com/api/signin/validation_message", {
				json: payload,
			})
			.json();

		if (response.status === "ok") {
			const msg = response.message;
			const signature = await this.signer.signMessage(msg);
			return signature;
		}
		logger.warn`Auth request error: ${response}`;
	}

	private async signIn() {
		logger.info`Starting signIn...`;
		const signature = await this.auth();

		const payload = {
			publicKey: this.address.toLowerCase(),
			signedMessage: signature,
		};

		const response: SignInResponse = await this.gotProxy
			.post("https://api.zkbridge.com/api/signin", {
				json: payload,
				responseType: "json",
			})
			.json();

		if (response.code === 200) {
			const token = response.token;

			this.gotProxy = this.gotProxy.extend({
				headers: {
					authorization: `Bearer ${token}`,
				},
			});
			return;
		}
		logger.warn`SignIn request error: ${response}`;
	}

	async startSession() {
		logger.info`Starting startSession`;
		await this.signIn();

		const response: StartSessionResponse = await this.gotProxy
			.get("https://api.zkbridge.com/api/user/profile")
			.json();
		if (response.id) {
			logger.success`Successfully authorized on https://zkbridge.com`;
			this.sessionStarted = true;
			return;
		}
		logger.warn`startSession request error: ${response}`;
	}

	private async createOrder(
		fromChain: ChainsType,
		toChain: ChainsType,
		hash: string,
		nftAddress: string,
		nftId: number,
		isL0: boolean
	) {
		logger.info`Starting createOrder...`;

		const sourceChainId = ProviderManager.getChainId(fromChain);
		const targetChainId = ProviderManager.getChainId(toChain);

		const payload = {
			contracts: [
				{
					contractAddress: nftAddress,
					tokenId: Number(nftId),
				},
			],
			from: this.address.toLowerCase(),
			isL0,
			sourceChainId,
			targetChainId,
			to: this.address.toLowerCase(),
			txHash: hash,
		};

		const response: CreateOrderResponse = await this.gotProxy
			.post("https://api.zkbridge.com/api/bridge/createOrder", {
				json: payload,
				responseType: "json",
			})
			.json();

		if (response.id) {
			logger.success`Order created: ${response.id}`;
			return response.id;
		}
		logger.warn`createOrder request error: ${response}`;
		throw new Error("Failed to create order");
	}

	async generateProof(hash: string, fromChain: ZKBridgeChainsType) {
		const chain_id = BridgeManager.getChainId(fromChain);
		const payload = {
			tx_hash: hash,
			chain_id,
		};

		const response: GenerateProofResponse = await this.gotProxy
			.post("https://api.zkbridge.com/api/v2/receipt_proof/generate", {
				json: payload,
				responseType: "json",
			})
			.json();

		if (response.chain_id) {
			logger.success`Proof generated`;
			return response;
		}
		logger.warn`generateProof request error: ${response}`;
	}
	async claimOrder(claimHash: string, orderId: string) {
		logger.info`Starting claimOrder...`;
		const payload = {
			claimHash,
			id: orderId,
		};

		const response: any = await this.gotProxy
			.post("https://api.zkbridge.com/api/bridge/claimOrder", {
				json: payload,
			})
			.json();

		if (response.statusCode === 200) {
			logger.success`Claimed NFT order`;
			return;
		}
		logger.warn`generateProof request error: ${response}`;
	}

	async runSession(
		fromChain: ZKBridgeChainsType,
		toChain: L0ChainType | ZKBridgeChainsType,
		hash: string,
		nftAddress: string,
		nftId: number,
		isL0: boolean
	) {
		if (!this.sessionStarted)
			throw new Error("Not signed in. Need to startSession first!");

		const orderId = await this.createOrder(
			fromChain,
			toChain,
			hash,
			nftAddress,
			nftId,
			isL0
		);
		return orderId;
	}
}
