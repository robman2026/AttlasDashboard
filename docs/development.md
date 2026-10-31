# Development

Requirements: Node.js 22.18 or newer (the docs generator imports TypeScript directly), npm.

## Commands

| Command | What it does |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run build` | Icons, docs (`docs/configuration.md`), typecheck, bundle to `dist/` |
| `npm run docs` | Regenerate `docs/configuration.md` only |
| `npm run typecheck` | TypeScript check |
| `npm run harness` | Local preview of `dist/` with the demo house: `/dev/harness.html?view=home` (also `alerts`, `rooms`, `floor-first`, `room-office`, ...) |
| `npm run screenshots` | Regenerate `docs/screenshots/*.jpg` (needs Playwright + Chromium) |

`dist/` is committed on purpose: HACS installs from it. CI fails if `dist/`, generated icons or `docs/configuration.md` are out of date.

## Adding or changing a config option

1. Add the field to `src/config/types.ts` (type) and `src/config/fields.ts` (label, help, selector, default).
2. Use it in the code.
3. If the demo house should show it, add it to `src/config/preset-demo.ts` (and a mock state in `dev/mock-hass.js`). The docs generator fails if the preset uses an option that is not in `fields.ts`.
4. `npm run build`. The editor and `docs/configuration.md` pick up the change automatically.

## Documentation policy

Documentation is part of every change, in the same commit or PR:

| You changed | Update |
| --- | --- |
| Anything in `src/` | `CHANGELOG.md` under **Unreleased** (CI enforces this on PRs) |
| Config options | `src/config/fields.ts` (docs regenerate on build) |
| Alert rules | `docs/alerts.md` |
| Structure, new files, HA APIs | `docs/architecture.md` (source map, API table with where it was verified) |
| UI | `npm run screenshots`, commit the images |
| Install, features | `README.md` |
| Tooling | `docs/development.md` |

## Privacy

The repository is public. Never commit real room names, entity IDs, people, hostnames or locations. Use the demo house for examples, tests and screenshots. Real configs go in `*.private.yaml` (git-ignored).

## Release

1. Move the **Unreleased** entries in `CHANGELOG.md` under a new version heading.
2. Set `version` in `package.json` (the bundle reads it at build time).
3. `npm run build`, commit, merge to `main`.
4. Push a tag `vX.Y.Z` on `main`. The release workflow checks that the tag matches `package.json` and publishes the GitHub Release that HACS reads.

## Working on Windows

All scripts are Node based, so they run the same in PowerShell. No bash tools are needed.
