import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.19",

  networks: {
    mumbai: {
      url: process.env.ALCHEMY_URL,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY as string],
    },
  },
};

export default config;
