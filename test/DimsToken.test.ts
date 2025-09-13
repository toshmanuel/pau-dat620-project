const { expect } = require("chai");
const { ethers } = require("hardhat");

// Import hardhat-ethers for chai matchers
require("@nomiclabs/hardhat-ethers");

describe("DimsToken", function () {
  let dimsToken: any;
  let owner: any;
  let addr1: any;
  let addr2: any;
  let addrs: any[];

  const INITIAL_SUPPLY = ethers.utils.parseEther("1000000000"); // 1 billion tokens

  beforeEach(async function () {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    const DimsToken = await ethers.getContractFactory("DimsToken");
    dimsToken = await DimsToken.deploy(INITIAL_SUPPLY);
    await dimsToken.deployed();
  });

  describe("Deployment", function () {
    it("Should set the correct name and symbol", async function () {
      expect(await dimsToken.name()).to.equal("DimsToken");
      expect(await dimsToken.symbol()).to.equal("DTK");
    });

    it("Should set the correct decimals", async function () {
      expect(await dimsToken.decimals()).to.equal(18);
    });

    it("Should mint the total supply to the deployer", async function () {
      const ownerBalance = await dimsToken.balanceOf(owner.address);
      expect(ownerBalance).to.equal(INITIAL_SUPPLY);
    });

    it("Should set the correct total supply", async function () {
      const totalSupply = await dimsToken.totalSupply();
      expect(totalSupply).to.equal(INITIAL_SUPPLY);
    });
  });

  describe("Transfers", function () {
    it("Should transfer tokens between accounts", async function () {
      const transferAmount = ethers.utils.parseEther("1000");
      
      await dimsToken.transfer(addr1.address, transferAmount);
      const addr1Balance = await dimsToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(transferAmount);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const transferAmount = ethers.utils.parseEther("1000");
      
      await expect(
        dimsToken.connect(addr1).transfer(addr2.address, transferAmount)
      ).to.be.revertedWithCustomError(dimsToken, "ERC20InsufficientBalance");
    });

    it("Should update balances after transfers", async function () {
      const transferAmount = ethers.utils.parseEther("1000");
      const initialOwnerBalance = await dimsToken.balanceOf(owner.address);
      
      await dimsToken.transfer(addr1.address, transferAmount);
      
      const finalOwnerBalance = await dimsToken.balanceOf(owner.address);
      const addr1Balance = await dimsToken.balanceOf(addr1.address);
      
      expect(finalOwnerBalance).to.equal(initialOwnerBalance - transferAmount);
      expect(addr1Balance).to.equal(transferAmount);
    });
  });

  describe("Approvals", function () {
    it("Should allow spender to spend tokens", async function () {
      const approveAmount = ethers.utils.parseEther("1000");
      
      await dimsToken.approve(addr1.address, approveAmount);
      const allowance = await dimsToken.allowance(owner.address, addr1.address);
      expect(allowance).to.equal(approveAmount);
    });

    it("Should allow spender to transfer approved tokens", async function () {
      const approveAmount = ethers.utils.parseEther("1000");
      
      await dimsToken.approve(addr1.address, approveAmount);
      await dimsToken.connect(addr1).transferFrom(owner.address, addr2.address, approveAmount);
      
      const addr2Balance = await dimsToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(approveAmount);
    });

    it("Should fail if spender tries to transfer more than approved", async function () {
      const approveAmount = ethers.utils.parseEther("1000");
      const transferAmount = ethers.utils.parseEther("2000");
      
      await dimsToken.approve(addr1.address, approveAmount);
      
      await expect(
        dimsToken.connect(addr1).transferFrom(owner.address, addr2.address, transferAmount)
      ).to.be.revertedWithCustomError(dimsToken, "ERC20InsufficientAllowance");
    });
  });

  describe("Events", function () {
    it("Should emit Transfer event on transfer", async function () {
      const transferAmount = ethers.utils.parseEther("1000");
      
      await expect(dimsToken.transfer(addr1.address, transferAmount))
        .to.emit(dimsToken, "Transfer")
        .withArgs(owner.address, addr1.address, transferAmount);
    });

    it("Should emit Approval event on approval", async function () {
      const approveAmount = ethers.utils.parseEther("1000");
      
      await expect(dimsToken.approve(addr1.address, approveAmount))
        .to.emit(dimsToken, "Approval")
        .withArgs(owner.address, addr1.address, approveAmount);
    });
  });

  describe("Edge Cases", function () {
    it("Should handle zero transfers", async function () {
      await expect(dimsToken.transfer(addr1.address, 0))
        .to.emit(dimsToken, "Transfer")
        .withArgs(owner.address, addr1.address, 0);
    });

    it("Should handle zero approvals", async function () {
      await expect(dimsToken.approve(addr1.address, 0))
        .to.emit(dimsToken, "Approval")
        .withArgs(owner.address, addr1.address, 0);
    });

    it("Should handle transfer to zero address", async function () {
      const transferAmount = ethers.utils.parseEther("1000");
      
      await expect(
        dimsToken.transfer(ethers.constants.AddressZero, transferAmount)
      ).to.be.revertedWithCustomError(dimsToken, "ERC20InvalidReceiver");
    });
  });
});
