// SPDX-License-Identifier: MIT
const hre = require("hardhat");

async function main() {
  const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Deployed token on localhost
  const AIModelMarketplace = await hre.ethers.getContractFactory("AIModelMarketplace");
  const marketplace = await AIModelMarketplace.deploy(tokenAddress);

  await marketplace.waitForDeployment();
  console.log("Marketplace deployed to:", await marketplace.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
