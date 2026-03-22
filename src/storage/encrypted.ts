import { randomBytes, scryptSync, createCipheriv, createDecipheriv } from "crypto";
import { mkdir, writeFile, readFile } from "fs/promises";

const ALGORITHM = "aes-256-gcm";

export type EncryptedPayload = {
  salt: string;
  iv: string;
  authTag: string;
  ciphertext: string;
};

export function encryptMnemonic(mnemonic: string, password: string): EncryptedPayload {
  const salt = randomBytes(16);
  const iv = randomBytes(12);
  const key = scryptSync(password, salt, 32);

  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(mnemonic, "utf8"),
    cipher.final()
  ]);
  const authTag = cipher.getAuthTag();

  return {
    salt: salt.toString("hex"),
    iv: iv.toString("hex"),
    authTag: authTag.toString("hex"),
    ciphertext: encrypted.toString("hex")
  };
}

export function decryptMnemonic(payload: EncryptedPayload, password: string): string {
  const key = scryptSync(password, Buffer.from(payload.salt, "hex"), 32);
  const decipher = createDecipheriv(ALGORITHM, key, Buffer.from(payload.iv, "hex"));
  decipher.setAuthTag(Buffer.from(payload.authTag, "hex"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(payload.ciphertext, "hex")),
    decipher.final()
  ]);

  return decrypted.toString("utf8");
}

export async function saveEncryptedWallet(
  mnemonic: string,
  password: string,
  filePath = ".wallet/wallet.json"
): Promise<void> {
  const payload = encryptMnemonic(mnemonic, password);

  await mkdir(".wallet", { recursive: true });
  await writeFile(filePath, JSON.stringify(payload, null, 2), "utf8");
}

export async function loadEncryptedWallet(
  password: string,
  filePath = ".wallet/wallet.json"
): Promise<string> {
  const raw = await readFile(filePath, "utf8");
  const payload = JSON.parse(raw) as EncryptedPayload;
  return decryptMnemonic(payload, password);
}