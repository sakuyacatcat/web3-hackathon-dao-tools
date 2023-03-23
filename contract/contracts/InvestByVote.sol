// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import '../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol';

contract InvestByVote {
  event Investment(uint256 _votes, uint256 _amount);

  IERC20 public jpycToken;
  address payable public owner;

  constructor(address _jpycToken) {
    owner = payable(msg.sender);
    jpycToken = IERC20(_jpycToken);
  }

  function transferJpycWithVotes(address recipient, uint256 votes) external {
    require(msg.sender == owner, 'This contract is called by only owner');
    uint256 amountJpyc = votes * 100_000; // 1 vote = 100_000 JPYC
    uint256 amountWei = amountJpyc * (10 ** 18);
    require(
      jpycToken.balanceOf(address(this)) >= amountWei,
      'Insufficient JPYC balance'
    );
    jpycToken.transfer(recipient, amountWei);

    emit Investment(votes, amountJpyc);
  }
}
