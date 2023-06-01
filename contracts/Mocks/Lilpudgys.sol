// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract LilPudgys is ERC721, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    string private baseTokenUri = "https://dja2u2purosa2klfkjkz4ek5t326rgm6ndza56sibvmwjxes3oza.arweave.net/GkGqafSLpA0pZVJVnhFdnvXomZ5o8g76SA1ZZNyS27I/";


    constructor() ERC721("LilPudgys", "LP") {}

    function _baseURI() internal view override returns (string memory) {
        return baseTokenUri;
    }

    //return uri for certain token
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
  
        // Check if tokenID is even or odd and return the appropriate baseURI
        return tokenId % 2 == 0 ? string(abi.encodePacked(baseTokenUri, "1.json")) : string(abi.encodePacked(baseTokenUri, "2.json"));
    }

    function safeMint() external {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
    }
}

