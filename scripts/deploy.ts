import { ethers } from "hardhat";
import { erc20 } from "../typechain-types/@openzeppelin/contracts/token";
const MATIC_FEED_ADDRESS = "0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada";
const DAI_FEED_ADDRESS = "0x0FCAa9c899EC5A91eBc3D5Dd869De833b06fB046";
export const NIKO_TOKEN_ADDRESS = "0xD416889755FCceF5bEFFb5BDE6bcf57C11813F8E";

async function main() {
  // const initialFundTest = ethers.utils.parseEther("10");
  const TokenSell = await ethers.getContractFactory("NikoSell");
  const tokenSell = await TokenSell.deploy(
    MATIC_FEED_ADDRESS,
    NIKO_TOKEN_ADDRESS
  );

  await tokenSell.deployed();
  console.log(`Token sell contract deployed at ${tokenSell.address}`);
  // console.log(`Funding with 10 NKOs`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
