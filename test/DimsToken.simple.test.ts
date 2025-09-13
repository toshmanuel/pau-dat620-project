const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DimsToken", function () {
  let dimsToken: any;
  let owner: any;
  let addr1: any;
  let addr2: any;

  const INITIAL_SUPPLY = ethers.utils.parseEther("1000000000"); // 1 billion tokens
  const ACTUAL_SUPPLY = INITIAL_SUPPLY.mul(ethers.utils.parseEther("1")); // Contract multiplies by 10^18

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

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
      expect(ownerBalance.toString()).to.equal(ACTUAL_SUPPLY.toString());
    });

    it("Should set the correct total supply", async function () {
      const totalSupply = await dimsToken.totalSupply();
      expect(totalSupply.toString()).to.equal(ACTUAL_SUPPLY.toString());
    });
  });

  describe("Transfers", function () {
    it("Should transfer tokens between accounts", async function () {
      const transferAmount = ethers.utils.parseEther("1000");
      
      await dimsToken.transfer(addr1.address, transferAmount);
      const addr1Balance = await dimsToken.balanceOf(addr1.address);
      expect(addr1Balance.toString()).to.equal(transferAmount.toString());
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const transferAmount = ethers.utils.parseEther("1000");
      
      try {
        await dimsToken.connect(addr1).transfer(addr2.address, transferAmount);
        expect.fail("Expected transaction to fail");
      } catch (error: any) {
        expect(error.message).to.include("ERC20InsufficientBalance");
      }
    });

    it("Should update balances after transfers", async function () {
      const transferAmount = ethers.utils.parseEther("1000");
      const initialOwnerBalance = await dimsToken.balanceOf(owner.address);
      
      await dimsToken.transfer(addr1.address, transferAmount);
      
      const finalOwnerBalance = await dimsToken.balanceOf(owner.address);
      const addr1Balance = await dimsToken.balanceOf(addr1.address);
      
      expect(finalOwnerBalance.toString()).to.equal(initialOwnerBalance.sub(transferAmount).toString());
      expect(addr1Balance.toString()).to.equal(transferAmount.toString());
    });
  });

  describe("Approvals", function () {
    it("Should allow spender to spend tokens", async function () {
      const approveAmount = ethers.utils.parseEther("1000");
      
      await dimsToken.approve(addr1.address, approveAmount);
      const allowance = await dimsToken.allowance(owner.address, addr1.address);
      expect(allowance.toString()).to.equal(approveAmount.toString());
    });

    it("Should allow spender to transfer approved tokens", async function () {
      const approveAmount = ethers.utils.parseEther("1000");
      
      await dimsToken.approve(addr1.address, approveAmount);
      await dimsToken.connect(addr1).transferFrom(owner.address, addr2.address, approveAmount);
      
      const addr2Balance = await dimsToken.balanceOf(addr2.address);
      expect(addr2Balance.toString()).to.equal(approveAmount.toString());
    });

    it("Should fail if spender tries to transfer more than approved", async function () {
      const approveAmount = ethers.utils.parseEther("1000");
      const transferAmount = ethers.utils.parseEther("2000");
      
      await dimsToken.approve(addr1.address, approveAmount);
      
      try {
        await dimsToken.connect(addr1).transferFrom(owner.address, addr2.address, transferAmount);
        expect.fail("Expected transaction to fail");
      } catch (error: any) {
        expect(error.message).to.include("ERC20InsufficientAllowance");
      }
    });
  });

  describe("Events", function () {
    it("Should emit Transfer event on transfer", async function () {
      const transferAmount = ethers.utils.parseEther("1000");
      
      const tx = await dimsToken.transfer(addr1.address, transferAmount);
      const receipt = await tx.wait();
      
      const transferEvent = receipt.events?.find((e: any) => e.event === "Transfer");
      expect(transferEvent).to.not.be.undefined;
      expect(transferEvent.args.from).to.equal(owner.address);
      expect(transferEvent.args.to).to.equal(addr1.address);
      expect(transferEvent.args.value.toString()).to.equal(transferAmount.toString());
    });

    it("Should emit Approval event on approval", async function () {
      const approveAmount = ethers.utils.parseEther("1000");
      
      const tx = await dimsToken.approve(addr1.address, approveAmount);
      const receipt = await tx.wait();
      
      const approvalEvent = receipt.events?.find((e: any) => e.event === "Approval");
      expect(approvalEvent).to.not.be.undefined;
      expect(approvalEvent.args.owner).to.equal(owner.address);
      expect(approvalEvent.args.spender).to.equal(addr1.address);
      expect(approvalEvent.args.value.toString()).to.equal(approveAmount.toString());
    });
  });

  describe("Edge Cases", function () {
    it("Should handle zero transfers", async function () {
      const tx = await dimsToken.transfer(addr1.address, 0);
      const receipt = await tx.wait();
      
      const transferEvent = receipt.events?.find((e: any) => e.event === "Transfer");
      expect(transferEvent).to.not.be.undefined;
      expect(transferEvent.args.value.toString()).to.equal("0");
    });

    it("Should handle zero approvals", async function () {
      const tx = await dimsToken.approve(addr1.address, 0);
      const receipt = await tx.wait();
      
      const approvalEvent = receipt.events?.find((e: any) => e.event === "Approval");
      expect(approvalEvent).to.not.be.undefined;
      expect(approvalEvent.args.value.toString()).to.equal("0");
    });

    it("Should handle transfer to zero address", async function () {
      const transferAmount = ethers.utils.parseEther("1000");
      
      try {
        await dimsToken.transfer(ethers.constants.AddressZero, transferAmount);
        expect.fail("Expected transaction to fail");
      } catch (error: any) {
        expect(error.message).to.include("ERC20InvalidReceiver");
      }
    });
  });
});
