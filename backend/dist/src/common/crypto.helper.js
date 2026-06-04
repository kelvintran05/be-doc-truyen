"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SECRET_KEY = void 0;
exports.encryptPayload = encryptPayload;
exports.decryptPayload = decryptPayload;
const CryptoJS = require("crypto-js");
exports.SECRET_KEY = "miniread-secret-key-2026-auth-token-key-32";
function encryptPayload(data) {
    const jsonString = JSON.stringify(data);
    return CryptoJS.AES.encrypt(jsonString, exports.SECRET_KEY).toString();
}
function decryptPayload(ciphertext) {
    const bytes = CryptoJS.AES.decrypt(ciphertext, exports.SECRET_KEY);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedText);
}
//# sourceMappingURL=crypto.helper.js.map