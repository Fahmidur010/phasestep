---
name: audit-ds
description: Read-only design-system audit for a named build phase (delivery loop)
argument-hint: [phase-slug or "all"]
---

> **Install check:** If the workspace has no `phasestep.json` (or legacy `phasegate.json`), run **`/setup` first** — it scaffolds the project in-repo (same shape as `npx phasestep init`). If the file exists, the project is **already installed**; continue. Never require a separate terminal init when the Phasestep plugin is active.

Perform a **read-only** design-system audit for a **named build phase** (or **all** UI if `all`). **Do not modify files.**

**Delivery-only.** For campaign (project-audit) UI surfaces use `/audit-campaign-ds N`.

## Resolve phase id

If `$ARGUMENTS` is `all` → audit every UI surface (no single phase file). Otherwise treat as **PHASE_RAW**: prefer **slug** from [`docs/BUILD_PLAN.md`](docs/BUILD_PLAN.md); soft compat for integer `N` (existing `phase-N.md` or order → slug). Plan file: `phase-<id>.md`. Below, **PHASE** = resolved id when not `all`.

## Scope

| Argument | Scope | Fixes go through |
|----------|-------|------------------|
| **PHASE** (slug) | Build phase plan **Files checklist** paths (+ shared UI they touch) | `/refine-phase PHASE` |
| **all** | Every UI surface | Owner's choice (usually `/refine-phase` per affected build phase) |

## Soft-offer before audit (UI)

If Visual direction is accepted and detect/critique has not just run this chat, **STOP** once (optional — does not skip DS audit forever):

```text
Before /audit-ds:
1. /detect-ui first — AS-* anti-slop, then return to /audit-ds
2. /critique-ui first — ranked findings, then return to /audit-ds
3. Proceed with /audit-ds now
4. Skip soft-offer
```

## Required reading

- [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) — including **Visual direction** + **Motion**
- Constitution craft floor (§1 Design wing)
- Recent `/detect-ui` findings if present
- Inventory: [`components/ui/`](components/ui/) if it exists
- Phase plan when auditing **PHASE**: [`docs/phase-plans/phase-PHASE.md`](docs/phase-plans/)

## Checks

Follow **docs/DESIGN_SYSTEM.md** as source of truth. Include UI touched by mid-phase absorbed side-work when those paths are on the Files checklist. Typical checks:

- **Visual direction** — Character / World / Moments / Signature respected (not generic AI default)
- Craft floor / detect — open `AS-*` hits; kickers, nested cards, emoji-icons, purple-glow / AI beige when direction forbids
- **Motion** — if Motion is accepted: purpose-fit only; no decorative chrome loops; reduced-motion honored; no ease-in / layout-thrash / scale(0)-only show-hide when DS forbids
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

Then **STOP — Next actions** (numbered; Owner replies with a number; **run the chosen workflow in this session**). Omit inapplicable options and renumber.

**Findings (C/M open):**

```text
Audit-ds ready.
1. Refine — /refine-phase PHASE
2. Detect — /detect-ui [surface]
3. Polish — /polish-ui [surface]
4. Motion — /motion-ui [surface]
5. Re-run audit-ds — /audit-ds PHASE (after fixes)
6. Done for now
```

**Clean (no C/M):**

```text
Audit-ds clean.
1. Audit phase — /audit-phase PHASE
2. Land work — /pr-step update
3. Done for now
```

Do **not** offer `/complete-phase` until `/audit-phase` is clean and Owner verify history is green. Never leave bare “Next: `/…`” for the Owner to type.
