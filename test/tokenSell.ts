import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { formatUnits, parseEther } from "ethers/lib/utils";
import { maticWhale, nikoWhale } from "../constant/wallets";
import {
  BNB_USD_PRICE_FEED,
  MATIC_USD_PRICE_FEED,
  NIKO_TOKEN_ADDRESS,
} from "../constant/contracts";

describe("TEST TOKEN SELL", function () {
  async function deployContractFixture() {
    const buyer = await ethers.getImpersonatedSigner(maticWhale);
    const nikoWale = await ethers.getImpersonatedSigner(nikoWhale);
    const [deployer] = await ethers.getSigners();

    const nko = await ethers.getContractAt("IERC20", NIKO_TOKEN_ADDRESS);
    const Sell = await ethers.getContractFactory("NikoSell");
    const sell = await Sell.deploy(
      MATIC_USD_PRICE_FEED,
      BNB_USD_PRICE_FEED,
      NIKO_TOKEN_ADDRESS
    );
    await sell.deployed();

    const sendEth = await buyer.sendTransaction({
      to: nikoWale.address,
      value: parseEther("10"),
    });

    const approve = await nko
      .connect(nikoWale)
      .approve(sell.address, parseEther("100000"));

    const fund = await sell.connect(nikoWale).fundNiko(parseEther("100000"));
    return { buyer, nikoWale, nko, sell };
  }
  // done
  async function sellingContractWithBNBFixture() {
    const { buyer, nikoWale, nko, sell } = await loadFixture(
      deployContractFixture
    );

    const bnb = await ethers.getContractAt(
      "IERC20",
      "0x3BA4c387f786bFEE076A58914F5Bd38d668B42c3"
    );

    const bnbWhale = await ethers.getImpersonatedSigner(
      "0xf79c9CaAd6c7fCCf45d65992D72c585954B8d7fC"
    );

    const sendMaticToBnbWhale = await buyer.sendTransaction({
      to: bnbWhale.address,
      value: parseEther("1"),
    });

    const approveBNB = await bnb
      .connect(bnbWhale)
      .approve(sell.address, parseEther("1"));

    return { nikoWale, nko, sell, bnbWhale, bnb };
  }

  // done
  async function sellingContractWithDAIFixture() {
    const { buyer, nikoWale, nko, sell } = await loadFixture(
      deployContractFixture
    );

    const dai = await ethers.getContractAt(
      "IERC20",
      "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063"
    );

    const daiWhale = await ethers.getImpersonatedSigner(
      "0xE0810Fd9a243f7D930c1afEdcA76Fb3d4de972f5"
    );

    const sendMaticToDaiWhale = await buyer.sendTransaction({
      to: daiWhale.address,
      value: parseEther("1"),
    });

    const approveDAI = await dai
      .connect(daiWhale)
      .approve(sell.address, parseEther("1"));

    return { nikoWale, nko, sell, daiWhale, dai };
  }
  // TODO
  async function withdrawContractFundsFixture() {
    const { buyer, nikoWale, nko, sell } = await loadFixture(
      deployContractFixture
    );

    const bnb = await ethers.getContractAt(
      "IERC20",
      "0x3BA4c387f786bFEE076A58914F5Bd38d668B42c3"
    );

    const bnbWhale = await ethers.getImpersonatedSigner(
      "0xf79c9CaAd6c7fCCf45d65992D72c585954B8d7fC"
    );

    const sendMaticToBnbWhale = await buyer.sendTransaction({
      to: bnbWhale.address,
      value: parseEther("1"),
    });

    const approveBNB = await bnb
      .connect(bnbWhale)
      .approve(sell.address, parseEther("1"));

    return { nikoWale, nko, sell, bnbWhale, bnb };
  }

  describe("Buyers Wallet", function () {
    it("should have MATIC", async function () {
      const { buyer } = await loadFixture(deployContractFixture);
      expect(await buyer.getBalance()).to.greaterThan(parseEther("5000"));
    });
  });

  describe("Hamids Wallet", function () {
    it("should have MATIC", async function () {
      const { nikoWale } = await loadFixture(deployContractFixture);
      expect(await nikoWale.getBalance()).to.greaterThanOrEqual(
        parseEther("1")
      );
    });
    it("should have NKO", async function () {
      const { nikoWale, nko } = await loadFixture(deployContractFixture);
      expect(await nko.balanceOf(nikoWale.address)).to.greaterThan(
        parseEther("10000000")
      );
    });
  });

  describe("TESTING SELLING NIKO", function () {
    describe("Should be able to sell NIKO per MATIC", function () {
      it("Should increase sell contract MATIC balance and subtract user balance correctly", async function () {
        // const { buyer, sell } = await loadFixture(deployContractFixture);
        // const maticPrice = await sell.getMaticLatestPrice();
        // const formattedMaticPrice = formatUnits(maticPrice, "ether");
        // console.log(formattedMaticPrice);
        // const value = 10 * (1 / parseFloat(formattedMaticPrice));
        // await expect(
        //   sell.connect(buyer).buyNikoWithMatic(parseEther("10"), {
        //     value: parseEther(((value * 110) / 100).toString()),
        //   })
        // ).to.changeEtherBalances(
        //   [sell, buyer],
        //   [parseEther(value.toString()), parseEther(`-${value.toString()}`)]
        // );
      });
      it("Should increase buyers NKO balance and subtract sell contract balance correctly", async function () {
        // const { buyer, sell, nko } = await loadFixture(deployContractFixture);
        // const maticPrice = await sell.getMaticLatestPrice();
        // const formattedMaticPrice = formatUnits(maticPrice, "ether");
        // const value = 10 * (1 / parseFloat(formattedMaticPrice));
        // await expect(
        //   sell.connect(buyer).buyNikoWithMatic(parseEther("10"), {
        //     value: parseEther(((value * 110) / 100).toString()),
        //   })
        // ).to.changeTokenBalances(
        //   nko,
        //   [sell, buyer],
        //   [parseEther("-10"), parseEther("10")]
        // );
      });
    });

    describe("Should be able to sell NIKO per BNB", function () {
      it("Should increase sell contract BNB balance and subtract user balance correctly", async function () {
        // const { bnbWhale, sell, nko, bnb } = await loadFixture(
        //   sellingContractWithBNBFixture
        // );
        // const bnbPrice = await sell.getBNBLatestPrice();
        // const formattedBnbPrice = formatUnits(bnbPrice, "ether");
        // const value = 10 * (1 / parseFloat(formattedBnbPrice));
        // await expect(
        //   sell.connect(bnbWhale).buyNikoWithBNB(parseEther("10"))
        // ).to.changeTokenBalances(
        //   bnb,
        //   [sell, bnbWhale],
        //   [parseEther(value.toString()), parseEther(`-${value.toString()}`)]
        // );
      });
      it("Should increase buyer NKO balance and subtract sell contract balance correctly", async function () {
        // const { bnbWhale, sell, nko } = await loadFixture(
        //   sellingContractWithBNBFixture
        // );
        // const bnbPrice = await sell.getBNBLatestPrice();
        // const formattedBnbPrice = formatUnits(bnbPrice, "ether");
        // const value = 10 * (1 / parseFloat(formattedBnbPrice));
        // await expect(
        //   sell.connect(bnbWhale).buyNikoWithBNB(parseEther("10"))
        // ).to.changeTokenBalances(
        //   nko,
        //   [sell, bnbWhale],
        //   [parseEther("-10"), parseEther("10")]
        // );
      });
    });

    // done
    async function sellingContractWithBUSDFixture() {
      const { buyer, nikoWale, nko, sell } = await loadFixture(
        deployContractFixture
      );

      const busd = await ethers.getContractAt(
        "IERC20",
        "0xdAb529f40E671A1D4bF91361c21bf9f0C9712ab7"
      );

      const busdWhale = await ethers.getImpersonatedSigner(
        "0x115Ed5a59C73586D6D00d4E973e1228B4BF9dC19"
      );

      const sendMaticToBUSDWhale = await buyer.sendTransaction({
        to: busdWhale.address,
        value: parseEther("1"),
      });

      const approveBUSD = await busd
        .connect(busdWhale)
        .approve(sell.address, parseEther("10"));

      return { nikoWale, nko, sell, busdWhale, busd };
    }

    describe("Should be able to sell NIKO per BUSD", function () {
      it("Should increase sell contract BUSD balance and subtract user balance correctly", async function () {
        const { busd, busdWhale, sell } = await loadFixture(
          sellingContractWithBUSDFixture
        );

        await expect(
          sell.connect(busdWhale).buyNikoWithBUSD(parseEther("10"))
        ).to.changeTokenBalances(
          busd,
          [busdWhale, sell],
          [parseEther("-10"), parseEther("10")]
        );
      });
      it("Should increase user NKO balance and subtract sell contract balance correctly", async function () {
        const { busdWhale, nko, sell } = await loadFixture(
          sellingContractWithBUSDFixture
        );

        await expect(
          sell.connect(busdWhale).buyNikoWithBUSD(parseEther("10"))
        ).to.changeTokenBalances(
          nko,
          [busdWhale, sell],
          [parseEther("10"), parseEther("-10")]
        );
      });
    });

    describe("Should be able to sell NIKO per DAI", function () {
      it("Should increase sell contract DAI balance and subtract user balance correctly", async function () {});
      it("Should increase user NKO balance and subtract sell contract balance correctly", async function () {});
    });

    // it("Should be able to sell NIKO per BUSD", async function () {
    //   const { buyer, sell, nko } = await loadFixture(sellingContractFixture);
    //   const maticPrice = await sell.getMaticLatestPrice();
    //   const formattedMaticPrice = formatUnits(maticPrice, "ether");
    //   const value = 10 * (1 / parseFloat(formattedMaticPrice));

    //   await expect(
    //     sell.connect(buyer).buyNikoWithMatic(parseEther("10"), {
    //       value: parseEther(value.toString()),
    //     })
    //   ).to.changeEtherBalances(
    //     [sell, buyer],
    //     [parseEther(value.toString()), parseEther(`-${value.toString()}`)]
    //   );
    //   await expect(
    //     sell.connect(buyer).buyNikoWithMatic(parseEther("10"), {
    //       value: parseEther(value.toString()),
    //     })
    //   ).to.changeTokenBalances(
    //     nko,
    //     [sell, buyer],
    //     [parseEther("-10"), parseEther("10")]
    //   );
    // });

    // it("Should be able to sell NIKO per DAI", async function () {
    //   const { buyer, sell, nko } = await loadFixture(sellingContractFixture);
    //   const maticPrice = await sell.getMaticLatestPrice();
    //   const formattedMaticPrice = formatUnits(maticPrice, "ether");
    //   const value = 10 * (1 / parseFloat(formattedMaticPrice));

    //   await expect(
    //     sell.connect(buyer).buyNikoWithMatic(parseEther("10"), {
    //       value: parseEther(value.toString()),
    //     })
    //   ).to.changeEtherBalances(
    //     [sell, buyer],
    //     [parseEther(value.toString()), parseEther(`-${value.toString()}`)]
    //   );
    //   await expect(
    //     sell.connect(buyer).buyNikoWithMatic(parseEther("10"), {
    //       value: parseEther(value.toString()),
    //     })
    //   ).to.changeTokenBalances(
    //     nko,
    //     [sell, buyer],
    //     [parseEther("-10"), parseEther("10")]
    //   );
    // });

    describe("ADMIN_ROLE should be able to withdraw contracts assets", function () {
      it("Should withdraw ETH balance", async function () {});
      it("Should withdraw BNB balance", async function () {});
      it("Should withdraw BUSD balance", async function () {});
      it("Should withdraw DAI balance", async function () {});
      it("Should fail if caller is not ADMIN_ROLE", async function () {});
      it("Should fail with correct message if amount exceeds balance", async function () {});
    });
  });
});
