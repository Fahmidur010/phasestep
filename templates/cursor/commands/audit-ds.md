---
description: Read-only design-system audit for a build phase (delivery loop)
argument-hint: [phase-id or "all"]
---

Perform a **read-only** design-system audit for **Build Phase $ARGUMENTS** (or **all** UI if `all`). **Do not modify files.**

**Delivery-only.** For campaign (project-audit) UI surfaces use `/audit-campaign-ds N`.

## Scope

| Argument | Scope | Fixes go through |
|----------|-------|------------------|
| **N** | Build phase plan **Files checklist** paths (+ shared UI they touch) | `/refine-phase N` |
| **all** | Every UI surface | Owner's choice (usually `/refine-phase` per affected build phase) |

## Required reading

- [`{{DESIGN_SYSTEM}}`](../../{{DESIGN_SYSTEM}})
- Inventory: [`{{UI_PRIMITIVES_DIR}}/`](../../{{UI_PRIMITIVES_DIR}}/) if it exists
- Phase plan when auditing **N**: [`{{PHASE_PLANS_DIR}}/phase-N.md`](../../{{PHASE_PLANS_DIR}}/)

## Checks

Follow **{{DESIGN_SYSTEM}}** as source of truth. Typical checks:

- Interactive controls use approved primitives — not one-off duplicates
- Tokens / semantic colors — avoid arbitrary hard-coded colors where DS forbids them
- Typography / spacing / radius per DS
- No unauthorized new primitives without Owner approval

## Severity

- **Critical (C):** Wrong control for a primary workflow
- **Major (M):** Clear DS violations on visible UI
- **Minor (Mi):** Spacing/radius drift, redundant wrappers

## Report

severity — `file:line` — issue — suggested fix (name DS rule or primitive)

End with counts.

- C/M → `/refine-phase N` then re-run `/audit-ds N`
- Clean → still need `/audit-phase N` + Owner verify history before `/complete-phase`
