# Alerts (attention engine)

Source: `src/data/alerts.ts`. Evaluated in the browser on every relevant state change. Configure in Edit dashboard > **Alerts** (options: [configuration.md](configuration.md#alert-rules-alerts)).

Principle: **unknown or unavailable is never treated as "clear".** A source that cannot be read produces its own warning instead of a silent "all good".

## Severities

| Severity | Colour | Used for |
| --- | --- | --- |
| Critical | red `#FF727D` | Only real detectors listed in `alerts.critical` (leak, smoke). None mapped yet. |
| Warning | amber `#FFBF57` | Temperature limits, exterior doors, unavailable devices, incident report warnings, unreadable sources |
| Info | lavender `#A7A3FF` | Interior doors, mailbox, available updates, incident report with only minor issues |

The Home banner counts critical + warning as "things need attention" and lists info separately. It shows up to 3 chips (most severe first). The Alerts view groups rows by severity and hides empty groups.

## Rules

| Rule | Condition | Severity | Tap goes to |
| --- | --- | --- | --- |
| Temperature limit | value > `above`; stays active until value < `clear_below` | Warning, room badge "Too hot", temperature shown red | Room |
| Temperature sensor unreadable | sensor missing, unavailable, unknown or non numeric | Warning | Room |
| Exterior door | binary_sensor `on` or cover `open`/`opening` | Warning, room badge "<name> open" | Room |
| Interior door | same as above | Info, room badge | Room |
| Data quality | mapped entities (globals, room sensors, cameras, devices) that are `unavailable` or not found; names listed | Warning | Alerts view |
| Incident report | attributes `critical` + `warning` > 0 | Warning | more-info of the sensor |
| Incident report (minor only) | only `minor` > 0 | Info | more-info |
| Incident report unreadable | sensor unavailable or unknown | Warning | more-info |
| Mailbox | contact `on`; or, with `mailbox_ack` set, while the helper is `on` | Info, Acknowledge button turns the helper off | Room |
| Updates | any `update.*` entity `on` | Info | `/config/updates` |
| Critical detector | `on` | Critical | Room |
| Critical detector unreadable | unavailable or unknown | Warning | Room |

Counts in the incident report attributes may be numbers or lists; lists are counted by length.

## Hysteresis

The temperature rule remembers whether it is active for as long as the page is open. After a reload, a value between `clear_below` and `above` starts as not active (the history before the reload is not known).

## Mailbox acknowledge (optional, not created)

To keep the mailbox alert until someone acknowledges it, create an `input_boolean` (e.g. `input_boolean.atlas_mailbox_pending`) and an automation that turns it on when the mailbox contact (e.g. `binary_sensor.mailbox`) turns on. Then set it as `alerts.mailbox_ack`. ATLAS does not create helpers or automations itself.
