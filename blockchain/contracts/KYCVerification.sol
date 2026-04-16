// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract KYCVerification {
    mapping(string => string) private kycRecords;
    
    event KYCStored(string indexed userId, string kycHash, uint256 timestamp);
    
    function storeKYC(string memory userId, string memory kycHash) public {
        kycRecords[userId] = kycHash;
        emit KYCStored(userId, kycHash, block.timestamp);
    }
    
    function getKYC(string memory userId) public view returns (string memory) {
        return kycRecords[userId];
    }
}
