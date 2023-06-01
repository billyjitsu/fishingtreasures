// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


contract PudgyPresent is ERC721, ERC721Enumerable, Pausable, Ownable, ERC721Burnable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
     string private baseTokenUri = "https://np4zj273suxharowsyxqhlz5ou2zptjytbh22eabsvdlxdga4g4q.arweave.net/a_mU6_uVLnBF1pYvA689dTWXzTiYT60QAZVGu4zA4bk/";

    constructor() ERC721("PudgyPresent", "PP") {}

    function _baseURI() internal view override returns (string memory) {
        return baseTokenUri;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function safeMint() external {
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(msg.sender, tokenId);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        whenNotPaused
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    //return uri for certain token on a repeating cycle of 3
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
  
        // Check if tokenID modulo 3 and return the appropriate baseURI
        if (tokenId % 3 == 0) {
            return string(abi.encodePacked(baseTokenUri, "1.json"));
        } else if (tokenId % 3 == 1) {
            return string(abi.encodePacked(baseTokenUri, "2.json"));
        } else {
            return string(abi.encodePacked(baseTokenUri, "3.json"));
        }
    }

    // The following functions are overrides required by Solidity.

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}


