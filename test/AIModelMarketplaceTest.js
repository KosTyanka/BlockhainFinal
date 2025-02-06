// SPDX-License-Identifier: MIT
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AIModelMarketplace", function () {
  let token, marketplace, owner, buyer;

  beforeEach(async function () {
    [owner, buyer] = await ethers.getSigners();

    const AITUSE2321 = await ethers.getContractFactory("AITUSE2321");
    token = await AITUSE2321.deploy("AITUSE2321", "AIT", 1000000);
    await token.waitForDeployment();

    const AIModelMarketplace = await ethers.getContractFactory("AIModelMarketplace");
    marketplace = await AIModelMarketplace.deploy(await token.getAddress());
    await marketplace.waitForDeployment();

    await token.transfer(buyer.address, 1000);
  });

  it("Should list a model", async function () {
    await marketplace.listModel("Model1", "Description", 100, "http://example.com");
    const model = await marketplace.models(1);
    expect(model.name).to.equal("Model1");
  });

  it("Should buy a model with tokens", async function () {
    await marketplace.listModel("Model1", "Description", 100, "http://example.com");

    await token.connect(buyer).approve(await marketplace.getAddress(), 100);
    await marketplace.connect(buyer).buyModel(1);

    const modelAfter = await marketplace.models(1);
    expect(modelAfter.sold).to.equal(true);
  });
});
