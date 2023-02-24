import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      forking: {
        url: process.env.MAINNET_ALCHEMY_API as string,
        blockNumber: 38753805,
        enabled: true,
      },
      gas: "auto",
    },

    polygonMumbai: {
      accounts: [process.env.ACCOUNT_PRIVATE_KEY as string],
      url: process.env.MUMBAI_ALCHEMY_API as string,
    },
  },
};

export default config;
