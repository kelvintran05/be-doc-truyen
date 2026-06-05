const CryptoJS = require("crypto-js");

const SECRET_KEY = "miniread-secret-key-2026-auth-token-key-32";

function decryptPayload(ciphertext) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decryptedText);
}

async function run() {
  try {
    console.log("Fetching courses...");
    const res = await fetch("http://127.0.0.1:3001/courses");
    const json = await res.json();
    console.log("Raw JSON response:", json);
    const payload = json.payload;
    const data = decryptPayload(payload);
    console.log("SUCCESS! Courses list loaded:", data.length);
    console.log("Course Title:", data[0].title);
    console.log("Slug:", data[0].slug);
    console.log("Units count:", data[0].units.length);

    console.log("\nFetching details for english-for-kids-lv1...");
    const resDetail = await fetch("http://127.0.0.1:3001/courses/english-for-kids-lv1");
    const jsonDetail = await resDetail.json();
    const detailData = decryptPayload(jsonDetail.payload);
    console.log("SUCCESS! Course detail loaded.");
    console.log("Title:", detailData.title);
    console.log("Level:", detailData.level);
    console.log("Units:");
    detailData.units.forEach((u, i) => {
      console.log(`  Unit ${i+1}: ${u.title} (${u.lessons.length} lessons)`);
      u.lessons.forEach((l, j) => {
        console.log(`    Lesson ${j+1}: ${l.title} (type: ${l.type}, pages: ${l.pages ? l.pages.length : 0})`);
      });
    });
  } catch (err) {
    console.error("API test failed:", err.message);
  }
}

run();
