# Changelog

All notable changes. Every change to `src/` adds a line under **Unreleased** (enforced in CI for pull requests). On release the Unreleased entries move under the new version.

## Unreleased

### Removed
- Built-in Remote card and the room options `remote_media_player`, `remote_entity`, `remote_type`. Use your own remote card through `side_cards` instead. Leftover `remote_*` keys in a config are ignored.

### Fixed
- Floor cards on a camera-wall page no longer overflow: they were a fixed 84 px tall and the summary line spilled over the bottom border with taller fonts (e.g. Windows). They now size to their content; normal floor cards use a minimum height instead of a fixed one.
- Own cards (`cards`, `side_cards`) now also accept a single card (`type: ...` without a leading `-`); before, only a list was rendered and a single card was silently ignored.

### Changed
- Floor camera wall fits the window on tablet and desktop: the floor's Rooms page becomes one window tall (compact floor cards and room tiles) and the cameras get the remaining space; the column count is chosen for the largest 16:9 tiles that fit and recalculated on resize. Phone keeps the stacked, scrolling layout.

### Added
- Own cards in rooms: `cards` (below the Devices card, side by side when there is room) and `side_cards` (left column below the camera), each a YAML list of any Lovelace card configs, built-in or `custom:...` (e.g. your own washer, dryer or remote card). Rendered with HA's `loadCardHelpers().createCardElement`; the cards get every state update. Edit dashboard > Rooms > **Own cards**. Demo house: Laundry with two tile cards.
- Floor camera wall: floor option `cameras` (`off` default, `live`, `stills`). Shows the cameras of all rooms on that floor side by side on its Rooms page, stacked on the phone. Skips rooms with the camera section off; private cameras stay hidden. Demo house: Basement with four live cameras.

### Added
- Time since the last change on device tiles and on the room climate values, e.g. "5 min ago"; hovering shows both absolute timestamps. New option `appearance.time_display`: `changed` (default, HA `last_changed`), `updated` (HA `last_updated`) or `off`.
- Energy view: circuit cards of three-phase meters show a compact phase table (one row per phase with power, current and voltage, only the configured columns; each value opens more-info). Previously phases were shown only on the main meter. Demo house: new three-phase circuit "Oven & cooktop".
- Energy view (`energy` path): whole-house meter with ring gauge, phase A/B/C power, current and voltage, total energy, power factor, current and frequency; a "Right now" summary (whole house, metered circuits, not metered, top consumers, offline count); one gauge card per circuit (W, Consuming / Standby / Offline, kWh, A, PF, V, Hz). Configured with the new `energy_meters` list (Edit dashboard > Energy). Sidebar and phone nav **Energy** open it when meters are set, otherwise the HA Energy dashboard as before. The Home "Energy flow" card links to it. Unavailable sensors show "–", never 0.
- Room option `show_camera` (Edit dashboard > Rooms > Camera > **Show camera section**, default on). Off removes the room's camera section completely: no Camera card, no stream loading, camera not counted in the data-quality alert, no "open camera" label on its Home security tile. Demo house: Bedroom has it off.
- Room images `bathroom.jpg` (large bathroom) and `guest-wc.jpg` (small WC), conceptual like the others. Demo house: Bathroom on the first floor uses `bathroom.jpg`; new ground floor room Guest WC uses `guest-wc.jpg`.
- Documentation set: `docs/README.md` index, `docs/configuration.md` (generated), `docs/alerts.md`, `docs/architecture.md`, `docs/development.md`, screenshots in `docs/screenshots/`.
- `src/config/fields.ts`: one definition per option (label, help, type, default, selector). The editor and `docs/configuration.md` are both built from it.
- `npm run docs` (part of `npm run build`) and `npm run screenshots`.
- CI: generated docs must be up to date; pull requests that change `src/` must update `CHANGELOG.md`.
- Pull request template with a documentation checklist; `CLAUDE.md` with the same rules for AI sessions.

### Changed
- Room camera starts the live stream (muted) as soon as the room opens; no tap needed. A still frame is shown while the stream element loads. `camera_private` still hides it behind Reveal.
- Room image is now only the backdrop of the Devices card (darkened, tiles on frosted glass); the separate picture block is gone.
- Home Security card: camera tiles are 16:9 live still frames from the camera (scaled server side, refreshed every 10 s) instead of room photos; unavailable cameras show a dashed tile. Tap opens the room with the live stream.
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
