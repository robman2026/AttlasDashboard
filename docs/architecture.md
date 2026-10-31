# Architecture

## Overview

ATLAS Home is one JavaScript module (`dist/atlas-home.js`) that registers three custom elements:

| Element | Role |
| --- | --- |
| `ll-strategy-dashboard-atlas-home` | Dashboard strategy. HA calls `generate(config)` and gets the full dashboard (all views). |
| `atlas-home-strategy-editor` | Graphical editor shown in Edit dashboard (`getConfigElement`). |
| `atlas-view` | The only card. One per view, rendered in a `panel` view, draws the whole ATLAS screen. |

All `customElements.define` calls are guarded against double registration (`src/util/navigate.ts`).

## Views and URLs

| View path | Screen | HA view options |
| --- | --- | --- |
| `home` | Home | first view, default |
| `alerts` | Alerts | `subview`, `back_path: home` |
| `rooms` | Rooms, first floor selected | subview |
| `floor-<floor id>` | Rooms, that floor selected | subview |
| `room-<room id>` | Room | subview |
| `energy` | Energy (only generated when `energy_meters` has entries) | subview |

Each screen is a real HA view, so the browser back button and deep links work (e.g. `/atlas-home/room-office`). Navigation uses the same pattern as the HA frontend: `history.pushState` then a `location-changed` event on `window`.

## Data flow

1. The strategy config (stored in the dashboard) is the single source of truth: rooms, floors, entities, alert rules, layout. The HA area and floor registries are not used (`registryDependencies = []`, so registry changes do not regenerate the dashboard).
2. The strategy copies the whole config into each `atlas-view` card config.
3. `atlas-view` re-renders only when an entity it uses changes (`shouldUpdate` compares the relevant entity states).
4. Alerts are computed per render from the config and states (`src/data/alerts.ts`).

## Source map

| Path | Content |
| --- | --- |
| `src/atlas-home.ts` | Entry: registers elements and the Community dashboards entry |
| `src/strategy.ts` | View generation |
| `src/config/types.ts` | TypeScript types of the config |
| `src/config/fields.ts` | Option definitions (labels, help, selectors). Drives the editor **and** `docs/configuration.md` |
| `src/config/preset-demo.ts` | Fictional demo house (editor "Load demo house", harness, screenshots) |
| `src/config/constants.ts` | Tags, version (from package.json), defaults |
| `src/editor/strategy-editor.ts` | Editor built from `fields.ts` with HA `ha-form` |
| `src/data/hass.ts` | Minimal `hass` types and state helpers (invalid, numeric, power in kW) |
| `src/data/model.ts` | Config lookups (rooms, floors, images, mapped entities, room lights, `cameraOf` which respects `show_camera`) |
| `src/data/alerts.ts` | Attention engine ([alerts.md](alerts.md)) |
| `src/ui/atlas-view.ts` | Frame: background, sidebar, top bar, phone nav, settings, confirm dialog |
| `src/ui/views/*.ts` | Home, Alerts, Rooms, Room, Energy renderers |
| `src/ui/devices.ts` | Device tile icon, state kind, text |
| `src/ui/styles.ts` | Design tokens and all CSS, responsive breakpoints |
| `src/ui/icons.ts`, `icons.generated.ts` | ATLAS line icons (generated from `assets/icons`) and device glyphs |
| `public/rooms/` | Room images, copied to `dist/rooms/` |
| `scripts/` | Icon, docs and screenshot generators |
| `dev/` | Mock `hass` and harness page for local checks |

## Design tokens

| Token | Value |
| --- | --- |
| Canvas | `#14171C` |
| Solid card (Quiet) | `#252A30` |
| Glass card | `rgba(28,31,36,0.72)`, blur 12px, border `rgba(188,200,222,0.16)` |
| Text / secondary | `#F1F5FF` / `#BCC8DE` |
| Accent (default) | `#56E7C0` (configurable) |
| Warning / critical / info | `#FFBF57` / `#FF727D` / `#A7A3FF` |
| Radius | cards 20px, controls 12px |
| Touch target | min 44 x 44 px |

Glass falls back to the solid card colour when `backdrop-filter` is not supported. Breakpoints: up to 1280 px (tablet tweaks), 1100 px (icon sidebar, single column), 760 px (phone: no sidebar, bottom nav).

## Home Assistant APIs used (and where verified)

| API | Use | Verified in |
| --- | --- | --- |
| Custom dashboard strategy (`static generate`, `getConfigElement`, `configRequired`, `getCreateSuggestions`) | Strategy and editor | developers.home-assistant.io `docs/frontend/custom-ui/custom-strategy.md` |
| `window.customStrategies` (HA 2026.5+) | Community dashboards entry | developers blog 2026-04-21 |
| `registryDependencies` | Skip regeneration on registry changes | frontend `src/panels/lovelace/strategies/get-strategy.ts` (dev branch) |
| `location-changed` navigation | View switching | frontend `src/common/navigate.ts` |
| `hass-more-info` event | Device details | frontend `src/panels/lovelace/common/handle-action.ts` |
| `ha-form` selectors incl. `object` with `fields` + `multiple` | Editor | frontend `src/data/selector.ts`, `ha-selector-object.ts` |
| `ha-camera-stream` (`stateObj`, `fitMode`, `controls`, `muted`; HA context, `hass` still passed for older frontends) | Live camera, autoplays: HLS and WebRTC players render `<video autoplay playsinline>`; MJPEG fallback when the camera has no stream support | frontend `src/components/ha-camera-stream.ts`, tag `20260930.5` (HA 2026.10) and dev branch 2026-10-31 |
| `/api/camera_proxy/<id>?token=..&width=W&height=H` (entity `entity_picture`) | Home security stills, refreshed every 10 s like `hui-image` (`UPDATE_INTERVAL = 10000`). Backend reads only `token`, `width`, `height`; the extra `t` cache buster is ignored | frontend `src/panels/lovelace/components/hui-image.ts`, `src/data/camera.ts`; core `homeassistant/components/camera/__init__.py` (`CameraView`, `CameraImageView`) |
| HACS plugin layout (`dist/`, `hacs.json` `filename`) | Install | hacs/documentation `docs/publish/plugin.md`, `start.md` |

The frontend source was read from the `dev` branch on 2026-10-31 and targets HA 2026.10.
