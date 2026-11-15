# Porting plan: one dashboard for all cards

Goal: ATLAS replaces the owner's separate custom card repositories. After the port, every change happens in this repository and is installed with one HACS entry. No Python integration is needed: all ported cards are frontend code (the incident report card reads a sensor that is filled outside Home Assistant).

Status of each step is kept in the [Steps](#steps) table. House-specific mapping (which real room gets what) stays in the dashboard config in Home Assistant, never in this repository.

## Placement rule

Every ported feature has a fixed scope, and room features appear only where they are configured.

- **Room features** are room options. They render only in the room whose config sets them. Nothing appears in a room by default, and no code refers to a room by id or name. A salt level is shown in the utility room because that room's config has `salt_*`; a mower card is shown in the garden because the garden's config has `mower_*`.
- **Device features** are options on a single device tile in a room's `devices` list (for example confirmation before toggling, or the Open / Stop / Close buttons of a cover).
- **Page features** are views or Home sections that cover the whole house (Lights page, Security page, System page, presence on Home).
- **Bundled elements** (if chosen, see [Decisions](#decisions)) are custom elements shipped in the ATLAS bundle and placed in a room with `cards` or `side_cards`, like any other Lovelace card.

| Feature | Scope | Configured with | Typical place |
| --- | --- | --- | --- |
| Confirm before acting, tap action | Device | `devices[].confirm`, `devices[].tap` | plugs powering servers or network gear |
| Open / Stop / Close buttons | Device | a `cover.*` entry in `devices` | garage, gate, blinds |
| Vehicle card | Room | `car_*` (name, subtitle, image, lock or doors status, range, odometer, location, distance and trips today / this month, last update, flash / horn / update buttons) | garage |
| Fans with speed and direction | Device | a `fan.*` entry in `devices` | any room with a fan |
| Mower card | Room | `mower_*` | garden |
| Salt level | Room | `salt_*` | utility room |
| Room power | Room | `power_*` | any room with a metered circuit |
| Appliances (oven, dishwasher, washer, dryer) | Room | `appliances` | kitchen, laundry |
| Presence | Page (Home) | `entities.persons` | Home |
| Weather forecast and warnings | Page (Home) and alerts | `entities.weather`, `alerts.severe_weather` | Home (strip next to the greeting), Alerts |
| Open window while it rains | Alert rule | `alerts.rain_windows`, `rain_weather`, `rain_min_mm` | Alerts, the window's room |
| Own cards on Home | Page (Home) | `layout.home_cards` | Home |
| Lights page | Page | each room's lights (no new options) | sidebar "Lights" |
| Security page | Page | alarm, cameras, contacts already in the config | sidebar "Security" |
| System page | Page | incident report sensor, `layout.system_cards` | sidebar "System" |

## Porting rules

Applies to every step, in addition to [development.md](development.md).

- Port behaviour, not code style. Use ATLAS tokens and components (`src/ui/styles.ts`), `ctx.call` for services, `ctx.moreInfo` for details, `ctx.confirm` for risky actions.
- Do not port: the cards' own editors (ATLAS builds its editor from `src/config/fields.ts`), frosted glass and theme switches, colour-stop code, per-card camera stream elements, fonts loaded from external sites.
- No new runtime dependencies. Charts are drawn as SVG.
- Unknown or unavailable values show "-" and never count as valid (same as the rest of ATLAS).
- Every new option: `types.ts` and `fields.ts`, demo data in `preset-demo.ts` and `dev/mock-hass.js` (fictional entities only), and, if the option holds an entity that is not a room device, the re-render list in `src/ui/atlas-view.ts`.
- Every step is one pull request with CHANGELOG, docs, screenshots and `dist/`.

## Sources

| Source repository | What moves into ATLAS | Step |
| --- | --- | --- |
| Garage-Dashboard-Card | Open / Stop / Close cover control | 1 |
| Vehicle-Custom-Card (and the car section of Garage-Dashboard-Card) | Vehicle card | 2 |
| lights-card | Lights page, drag to dim | 3 |
| ultimate-home-dashboard | Presence, media player, monthly power history | 4, 7 |
| HA-Log-analyzer-dashboard | System page (incident report) | 5 |
| Adaptive-Room-Card | Weather forecast and alerts, fans, mower, room power | 6, 7 |
| Multi-panel-dashboard-card | Salt level | 7 |
| Samsung-SolarCell-Remote-HA-Card | Remote (bundled element) | 8 |
| Laundry-Room-Card | Washer and dryer (bundled element or native) | 8 |
| Kitchen-Card | Appliances | 9 |
| SolarPanels-Dashboard | Solar view (only if decided) | 10 |
| Heat-pump-Nibe-card | Heat pump view (only if decided) | 10 |
| Power-Energy-HA-Dashboard | Nothing left: covered by the Energy view | done |
| Kids-Room-Dashboard-Card | Nothing left: covered by the room view | done |
| General-Custom-Card-HA, HASolarCellRemote | Nothing: demo card and YAML remote, superseded | done |

## Steps

| Step | Content | Scope | Status |
| --- | --- | --- | --- |
| 1 | Safer device tiles (`confirm`, `tap`), cover tiles with Open / Stop / Close | Device | Done (PR #16) |
| 2 | Vehicle card (`car_*`) | Room | Done (PR #17) |
| 3 | Lights page (tap toggles, hold for details, drag to dim) | Page | Done (PR #18) |
| 4 | Security page, presence on Home | Page | Done (PR #19) |
| 5 | System page, `layout.home_cards` | Page | Done (PR #20) |
| 6 | Weather forecast, warnings, open window while it rains | Page and alerts | Done (PR #21) |
| 7 | Fans, mower, salt level, room power | Device and room | Done (PR #22) |
| 8 | Remote and washer / dryer as bundled elements | Room (`cards`, `side_cards`) | Decision needed |
| 9 | Appliances | Room | Done, in review |
| 10 | Solar and heat pump views | Page | Decision needed |
| 11 | Retire the old repositories and dashboards | - | After all steps, owner's go per item |

## Decisions

1. Remote and washer / dryer: keep their own look as bundled elements, or rebuild them in ATLAS style.
2. Second house: move it to a second ATLAS dashboard (a strategy dashboard can be added several times with its own config). Step 10 is only needed if yes.
