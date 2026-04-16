import { ethers } from 'ethers';
import crypto from 'crypto';

const KYC_ABI = [
  "function storeKYC(string memory userId, string memory kycHash) public",
  "function getKYC(string memory userId) public view returns (string memory)"
];

export const generateKYCHash = (name, idNumber, faceMatchScore) => {
  const data = `${name}${idNumber}${faceMatchScore}`;
  return crypto.createHash('sha256').update(data).digest('hex');
};

export const storeOnBlockchain = async (userId, kycHash) => {
  try {
    const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, KYC_ABI, wallet);
    
    const tx = await contract.storeKYC(userId, kycHash);
    const receipt = await tx.wait();
    
    return receipt.hash;
  } catch (error) {
    console.error('Blockchain error:', error);
    throw error;
  }
};

export const verifyFromBlockchain = async (userId) => {
  try {
    const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC_URL);
    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, KYC_ABI, provider);
    
    const storedHash = await contract.getKYC(userId);
    return storedHash;
  } catch (error) {
    console.error('Blockchain verification error:', error);
    throw error;
  }
};
