# Changelog

All notable changes. Every change to `src/` adds a line under **Unreleased** (enforced in CI for pull requests). On release the Unreleased entries move under the new version.

## Unreleased

### Added
- Appliances card (porting plan step 9, from the owner's Kitchen Card). Room option `appliances` is a list; only the name is required. Edit dashboard > Rooms > Appliances. Each tile shows:
  - a temperature arc (or an icon);
  - an operation state pill and the door state;
  - an On / Off badge (running: the main state is on, or the operation says run, active, heat or progress);
  - a strip with setpoint, program, progress, finish time (the clock time and how long until then) and remote start;
  - a progress bar;
  - while running, the controls (switches toggle, buttons are pressed, scripts run) and Stop (asks first).

  Works with any integration; the field names follow Home Connect. Demo house: oven and dishwasher in the kitchen, replacing their device tiles.
- Fan tiles (porting plan step 7): a `fan.*` room device gets its own tile.
  - Tap toggles, or asks first with `confirm`.
  - Hold opens the details.
  - A horizontal drag sets the speed (`fan.set_percentage`, snapped to the fan's speed steps); only for fans that support a speed.
  - The tile fill shows the speed, and the icon spins while the fan is on (not with reduced motion).
  - A Fwd / Rev button switches the direction (`fan.set_direction`) for fans that support it.
- Room power (room options `power`, `power_energy`, `power_current`, `power_max`, Edit dashboard > Rooms > Room power): a gauge card with watts and Consuming / Standby / Offline, plus energy and current. The colour follows the load: accent up to 65 % of full scale, then amber, red from 85 %. There is also a power chip in the room status strip. Demo house: the kitchen.
- Lawn mower card (room options `mower`, `mower_battery`, `mower_name`):
  - state badge, time since the last change, battery bar;
  - Start mowing / Pause (one slot, as in the source card) and Return to dock, for what the mower supports (`supported_features`) and enabled per state;
  - a status chip;
  - a warning alert while the mower reports an error.

  Demo house: the garden.
- Salt level card (room options `salt_level`, `salt_distance`, `salt_warn_below`, `salt_name`):
  - a tank showing the level in % (the sensor may report 0-100 or 0-1), red below 30 %, amber below 60 %;
  - an optional raw reading;
  - a status chip;
  - an info alert "Salt low" below the threshold (default 30 %).

  Demo house: the utility room.
- Weather forecast on Home (porting plan step 6): a compact strip next to the greeting with five days (high / low, rain chance) or six hours, a Days / Hours toggle for the forecast types the weather entity supports, and tap for the HA weather dialog. On narrower screens and the phone it sits below the greeting. Uses the Home Assistant forecast subscription (`weather/subscribe_forecast`); hidden while the weather entity is unavailable.
- Alert rule **open window while it rains** (`alerts.rain_windows`, Edit dashboard > Alerts > Weather): warning for each listed window that is open while the weather is rainy, pouring, snowy, snowy-rainy, hail or a thunderstorm with rain, with a room badge. When the weather entity has an hourly forecast, the current and next hour must confirm precipitation (`alerts.rain_min_mm`, default 0.1 mm, or a 50 % chance); this stops false alarms from a wrong "rainy" state. Optional `alerts.rain_weather` uses another weather entity for the rule. Behaviour from the owner's Adaptive Room Card.
- Alert rule **severe weather** (`alerts.severe_weather`, default on): warning while the weather is lightning, thunderstorm with rain, hail, pouring or exceptional.
- System page (porting plan step 5, sidebar **System**; before: Home Assistant settings). The **Log report** from the log analyzer sensor (`entities.incidents`) shows:
  - a banner (red with a critical incident, amber with warnings, "waiting" until the sensor reports);
  - Critical / Warning / Minor counts;
  - one row per incident, critical first: severity, title, count, detail, sources and recommendation.

  Also on the page:
  - **Updates**: `update.*` entities with an update available, installed and latest version; tap opens the HA update dialog.
  - **Unavailable devices**: the entities in the config that are unavailable or missing, with room and entity id.
  - Links to Settings, Logs, Repairs and Updates.
  - Own cards (`layout.system_cards`).
- Own cards on Home (`layout.home_cards`): any Lovelace cards below the Home grid, side by side (stacked on the phone). One card or a list, like the room own cards. Demo house: a note card on Home and a history graph on the System page.
- Security page (porting plan step 4, sidebar **Security**; the Home Security card title opens it): alarm panel with its state, since when and who changed it, one button per arm mode the panel supports (Home, Away, Night, Vacation, Custom bypass from `supported_features`) and Disarm, all asking first; panels that need a code open the Home Assistant dialog, which asks for it. Doors and windows (room contacts and covers plus the alert door lists, mailbox left out; open first, exterior marked), Locks (room `lock.*` devices and vehicle locks; Unlock asks first, code locks open the HA dialog), Motion and presence, and every camera of the house as 16:9 stills refreshed every 10 s (a camera shared by rooms appears once, private cameras stay hidden, tap opens the room). No new options. The view exists only when there is something to show.
- Presence on Home: one chip per person in `entities.persons` (picture or initial, name, Home / Away / zone; tap opens the person). Next to the greeting on desktop, below it on the phone. Demo house: two persons and a front door lock.
- Lights page (porting plan step 3, sidebar **Lights**): every room's lights grouped by floor, "N of M on" and **All off** (asks first). Per room: name (opens the room), "x of y on" and an on / off switch. Light tile: tap toggles, hold opens details, drag left / right dims lights that support brightness (live level on the tile, `light.turn_on` with `brightness_pct` on release); switches used as lights toggle. Uses each room's lights as already configured (`light_entities`, else its `light.*` devices minus excluded status LEDs); no new options. The view exists only when some room has lights. Phone bottom navigation: Lights replaces Climate (Climate stays on Home).
- Vehicle card (porting plan step 2), room options `car_*` (Edit dashboard > Rooms > Vehicle): name and subtitle, image (or a drawn outline), lock state with Lock / Unlock (Unlock asks first; locks with a code open the Home Assistant lock dialog) or a read-only doors status, range, odometer, location (zone), distance and trips today and this month, last update, and Flash lights / Honk horn (asks first) / Update data buttons. Shown only in the room whose config sets these options, below the Devices card; the room status strip gets a car chip (lock and range, amber when unlocked). Demo house: a fictional car in the garage.
- Room images `garden.jpg` (garden at dusk) and `backup/garden.jpg` (terrace and lawn). Demo house: the Garden room picks `garden.jpg` automatically (room id `garden`).
- Device tile options `tap` and `confirm` (Edit dashboard > Rooms > Devices). `tap`: `toggle` (default for light, switch, fan, input_boolean), `more-info` (default otherwise) or `press` (presses a button or input_button, runs a script). `confirm: true` asks before the tap action, e.g. for a plug that powers a server. Hold or right click still opens the details. Extra climate values keep only entity, name and icon.
- Cover tiles: a `cover.*` device gets a full-width tile with Open / Stop / Close buttons for the actions the cover supports (`supported_features`), disabled when not possible (fully open, already closing, unavailable), with the position while open or moving. Open and Close ask first for garage doors and gates (or with `confirm: true`); Stop never asks. Tapping the tile opens the details. On the phone the buttons sit below the name.
- Demo house: the garage door supports open, close and stop; the server room has a rack power switch that asks first and a router restart button (`tap: press`).
- `docs/porting-plan.md`: plan for moving the owner's separate cards into ATLAS (placement rule, porting rules, steps and status).
- Light mood: room photos follow the room lights. Off: darker, desaturated, cool; on: brighter with a warm glow, brightness following the light level (average brightness over the room's lights); full: amber edge. Room tiles show a light chip ("Off", "1 on · 40 %", "3 on"); in the room view the Devices background follows the same rule and lights that are on get an amber tile. 0.6 s fade. Rooms without lights are unchanged. Option `appearance.light_mood` (default on).
- Room option `light_entities`: which entities count as the room's lights (light, switch, input_boolean), e.g. Tasmota relays that power lamps. Used by the light mood, the room Lights chip and the Home "Lights off" action. Empty: the room's `light.*` devices minus the excluded status LEDs.
- Room image `guest-room.jpg` (guest room).
- Automatic room image: a room without `image` uses the shipped image whose name matches the room id (`laundry` -> `laundry.jpg`, `guest_room` -> `guest-room.jpg`, `workshop` -> `workshop.jpg`). `image: none` turns it off. Only with the shipped images (no custom image base URL).
- Editor: the room Image field is a picker listing every shipped image (typing a file name or URL still works).
- Hobby room features, all optional per room (Edit dashboard > Rooms):
  - **Status strip** under the room title: All OK / alerts for this room, lights on (tap switches the room lights off, or on when all are off), 3D printer progress, unavailable devices.
  - **Extra climate values** (`climate_extra`): CO2, pressure, VOC, ... in the Climate card.
  - **3D printer card** (`printer_*`): status, progress, remaining time, nozzle / bed / chamber temperatures, chamber light, pause / resume / stop (stop asks first), printer picture. Works with any integration; field names follow the Bambu Lab integration (ha-bambulab) entities.
  - **Automations card** (`automations`): on/off switch and last run per automation.
- Room images `laundry.jpg` and `workshop.jpg`. Demo house: Laundry and Workshop use them; Workshop shows all hobby room features.
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
- Own cards in rooms: `cards` (below the Devices card, side by side when there is room) and `side_cards` (left column below the camera), each a YAML list of any Lovelace card configs, built-in or `custom:...` (e.g. your own washer, dryer or remote card). Rendered with HA's `loadCardHelpers().createCardElement`; the cards get every state update. Edit dashboard > Rooms > **Own cards**. Demo house: Laundry with two tile cards.
- Floor camera wall: floor option `cameras` (`off` default, `live`, `stills`). Shows the cameras of all rooms on that floor side by side on its Rooms page, stacked on the phone. Skips rooms with the camera section off; private cameras stay hidden. Demo house: Basement with four live cameras.

### Changed
- Demo house: the garden's lawn mower status sensor is replaced by a `lawn_mower` entity with the mower card.
- The "Log report" alert opens the System page and lists the first incident titles.
- Home Security card: the open count uses the same list as the Security page (alert door lists included, mailbox left out).
- Sidebar **Security** opens the Security page (before: the alarm details).
- A button or input_button that was never pressed (state `unknown`) shows "Never pressed" on a normal tile instead of the dashed "Unknown" style used for unavailable devices.
- Room view, wide screens: if the own-cards column (e.g. a tall remote) is taller than the space left in the window, it is scaled down to fit (CSS `zoom`, not below 75 %, only shrinks). Recalculated on resize and when the cards change size.
- Room view header is compact: a small breadcrumb line, then icon, title (40 px instead of 56 px) and summary, the status chips and previous / next on one row. The room content starts about 100 px higher, so tall cards such as a remote fit on smaller laptops.
- Room Lights chip and Home "Lights off" use `homeassistant.turn_on` / `turn_off`, so switches used as lights work too.
- Floor camera wall fits the window on tablet and desktop: the floor's Rooms page becomes one window tall (compact floor cards and room tiles) and the cameras get the remaining space; the column count is chosen for the largest 16:9 tiles that fit and recalculated on resize. Phone keeps the stacked, scrolling layout.
- Room camera starts the live stream (muted) as soon as the room opens; no tap needed. A still frame is shown while the stream element loads. `camera_private` still hides it behind Reveal.
- Room image is now only the backdrop of the Devices card (darkened, tiles on frosted glass); the separate picture block is gone.
- Home Security card: camera tiles are 16:9 live still frames from the camera (scaled server side, refreshed every 10 s) instead of room photos; unavailable cameras show a dashed tile. Tap opens the room with the live stream.
- Privacy: the repository no longer contains any real house data. The house-specific preset, entity map, design handoff and prototype were removed; a fictional English demo house (`src/config/preset-demo.ts`) is used for the editor's **Load demo house** button, the harness, the docs and the screenshots. Room images and icons renamed to English (`office`, `kids-room`, `bedroom`, `hallway`, `attic`, `garage`, `basement`, `shelter`, `utility`). Real configs belong in `*.private.yaml` (git-ignored). Existing dashboards that use old image file names or icon keys need them updated.
- Device type detection uses the entity's `device_class` first and only English name keywords as fallback (window, door, skylight, mailbox, motion, ...). Contacts without a device class may need one set in HA.
- `docs/design.md` replaces the private handoff with an anonymised design brief and milestone status.
- Editor shows a short intro and help text for each option (from `fields.ts`).
- Version is read from `package.json` at build time (single source).

### Fixed
- Lights page: after dragging a tile to dim it, the next state update could fail to render (the live percentage overwrote text managed by the renderer). The live value now uses its own element. Fan tiles use the same approach.
- Incident report: counts are read from the `summary` object the log analyzer publishes (then top-level `critical` / `warning` / `minor`, then the incident list). Before, a sensor with only `summary` raised no alert, and the alert text showed "[object Object]".
- A motion, occupancy or presence sensor whose entity id contains "door" or "window" (e.g. a doorbell's person sensor) no longer counts as a door or window.
- Room view with own left-column cards (`side_cards`, e.g. a tall remote) on smaller screens: the card was pushed below the window and the Devices card stretched into a large empty photo. From 1200 px wide these cards now get their own third column (side columns scale with the width, device tiles pick their column count); from 1100 to 1200 px they sit below climate and camera while Devices spans the full height; phone and tablet stack them after the camera.
- Camera-wall floor page with a single room (e.g. an attic) looked lopsided: the one tile used half of the left card. It now fills the whole card and the left side is narrower, so the cameras get more width. With an odd number of rooms the last tile spans the full row.
- Floor camera wall showed a camera twice when two rooms use the same camera entity. Each camera now appears once, labeled with all its rooms (e.g. "Workshop · Laundry"); each name opens its room. If any of those rooms marks the camera private, it stays hidden. Demo house: Laundry shares the Workshop camera.
- Phone: room tile text no longer wraps over the arrow button (name and details are cut with "..." instead), and the camera wall header wraps cleanly.
- Floor cards on a camera-wall page no longer overflow: they were a fixed 84 px tall and the summary line spilled over the bottom border with taller fonts (e.g. Windows). They now size to their content; normal floor cards use a minimum height instead of a fixed one.
- Own cards (`cards`, `side_cards`) now also accept a single card (`type: ...` without a leading `-`); before, only a list was rendered and a single card was silently ignored.

### Removed
- Built-in Remote card and the room options `remote_media_player`, `remote_entity`, `remote_type`. Use your own remote card through `side_cards` instead. Leftover `remote_*` keys in a config are ignored.

## 0.1.0 - 2026-10-31

First development build.

- Repo scaffold: Vite 8 + Lit 3 + TypeScript, single ES module `dist/atlas-home.js`, `hacs.json`, build and release workflows.
- Dashboard strategy `custom:atlas-home` (`ll-strategy-dashboard-atlas-home`), registered in `window.customStrategies` so it shows under Community dashboards (HA 2026.5+). Generates views `home`, `alerts`, `rooms`, `floor-<id>`, `room-<id>` (subviews with back path to home).
- Graphical strategy editor (HA `ha-form` selectors): every entity, floor, room, device, alert rule and layout list is editable, with a preset loader.
- `atlas-view` card: sidebar, top bar with room tabs, weather and clock, phone bottom nav; Warm glass / Glass / Quiet variants with solid fallback when `backdrop-filter` is unsupported; 5 ambiences; per-device style and accent override.
- Home: greeting, attention banner, room tiles, quick actions (Arm away, Garage, Lights off with confirmation; Wake PC), climate ring, energy flow, security.
- Alerts view grouped by severity. Rules: temperature limits with hysteresis, exterior doors (warning), interior doors (info), data quality (unavailable mapped entities), incident report, mailbox, updates, critical detectors. Unknown or unavailable is never treated as clear.
- Rooms view by floor; Room view with climate, camera slot (16:9, privacy Reveal, Live / Snapshot / Recordings), device tiles (tap toggles lights/switches/fans, hold or right click opens more-info), room image, other rooms on the floor.
