import { NODE_ENDPOINT } from '@src/configs/constant/env';
import Web3 from 'web3';
import { Account } from 'web3-core';

const web3 = new Web3(NODE_ENDPOINT);

export function createWeb3Account(): Account {
  const account = web3.eth.accounts.create();

  return account;
}
