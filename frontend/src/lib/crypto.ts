import CryptoJS from "crypto-js";

// Shared secret key between backend and frontend
export const SECRET_KEY = "miniread-secret-key-2026-auth-token-key-32";

export function decryptPayload<T = any>(ciphertext: string): T {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
  if (!decryptedText) {
    throw new Error("Failed to decrypt payload or empty data");
  }
  return JSON.parse(decryptedText) as T;
}
