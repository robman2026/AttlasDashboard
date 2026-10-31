# Project rules (ATLAS Home Dashboard)

Read `docs/design.md` (brief) and `docs/README.md` (documentation index) before changing code.

## Privacy (public repository)
- Never commit anything that identifies the owner's house: real room names, entity IDs, people, hostnames, locations, screenshots of the real dashboard.
- Examples, tests, harness and screenshots use only the fictional demo house (`src/config/preset-demo.ts`, `dev/mock-hass.js`).
- Real configs live in `*.private.yaml` (git-ignored) or only in Home Assistant. If the owner shares a private handoff or entity map, use it locally and never copy it into the repo.

## Working rules (from the owner)
- Research first: verify HA APIs and card behaviour against current docs or frontend source, and record where in `docs/architecture.md` (API table).
- No assumptions. If something cannot be verified, say so.
- Minimal, precise changes. Ask before anything irreversible in HA (dashboards, areas, floors, entity names, helpers, automations).
- Never use the em dash character in docs or UI text. Use "-".
- The owner works on Windows / PowerShell: keep scripts Node based.

## Documentation is part of every change (same commit or PR)
- `src/` changed: add a line to `CHANGELOG.md` under **Unreleased** (CI enforces this).
- Config option added or changed: update `src/config/types.ts` and `src/config/fields.ts`; `npm run build` regenerates `docs/configuration.md`. Never edit `docs/configuration.md` by hand.
- Alert rules changed: `docs/alerts.md`.
- New files, structure or HA APIs: `docs/architecture.md`.
- UI changed: `npm run screenshots` and commit `docs/screenshots/`.
- Install steps or features changed: `README.md`.
- Tooling changed: `docs/development.md`.
- Always run `npm run build` and commit `dist/` (HACS installs from it).
