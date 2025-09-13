// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract IDO is Ownable {
    IERC20 public token;
    uint256 public rate;
    uint256 public cap;
    uint256 public raised;
    uint256 public startTime;
    uint256 public endTime;
    mapping(address => uint256) public contributions;

    event TokensPurchased(address buyer, uint256 amount);

    constructor(IERC20 _token, uint256 _rate, uint256 _cap, uint256 _duration, address initialOwner)
        Ownable(initialOwner)
    {
        token = _token;
        rate = _rate;
        cap = _cap;
        startTime = block.timestamp;
        endTime = block.timestamp + _duration;
    }

    function buyTokens() external payable {
        require(block.timestamp >= startTime && block.timestamp <= endTime, "IDO not active");
        require(raised + msg.value <= cap, "Cap exceeded");
        uint256 tokens = msg.value * rate;
        require(token.balanceOf(address(this)) >= tokens, "Not enough tokens");
        contributions[msg.sender] += msg.value;
        raised += msg.value;
        token.transfer(msg.sender, tokens);
        emit TokensPurchased(msg.sender, tokens);
    }

    function withdrawFunds() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}