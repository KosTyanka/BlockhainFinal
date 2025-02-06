import React, { useState } from "react";
import { ethers } from "ethers";


const tokenAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const marketplaceAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

const tokenABI = ["function balanceOf(address) view returns (uint256)"];
const marketplaceABI = [
  "function modelCount() view returns (uint)",
  "function models(uint) view returns (uint id, string name, string description, uint price, address seller, string fileURL, bool sold)",
  "function buyModel(uint)"
];

function App() {
  const [account, setAccount] = useState(null);
  const [models, setModels] = useState([]);

  const [modelName, setModelName] = useState("");
  const [modelDescription, setModelDescription] = useState("");
  const [modelPrice, setModelPrice] = useState("");
  const [modelFileURL, setModelFileURL] = useState("");

  async function connectWallet() {
    if (window.ethereum) {
      try {
        const [selectedAccount] = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(selectedAccount);
      } catch (error) {
        console.error("User denied account access", error);
      }
    } else {
      alert("MetaMask not detected");
    }
  }

  async function fetchBalance() {
    if (!account) {
      alert("Connect MetaMask first!");
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const tokenContract = new ethers.Contract(tokenAddress, tokenABI, provider);
    const balance = await tokenContract.balanceOf(account);
    alert(`Balance: ${ethers.utils.formatUnits(balance, 18)} AIT`);
  }

  async function fetchModels() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const marketplace = new ethers.Contract(marketplaceAddress, marketplaceABI, provider);

    const count = await marketplace.modelCount();
    let items = [];
    for (let i = 1; i <= count; i++) {
      const model = await marketplace.models(i);
      items.push(model);
    }
    setModels(items);
  }

  async function buyModel(modelId, price) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
  
    const tokenContract = new ethers.Contract(tokenAddress, ["function approve(address, uint256)"], signer);
    await tokenContract.approve(marketplaceAddress, price);
  
    const marketplace = new ethers.Contract(marketplaceAddress, ["function buyModel(uint)"], signer);
    await marketplace.buyModel(modelId);
  
    alert("Purchase Successful!");
    fetchModels(); 
  }

  async function listModel() {
    if (!modelName || !modelDescription || !modelPrice || !modelFileURL) {
      alert("Please fill in all fields");
      return;
    }
  
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
  
    const marketplace = new ethers.Contract(marketplaceAddress, ["function listModel(string,string,uint,string)"], signer);
    const priceInWei = ethers.utils.parseUnits(modelPrice, 18);
  
    const tx = await marketplace.listModel(modelName, modelDescription, priceInWei, modelFileURL);
    await tx.wait();
    
    alert("Model Listed Successfully!");
    fetchModels(); 
  }
  

  return (
    <div>
      <h1>AI Model Marketplace</h1>
      <button onClick={connectWallet}>Connect Wallet</button>
      {account && <p>Connected: {account}</p>}
      <button onClick={fetchBalance}>Check Token Balance</button>
      <button onClick={fetchModels}>Load AI Models</button>

      {models.map((model, idx) => (
        <div key={idx}>
          <p><strong>{model.name}</strong></p>
          <p>{model.description}</p>
          <p>Price: {ethers.utils.formatUnits(model.price, 18)} AIT</p>
          <p>Seller: {model.seller}</p>
          <p>Sold? {model.sold ? "Yes" : "No"}</p>
          {!model.sold && (
            <button onClick={() => buyModel(model.id, model.price)}>Buy</button>
          )}
          <hr />
        </div>
      ))}
      <h2>List a New AI Model</h2>
      <input type="text" placeholder="Model Name" onChange={(e) => setModelName(e.target.value)} />
      <input type="text" placeholder="Description" onChange={(e) => setModelDescription(e.target.value)} />
      <input type="text" placeholder="Price in AIT" onChange={(e) => setModelPrice(e.target.value)} />
      <input type="text" placeholder="Model File URL" onChange={(e) => setModelFileURL(e.target.value)} />
      <button onClick={listModel}>List Model</button>
    </div>
  );
}

export default App;
