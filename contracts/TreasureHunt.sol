//SPDX-License-Identifier: MIT
pragma solidity 0.8.9;
import "@api3/airnode-protocol/contracts/rrp/requesters/RrpRequesterV0.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./FishingTreasures.sol";

contract TreasureHunt is RrpRequesterV0, Ownable, FishingTreasures {
    event RequestedUint256Array(bytes32 indexed requestId, uint256 size);
    event ReceivedUint256Array(bytes32 indexed requestId, uint256[] response);
    event WentFishing(address _from, uint256 amount);

    address public airnode;
    bytes32 public endpointIdUint256Array;
    address public sponsorWallet;

    uint256 public singleNumber;
    uint256[] public arrayOfRandoms;

    mapping(bytes32 => bool) public expectingRequestWithIdToBeFulfilled;
    //Mapping that maps the requestId to the address that made the request
    mapping(bytes32 => address) requestToSender;

    constructor(
        address _airnodeRrp,
        address _pudgyPengu,
        address _lilPengu,
        address _rogs,
        string memory _nftURI
    )
        RrpRequesterV0(_airnodeRrp)
        FishingTreasures(_pudgyPengu, _lilPengu, _rogs, _nftURI)
    {}

    function setRequestParameters(
        address _airnode,
        bytes32 _endpointIdUint256Array,
        address _sponsorWallet
    ) external onlyOwner {
        airnode = _airnode;
        endpointIdUint256Array = _endpointIdUint256Array;
        sponsorWallet = _sponsorWallet;
    }

    function letsGoFishing() external {
        //go through the amounts of rogs for number request
        uint256 lilPudgyBalance = lilPengu.balanceOf(msg.sender);
        uint256 rogBalance = rogs.balanceOf(msg.sender);
        //reset the amount to 0
        uint256 amount = 0;
        //calcuate the balance of lilpudgys to make sure there is a delay if too many pudgys
        uint256 lilPudgyTimer = (lilPudgyBalance * 1 hours);
        // console.log("Lil Pudgy Timer:", lilPudgyTimer);
        // console.log("7 days in seconds:", 7 days);
        //if the timer is greater than 7 days, set it to 6 days (some holders have a large amount)
        if (lilPudgyTimer > 7 days) {
            lilPudgyTimer = 6 days;
        }
        // loop over the balance and get the token ID owned by `sender` at a given `index` of its token list.
        for (uint256 i = 0; i < rogBalance; i++) {
            uint256 tokenId = rogs.tokenOfOwnerByIndex(msg.sender, i);
            // if the tokenId has not been claimed, increase the amount
            if (rogsData[tokenId] < block.timestamp) {
                amount += 1;

                //rogsData[tokenId] =  ((block.timestamp + 7 days) - lilPudgyTimer);
                rogsData[tokenId] =  ((block.timestamp + 2 minutes) - lilPudgyTimer); //Make sure this works
                // console.log("Base Reset time:", (block.timestamp + 7 days));
                // console.log("Holder Reset time:", rogsData[tokenId].timestamp);
            }
        }
        makeRequestUint256Array(amount);
        emit WentFishing(msg.sender, amount);
    }

    function makeRequestUint256Array(uint256 size) internal {
        bytes32 requestId = airnodeRrp.makeFullRequest(
            airnode,
            endpointIdUint256Array,
            address(this),
            sponsorWallet,
            address(this),
            this.fulfillUint256Array.selector,
            // Using Airnode ABI to encode the parameters
            abi.encode(bytes32("1u"), bytes32("size"), size)
        );
        expectingRequestWithIdToBeFulfilled[requestId] = true;
        //code the msg.sender to the requestId
        requestToSender[requestId] = msg.sender;
        emit RequestedUint256Array(requestId, size);
    }

    function fulfillUint256Array(
        bytes32 requestId,
        bytes calldata data
    ) external onlyAirnodeRrp {
        require(
            expectingRequestWithIdToBeFulfilled[requestId],
            "Request ID not known"
        );
        expectingRequestWithIdToBeFulfilled[requestId] = false;
        uint256[] memory qrngUint256Array = abi.decode(data, (uint256[]));
        for (uint i = 0; i < qrngUint256Array.length; i++) {
            qrngUint256Array[i] = (qrngUint256Array[i] % 5) + 1;
        }
        arrayOfRandoms = qrngUint256Array; // remove for demo (just public call of values)
        reelInPrize(requestToSender[requestId], qrngUint256Array);

        emit ReceivedUint256Array(requestId, qrngUint256Array);
    }
}
