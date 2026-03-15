import * as bip39 from "bip39";

export function generateMnemonic(): string {
    const mnemonic = bip39.generateMnemonic(256); // 24-word seed
    return mnemonic;
}

export function validateMnemonic(mnemonic: string): boolean {
    return bip39.validateMnemonic(mnemonic);
}