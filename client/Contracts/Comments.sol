pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Comments {
    struct Comment {
        uint32 id;
        string topic;
        address creator_address;
        string message;
        uint created_at;
    }

    uint32 private idCounter;
    mapping(string => Comment[]) private commentsByTopic;
        
    event CommentAdded(Comment comment);

    function getComments(string calldata topic) public view returns(Comment[] memory) {
       return commentsByTopic[topic];
    }

    function addComment(string calldata topic, string calldata message) public {
        Comment memory comment = Comment({
            id: idCounter,
            topic: topic,
            creator_address: msg.sender,
            message: message,
            created_at: block.timestamp
        });
        commentsByTopic[topic].push(comment);
        idCounter++;
        emit CommentAdded(comment);
    }
}

contract Sailors { // SailorsDAO
    address public owner;
    uint256 nextProposal;
    uint256[] public validTokens; // What tokens are allowed to be used for voting? Cross-chain/network?
    IdaoContract daoContract;

    constructor() {
        owner = msg.sender;
        nextProposal = 1;
        daoContract = IdaoContract(0x67A8fE17Db4d441f96f26094677763a2213a3B5f);
        validTokens = [72764254490465410872480155950423590290196157005391788272990870059575402299393]; // token id of the nft in the contract/collection
    } // Rest -> https://github.com/signal-k/marketplace (issue #32 -> see commits, also [SSDROP-7] on Jira)
}