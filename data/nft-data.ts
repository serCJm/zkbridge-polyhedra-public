import { Chains, NFTDataType } from "../src/types.js";
export const NFT_DATA: NFTDataType = {
	[Chains.BSC]: {
		greenfield: "0x13d23d867e73af912adf5d5bd47915261efa28f2",
		opBNB: "0x9c614a8e5a23725214024d2c3633be30d44806f9",
		zkLightClient: "0xD2cCC9EE7Ea2ccd154c727A46D475ddA49E99852",
		pandaCode: "0x87a218Ae43C136B3148A45EA1A282517794002c8",
	},
	[Chains.Polygon]: {
		pandaPixel: "0x141A1fb33683C304DA7C3fe6fC6a49B5C0c2dC42",
		zkLightClient: "0x6b0C248679F493481411a0A14cd5FC2DBBe8Ab02",
	},
	[Chains.Core]: {
		mainnetAlpha: "0x61DFDbcC65DaF1F60fB1DbE703D84940dA28526c",
		pandaMelody: "0x36e5121618c0Af89E81AcD33B6b8F5CF5cDD961a",
	},
	[Chains.Celo]: {
		pandaGuardian: "0xb404e5233aB7E426213998C025f05EaBaBD41Da6",
	},
};
