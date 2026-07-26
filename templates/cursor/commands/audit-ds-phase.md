---
description: Read-only design system audit (after all phase steps verified)
argument-hint: [phase-id or "all"]
---

Perform a **read-only** design-system audit for **Phase $ARGUMENTS** (or **all** UI if `all`). **Do not modify files.**

## Mode

| Mode | When | Scope | Fixes go through |
|------|------|-------|------------------|
| **Build** | Delivery loop — after all steps of build phase N are Owner-verified | Phase plan **Files checklist** paths (+ shared UI they touch) | `/refine-phase N` |
| **Campaign** | Called from `/audit-phase N` in project-audit mode | That audit phase's **In scope** UI from [`{{AUDIT_PLAN}}`](../../{{AUDIT_PLAN}}) | `/refine-audit N` |
| **all** | Owner asks for a full UI sweep | Every UI surface | Owner's choice |

In **Campaign** mode, fold findings into the phase report at `{{AUDIT_REPORTS_DIR}}/audit-phase-N.md` using the same stable IDs and severity rubric — do not write a separate report file.

## Required reading

- [`{{DESIGN_SYSTEM}}`](../../{{DESIGN_SYSTEM}})
- Inventory: [`{{UI_PRIMITIVES_DIR}}/`](../../{{UI_PRIMITIVES_DIR}}/) if it exists

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

- **Build mode:** C/M → `/refine-phase N` then re-run this audit; clean → still need `/audit-phase N` + Owner verify history
- **Campaign mode:** findings join the audit phase report; fixes only after Owner approval via `/refine-audit N`, then `/audit-phase N reaudit`
