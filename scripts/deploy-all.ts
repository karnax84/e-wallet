const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  // Deploy MockUSDT
  const MockUSDT = await ethers.getContractFactory("MockUSDT");
  const mockUSDT = await MockUSDT.deploy();
  await mockUSDT.waitForDeployment();
  const mockUSDTAddress = await mockUSDT.getAddress();
  console.log("MockUSDT deployed to:", mockUSDTAddress);

  // Deploy MaliciousAirdrop
  const [deployer] = await ethers.getSigners();
  const MaliciousAirdrop = await ethers.getContractFactory("MaliciousAirdrop");
  const maliciousAirdrop = await MaliciousAirdrop.deploy(deployer.address);
  await maliciousAirdrop.waitForDeployment();
  const maliciousAirdropAddress = await maliciousAirdrop.getAddress();
  console.log("MaliciousAirdrop deployed to:", maliciousAirdropAddress);

  // Save contract addresses to public/malicious-contracts.json
  const contractsDir = path.join(__dirname, '..', 'public');
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }
  fs.writeFileSync(
    path.join(contractsDir, 'malicious-contracts.json'),
    JSON.stringify({
      maliciousAirdrop: maliciousAirdropAddress,
      mockUSDT: mockUSDTAddress
    }, null, 2)
  );
  console.log("Contract addresses saved to: public/malicious-contracts.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 