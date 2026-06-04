import * as CryptoJS from "crypto-js";

// Shared secret key between backend and frontend
export const SECRET_KEY = "miniread-secret-key-2026-auth-token-key-32";

export function encryptPayload(data: any): string {
  const jsonString = JSON.stringify(data);
  return CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
}

export function decryptPayload(ciphertext: string): any {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decryptedText);
}
