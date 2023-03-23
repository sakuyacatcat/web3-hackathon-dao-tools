import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'
import { ethers } from 'hardhat'

describe('InvestByVote', function () {
  async function deployInvestByVoteFixture() {
    const [owner, otherAccount] = await ethers.getSigners()

    const votes = 10
    const overVotes = 20
    const amountPerVote = 100_000
    const gwei = 10 ** 18
    const amountWei = votes * amountPerVote * gwei // => 1,000,000 JPYC
    const amountJpyc = votes * amountPerVote

    const totalSupply = amountWei.toLocaleString().replace(/,/g, '')
    const DummyJPYC = await ethers.getContractFactory('MyToken')
    const dummyJPYC = await DummyJPYC.deploy("JapanCoin", "JPYC", totalSupply)

    const jpycAddress = dummyJPYC.address

    const InvestByVote = await ethers.getContractFactory('InvestByVote')
    const investByVote = await InvestByVote.deploy(jpycAddress)

    await dummyJPYC.approve(investByVote.address, totalSupply);
    await dummyJPYC.transfer(investByVote.address, totalSupply);

    return { investByVote, dummyJPYC, jpycAddress, owner, otherAccount, votes, overVotes, amountWei, amountJpyc }
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
  })

  describe('Invest', function () {
    describe('Validations', function () {
      it('Should revert with the right error if called from another account', async function () {
        const { investByVote, owner, otherAccount, votes } = await loadFixture(
          deployInvestByVoteFixture
        )

        await expect(investByVote.connect(otherAccount).transferJpycWithVotes(owner.address, votes)).to.be.revertedWith(
          'This contract is called by only owner'
        )
      })

      it("Shouldn't fail if the invest amount has overed JPYC balance", async function () {
        const { investByVote, otherAccount, overVotes } = await loadFixture(deployInvestByVoteFixture)

        await expect(investByVote.transferJpycWithVotes(otherAccount.address, overVotes)).to.be.revertedWith(
          'Insufficient JPYC balance'
        )
      })
    })

    describe('Events', function () {
      it('Should emit an event on investments', async function () {
        const { investByVote, otherAccount, votes, amountJpyc } = await loadFixture(
          deployInvestByVoteFixture
        )

        await expect(investByVote.transferJpycWithVotes(otherAccount.address, votes))
          .to.emit(investByVote, 'Investment')
          .withArgs(votes, amountJpyc)
      })
    })

    describe('Investments', function () {
      it('Should invest the funds to the recipient', async function () {
        const { investByVote, otherAccount, votes, dummyJPYC, amountWei } = await loadFixture(
          deployInvestByVoteFixture
        )

        investByVote.transferJpycWithVotes(otherAccount.address, votes)
        const amountWeiStr = amountWei.toLocaleString().replace(/,/g, "")

        expect(await dummyJPYC.balanceOf(otherAccount.address)).to.equal(amountWeiStr)
      })
    })
  })
})
