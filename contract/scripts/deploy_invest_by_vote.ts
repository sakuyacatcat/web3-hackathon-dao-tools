import { ethers } from 'hardhat';

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const InvestByVote = await ethers.getContractFactory("InvestByVote");
  const investByVote = await InvestByVote.deploy();

  console.log("Contract deployed, InvestByVote address:", investByVote.address);
}

main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error)
  process.exitCode = 1
})
