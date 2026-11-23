# Verification map

**How to prove product behavior** — durable prove-paths for agents and Owners. **Context only:** never overrides Behavior delta, Trace, Owner verify gates, or accepted product/flow.

Filled lightly at `/setup` (seed) and grown when `/verify-phase` or `/audit-phase` establishes a new prove path. Prefer updating this map over rediscovering how to prove the same surface every step.

**Status:** empty | seeded | current  
**Last updated:** —  

## How to use

| Column | Meaning |
|--------|---------|
| **Feature / surface** | Named capability or UI/API area (e.g. auth login, checkout API) |
| **Prove how** | Concrete Owner path and/or agent command (matching surface) |
| **Command / tool** | e.g. `buildCommand`, Playwright CLI, `flutter analyze`, curl smoke |
| **Source** | `setup` \| `verify` \| `audit` — who last wrote the row |
| **Notes** | Environment, accounts, caveats |

## Prove paths

| Feature / surface | Prove how | Command / tool | Source | Notes |
|-------------------|-----------|----------------|--------|-------|
| *(seed at setup — build check)* | Run project build/quality check after implement | `npm run build` | setup | Replace when Owner confirms |
| … | … | … | setup \| verify \| audit | … |

## Rules

1. Matching **surface** only (web → browser evidence; Flutter/RN → native; API/CLI → backend tools) — same as `/verify-phase` Evidence bar.
2. Rows are **hints**, not a test factory. Owner UAT remains the gate.
3. **Append** when a new durable prove path appears; do not delete Owner-edited rows without asking.
4. If this map conflicts with the current step’s Behavior delta / Trace → **delta + Owner win**.
5. Keep rows short; one prove path per feature/surface when possible.
