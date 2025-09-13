const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const DimsToken = await hre.ethers.getContractFactory("DimsToken");
  const totalSupply = hre.ethers.utils.parseEther("1000000000");
  const token = await DimsToken.deploy(totalSupply);
  await token.deployed();
  console.log("DimsToken deployed to:", token.address);

  const IDO = await hre.ethers.getContractFactory("IDO");
  const rate = hre.ethers.utils.parseUnits("66225165", 0);
  const cap = hre.ethers.utils.parseEther("10");
  const duration = 7 * 24 * 60 * 60;
  const ido = await IDO.deploy(token.address, rate, cap, duration, deployer.address);
  await ido.deployed();
  console.log("IDO deployed to:", ido.address);

  const idoAllocation = totalSupply.div(10);
  await token.transfer(ido.address, idoAllocation);
  console.log("Tokens transferred to IDO");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});