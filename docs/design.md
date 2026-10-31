# Design brief

Public, anonymised summary of the approved ATLAS design. House-specific details (rooms, entities, hostnames) are kept privately by the owner and never committed.

## Concept

- Attention-first: what needs attention is shown before everything else, combined with room and function navigation.
- One dashboard replacing several scattered ones, added alongside existing dashboards (never modifies or deletes them).
- Devices: phone, ~10 inch landscape wall tablet, desktop / large monitor.
- Visual direction: dark glass panels over a blurred home photo, mint accent, amber attention strip, photographic room tiles with bottom darkening. Neutral Graphite ambience by default (no brown tones); accent adjustable.
- Room images are conceptual generated interiors, not photos of a real house. Used as room tiles, the blurred room view background, and to fill the free space of the Devices card.
- Privacy: a camera can be marked private (stream hidden until Reveal). Cameras never auto-play on the wall panel. Camera slot is always 16:9.

## Screens

**Shared frame (desktop design size 1600 x 1000):** left sidebar (200 px glass) with logo and navigation (Home, Rooms, Energy, Climate, Security, Automations, System) and user; top bar (64 px glass) with Home, room tabs, All rooms, weather, clock, settings.

**Home:** time-aware greeting with indoor temperature and alarm state; amber attention banner (count, critical / warning / info split, up to 3 chips to the source room, chevron to Alerts); 8 room photo tiles in a 6 column grid (spans 2,2,2 / 3,3 / 2,2,2) with icon, badge, name, temperature, humidity; "View all rooms"; quick actions (Arm away with confirmation, Garage, Lights off, Wake PC, More); right column with Climate ring (10-30 C, current and target, outdoor / supply / return), Energy flow (Solar, House, Grid with direction), Security (alarm, open count, camera tiles to the room view).

**Alerts:** groups Critical (red), Warning (amber), Info (lavender). Row: icon, title, meta, severity label, tap goes to the room. Empty groups hidden.

**Rooms:** floor cards (level, name, room count, typical temperature, alert count); selected floor shows its room tiles (3 columns, 180 px rows).

**Room:** breadcrumb Home > Floor > Room; large title with icon and badge; previous / next room on the floor. Left: Climate (temperature and humidity with bars, or "No temperature sensor"), Camera (16:9 slot with Live, Snapshot, Recordings; privacy Reveal; compact "No camera"). Right: Devices (3 column grid; on = accent, open = amber, unavailable = dashed amber), room image filling the remaining height; "Other rooms on <floor>" chips. Page background: the room image, blurred.

**Phone (390 wide):** header (logo, weather, settings), greeting, compact attention banner, rooms, climate, energy, security, bottom navigation.

**Wall tablet (~1280 x 800):** desktop layout adapted, Quiet variant (no blur) recommended. Dedicated layout still to be designed and reviewed before building.

## Tokens

See [architecture.md](architecture.md#design-tokens).

## Alert principles

Unknown or unavailable is never treated as clear; critical is reserved for real detectors (leak, smoke). Rules: [alerts.md](alerts.md).

## Milestones

1. Scaffold, strategy, HACS install. **Done (0.1.0)**
2. Config, design tokens, variants, frame and navigation. **Done (0.1.0)**
3. Home with live data, attention engine, quick actions. **First pass done**
4. Rooms and room views, device tiles with actions and more-info. **First pass done**
5. Camera slots: live stream, privacy, snapshot, recordings. **Partly done, needs live test**
6. Phone layout, then wall tablet layout. **Phone first pass done; tablet pending**
7. Acceptance pass and v1.0.0: every route and deep link, no status LED counted as a light, no unavailable value shown as valid, alert states (none, warning, info, unavailable source), contrast 4.5:1, 44 px targets, phone / tablet / desktop checked, existing dashboards untouched.
