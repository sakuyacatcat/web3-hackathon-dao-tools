import { WEB3_ACCOUNT, WEB3_PRIVATE_KEY } from "@src/configs/constant/env";
import { web3 } from "@src/configs/web3Provier";
import { abi } from '@src/lib/contracts/abi';
import { AbiItem } from "web3-utils";

const contractAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
const contract = new web3.eth.Contract(abi.investByVote as AbiItem[], contractAddress)

export default async function investByVote(recipient: string, votes: number) {
  const account = WEB3_ACCOUNT
  const privateKey = WEB3_PRIVATE_KEY
  const gasPrice = await web3.eth.getGasPrice();
  const gas = 100_000;
  const data = contract.methods.transferJpycWithVotes(recipient, votes).encodeABI()

  const nonce = await web3.eth.getTransactionCount(account);

  try {
    const signedTx = await web3.eth.accounts.signTransaction(
      {
        from: account,
        to: contractAddress,
        gasPrice,
        gas,
        nonce,
        data
      },
      privateKey
    );
    if (signedTx.rawTransaction) {
      const eventData = await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
      const receipt = await web3.eth.getTransactionReceipt(eventData.transactionHash)
      contract.getPastEvents('Investment', {
        fromBlock: receipt.blockNumber,
      }, function(error, events){
        if (error) {
          console.log(error);
        } else if (events[0].returnValues) {
          alert(`
            Investment complete!\n
            Recipient address: ${recipient}\n
            Votes: ${events[0].returnValues[0]}\n
            Amount: ${events[0].returnValues[1]} JPYC
          `)
        }
      })
    }
  } catch (e) {
    console.log(e)
  }
}
