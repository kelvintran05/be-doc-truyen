import CryptoJS from "crypto-js";

// Shared secret key between NestJS backend and React Native client
export const SECRET_KEY = "miniread-secret-key-2026-auth-token-key-32";

export function decryptPayload<T = any>(ciphertext: string): T {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    if (!decryptedText) {
      throw new Error("Empty decrypted string");
    }
    return JSON.parse(decryptedText) as T;
  } catch (error) {
    console.error("[DecryptionError] Failed to decrypt response payload:", error);
    throw new Error("Payload security decryption failed");
  }
}
