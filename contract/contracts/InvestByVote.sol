// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import '../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol';

contract InvestByVote {
  event invest(uint256 _votes, uint256 _amount);

  IERC20 public jpycToken;
  address payable public owner;

  constructor(address _jpycToken) {
    owner = payable(msg.sender);
    jpycToken = IERC20(_jpycToken);
  }

  function transferJpycWithVotes(address recipient, uint256 votes) external {
    require(msg.sender == owner);
    uint256 amount = votes * 100000 * (10 ** 18); // 1 vote = 100,000 JPYC
    require(
      jpycToken.balanceOf(msg.sender) >= amount,
      'Insufficient JPYC balance'
    );
    jpycToken.transferFrom(msg.sender, recipient, amount);
  }
}
