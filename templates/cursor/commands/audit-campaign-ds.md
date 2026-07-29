---
description: Read-only design-system audit for a campaign audit phase
argument-hint: [audit-phase-id]
---

Perform a **read-only** design-system audit for **Campaign Audit Phase $ARGUMENTS**. **Do not modify files.**

**Campaign-only.** For delivery build-phase DS checks use `/audit-ds N`.

## Scope

That audit phase's **In scope** UI from [`{{AUDIT_PLAN}}`](../../{{AUDIT_PLAN}}).

Fold findings into the phase report at [`{{AUDIT_REPORTS_DIR}}/audit-phase-$ARGUMENTS.md`](../../{{AUDIT_REPORTS_DIR}}/) using the same stable IDs and severity rubric — **do not** write a separate DS report file.

## Required reading

- [`{{DESIGN_SYSTEM}}`](../../{{DESIGN_SYSTEM}})
- Inventory: [`{{UI_PRIMITIVES_DIR}}/`](../../{{UI_PRIMITIVES_DIR}}/) if it exists
- [`{{AUDIT_PLAN}}`](../../{{AUDIT_PLAN}}) phase In scope
- Existing report if present: [`{{AUDIT_REPORTS_DIR}}/audit-phase-$ARGUMENTS.md`](../../{{AUDIT_REPORTS_DIR}}/)

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

Add/update findings in the campaign phase report (stable IDs). End with counts in that report's snapshot.

- Fixes only after Owner approval via `/refine-audit N`
- Then `/audit-campaign N reaudit` (and re-run `/audit-campaign-ds N` if DS items were in scope)
