# Changelog

All notable changes. Every change to `src/` adds a line under **Unreleased** (enforced in CI for pull requests). On release the Unreleased entries move under the new version.

## Unreleased

### Added
- Documentation set: `docs/README.md` index, `docs/configuration.md` (generated), `docs/alerts.md`, `docs/architecture.md`, `docs/development.md`, screenshots in `docs/screenshots/`.
- `src/config/fields.ts`: one definition per option (label, help, type, default, selector). The editor and `docs/configuration.md` are both built from it.
- `npm run docs` (part of `npm run build`) and `npm run screenshots`.
- CI: generated docs must be up to date; pull requests that change `src/` must update `CHANGELOG.md`.
- Pull request template with a documentation checklist; `CLAUDE.md` with the same rules for AI sessions.

### Changed
- Privacy: the repository no longer contains any real house data. The house-specific preset, entity map, design handoff and prototype were removed; a fictional English demo house (`src/config/preset-demo.ts`) is used for the editor's **Load demo house** button, the harness, the docs and the screenshots. Room images and icons renamed to English (`office`, `kids-room`, `bedroom`, `hallway`, `attic`, `garage`, `basement`, `shelter`, `utility`). Real configs belong in `*.private.yaml` (git-ignored). Existing dashboards that use old image file names or icon keys need them updated.
- Device type detection uses the entity's `device_class` first and only English name keywords as fallback (window, door, skylight, mailbox, motion, ...). Contacts without a device class may need one set in HA.
- `docs/design.md` replaces the private handoff with an anonymised design brief and milestone status.
- Editor shows a short intro and help text for each option (from `fields.ts`).
- Version is read from `package.json` at build time (single source).

## 0.1.0 - 2026-10-31

First development build.

- Repo scaffold: Vite 8 + Lit 3 + TypeScript, single ES module `dist/atlas-home.js`, `hacs.json`, build and release workflows.
- Dashboard strategy `custom:atlas-home` (`ll-strategy-dashboard-atlas-home`), registered in `window.customStrategies` so it shows under Community dashboards (HA 2026.5+). Generates views `home`, `alerts`, `rooms`, `floor-<id>`, `room-<id>` (subviews with back path to home).
- Graphical strategy editor (HA `ha-form` selectors): every entity, floor, room, device, alert rule and layout list is editable, with a preset loader.
- `atlas-view` card: sidebar, top bar with room tabs, weather and clock, phone bottom nav; Warm glass / Glass / Quiet variants with solid fallback when `backdrop-filter` is unsupported; 5 ambiences; per-device style and accent override.
- Home: greeting, attention banner, room tiles, quick actions (Arm away, Garage, Lights off with confirmation; Wake PC), climate ring, energy flow, security.
- Alerts view grouped by severity. Rules: temperature limits with hysteresis, exterior doors (warning), interior doors (info), data quality (unavailable mapped entities), incident report, mailbox, updates, critical detectors. Unknown or unavailable is never treated as clear.
- Rooms view by floor; Room view with climate, camera slot (16:9, privacy Reveal, Live / Snapshot / Recordings), device tiles (tap toggles lights/switches/fans, hold or right click opens more-info), room image, other rooms on the floor.
