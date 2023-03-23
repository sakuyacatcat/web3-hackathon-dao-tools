import { NODE_ENDPOINT } from '@src/configs/constant/env';
import Web3 from 'web3';

const provider = new Web3.providers.HttpProvider(NODE_ENDPOINT)
export const web3 = new Web3(provider)
