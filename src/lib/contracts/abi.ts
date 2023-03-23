export const abi = {
  investByVote: [
    {
      inputs: [
        {
          internalType: 'address',
          name: '_jpycToken',
          type: 'address',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'uint256',
          name: '_votes',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: '_amount',
          type: 'uint256',
        },
      ],
      name: 'Investment',
      type: 'event',
    },
    {
      inputs: [],
      name: 'jpycToken',
      outputs: [
        {
          internalType: 'contract IERC20',
          name: '',
          type: 'address',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'owner',
      outputs: [
        {
          internalType: 'address payable',
          name: '',
          type: 'address',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'recipient',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'votes',
          type: 'uint256',
        },
      ],
      name: 'transferJpycWithVotes',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ],
}
