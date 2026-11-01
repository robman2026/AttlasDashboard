// Regenerates docs/screenshots/*.jpg from the built bundle with mocked states
// (dev/mock-hass.js). Needs Playwright with Chromium installed
// (npm i -D playwright && npx playwright install chromium). Run after `npm run build`
// whenever the UI changes, and commit the images with the change.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  try {
    ({ chromium } = createRequire(import.meta.url)("playwright")); // globally installed (NODE_PATH)
  } catch {}
}
if (!chromium) {
  console.error("Playwright is not installed. Run: npm i -D playwright && npx playwright install chromium");
  process.exit(1);
}

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml" };
const root = process.cwd();
const server = createServer(async (req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)).replace(/^([/\\])+/, "");
  try {
    const body = await readFile(join(root, path));
    res.writeHead(200, { "content-type": TYPES[extname(path)] ?? "application/octet-stream" }).end(body);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
const port = server.address().port;

const SHOTS = [
  ["home", 1600, 1000, "home-desktop"],
  ["alerts", 1600, 1000, "alerts-desktop"],
  ["floor-first", 1600, 1000, "rooms-desktop"],
  ["room-office", 1600, 1000, "room-office-desktop"],
  ["room-kids_room", 1600, 1000, "room-kids-room-desktop"],
  ["room-living", 1600, 1000, "room-living-desktop"],
  ["room-bedroom", 1600, 1000, "room-bedroom-desktop"],
  ["energy", 1600, 1000, "energy-desktop"],
  ["energy", 1280, 800, "energy-tablet"],
  ["energy", 390, 844, "energy-phone"],
  ["home", 1280, 800, "home-tablet"],
  ["home", 390, 844, "home-phone"],
];

mkdirSync("docs/screenshots", { recursive: true });
const browser = await chromium.launch();
let failed = false;
for (const [view, width, height, name] of SHOTS) {
  const page = await browser.newPage({ viewport: { width, height } });
  page.on("pageerror", (e) => { failed = true; console.error(name, e.message); });
  await page.goto(`http://127.0.0.1:${port}/dev/harness.html?view=${view}`);
  await page.waitForTimeout(900);
  await page.screenshot({ path: `docs/screenshots/${name}.jpg`, type: "jpeg", quality: 82, fullPage: width < 800 });
  await page.close();
  console.log(`docs/screenshots/${name}.jpg`);
}
await browser.close();
server.close();
process.exit(failed ? 1 : 0);
