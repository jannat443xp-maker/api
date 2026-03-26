// Debug: what does server get when it calls shop2game?
const axios = require("axios");
const vm = require("vm");

const HEADERS = {
  "Content-Type": "application/json",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "application/json, text/plain, */*",
  Origin: "https://shop2game.com",
  Referer: "https://shop2game.com/",
};

async function main() {
  // Step 1: fetch aes.min.js
  const aesRes = await axios.get("https://shop2game.com/aes.min.js", { headers: HEADERS, timeout: 8000 });
  const aesCode = aesRes.data;

  // Step 2: trigger challenge
  const r = await axios.post(
    "https://shop2game.com/app/api/auth/player_id_login",
    { app_id: 100067, login_id: "1" },
    { headers: HEADERS, validateStatus: () => true, timeout: 8000 }
  );
  
  const html = typeof r.data === "string" ? r.data : JSON.stringify(r.data);
  console.log("Status:", r.status);
  console.log("Response type:", typeof r.data);
  console.log("First 500 chars:", html.substring(0, 500));
  
  // Step 3: extract inline scripts
  const inlineRegex = /<script(?![^>]*\bsrc\b)[^>]*>([\s\S]*?)<\/script>/gi;
  let m, count = 0;
  while ((m = inlineRegex.exec(html)) !== null) {
    count++;
    console.log(`\nScript ${count}: length=${m[1].trim().length}, hasSlowAES=${m[1].includes("slowAES")}`);
  }
  console.log("Total inline scripts found:", count);

  // Step 4: also try GET request
  const r2 = await axios.get(
    "https://shop2game.com/app/api/auth/player_id_login",
    { headers: HEADERS, validateStatus: () => true, timeout: 8000 }
  );
  console.log("\nGET status:", r2.status);
  const html2 = typeof r2.data === "string" ? r2.data : JSON.stringify(r2.data);
  console.log("GET response first 200 chars:", html2.substring(0, 200));
}

main().catch(e => console.error("FATAL:", e.message));
