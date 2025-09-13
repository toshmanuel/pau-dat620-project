// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DimsToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("DimsToken", "DTK") {
        _mint(msg.sender, initialSupply * 10 ** decimals());  // Mint total supply to deployer
    }
}