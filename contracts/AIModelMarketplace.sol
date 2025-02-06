// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract AIModelMarketplace {
    struct Model {
        uint id;
        string name;
        string description;
        uint price;
        address seller;
        string fileURL;
        bool sold;
    }

    IERC20 public token;
    uint public modelCount;
    mapping(uint => Model) public models;

    event ModelListed(uint id, string name, uint price, address seller);
    event ModelPurchased(uint id, address buyer);

    constructor(address tokenAddress) {
        token = IERC20(tokenAddress);
    }

    function listModel(string memory name, string memory description, uint price, string memory fileURL) public {
        require(price > 0, "Price must be greater than zero");
        modelCount++;
        models[modelCount] = Model(modelCount, name, description, price, msg.sender, fileURL, false);
        emit ModelListed(modelCount, name, price, msg.sender);
    }

    function buyModel(uint modelId) public {
        Model storage model = models[modelId];
        require(!model.sold, "Model already sold");
        bool success = token.transferFrom(msg.sender, model.seller, model.price);
        require(success, "Token transfer failed");
        model.sold = true;
        emit ModelPurchased(modelId, msg.sender);
    }
}
