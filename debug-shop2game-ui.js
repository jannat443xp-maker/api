const puppeteer = require("puppeteer");

async function debugUI() {
  console.log("[+] Launching...");
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  // Listen for API responses
  page.on("response", async (response) => {
    const url = response.url();
    if (url.includes("/api/") || url.includes("login") || url.includes("player")) {
      try {
        if (response.request().resourceType() === "xhr" || response.request().resourceType() === "fetch") {
          console.log(`[Response] ${url} ->`, await response.text());
        }
      } catch (e) {}
    }
  });

  console.log("[+] Navigating to shop2game...");
  // 100067 = Free Fire
  await page.goto("https://shop2game.com/app/100067/login", { waitUntil: "networkidle2" });

  try {
    console.log("[+] Looking for Player ID login button or input field...");
    
    // Sometimes it's a modal, sometimes it's direct.
    // Let's dump the HTML just to be sure we're on the right page
    const html = await page.content();
    console.log("Page title:", await page.title());
    if (html.includes("cloudflare") || html.includes("Just a moment")) {
      console.log("[-] Blocked by Cloudflare Turnstile screen.");
    }
    
    // In React/Vite SPAs, we need to inspect the inputs
    const inputs = await page.$$("input");
    console.log(`Found ${inputs.length} inputs.`);
    
    // I can't click blindly without knowing the selectors. Let's just exit and analyze.
  } catch (err) {
    console.log("[-] Error:", err.message);
  }

  await browser.close();
}
debugUI();
