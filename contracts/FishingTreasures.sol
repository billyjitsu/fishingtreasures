// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./IPudgys.sol";

contract FishingTreasures is ERC1155, Ownable, Pausable, ERC1155Supply {

    event TreasureFound(address _from, uint256[] _tokenIds, uint256[] _amounts);

    IPudgyPengu pudgyPengu;
    ILilPengu lilPengu;
    IRogs rogs;

    //uint256 public nftId;
    string public TreasureNFT;

    //token ID to block.timestamp
    mapping(uint256 => uint256) public rogsData;

    constructor(address _pudgyPengu, address _lilPengu, address _rogs, string memory _treasureNFT) ERC1155(_treasureNFT) {
        pudgyPengu = IPudgyPengu(_pudgyPengu);
        lilPengu = ILilPengu(_lilPengu);
        rogs = IRogs(_rogs);
        TreasureNFT = _treasureNFT;
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

    //@Dev: This is called once the random number array is recieved to mint the NFTs
    //Requester is the saved msg.sender from the random number request
    //as this function is called from the airnode
    function reelInPrize(address _requester ,uint256[] memory _array) internal {
        uint256[] memory amounts = new uint256[](_array.length);
        for(uint i = 0; i < _array.length; i++) {
            amounts[i] = 1;
        }
        //call the fishing mint function
        _mintBatch(_requester, _array, amounts, "");
        emit TreasureFound(_requester, _array, amounts);
    }

    // URI overide for number schemes
    function uri(uint256 _tokenId) public view override returns (string memory)
    {
        return string(abi.encodePacked(TreasureNFT, Strings.toString(_tokenId), ".json"));
    }

    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        internal
        whenNotPaused
        override(ERC1155, ERC1155Supply)
    {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    function name() public pure returns (string memory) {
        return "Ocean Treasures";
    }

    function symbol() public pure returns (string memory) {
        return "OT";
    }
}


