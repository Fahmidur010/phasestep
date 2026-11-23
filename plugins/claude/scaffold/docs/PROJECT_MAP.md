# Project map

**Agent navigation aid** — not product truth. Prefer this over blind repo grep for mid-project setup, architecture orientation, and audit slicing. If this map conflicts with `docs/product.md`, `docs/USER_FLOW.md`, or `docs/architecture.md`, those Owner-accepted docs win.

Filled / refreshed by `/map-project`. No Owner gate required to create or use.

**Status:** empty | current | stale  
**Last mapped:** —  
**Confidence:** high | mixed | low  

## When Status is stale

Mark **stale** (or run `/map-project refresh`) when any of these is true:

- Delivery phases added/renamed major modules, hubs, or entrypoints since **Last mapped**
- `/audit-project` or architecture work finds the map wrong or incomplete
- Agent would otherwise need a wide repo search again to orient

Agents may mark stale and refresh **without** an Owner gate.

## How to read labels

| Label | Meaning |
|-------|---------|
| **extracted** | Observed in the repo (paths, imports, entrypoints, package manifests) |
| **heuristic** | Inferred by the agent — verify before treating as hard fact |

## Entrypoints

| Path / command | Role | Label |
|----------------|------|-------|
| … | … | extracted \| heuristic |

## Modules / communities

Cluster by feature or architecture seam (not random top-level folders alone).

### [Module name]

- **Paths:** …
- **Responsibility:** …
- **Depends on:** …
- **Label:** extracted | heuristic

## Core hubs

Highest-connectivity or cross-cutting surfaces (auth, data layer, shared UI, API gateway, etc.).

| Hub | Why it matters | Touches | Label |
|-----|----------------|---------|-------|
| … | … | … | extracted \| heuristic |

## Seams (audit / phase candidates)

Suggested boundaries for `/audit-project` phases or remaining `/BUILD_PLAN` slices.

1. … — (extracted | heuristic)
2. …

## Out of scope / ignore

Generated folders, vendored code, archives (e.g. `.phasestep/archived-workflow/`), noise paths.

## Open questions

Gaps the agent could not resolve from the repo alone.
