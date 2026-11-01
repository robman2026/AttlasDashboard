# Changelog

All notable changes. Every change to `src/` adds a line under **Unreleased** (enforced in CI for pull requests). On release the Unreleased entries move under the new version.

## Unreleased

### Added
- Remote control card per room (Edit dashboard > Rooms > **Remote control**): set a media player for power, volume, mute, play/pause, previous/next, input source and now playing; set the TV type (Android TV / Google TV, Samsung, LG webOS, Apple TV, Roku) and, except for LG webOS, the TV's `remote` entity for the arrow pad, OK, Back, Home and Menu. Any room can have one (e.g. living room and bedroom). Command names follow the official HA integration docs. Remote entities only trigger re-renders and are not part of the data-quality alert (many TVs report unavailable while off). Demo house: living room (Android TV) and bedroom (LG webOS).
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
