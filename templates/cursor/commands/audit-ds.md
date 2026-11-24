---
description: Read-only design-system audit for a named build phase (delivery loop)
argument-hint: [phase-slug or "all"]
---

Perform a **read-only** design-system audit for a **named build phase** (or **all** UI if `all`). **Do not modify files.**

**Delivery-only.** For campaign (project-audit) UI surfaces use `/audit-campaign-ds N`.

## Resolve phase id

If `$ARGUMENTS` is `all` → audit every UI surface (no single phase file). Otherwise treat as **PHASE_RAW**: prefer **slug** from [`{{BUILD_PLAN}}`](../../{{BUILD_PLAN}}); soft compat for integer `N` (existing `phase-N.md` or order → slug). Plan file: `phase-<id>.md`. Below, **PHASE** = resolved id when not `all`.

## Scope

| Argument | Scope | Fixes go through |
|----------|-------|------------------|
| **PHASE** (slug) | Build phase plan **Files checklist** paths (+ shared UI they touch) | `/refine-phase PHASE` |
| **all** | Every UI surface | Owner's choice (usually `/refine-phase` per affected build phase) |

## Soft-offer before audit (UI)

If Visual direction is accepted and a critique has not just run this chat, **STOP** once (optional — does not skip DS audit forever):

```text
Before /audit-ds:
1. /critique-ui first — ranked findings, then return to /audit-ds
2. Proceed with /audit-ds now
3. Skip soft-offer
```

## Required reading

- [`{{DESIGN_SYSTEM}}`](../../{{DESIGN_SYSTEM}}) — including **Visual direction**
- Constitution craft floor (§1 Design wing)
- Inventory: [`{{UI_PRIMITIVES_DIR}}/`](../../{{UI_PRIMITIVES_DIR}}/) if it exists
- Phase plan when auditing **PHASE**: [`{{PHASE_PLANS_DIR}}/phase-PHASE.md`](../../{{PHASE_PLANS_DIR}}/)

## Checks

Follow **{{DESIGN_SYSTEM}}** as source of truth. Include UI touched by mid-phase absorbed side-work when those paths are on the Files checklist. Typical checks:

- **Visual direction** — Character / World / Moments / Signature respected (not generic AI default)
- Craft floor bans — kickers, nested cards, emoji-icons, purple-glow / AI beige when direction forbids
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

- C/M → `/refine-phase PHASE` and/or `/polish-ui` then re-run `/audit-ds PHASE`
- Clean → still need `/audit-phase PHASE` + Owner verify history before `/complete-phase`
