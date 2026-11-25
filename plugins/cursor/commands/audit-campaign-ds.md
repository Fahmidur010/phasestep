---
name: audit-campaign-ds
description: Read-only design-system audit for a campaign audit phase
argument-hint: [audit-phase-id]
---

> **Install check:** If the workspace has no `phasestep.json` (or legacy `phasegate.json`), run **`/setup` first** — it scaffolds the project in-repo (same shape as `npx phasestep init`). If the file exists, the project is **already installed**; continue. Never require a separate terminal init when the Phasestep plugin is active.

Perform a **read-only** design-system audit for **Campaign Audit Phase $ARGUMENTS**. **Do not modify files.**

**Campaign-only.** For delivery build-phase DS checks use `/audit-ds <slug>`.

## Scope

That audit phase's **In scope** UI from [`docs/AUDIT_PLAN.md`](docs/AUDIT_PLAN.md).

Fold findings into the phase report at [`docs/audit-reports/audit-phase-$ARGUMENTS.md`](docs/audit-reports/) using the same stable IDs and severity rubric — **do not** write a separate DS report file.

## Required reading

- [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md)
- Inventory: [`components/ui/`](components/ui/) if it exists
- [`docs/AUDIT_PLAN.md`](docs/AUDIT_PLAN.md) phase In scope
- Existing report if present: [`docs/audit-reports/audit-phase-$ARGUMENTS.md`](docs/audit-reports/)

## Checks

Follow **docs/DESIGN_SYSTEM.md** as source of truth. Typical checks:

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

Then **STOP — Next actions** (numbered; run on pick). Omit inapplicable options and renumber:

```text
Campaign DS checks recorded.
1. Continue campaign gate — return to /audit-campaign N Owner options (if that STOP is still open)
2. Refine approved — /refine-audit N (only after Owner approved findings)
3. Re-audit — /audit-campaign N reaudit
4. Re-check DS — /audit-campaign-ds N (after DS fixes)
5. Done for now
```

Never leave bare “Then `/refine-audit` / `/audit-campaign … reaudit`” for the Owner to type.
