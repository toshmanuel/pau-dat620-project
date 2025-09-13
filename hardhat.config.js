require("@nomiclabs/hardhat-ethers");
require("@nomicfoundation/hardhat-verify");
require("dotenv").config();

const { SEPOLIA_RPC_URL, PRIVATE_KEY } = process.env;

if (!SEPOLIA_RPC_URL) throw new Error("SEPOLIA_RPC_URL is not set in .env");
if (!PRIVATE_KEY) throw new Error("PRIVATE_KEY is not set in .env");

console.log("SEPOLIA_RPC_URL loaded:", SEPOLIA_RPC_URL);
console.log("PRIVATE_KEY loaded:", PRIVATE_KEY ? "Set" : "Not set");

module.exports = {
  solidity: {
    version: "0.8.30",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
    },
  },
};