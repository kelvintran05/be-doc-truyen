const CryptoJS = require("crypto-js");

const SECRET_KEY = "miniread-secret-key-2026-auth-token-key-32";

async function main() {
  const res = await fetch("http://127.0.0.1:3001/stories/2");
  const data = await res.json();
  const bytes = CryptoJS.AES.decrypt(data.payload, SECRET_KEY);
  const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
  const story = JSON.parse(decryptedText);
  console.log("Has questions:", !!story.questions, "Count:", story.questions?.length);
  console.log("Questions:", JSON.stringify(story.questions, null, 2));
}

main().catch(console.error);
