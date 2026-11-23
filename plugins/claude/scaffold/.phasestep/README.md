# Enrichment catalogs

Used by `/setup` for stack (Stage 4) and design (Stage 7). Also consulted by `/verify-phase`, `/audit-phase`, and `/audit-campaign` for evidence by surface (web / native / backend).

## Stack — `stack-catalog.json`

| Key | Meaning |
|-----|---------|
| `stacks` | **Official** framework sources — each resource/recipe has **`why`** |
| `community` | **Non-official** curated recipes (`appliesTo` + **`why`**) |
| `verification` | **Official** evidence by surface: Playwright (web UI); Flutter/RN analyzer + Owner/device UAT; backend build/test/lint. Filter by `appliesTo` + `appliesWhen`. Owner-gated; never vendored into the phasestep package |

Present Official, Community, and Verification separately. Prefer official stack sources. For web UI prefer **playwright-cli** over MCP. Never propose Playwright for Flutter / React Native native.

Community items may declare **`recommendedWith`**: verification ids (e.g. `playwright-cli`) they should be offered with. On Accept of that verification tool, propose those companions by default (Owner can decline). Skills still install **into the consumer project** via recipe — Phasestep never vendors skill bodies.

## Design — `design-catalog.json`

| Key | Meaning |
|-----|---------|
| `componentLibraries` | **Pick exactly one** (or none). Never mix. |
| `guidelines` | **Cite any** (additive). |

Each library/guideline lists agent `resources` (`mcp` / `skills` / `llms` / `cli` / `docs`) with **`why`** and optional install recipes. Filter by `appliesTo` (e.g. `react`, `flutter`, `tailwind`). Flag `license`: `free` | `commercial` | `preview-access`.

## Shared rules

- Pointers + recipes only — do not vendor rule/skill bodies into this package
- Owner-gated installs; verify URLs when web is available
- Never invent content; failure → propose links or ask Owner for URL/path
- Playwright (and similar tools) install **into the consumer project** on Accept — they are not dependencies of `phasestep` itself
- If verification was skipped at setup, `/verify-phase` / `/audit-phase` / `/audit-campaign` may offer a **mid-flight** install for web UI (Owner-gated, once per phase; decline recorded in `PROGRESS`) — never silent install
- MCP detect: project `.cursor/mcp.json` (Cursor) and `.mcp.json` (Claude Code). User-global Claude config is outside the repo
