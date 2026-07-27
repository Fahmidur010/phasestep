# Enrichment catalogs

Used by `/setup` for stack (Stage 4) and design (Stage 7). Also consulted by `/verify-phase` and `/audit-phase` (build + campaign) for optional browser evidence.

## Stack — `stack-catalog.json`

| Key | Meaning |
|-----|---------|
| `stacks` | **Official** framework sources — each resource/recipe has **`why`** |
| `community` | **Non-official** curated recipes (`appliesTo` + **`why`**) |
| `verification` | **Official** cross-cutting verify/audit tools (e.g. Playwright CLI + MCP). Filter by `appliesTo` + `appliesWhen` (web UI). **Not** for Flutter / React Native native. Owner-gated; never vendored into the phasestep package |

Present Official, Community, and Verification separately. Prefer official stack sources; prefer **playwright-cli** over MCP for routine verify/audit evidence.

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
- If verification was skipped at setup, `/verify-phase` / `/audit-phase` (Mode A or B) may offer a **mid-flight** install (Owner-gated, once per phase; decline recorded in `PROGRESS`) — never silent install
- MCP detect: project `.cursor/mcp.json` (Cursor) and `.mcp.json` (Claude Code). User-global Claude config is outside the repo
