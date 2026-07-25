# Enrichment catalogs

Used by `/setup` for stack (Stage 4) and design (Stage 7).

## Stack — `stack-catalog.json`

| Key | Meaning |
|-----|---------|
| `stacks` | **Official** framework sources — each resource/recipe has **`why`** |
| `community` | **Non-official** curated recipes (`appliesTo` + **`why`**) |

Present Official and Community separately. Prefer official.

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
