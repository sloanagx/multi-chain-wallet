import * as bip39 from "bip39";
import * as bitcoin from "bitcoinjs-lib";
import { BIP32Factory } from "bip32";
import * as ecc from "tiny-secp256k1";

const bip32 = BIP32Factory(ecc);

export function deriveBitcoinWallet(mnemonic: string, index = 0) {
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const root = bip32.fromSeed(seed);

  // BIP84 (native segwit): m/84'/0'/0'/0/index
  const path = `m/84'/0'/0'/0/${index}`;
  const child = root.derivePath(path);

  const { address } = bitcoin.payments.p2wpkh({
    pubkey: child.publicKey,
  });

  if (!address) {
    throw new Error("Failed to derive Bitcoin address");
  }

  return {
    address,
    path,
    index,
  };
}