import { ethers } from "hardhat";
import {
  BNB_USD_PRICE_FEED,
  MATIC_USD_PRICE_FEED,
  NIKO_TOKEN_ADDRESS,
} from "../constant/contracts";

async function main() {
  const NikoSell = await ethers.getContractFactory("NikoSell");
  const sell = await NikoSell.deploy(
    MATIC_USD_PRICE_FEED,
    BNB_USD_PRICE_FEED,
    NIKO_TOKEN_ADDRESS
  );
  console.log(`Niko Selling Contract deploying...`);
  await sell.deployed();

  console.log(`deployed to ${sell.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
