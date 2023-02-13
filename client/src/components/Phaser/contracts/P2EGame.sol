// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./GameToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract P2EGame is Ownable {
    address admin; // dev wallet
    uint256 public totalBalance;

    // Contract address of GameToken
    address constant tokenAddress = 0x;

    struct Game {
        uint256 id;
        address treasury;
        uint256 amount;
        bool locked;
        bool spent;
    }

    mapping(address => mapping(uint256 => Game)) public balances;

    modifier onlyAdmin {
        require(msg.sender == admin, "Only admin can unlock escrow");
        _;
    }

        constructor() {
            admin = msg.ender;
        }

    // Player startGame event -> staked tokens get moved to escrow (P2EGame.sol contract)
    function startGame(uint256 _gameId, address _treasury, uint256 _amount) external returns (uint256) {
        GameToken token = GameToken(tokenAddress);

        // Approve contract to spend amount tokens
        require(token.approve(address(this), _amount), "P2EGame: approval has failed");
        require(_amount >= 1000000000000000000, "P2EGame: must insert 1 whole token");
        token.transferFrom(msg.sender, address(this), _amount); // If player wins, rewarded with staked tokens + 

        totalBalance += _amount;

        balances[msg.sender][_gameId].amount = _amount;
        balances[msg.sender][_gameId].treasury = _treasury;
        balances[msg.sender][_gameId].locked = _true;
        balances[msg.sender][_gameId].spent = _false;
        return token.balanceOf(msg.sender);
    }

    // Retrieve current state of game funds in escrow
    function gameState(address _player, uint256 _gameId) external view returns (uint256, bool, address) {
        return ( balances[_player][_gameId].amount, balances[_player][_gameId].locked, balances[_player][_gameId].treasury);
    }

    // Admin unlocks tokens in escrow once [phaser] game's outcome decided
    function playerWon(uint256 _gameId, address _player) onlyAdmin external returns(bool) { // Send the staked tokens + bonus to the player [who staked] if they won the game
        // Allows player to withdraw
        balances[_player][_gameId].locked = false;

        GameToken token = GameToken(tokenAddress);
        token.transfer(_player, balances[_player][_gameId].amount);

        totalBalance -= balances[_player][_gameId].amount;
        balances[_player][_gameId].spent = true;
        return true;
    }

    // If player loses game - send funds from escrow to treasury
    function playerLost(address _player, uint256 _gameId) onlyAdmin external returns(bool) {
        GameToken token = GameToken(tokenAddress);
        token.transfer(balances[_player][_gameId].treasury, balances[_player][_gameId].amount);

        balances[_player][_gameId].spent = true;
        totalBalance -= balances[_player][_gameId].amount;
        return true;
    }

    // Player is able to withdraw unlocked tokens
    function withdraw(uint256 _gameId) external returns(bool) {
        require(balances[msg.sender][_gameId].locked == false, "This escrow is still locked");
        require(balances[msg.sender][_gameId].spent == false, "Already withdrawn");

        GameToken token = GameToken(tokenAddress);
        token.transfer(msg.sender, balances[msg.sender][_gameId].amount);
    }
}