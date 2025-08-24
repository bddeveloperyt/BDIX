// scripts/st.js
// Puppeteer script to fetch sport schedule based on c=SPORT & d=DATE

import puppeteer from "puppeteer";
import fs from "fs";

// Parse command-line args like query parameters
const args = process.argv.slice(2);
const params = {};
args.forEach(arg => {
  const [key, value] = arg.split("=");
  if (key && value) params[key] = value;
});

const sport = params.c || "tennis";
const date = params.d || "2025-08-24";

const url = `https://www.sofascore.com/api/v1/sport/${sport}/scheduled-events/${date}`;

(async () => {
  try {
    console.log(`🚀 Fetching ${sport} schedule for ${date}`);

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36"
    );

    await page.setExtraHTTPHeaders({
      "sec-ch-ua-platform": '"Windows"',
      "sec-ch-ua": '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
      "sec-ch-ua-mobile": "?0",
      "X-Requested-With": "077dd6",
      "DNT": "1",
      "Accept": "*/*",
      "Referer": "https://www.sofascore.com/",
      "Origin": "https://www.sofascore.com"
    });

    const response = await page.goto(url, { waitUntil: "networkidle0" });
    const jsonText = await response.text();

    const fileName = `data/${sport}_${date}.json`;
    fs.mkdirSync("data", { recursive: true });
    fs.writeFileSync(fileName, jsonText);
    console.log(`✅ Saved JSON to ${fileName}`);

    await browser.close();
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
})();
