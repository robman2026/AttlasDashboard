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
| `lights` | Lights page (only when some room has lights) | subview |
| `system` | System page (always) | subview |
| `security` | Security page (only with an alarm, door lists, a camera, or a binary sensor, cover or lock in a room) | subview |
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
| `src/data/model.ts` | Config lookups (rooms, floors, images, mapped entities, room lights, `cameraOf` which respects `show_camera`, `floorCameraGroups` / `houseCameraGroups` which merge rooms sharing a camera, `hasSecurity`) |
| `src/data/alerts.ts` | Attention engine ([alerts.md](alerts.md)) |
| `src/ui/atlas-view.ts` | Frame: background, sidebar, top bar, phone nav, settings, confirm dialog |
| `src/ui/views/*.ts` | Home, Alerts, Rooms, Room, Energy renderers |
| `src/ui/devices.ts` | Device tile icon, state kind, text, tap action, cover control rules |
| `src/ui/views/lights.ts` | Lights page: rooms grouped by floor, tap / hold / drag-to-dim tiles |
| `src/ui/views/security.ts` | Security page: alarm modes, doors and windows, locks, motion, all cameras; `cameraStill` also used by Home |
| `src/ui/views/presence.ts` | Presence chips on Home (`entities.persons`) |
| `src/ui/views/system.ts` | System page: log report, updates, unavailable devices, HA links, `layout.system_cards` |
| `src/data/weather.ts` | Forecast types from `supported_features`, wet and severe conditions, the precipitation guard of the rain rule |
| `src/ui/views/weather.ts` | Forecast strip on Home (Days / Hours) |
| `src/ui/drag.ts` | Shared tap / hold / horizontal drag handling (Lights page tiles, fan tiles) |
| `src/ui/views/fan.ts` | Fan tile: speed by drag, direction button |
| `src/ui/views/room-more.ts` | Room power, lawn mower and salt level cards (room options `power_*`, `mower_*`, `salt_*`) |
| `src/ui/views/appliances.ts` | Appliances card (room option `appliances`) |
| `src/bundled/samsung-solar-remote.js`, `src/bundled/laundry-card.js` | Owner's cards bundled as-is (step 8): source commit and the only changes in the file header (guarded registration; Lit from the bundle for the laundry card) |
| `src/data/incidents.ts` | Reads the log analyzer sensor (counts from `summary`, top-level attributes or the incident list) |
| `src/ui/views/vehicle.ts` | Vehicle card (room option `car_*`) and the car chip data for the status strip |
| `src/ui/views/room-extras.ts` | Optional room sections: status strip, extra climate values, 3D printer card, automations card |
| `src/ui/embedded-card.ts` | `<atlas-hui-card>`: renders own Lovelace cards (room `cards` / `side_cards`) |
| `src/ui/time.ts` | Relative "time ago" labels (`time_display`) |
| `src/ui/styles.ts` | Design tokens and all CSS, responsive breakpoints |
| `src/config/images.generated.ts` | List of shipped room images (generated from `public/rooms` by `scripts/build-icons.mjs`) for the editor picker and the automatic room image |
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
| Entity `last_changed` / `last_updated` | "Time ago" on device tiles and climate values | home-assistant-js-websocket `HassEntity` type |
| `window.loadCardHelpers()` then `createCardElement(config)`, `ll-rebuild` event | Own cards in rooms | frontend `src/panels/lovelace/ha-panel-lovelace.ts`, `custom-card-helpers.ts` (2026-11-01) |
| `button.press`, `automation.toggle`, automation `last_triggered` | 3D printer job buttons, Automations card | home-assistant.io `source/_actions/automation.toggle.markdown` (2026-11-01); printer entity names from greghesp/ha-bambulab `definitions.py`, `button.py` (2026-11-01) |
| `homeassistant.turn_on` / `turn_off` (any domain) | Room Lights chip, Home "Lights off" (lights and switches together) | home-assistant.io `source/_actions/homeassistant.turn_off.markdown` (2026-11-02) |
| `cover.open_cover` / `close_cover` / `stop_cover`; `supported_features` OPEN = 1, CLOSE = 2, STOP = 8; enable rules (Open: not fully open and not opening, Close: not fully closed and not closing, both always with `assumed_state`; fully open / closed from `current_position` when present, else the state; nothing when unavailable) | Cover tiles (Open / Stop / Close) | core `homeassistant/components/cover/const.py` (`CoverEntityFeature`, `CoverState`), `cover/services.py` (required features per service); frontend `src/data/cover.ts` (`canOpen`, `canClose`, `canStop`), `src/data/feature/cover_entity_feature.ts` (dev branch, 2026-11-15) |
| `button.press`, `input_button.press`, `script.turn_on` (entity target) | Device tile `tap: press`; Wake PC quick action | core `button/const.py`, `button/services.py`, `input_button/const.py`, `input_button/services.py`, `script/const.py`, `script/services.py` (dev branch, 2026-11-15) |
| Button / input_button state: last press as ISO timestamp, `unknown` before the first press, restored after restart | "Never pressed" on device tiles | core `button/entity.py` (`state`, `__last_pressed_isoformat`), `input_button/entity.py` (inherits `ButtonEntity`); home-assistant.io `source/_integrations/button.markdown` (2026-11-15) |
| `lock.lock` / `lock.unlock` (entity target, optional `code`); lock states `locked`, `locking`, `unlocked`, `unlocking`, `open`, `opening`, `jammed`; `code_format` attribute when a code is needed | Vehicle card Lock / Unlock (code locks open the HA dialog) | home-assistant.io `source/_integrations/lock.markdown`, `source/_actions/lock.lock.markdown`, `lock.unlock.markdown` (2026-11-15) |
| `binary_sensor` device class `lock`: `on` = unlocked, `off` = locked | Vehicle doors status without a lock entity | home-assistant.io `source/_integrations/binary_sensor.markdown` (2026-11-15) |
| `device_tracker` state: zone name, `home`, `not_home` | Vehicle location | home-assistant.io `source/_integrations/device_tracker.markdown` (2026-11-15) |
| Timestamp sensor state: ISO date-time in UTC | Vehicle last update | home-assistant.io `source/_integrations/sensor.markdown` (2026-11-15) |
| `supported_color_modes` brightness rule (brightness, color_temp, hs, xy, rgb, rgbw, rgbww, white) | Lights page: which tiles can be dragged to dim | frontend `src/data/light.ts` (`lightSupportsBrightness`, dev branch 2026-10-31) |
| `light.turn_on` with `brightness_pct` (0 off, 1 minimum, 100 maximum) | Lights page drag to dim | home-assistant.io `source/_actions/light.turn_on.markdown` (2026-11-15) |
| `alarm_control_panel` `supported_features` ARM_HOME 1, ARM_AWAY 2, ARM_NIGHT 4, TRIGGER 8, ARM_CUSTOM_BYPASS 16, ARM_VACATION 32; services `alarm_arm_home` / `_away` / `_night` / `_vacation` / `_custom_bypass`, `alarm_disarm`; code needed when `code_format` is set (disarm) or `code_format` and `code_arm_required` (arm); attribute `changed_by` | Security page alarm buttons (code panels open the HA dialog, which also applies a stored default code) | frontend `src/data/alarm_control_panel.ts` (`ALARM_MODES`, `supportedAlarmModes`, `setProtectedAlarmControlPanelMode`, dev branch 2026-11-15); home-assistant.io `source/_integrations/alarm_control_panel.markdown` (states, code, `changed_by`, 2026-11-15) |
| Alarm states `disarmed`, `armed_home`, `armed_away`, `armed_night`, `armed_vacation`, `armed_custom_bypass`, `arming`, `pending`, `triggered`, `disarming` | Security page alarm colour (armed: accent, arming / pending / disarming: amber, triggered: red) | home-assistant.io `source/_integrations/alarm_control_panel.markdown` (2026-11-15) |
| `person` state: `home`, `not_home` or a zone name; `entity_picture` | Presence chips on Home | home-assistant.io `source/_integrations/person.markdown` (2026-11-15) |
| Log analyzer sensor: state summary text; attributes `generated` (ISO), `summary` (`critical`, `warning`, `minor`), `incidents` (`id`, `severity`, `title`, `detail`, `recommendation`, `count`, `sources`) | System page log report, Log report alert | owner's repositories `ha-log-analyzer-dashboard` (`system-incident-report-card.js` `_readEntity`, README "How the sensor looks", `node-red-analyzer.md`), read 2026-11-15 |
| `update` entity: state `on` = update available; attributes `title`, `installed_version`, `latest_version`, `in_progress` | System page Updates card | frontend `src/data/update.ts` (dev branch 2026-10-31) |
| Config routes `/config/system`, `/config/logs`, `/config/repairs`, `/config/updates` | System page links | frontend `src/panels/config/ha-panel-config.ts` (dev branch 2026-10-31) |
| `weather/subscribe_forecast` websocket subscription (`entity_id`, `forecast_type` daily / hourly / twice_daily) returning `{ type, forecast }`; weather `supported_features` FORECAST_DAILY 1, FORECAST_HOURLY 2, FORECAST_TWICE_DAILY 4; forecast fields `datetime`, `condition`, `temperature`, `templow`, `precipitation`, `precipitation_probability`; the `forecast` attribute is legacy | Home forecast strip, rain rule guard (hourly). `<atlas-view>` keeps one subscription per needed entity and type and ends it when the view is removed | frontend `src/data/weather.ts` (`subscribeForecast`, `getSupportedForecastTypes`, `ForecastAttribute`, dev branch 2026-10-31) |
| Weather conditions `clear-night`, `cloudy`, `exceptional`, `fog`, `hail`, `lightning`, `lightning-rainy`, `partlycloudy`, `pouring`, `rainy`, `snowy`, `snowy-rainy`, `sunny`, `windy`, `windy-variant` | Rain rule (wet set), severe weather rule | frontend `src/data/weather.ts` (`weatherIcons`); rain guard and condition groups from the owner's Adaptive-Room-Card `room-card.js` (`_computeActiveAlerts`, `_forecastHasPrecip`), read 2026-11-15 |
| `fan` features SET_SPEED 1, OSCILLATE 2, DIRECTION 4, PRESET_MODE 8, TURN_OFF 16, TURN_ON 32; attributes `percentage`, `percentage_step`, `direction`; `fan.set_percentage` (`percentage` 0-100), `fan.set_direction` (`direction` forward / reverse) | Fan tiles | frontend `src/data/fan.ts` (dev branch 2026-10-31); home-assistant.io `source/_actions/fan.set_percentage.markdown`, `fan.set_direction.markdown` (2026-11-15) |
| `lawn_mower` features START_MOWING 1, PAUSE 2, DOCK 4; states `mowing`, `paused`, `returning`, `docked`, `idle`, `error`; enable rules (start: not mowing, pause: not paused, dock: not docked, none while unavailable); `lawn_mower.start_mowing`, `pause`, `dock` | Mower card | frontend `src/data/lawn_mower.ts` (dev branch 2026-10-31); home-assistant.io `source/_integrations/lawn_mower.markdown`, `source/_actions/lawn_mower.start_mowing.markdown`, `lawn_mower.pause.markdown` (2026-11-15) |
| Salt level as % (0-100 or 0-1), thresholds 30 / 60 %, "buy salt" below 30 % | Salt card and alert | owner's Multi-panel-dashboard-card `multi-panel-dashboard-card.js` (`calcSaltPct`, `DEFAULT_THRESHOLDS.salt`), read 2026-11-15 |
| Appliance tile rules: running = main state on (`on`, `true`, `home`, `open`) or operation containing run / active / heat / progress; controls and Stop only while running; finish as a timestamp | Appliances card | owner's Kitchen-Card `kitchen-card.js` (`_applTileHTML`, `_controlsRowHTML`, `fmtFinish`), read 2026-11-15; button state `unknown` before the first press (core `button/entity.py`, see above) |
| `customElements.get` before `define` | Bundled cards coexist with the separately installed cards (a second `define` of the same name throws) | HTML Living Standard, CustomElementRegistry `define()` (throws "NotSupportedError" for a name already defined) |
| CSS `zoom` | Scale the room view own-cards column to fit the window (wide screens) | MDN `zoom` (standardized; Chromium, Safari, Firefox 126+) |
| HACS plugin layout (`dist/`, `hacs.json` `filename`) | Install | hacs/documentation `docs/publish/plugin.md`, `start.md` |

The frontend source was read from the `dev` branch on 2026-10-31 and targets HA 2026.10.
