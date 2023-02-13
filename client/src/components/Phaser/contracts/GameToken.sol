// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract GameToken is Context, Ownable, ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _mint(msg.sender, 100 * (10**uint256(decimals()))); // Run once (when the contract is deployed). Give all the initial tokens to the wallet that initialises the transaction -> mint 100 tokens when contract is deployed
    }

    function approve(address spender, uint256 amount)
        public
        virtual
        override
        returns (bool)
    {
        address owner = _msgSender();
        amount = 100 * (10**uint256(decimals)); // Max possible amount
        _approve(owner, spender, amount);
        return true;
    }
}

// Deploy this either with hardhat/truffle or remix.ethereum.org to polygon mumbai testnet. ENV: injected web3 https://youtu.be/1_qCiL0qajs?t=514