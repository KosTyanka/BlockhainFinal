// SPDX-License-Identifier: MIT
const hre = require("hardhat");

async function main() {
  const tokenAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // Deployed token on localhost
  const AIModelMarketplace = await hre.ethers.getContractFactory("AIModelMarketplace");
  const marketplace = await AIModelMarketplace.deploy(tokenAddress);

  await marketplace.waitForDeployment();
  console.log("Marketplace deployed to:", await marketplace.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
