---
description: Mark a named build phase complete, update progress and session log
argument-hint: [phase-slug]
---

## Resolve phase id

`$ARGUMENTS` is **PHASE_RAW**. Prefer a **slug** from [`{{BUILD_PLAN}}`](../../{{BUILD_PLAN}}). Soft compat: integer `N` → existing `phase-N.md` or BUILD_PLAN order → slug. Resolve **title**. Plan file: `phase-<id>.md`. Below, **PHASE** = resolved id. Show **PHASE — Title** everywhere.

The Owner has **completed the full phase loop** for **PHASE — Title**:

- All steps built and Owner-verified (progressive phases: every recorded step verified; plan should now hold the full step list from builds)
- Design-system audit clean (if run) — no Critical/Major
- Code audit clean — no Critical/Major

If Mode was `progressive`, set **Status:** `complete` and you may set **Mode:** `classic` (or leave `progressive` + complete) once the plan fully reflects what was built.

## Confirm with Owner

If not explicitly confirmed, **STOP** once:

```text
Phase PHASE — Title complete (steps verified, audits clean)?
1. Confirm complete
2. Not yet (what is missing)
```

Do not mark complete without **1. Confirm complete**.

## Update documentation

1. [`{{PHASE_PLANS_DIR}}/phase-PHASE.md`](../../{{PHASE_PLANS_DIR}}/phase-PHASE.md) — **Status:** `complete`
2. [`{{PROGRESS}}`](../../{{PROGRESS}}) — mark **PHASE — Title** done; add **session log** entry (required; do **not** tell Owner to run `/session-log` for this finale); **overwrite Phase health (resume)**:

```text
Phase: PHASE — Title
Step: —
Status: complete
Verified steps: all (or list)
Open rejects / fails: none
Evidence: (last used, or none)
Next: /plan-phase <next-slug> (and/or /pr-step update; GitFlow may then /pr-step release)
Updated: YYYY-MM-DD
```

3. Update progress doc **Last Updated** if present
4. [`{{DECISIONS}}`](../../{{DECISIONS}}) — move newly locked decisions to Resolved
5. **Project map:** if this phase added/renamed major modules, hubs, or entrypoints → mark [`{{PROJECT_MAP}}`](../../{{PROJECT_MAP}}) Status `stale` **or** run `/map-project refresh` (agent aid; no Owner gate). Skip if the map is empty/unused (tiny greenfield).

### Session log shape

| Date | Module | Summary | Left unfinished |

Or expanded block: built / UAT / audit / decisions / next phase command. Prefer Module = phase **title** or slug.

## Phase remainder (required in report)

After Confirm, before finishing, read [`{{BUILD_PLAN}}`](../../{{BUILD_PLAN}}) (this phase + following phases) and the completed [`phase-PHASE.md`](../../{{PHASE_PLANS_DIR}}/phase-PHASE.md) (scope, out of scope, decision gates, clarify answers).

Produce a short **Phase remainder** block in the chat report **and** paste it into the session log entry (or a `## Phase remainder` section at the end of `phase-PHASE.md`). Use `none` for empty rows — do not invent work.

```markdown
## Phase remainder — PHASE — Title
| Kind | Item | Notes |
|------|------|-------|
| Still open | … or `none` | In-phase items not done (Owner deferred mid-phase, partial, blocked) |
| Deferred | … or `none` | Explicitly parked (decisions `deferred` / `tbd`, Owner defer, **Side-work size STOP** option 2 park seeds) |
| Out of scope | … or `none` | Called out in the phase plan / BUILD_PLAN as not this phase |
| Carry into next | … or `none` | Concrete seeds for the next BUILD_PLAN phase (incl. parked mid-phase side-work meant for another phase) |
```

**Next-phase seeds** (optional bullets under the table when **Carry into next** is not `none`):
- 1–5 short bullets the Owner can paste into `/plan-phase <next-slug>` for the **next** phase
- Include any **parked mid-phase side-work** seeds so they are not dropped at complete
- Do **not** write the next `phase-<slug>.md` here
- Do **not** auto-start the next phase

If everything for this phase closed cleanly and nothing carries forward, say so explicitly (all `none` is fine).

## Do not

- Auto-start the next phase unless Owner asks
- Commit/push/merge here — use `/pr-step update` (GitFlow also release/main) instead
- Turn remainder into silent BUILD_PLAN edits — Owner must Accept any plan changes

## Report

- **PHASE — Title:** **complete**
- Show the **Phase remainder** table (and next-phase seeds if any)
- Suggest next: optional `/pr-step update` (and GitFlow `/pr-step release` when promoting) and/or `/plan-phase <next-slug>` in `{{BUILD_PLAN}}` (mention seeds if present)
- If `{{PROGRESS}}` has no `GitHub: connected` line and Owner wants PRs → soft remind `/github-connect` first (do not block complete). Connect also chooses Simple vs GitFlow.
