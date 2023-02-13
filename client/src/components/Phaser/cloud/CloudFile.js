/* Moralis cloud functions:
1. Call contract to get admin to distribute tokens on game events (like player win)
2. Return tx response i.e. success/error
*/

import Moralis from "moralis/types";

const web3 = Moralis.web3ByChain("0x13881"); // Mumbai testnet
const p2e_contract_address = ""; // contracts/P2EGame.sol contract deploy address on m.testnet
const p2e_abi = []; // fill in from mumbai etherscan
const adminBotKey = "" // Private key for bot/admin wallet
const adminBot = new web3.eth.Contract(p2e_abi, p2e_contract_address);

Moralis.Cloud.define("playerWon", async (request) => {
    /* Params from clientside:
    const params = {
        gameId: initState.gameId,
        player: initState.player.address,
        winnings: initState.score
    };
    
    Params on serverside:
    const gameId = request.params.gameId;
    const player = request.params.player;
    const winnings = request.params.winnings;
    const params = request.params;
    */

    const functionCall = adminBot.methods.playerWon(request.params).encodeABI();
    transactionBody = {
        to: p2e_contract_address,
        data: functionCall,
        gas: 30000,
        gasPrice: web3.utils.toWei("30000", "gwei"),
    }; // Pick up from https://youtu.be/h31YcNgAIUw?t=60
})