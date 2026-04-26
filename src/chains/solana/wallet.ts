import * as bip39 from "bip39";
import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl";
import { Keypair } from "@solana/web3.js";

export function deriveSolanaWallet(mnemonic: string, index = 0) {
  const seed = bip39.mnemonicToSeedSync(mnemonic).toString("hex");

  // Solana standard path: m/44'/501'/0'/0'
  const path = `m/44'/501'/${index}'/0'`;

  const derived = derivePath(path, seed).key;
  const keypair = Keypair.fromSeed(derived);

  return {
    address: keypair.publicKey.toBase58(),
    path,
    index,
  };
}