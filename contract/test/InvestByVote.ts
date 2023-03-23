import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs'
import { loadFixture, time } from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'
import { ethers } from 'hardhat'

describe('InvestByVote', function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployInvestByVoteFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners()

    const totalSupply = "10000000000000000000000000000"
    const DummyJPYC = await ethers.getContractFactory('MyToken')
    const dummyJPYC = await DummyJPYC.deploy("JapanCoin", "JPYC", totalSupply)

    await dummyJPYC.approve(owner.address, totalSupply);
    await dummyJPYC.transfer(owner.address, "10000000000000000000000000000");

    const jpycAddress = dummyJPYC.address

    const InvestByVote = await ethers.getContractFactory('InvestByVote')
    const investByVote = await InvestByVote.deploy(jpycAddress)

    return { investByVote, jpycAddress, owner, otherAccount }
  }

  describe('Deployment', function () {
    it('Should set the right owner', async function () {
      const { investByVote, owner } = await loadFixture(deployInvestByVoteFixture)

      expect(await investByVote.owner()).to.equal(owner.address)
    })

    it('Should set the right jpyc address', async function () {
      const { investByVote, jpycAddress } = await loadFixture(deployInvestByVoteFixture)

      expect(await investByVote.jpycToken()).to.equal(jpycAddress)
    })

    // it('Should fail if the unlockTime is not in the future', async function () {
    //   // We don't use the fixture here because we want a different deployment
    //   const latestTime = await time.latest()
    //   const Lock = await ethers.getContractFactory('Lock')
    //   await expect(Lock.deploy(latestTime, { value: 1 })).to.be.revertedWith(
    //     'Unlock time should be in the future'
    //   )
    // })
  })

  // describe('Withdrawals', function () {
  //   describe('Validations', function () {
  //     it('Should revert with the right error if called too soon', async function () {
  //       const { lock } = await loadFixture(deployInvestByVoteFixture)

  //       await expect(lock.withdraw()).to.be.revertedWith(
  //         "You can't withdraw yet"
  //       )
  //     })

  //     it('Should revert with the right error if called from another account', async function () {
  //       const { lock, unlockTime, otherAccount } = await loadFixture(
  //         deployInvestByVoteFixture
  //       )

  //       // We can increase the time in Hardhat Network
  //       await time.increaseTo(unlockTime)

  //       // We use lock.connect() to send a transaction from another account
  //       await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
  //         "You aren't the owner"
  //       )
  //     })

  //     it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
  //       const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture)

  //       // Transactions are sent using the first signer by default
  //       await time.increaseTo(unlockTime)

  //       await expect(lock.withdraw()).not.to.be.reverted
  //     })
  //   })

  //   describe('Events', function () {
  //     it('Should emit an event on withdrawals', async function () {
  //       const { lock, unlockTime, lockedAmount } = await loadFixture(
  //         deployOneYearLockFixture
  //       )

  //       await time.increaseTo(unlockTime)

  //       await expect(lock.withdraw())
  //         .to.emit(lock, 'Withdrawal')
  //         .withArgs(lockedAmount, anyValue) // We accept any value as `when` arg
  //     })
  //   })

  //   describe('Transfers', function () {
  //     it('Should transfer the funds to the owner', async function () {
  //       const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
  //         deployOneYearLockFixture
  //       )

  //       await time.increaseTo(unlockTime)

  //       await expect(lock.withdraw()).to.changeEtherBalances(
  //         [owner, lock],
  //         [lockedAmount, -lockedAmount]
  //       )
  //     })
  //   })
  // })
})
