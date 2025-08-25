const { ethers } = require("hardhat");

async function main() {
  const usdtAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // MockUSDT address
  const recipient = "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199"; // Replace with your desired account
  const amount = ethers.parseUnits("1000", 18); // 1000 USDT (18 decimals)

  const [deployer] = await ethers.getSigners();
  const usdt = await ethers.getContractAt("MockUSDT", usdtAddress, deployer);

  const tx = await usdt.mint(recipient, amount);
  await tx.wait();
  console.log(`Minted 1000 USDT to ${recipient}`);

  const balance = await usdt.balanceOf(recipient);
  console.log("USDT balance:", ethers.formatUnits(balance, 18));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});