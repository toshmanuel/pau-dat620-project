const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("IDO", function () {
  let dimsToken: any;
  let ido: any;
  let owner: any;
  let addr1: any;
  let addr2: any;

  const INITIAL_SUPPLY = ethers.utils.parseEther("1000000000"); // 1 billion tokens
  const ACTUAL_SUPPLY = INITIAL_SUPPLY.mul(ethers.utils.parseEther("1")); // Contract multiplies by 10^18
  const IDO_RATE = ethers.utils.parseUnits("66225165", 0); // 66,225,165 tokens per ETH
  const IDO_CAP = ethers.utils.parseEther("10"); // 10 ETH cap
  const IDO_DURATION = 7 * 24 * 60 * 60; // 7 days in seconds
  const IDO_ALLOCATION = ACTUAL_SUPPLY.div(10); // 10% of total supply

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy DimsToken
    const DimsToken = await ethers.getContractFactory("DimsToken");
    dimsToken = await DimsToken.deploy(INITIAL_SUPPLY);
    await dimsToken.deployed();

    // Deploy IDO
    const IDO = await ethers.getContractFactory("IDO");
    ido = await IDO.deploy(
      dimsToken.address,
      IDO_RATE,
      IDO_CAP,
      IDO_DURATION,
      owner.address
    );
    await ido.deployed();

    // Transfer tokens to IDO contract
    await dimsToken.transfer(ido.address, IDO_ALLOCATION);
  });

  describe("Deployment", function () {
    it("Should set the correct token address", async function () {
      expect(await ido.token()).to.equal(dimsToken.address);
    });

    it("Should set the correct rate", async function () {
      expect((await ido.rate()).toString()).to.equal(IDO_RATE.toString());
    });

    it("Should set the correct cap", async function () {
      expect((await ido.cap()).toString()).to.equal(IDO_CAP.toString());
    });

    it("Should set the correct start time", async function () {
      const startTime = await ido.startTime();
      const currentTime = await ethers.provider.getBlock("latest").then(block => block!.timestamp);
      expect(startTime.toNumber()).to.be.closeTo(currentTime, 5); // Allow 5 seconds tolerance
    });

    it("Should set the correct end time", async function () {
      const endTime = await ido.endTime();
      const startTime = await ido.startTime();
      expect(endTime.toString()).to.equal(startTime.add(IDO_DURATION).toString());
    });

    it("Should set the correct owner", async function () {
      expect(await ido.owner()).to.equal(owner.address);
    });

    it("Should initialize raised amount to zero", async function () {
      expect((await ido.raised()).toString()).to.equal("0");
    });
  });

  describe("Token Purchases", function () {
    it("Should allow users to buy tokens with ETH", async function () {
      const ethAmount = ethers.utils.parseEther("0.1");
      const expectedTokens = ethAmount.mul(IDO_RATE);

      const tx = await ido.connect(addr1).buyTokens({ value: ethAmount });
      const receipt = await tx.wait();

      const userBalance = await dimsToken.balanceOf(addr1.address);
      expect(userBalance.toString()).to.equal(expectedTokens.toString());

      // Check for TokensPurchased event
      const purchaseEvent = receipt.events?.find((e: any) => e.event === "TokensPurchased");
      expect(purchaseEvent).to.not.be.undefined;
      expect(purchaseEvent.args.buyer).to.equal(addr1.address);
      expect(purchaseEvent.args.amount.toString()).to.equal(expectedTokens.toString());
    });

    it("Should update raised amount after purchase", async function () {
      const ethAmount = ethers.utils.parseEther("0.1");
      
      await ido.connect(addr1).buyTokens({ value: ethAmount });
      
      const raised = await ido.raised();
      expect(raised.toString()).to.equal(ethAmount.toString());
    });

    it("Should track user contributions", async function () {
      const ethAmount = ethers.utils.parseEther("0.1");
      
      await ido.connect(addr1).buyTokens({ value: ethAmount });
      
      const contribution = await ido.contributions(addr1.address);
      expect(contribution.toString()).to.equal(ethAmount.toString());
    });

    it("Should allow multiple purchases from same user", async function () {
      const ethAmount1 = ethers.utils.parseEther("0.05");
      const ethAmount2 = ethers.utils.parseEther("0.03");
      const totalEth = ethAmount1.add(ethAmount2);
      const expectedTokens = totalEth.mul(IDO_RATE);

      await ido.connect(addr1).buyTokens({ value: ethAmount1 });
      await ido.connect(addr1).buyTokens({ value: ethAmount2 });

      const userBalance = await dimsToken.balanceOf(addr1.address);
      const contribution = await ido.contributions(addr1.address);
      
      expect(userBalance.toString()).to.equal(expectedTokens.toString());
      expect(contribution.toString()).to.equal(totalEth.toString());
    });

    it("Should calculate correct token amount based on rate", async function () {
      const ethAmount = ethers.utils.parseEther("1");
      const expectedTokens = ethAmount.mul(IDO_RATE);

      await ido.connect(addr1).buyTokens({ value: ethAmount });

      const userBalance = await dimsToken.balanceOf(addr1.address);
      expect(userBalance.toString()).to.equal(expectedTokens.toString());
    });
  });

  describe("Purchase Restrictions", function () {
    it("Should fail if purchase exceeds cap", async function () {
      const ethAmount = IDO_CAP.add(ethers.utils.parseEther("0.1"));
      
      try {
        await ido.connect(addr1).buyTokens({ value: ethAmount });
        expect.fail("Expected transaction to fail");
      } catch (error: any) {
        expect(error.message).to.include("Cap exceeded");
      }
    });

    it("Should fail if multiple purchases exceed cap", async function () {
      const ethAmount1 = ethers.utils.parseEther("9.5");
      const ethAmount2 = ethers.utils.parseEther("1"); // This would exceed the 10 ETH cap
      
      await ido.connect(addr1).buyTokens({ value: ethAmount1 });
      
      try {
        await ido.connect(addr2).buyTokens({ value: ethAmount2 });
        expect.fail("Expected transaction to fail");
      } catch (error: any) {
        expect(error.message).to.include("Cap exceeded");
      }
    });
  });

  describe("Owner Functions", function () {
    it("Should allow owner to withdraw funds", async function () {
      const ethAmount = ethers.utils.parseEther("1");
      await ido.connect(addr1).buyTokens({ value: ethAmount });

      const initialOwnerBalance = await ethers.provider.getBalance(owner.address);
      
      const tx = await ido.withdrawFunds();
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed.mul(receipt.effectiveGasPrice);
      
      const finalOwnerBalance = await ethers.provider.getBalance(owner.address);
      
      expect(finalOwnerBalance.toString()).to.equal(initialOwnerBalance.add(ethAmount).sub(gasUsed).toString());
    });

    it("Should fail if non-owner tries to withdraw funds", async function () {
      const ethAmount = ethers.utils.parseEther("1");
      await ido.connect(addr1).buyTokens({ value: ethAmount });

      try {
        await ido.connect(addr1).withdrawFunds();
        expect.fail("Expected transaction to fail");
      } catch (error: any) {
        expect(error.message).to.include("OwnableUnauthorizedAccount");
      }
    });
  });

  describe("Edge Cases", function () {
    it("Should handle maximum cap purchase", async function () {
      const maxEthAmount = IDO_CAP;
      const expectedTokens = maxEthAmount.mul(IDO_RATE);

      const tx = await ido.connect(addr1).buyTokens({ value: maxEthAmount });
      const receipt = await tx.wait();

      const userBalance = await dimsToken.balanceOf(addr1.address);
      expect(userBalance.toString()).to.equal(expectedTokens.toString());

      // Check for TokensPurchased event
      const purchaseEvent = receipt.events?.find((e: any) => e.event === "TokensPurchased");
      expect(purchaseEvent).to.not.be.undefined;
    });

    it("Should handle multiple users purchasing up to cap", async function () {
      const ethAmount1 = ethers.utils.parseEther("3");
      const ethAmount2 = ethers.utils.parseEther("4");
      const ethAmount3 = ethers.utils.parseEther("3");

      await ido.connect(addr1).buyTokens({ value: ethAmount1 });
      await ido.connect(addr2).buyTokens({ value: ethAmount2 });
      await ido.connect(owner).buyTokens({ value: ethAmount3 });

      const raised = await ido.raised();
      expect(raised.toString()).to.equal(IDO_CAP.toString());
    });
  });

  describe("State Management", function () {
    it("Should maintain correct state after multiple operations", async function () {
      const ethAmount1 = ethers.utils.parseEther("2");
      const ethAmount2 = ethers.utils.parseEther("3");

      await ido.connect(addr1).buyTokens({ value: ethAmount1 });
      await ido.connect(addr2).buyTokens({ value: ethAmount2 });

      const raised = await ido.raised();
      const contribution1 = await ido.contributions(addr1.address);
      const contribution2 = await ido.contributions(addr2.address);

      expect(raised.toString()).to.equal(ethAmount1.add(ethAmount2).toString());
      expect(contribution1.toString()).to.equal(ethAmount1.toString());
      expect(contribution2.toString()).to.equal(ethAmount2.toString());
    });
  });
});
