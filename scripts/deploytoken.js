// SPDX-License-Identifier: MIT
const hre = require("hardhat");

async function main() {
  const AITUSE2321 = await hre.ethers.getContractFactory("AITUSE2321");
  const token = await AITUSE2321.deploy("AITUSE2321", "AIT", 1000000);
  
  await token.waitForDeployment(); 
  
  console.log("AITUSE2321 deployed to:", await token.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
