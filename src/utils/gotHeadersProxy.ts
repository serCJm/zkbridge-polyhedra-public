import got, { ExtendOptions, Got } from "got";
import { HttpsProxyAgent } from "hpagent";
import { CookieJar } from "tough-cookie";
import { Proxy } from "../types.js";
import { randomNumber } from "./utils.js";

const userAgents = [
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:53.0) Gecko/20100101 Firefox/53.0",
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Safari/537.36 Edge/14.14393",
];

function getRandomUserAgent() {
	const randomIndex = randomNumber(0, userAgents.length - 1);
	return userAgents[randomIndex];
}

const jar = new CookieJar();
const gotWithHeaders = got.extend({
	cookieJar: jar,
	headers: {
		accept: "application/json, text/plain, */*",
		"accept-language": "en-US;q=0.8,en;q=0.7",
		"content-type": "application/json",
		"sec-ch-ua":
			'"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
		"sec-ch-ua-mobile": "?0",
		"sec-ch-ua-platform": '"Windows"',
		"sec-fetch-dest": "empty",
		"sec-fetch-mode": "cors",
		"sec-fetch-site": "same-site",
		"user-agent": getRandomUserAgent(), // Generate random user agent on import
	},
});

export function gotWithProxy(proxy?: Proxy): Got {
	let gotWithProxy = gotWithHeaders;

	if (proxy) {
		const proxyStr = `http://${proxy.username}:${proxy.password}@${proxy.ip}:${proxy.port}`;

		const options: ExtendOptions = {
			agent: {
				https: new HttpsProxyAgent({ proxy: proxyStr }),
			},
		};

		gotWithProxy = gotWithHeaders.extend(options);
	}

	return gotWithProxy;
}

export { gotWithHeaders };
