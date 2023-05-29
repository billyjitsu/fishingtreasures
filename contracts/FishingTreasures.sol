// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "./IPudgys.sol";
import "hardhat/console.sol";

contract FishingTreasures is ERC1155, Ownable, Pausable, ERC1155Supply {

    IPudgyPengu pudgyPengu;
    ILilPengu lilPengu;
    IRogs rogs;

    struct TokenData {
    bool used;
    uint256 timestamp;
    }

    uint256 public nftId;

    mapping(uint256 => TokenData) public rogsData;

    constructor(address _pudgyPengu, address _lilPengu, address _rogs) ERC1155("test") {
        pudgyPengu = IPudgyPengu(_pudgyPengu);
        lilPengu = ILilPengu(_lilPengu);
        rogs = IRogs(_rogs);
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function fish() external {
        uint256 pudgyBalance = pudgyPengu.balanceOf(msg.sender);
        console.log("Pudgy Balance:", pudgyBalance);
        uint256 lilPudgyBalance = lilPengu.balanceOf(msg.sender);
        console.log("Lil Pudgy Balance:", lilPudgyBalance);
        uint256 rogBalance = rogs.balanceOf(msg.sender);
        console.log("Rog Balance:", rogBalance);
        // do checks and balances

        uint256 amount = 0;
        //calcuate the balance of lilpudgys to make sure there is a delay
        uint256 lilPudgyTimer = (lilPudgyBalance * 1 hours);
        console.log("Lil Pudgy Timer:", lilPudgyTimer);
        console.log("7 days:", 7 days);
        if(lilPudgyTimer > 7 days){
            lilPudgyTimer = 6 days;
        }
        // loop over the balance and get the token ID owned by `sender` at a given `index` of its token list.
        for (uint256 i = 0; i < rogBalance; i++) {
            uint256 tokenId = rogs.tokenOfOwnerByIndex(msg.sender, i);
            // if the tokenId has not been claimed, increase the amount
            if (!rogsData[tokenId].used) {
                amount += 1;
           
                rogsData[tokenId]= TokenData(true, ((block.timestamp + 7 days) - lilPudgyTimer ));
                console.log("Base Reset time:", (block.timestamp + 7 days));
                console.log("Holder Reset time:", rogsData[tokenId].timestamp);
                console.log("Hours in numbers:", (lilPudgyBalance * 1 hours));
            }
        }

        // calculate a random number based on pudgyBalance.
        uint256 randomReward = (uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender))) % 100) + 1;
        console.log("Random Number Pulled:", randomReward);
         nftId = (randomReward * (1 + pudgyBalance)) % 5; // 0 through 4
        console.log("Number Generated:", nftId);

    //mint batch should be here
    _mint(msg.sender, nftId, amount, "");
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        onlyOwner
    {
        _mintBatch(to, ids, amounts, data);
    }

    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        internal
        whenNotPaused
        override(ERC1155, ERC1155Supply)
    {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}


