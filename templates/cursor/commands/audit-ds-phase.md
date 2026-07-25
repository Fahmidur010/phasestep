---
description: Read-only design system audit (after all phase steps verified)
argument-hint: [phase-id or "all"]
---

Perform a **read-only** design-system audit for **Phase $ARGUMENTS** (or **all** UI if `all`). **Do not modify files.**

**When (phase-scoped):** after all steps Owner-verified.

## Required reading

- [`{{DESIGN_SYSTEM}}`](../../{{DESIGN_SYSTEM}})
- Inventory: [`{{UI_PRIMITIVES_DIR}}/`](../../{{UI_PRIMITIVES_DIR}}/) if it exists

Phase-scoped: limit to phase plan **Files checklist** paths (+ shared UI they touch).

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

End with counts; C/M → `/refine-phase` then re-run this audit; clean → still need `/audit-phase` + Owner verify history.
