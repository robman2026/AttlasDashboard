# ATLAS Home documentation

| Document | What it covers | Kept current by |
| --- | --- | --- |
| [../README.md](../README.md) | Overview, features, install, quick start | Updated with every user-visible change |
| [configuration.md](configuration.md) | Every config option, defaults, the demo house config | **Generated** from `src/config/fields.ts` by `npm run docs` (part of `npm run build`); CI fails if stale |
| [alerts.md](alerts.md) | Attention engine: each rule, severities, edge cases | Updated when `src/data/alerts.ts` changes |
| [architecture.md](architecture.md) | Strategy, views and URLs, source map, design tokens, HA APIs used and where they were verified | Updated when structure or HA APIs change |
| [development.md](development.md) | Build, harness, screenshots, release, documentation policy | Updated when tooling changes |
| [../CHANGELOG.md](../CHANGELOG.md) | What changed in each version | Required for every change to `src/` (CI check on PRs) |
| [screenshots/](screenshots/) | Current UI with mocked states | `npm run screenshots` after UI changes |
| [design.md](design.md) | Design brief (anonymised) and milestones | Updated when a milestone is reached or the design changes |

Privacy: nothing in this repository may identify a real house (room names, entity IDs, people, hostnames, locations). Examples and screenshots use the fictional demo house in `src/config/preset-demo.ts`.
