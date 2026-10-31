// Generates docs/configuration.md from src/config/fields.ts (the same definitions
// the editor uses) and the demo preset. Runs in `npm run build`; CI fails when
// the committed file is out of date, so the reference can never drift from the code.
import { writeFileSync, readFileSync } from "node:fs";
import { stringify } from "yaml";
import { SECTIONS } from "../src/config/fields.ts";
import { DEMO_PRESET } from "../src/config/preset-demo.ts";

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const esc = (s = "") => String(s).replace(/\|/g, "\\|").replace(/\n/g, " ");

// Guard: every option used by the preset must be documented in fields.ts.
const known = new Map(SECTIONS.map((s) => [s.key, new Set(s.fields.map((f) => f.name))]));
const devFields = new Set(SECTIONS.find((s) => s.key === "rooms").fields.find((f) => f.name === "devices").fields.map((f) => f.name));
const problems = [];
for (const [key, value] of Object.entries(DEMO_PRESET)) {
  const names = known.get(key);
  if (!names) { problems.push(`top-level "${key}"`); continue; }
  const items = Array.isArray(value) ? value : [value];
  for (const item of items) for (const k of Object.keys(item)) if (!names.has(k)) problems.push(`${key}.${k}`);
  if (key === "rooms") for (const r of value) for (const d of r.devices ?? []) for (const k of Object.keys(d)) if (!devFields.has(k)) problems.push(`rooms.devices.${k}`);
}
if (problems.length) {
  console.error("Options used in the preset but missing in src/config/fields.ts:\n  " + [...new Set(problems)].join("\n  "));
  process.exit(1);
}

const table = (fields, prefix = "") => {
  const rows = [
    "| Option | Type | Default | Description |",
    "| --- | --- | --- | --- |",
  ];
  for (const f of fields) {
    const desc = [f.label, f.help].filter(Boolean).join(". ").replace(/\.\./g, ".");
    rows.push(`| \`${prefix}${f.name}\`${f.required ? " (required)" : ""} | ${esc(f.type)} | ${esc(f.default ?? "")} | ${esc(desc)} |`);
  }
  let out = rows.join("\n") + "\n";
  for (const f of fields) if (f.fields) out += `\nItems of \`${prefix}${f.name}\`:\n\n` + table(f.fields);
  return out;
};

let md = `# Configuration reference

<!-- GENERATED FILE - do not edit. Source: src/config/fields.ts and src/config/preset-demo.ts. Run \`npm run docs\`. -->

Version ${pkg.version}. Everything below is editable in the dashboard: three dots > **Edit dashboard** (tabs match the sections), or in YAML via the dialog's three dots > **Edit in YAML**.

The strategy config lives in the dashboard's raw config:

\`\`\`yaml
strategy:
  type: custom:atlas-home
  appearance: { ... }
  entities: { ... }
  alerts: { ... }
  floors: [ ... ]
  rooms: [ ... ]
  layout: { ... }
\`\`\`

Rules that apply everywhere:

- Entities that are missing, \`unavailable\` or \`unknown\` are never shown as a valid value and never count as "clear".
- Rooms and floors come only from this config, not from the HA area or floor registry.

`;
for (const s of SECTIONS) {
  md += `\n## ${s.title}\n\nEditor tab: **${s.tab}**. ${s.intro}\n\n`;
  if (s.shape === "list") md += `A list; each item has:\n\n`;
  md += table(s.fields);
}
md += `\n## Demo house\n\nLoaded by the editor's **Load demo house** button when the dashboard has no rooms. Fictional rooms and entity IDs: replace them with your own. Keep your real config out of the repo (e.g. \`my-house.private.yaml\`, git-ignored) and paste it in YAML mode.\n\n\`\`\`yaml\nstrategy:\n  type: custom:atlas-home\n${stringify(DEMO_PRESET, { lineWidth: 0 }).replace(/^/gm, "  ").trimEnd()}\n\`\`\`\n`;

writeFileSync("docs/configuration.md", md);
console.log(`docs: configuration.md (${SECTIONS.length} sections)`);
