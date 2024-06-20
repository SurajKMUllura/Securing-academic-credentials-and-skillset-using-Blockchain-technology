// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FileVerifier {
    event HashStored(address indexed user, bytes32 indexed ipfsHash, bytes32 indexed transactionHash);

    bytes32[] public ipfsHashes;

    function storeHash(bytes32 ipfsHash) external {
        // Store the IPFS hash
        ipfsHashes.push(ipfsHash);
        
        // Emit event
        emit HashStored(msg.sender, ipfsHash, keccak256(abi.encodePacked(ipfsHash)));
    }

}
