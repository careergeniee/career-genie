/**
 * Career Genie — Automated Screenshot Capture
 * Usage: node scripts/take-screenshots.mjs <email> <password>
 * Example: node scripts/take-screenshots.mjs user@example.com mypassword
 *
 * Screenshots are saved to docs/screenshots/
 * Requires: npm install -g puppeteer  (or npx puppeteer)
 * Dev server must be running: npm run dev -- --port 5174
 */

import puppeteer from "puppeteer";
import { existsSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const BASE_URL = "http://localhost:5174";
const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "../docs/screenshots");
const VIEWPORT = { width: 1440, height: 900 };

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error("Usage: node scripts/take-screenshots.mjs <email> <password>");
  process.exit(1);
}

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

async function shot(page, name, selector) {
  const target = selector ? await page.$(selector) : null;
  const path = join(OUT_DIR, `${name}.png`);
  if (target) {
    await target.screenshot({ path });
  } else {
    await page.screenshot({ path, fullPage: true });
  }
  console.log(`  ✓  ${name}.png`);
}

async function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    defaultViewport: VIEWPORT,
  });
  const page = await browser.newPage();
  page.on("console", (msg) => {
    if (msg.type() === "error") console.log("BROWSER ERR:", msg.text());
  });
  page.on("pageerror", (err) => console.log("PAGE ERR:", err.message));

  try {
    // ── 1. Landing page ──────────────────────────────────────────────
    console.log("\n[Public pages]");
    await page.goto(BASE_URL, { waitUntil: "networkidle0" });
    await wait(1000);
    await shot(page, "01-landing");

    // ── 2. About page ───────────────────────────────────────────────
    await page.goto(`${BASE_URL}/about`, { waitUntil: "networkidle0" });
    await wait(800);
    await shot(page, "02-about");

    // ── 3. Services page ─────────────────────────────────────────────
    await page.goto(`${BASE_URL}/services`, { waitUntil: "networkidle0" });
    await wait(800);
    await shot(page, "03-services");

    // ── 4. Login page ────────────────────────────────────────────────
    await page.goto(`${BASE_URL}/login`, { waitUntil: "networkidle0" });
    await wait(800);
    await shot(page, "04-login");

    // ── 5. Signup page ───────────────────────────────────────────────
    await page.goto(`${BASE_URL}/signup`, { waitUntil: "networkidle0" });
    await wait(800);
    await shot(page, "05-signup");

    // ── 6. Login with provided credentials ───────────────────────────
    console.log("\n[Logging in...]");
    await page.goto(`${BASE_URL}/login`, { waitUntil: "networkidle0" });
    await wait(500);

    // Log in via the form (email verification check is bypassed for screenshot mode)
    const loginEmail = "careergenie.screenshot@yopmail.com";
    const loginPass  = "ScreenShot2024!";

    await page.goto(`${BASE_URL}/login`, { waitUntil: "domcontentloaded" });
    await wait(800);
    await page.waitForSelector("#email", { timeout: 8000 });
    await page.click("#email");
    await page.type("#email", loginEmail, { delay: 40 });
    await page.click("#password");
    await page.type("#password", loginPass, { delay: 40 });
    await page.click('button[type="submit"]');
    await wait(5000);

    const currentUrl = page.url();
    if (!currentUrl.includes("/dashboard")) {
      // Debug: capture whatever is on screen
      await page.screenshot({ path: join(OUT_DIR, "_debug-login.png"), fullPage: true });
      // Also log any visible error text
      const errText = await page.$eval("body", el => el.innerText.substring(0, 500)).catch(() => "");
      console.error(`  ✗  Login failed — still at: ${currentUrl}`);
      console.error("     Page text:", errText.replace(/\n/g, " ").substring(0, 200));
      await browser.close();
      process.exit(1);
    }
    console.log("  ✓  Logged in successfully\n[Dashboard pages]");

    const go = async (url) => {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 }).catch(() => {});
      // Wait for Firebase auth to hydrate: the app renders nothing until !loading
      // Detect when real content appears (any element with a non-white bg, or sidebar)
      await page.waitForFunction(
        () => document.body.innerText.trim().length > 50,
        { timeout: 12000 }
      ).catch(() => {});
      await wait(1000); // let images/fonts settle
    };

    // ── 7. Dashboard Home ─────────────────────────────────────────────
    await go(`${BASE_URL}/dashboard`);
    await shot(page, "06-dashboard-home");

    // ── 8. AI Career Chat ─────────────────────────────────────────────
    await go(`${BASE_URL}/dashboard/chat`);
    await shot(page, "07-chat");

    // ── 9. Resume Builder ─────────────────────────────────────────────
    await go(`${BASE_URL}/dashboard/resume`);
    await wait(1000); // extra time for PDF preview
    await shot(page, "08-resume-builder");

    // ── 10. Career Assessment ─────────────────────────────────────────
    await go(`${BASE_URL}/dashboard/assessment`);
    await shot(page, "09-career-assessment");

    // ── 11. Career Match / Prediction ─────────────────────────────────
    await go(`${BASE_URL}/dashboard/careers`);
    await shot(page, "10-career-prediction");

    // ── 12. Career Roadmap ────────────────────────────────────────────
    await go(`${BASE_URL}/dashboard/roadmap`);
    await shot(page, "11-career-roadmap");

    // ── 13. Mock Interview ────────────────────────────────────────────
    await go(`${BASE_URL}/dashboard/interview`);
    await shot(page, "12-interview-simulator");

    // ── 14. Settings ──────────────────────────────────────────────────
    await go(`${BASE_URL}/dashboard/settings`);
    await shot(page, "13-settings");

    // ── 15. Senior Instructor ─────────────────────────────────────────
    await go(`${BASE_URL}/dashboard/instructor`);
    await shot(page, "14-instructor");

    console.log(`\n✅  All screenshots saved to: docs/screenshots/\n`);
  } catch (err) {
    console.error("\n✗  Error during screenshot capture:", err.message);
  } finally {
    await browser.close();
  }
})();
