import { Chains, NFTDataType } from "../src/types.js";
export const NFT_DATA: NFTDataType = {
	[Chains.BSC]: {
		// greenfield: "0x13d23d867e73af912adf5d5bd47915261efa28f2",
		// opBNB: "0x9c614a8e5a23725214024d2c3633be30d44806f9",
		pandaCode: "0x87a218Ae43C136B3148A45EA1A282517794002c8", // native
		pandaPixel: "0x45eB7E752e446dB7e7C757b21B26cbc897345843",
		pandaMelody: "0x917b43b57d25952c1A8Ce1af68aec95678D1246e",
		pandaGuardian: "0x1d143F26540c4bf893d74beF4a5D9999987E492b",
	},
	[Chains.Polygon]: {
		pandaCode: "0xe7C224EC925e877659FfbAB6D44bDf0413135C51",
		pandaPixel: "0x141A1fb33683C304DA7C3fe6fC6a49B5C0c2dC42", // native
		pandaMelody: "0x20fb7ec336958Ea887A288Ce49999D7d7C08529C",
		pandaGuardian: "0x9d03aB31c0e71D909C68d3f6bB7483577bA8dcd7",
		// zkLightClient: "0x6b0C248679F493481411a0A14cd5FC2DBBe8Ab02",
	},
	[Chains.Core]: {
		// mainnetAlpha: "0x61DFDbcC65DaF1F60fB1DbE703D84940dA28526c",
		pandaCode: "0x9bcc6c79c164161a3d14e61f1290074cdff57bc7",
		pandaPixel: "0x7dee1f908408fd415e2ae1b71b6b8ecb13c1d550",
		pandaMelody: "0x36e5121618c0Af89E81AcD33B6b8F5CF5cDD961a", // native
		pandaGuardian: "0xfb4be23f923d31ee8615d7550e8cc368977137c3",
	},
	[Chains.Celo]: {
		pandaCode: "0xbf782f6Eb61d617f7f72B978329339Aa728D21DB",
		pandaPixel: "0x1dAbddd9A30fc0BBE9efd0e6d370dDF902a974c4",
		pandaMelody: "0x5cc21549639F1643D27de5735a4ea19Bb1FB3335",
		pandaGuardian: "0xb404e5233aB7E426213998C025f05EaBaBD41Da6", // native
	},
	[Chains.Combo]: {
		pandaCode: "0x457066a03227aef7931f1aec38e0b4e6872e3cd2",
		pandaPixel: "0xa41de6806809f5915d0049c84e7f68aa776547cc",
		pandaMelody: "0x897ebff4c1d6f3fa487a858dba37ca8137626f1b",
		pandaGuardian: "0xb36a2ef053cc780ebcb6c89b0be42f0a2a5d1955",
	},
	[Chains.Mantle]: {
		pandaCode: "0x03dDC4b60D6bBf399A8397d73462060FdFb83476",
		pandaPixel: "0xCf995797cB2E65Cc290e084f0127B1e8Ebc692c8",
		pandaMelody: "0xE09828f0DA805523878Be66EA2a70240d312001e",
		// pandaGuardian: "",
	},
	[Chains.BNBOp]: {
		pandaCode: "0xc661f774a9d713f00cccebc37b16cf836b78d665",
		pandaPixel: "0x9bcc6c79c164161a3d14e61f1290074cdff57bc7",
		pandaMelody: "0x7dee1f908408fd415e2ae1b71b6b8ecb13c1d550",
		pandaGuardian: "0xddc726e51041d9489cb51b81067d89e91c0aa5aa",
	},
};
