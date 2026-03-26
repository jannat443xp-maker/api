// Debug: Fetch the AES challenge HTML and print it to inspect the script
const axios = require("axios");

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  "Accept": "*/*",
  "Origin": "https://shop2game.com",
  "Referer": "https://shop2game.com/",
};

axios.post("https://shop2game.com/app/api/auth/player_id_login",
  { app_id: 100067, login_id: "534049908" },
  { headers: DEFAULT_HEADERS, validateStatus: () => true, timeout: 10000 }
).then(res => {
  console.log("Status:", res.status);
  const html = typeof res.data === "string" ? res.data : JSON.stringify(res.data);
  console.log("Response (first 3000 chars):\n", html.substring(0, 3000));
}).catch(err => {
  console.log("Error:", err.message);
});
