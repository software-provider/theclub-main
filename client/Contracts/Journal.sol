// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Journal is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter; // Increment each post Id
    uint256 public fees;

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 fees_
    ) ERC721(name_, symbol_) {
        fees = fees_;
    }

    function safeMint(address to, string memory uri) public payable {
        require(msg.value >= fees, "Not enough MATIC");
        payable(owner()).transfer(fees); // -> transfer a fee to the owner of this contract with each mint

        // Mint post NFT
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId); // Send it to the address with the tokenId
        _setTokenURI(tokenId, uri); // From openz. contract

        // Return oversupplied fees
        uint256 contractBalance = address(this).balance;
        if (contractBalance > 0) {
            payable(msg.sender).transfer(address(this).balance);
        }
    }

    // Override functions
    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory) {
        return super.tokenURI(tokenID);
    }
}

// Comments.sol will attach to this. Extends the proposal function in the DAO (signal-k/marketplace on gh), however will also allow for general-purpose posts (like Medium) without creating proposals
// Component will likely be "Journal" -> ref based on relevant issues on github to see connecting files