import { ethers } from 'hardhat';

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const totalSupply = "10000000000000000000000000000";

  const MyToken = await ethers.getContractFactory("MyToken");
  const myToken = await MyToken.deploy(totalSupply);

  await myToken.approve(deployer.address, totalSupply);
  await myToken.transfer(deployer.address, "10000000000000000000000000000");

  console.log("Contract deployed, MyToken(DummyJPYC) address:", myToken.address);
}

main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error)
  process.exitCode = 1
})
