import { Account } from 'web3-core'
import { web3 } from './web3Provier'

export function createWeb3Account(): Account {
  const account = web3.eth.accounts.create()

  return account
}
