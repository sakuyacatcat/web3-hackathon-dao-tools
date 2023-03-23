import { web3 } from '@src/configs/web3Provier'
import { Account } from 'web3-core'

export function createWeb3Account(): Account {
  const account = web3.eth.accounts.create()

  return account
}
