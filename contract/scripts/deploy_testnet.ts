import { ethers } from 'hardhat';

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const totalSupply = "10000000000000000000000000000";

  const MyToken = await ethers.getContractFactory("MyToken");
  const myToken = await MyToken.deploy("JapanYenCoin", "JPYC", totalSupply);
  const InvestByVote = await ethers.getContractFactory("InvestByVote");
  const investByVote = await InvestByVote.deploy(myToken.address);

  console.log("Contract deployed, InvestByVote address:", investByVote.address);
  console.log("Contract deployed, MyToken(DummyJPYC) address:", myToken.address);

  await myToken.approve(investByVote.address, totalSupply);
  await myToken.transfer(investByVote.address, "10000000000000000000000000000");

  console.log("Complete transfer all JPYC to InvestByVote address");
}

main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error)
  process.exitCode = 1
})
