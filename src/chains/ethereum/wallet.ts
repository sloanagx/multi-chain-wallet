import { ethers } from "ethers";

export function deriveEthereumWallet(mnemonic: string, index = 0) {
  const path = `m/44'/60'/0'/0/${index}`;
  const wallet = ethers.HDNodeWallet.fromPhrase(mnemonic, undefined, path);

  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    path,
    index
  };
}