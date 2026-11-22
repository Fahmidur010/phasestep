---
description: Mark phase complete, update progress and session log
argument-hint: [phase-id]
---

The Owner has **completed the full phase loop** for Build Phase $ARGUMENTS:

- All steps built and Owner-verified
- Design-system audit clean (if run) — no Critical/Major
- Code audit clean — no Critical/Major

## Confirm with Owner

If not explicitly confirmed, **STOP** once:

```text
Phase $ARGUMENTS complete (steps verified, audits clean)?
1. Confirm complete
2. Not yet (what is missing)
```

Do not mark complete without **1. Confirm complete**.

## Update documentation

1. [`{{PHASE_PLANS_DIR}}/phase-$ARGUMENTS.md`](../../{{PHASE_PLANS_DIR}}/phase-$ARGUMENTS.md) — **Status:** `complete`
2. [`{{PROGRESS}}`](../../{{PROGRESS}}) — mark Phase $ARGUMENTS done; add **session log** entry (required; do **not** tell Owner to run `/session-log` for this finale); **overwrite Phase health (resume)**:

```text
Phase: $ARGUMENTS — (title)
Step: —
Status: complete
Verified steps: all (or list)
Open rejects / fails: none
Evidence: (last used, or none)
Next: /plan-phase <next> (and/or /pr-step update; GitFlow may then /pr-step release)
Updated: YYYY-MM-DD
```

3. Update progress doc **Last Updated** if present
4. [`{{DECISIONS}}`](../../{{DECISIONS}}) — move newly locked decisions to Resolved
5. **Project map:** if this phase added/renamed major modules, hubs, or entrypoints → mark [`{{PROJECT_MAP}}`](../../{{PROJECT_MAP}}) Status `stale` **or** run `/map-project refresh` (agent aid; no Owner gate). Skip if the map is empty/unused (tiny greenfield).

### Session log shape

| Date | Module | Summary | Left unfinished |

Or expanded block: built / UAT / audit / decisions / next phase command.

## Phase remainder (required in report)

After Confirm, before finishing, read [`{{BUILD_PLAN}}`](../../{{BUILD_PLAN}}) (this phase + following phases) and the completed [`phase-$ARGUMENTS.md`](../../{{PHASE_PLANS_DIR}}/phase-$ARGUMENTS.md) (scope, out of scope, decision gates, clarify answers).

Produce a short **Phase remainder** block in the chat report **and** paste it into the session log entry (or a `## Phase remainder` section at the end of `phase-$ARGUMENTS.md`). Use `none` for empty rows — do not invent work.

```markdown
## Phase remainder — Phase $ARGUMENTS
| Kind | Item | Notes |
|------|------|-------|
| Still open | … or `none` | In-phase items not done (Owner deferred mid-phase, partial, blocked) |
| Deferred | … or `none` | Explicitly parked (decisions `deferred` / `tbd`, Owner defer) |
| Out of scope | … or `none` | Called out in the phase plan / BUILD_PLAN as not this phase |
| Carry into next | … or `none` | Concrete seeds for the next BUILD_PLAN phase (not a full plan) |
```

**Next-phase seeds** (optional bullets under the table when **Carry into next** is not `none`):
- 1–5 short bullets the Owner can paste into `/plan-phase` for the **next** phase
- Do **not** write `phase-(N+1).md` here
- Do **not** auto-start the next phase

If everything for this phase closed cleanly and nothing carries forward, say so explicitly (all `none` is fine).

## Do not

- Auto-start the next phase unless Owner asks
- Commit/push/merge here — use `/pr-step update` (GitFlow also release/main) instead
- Turn remainder into silent BUILD_PLAN edits — Owner must Accept any plan changes

## Report

- Phase $ARGUMENTS: **complete**
- Show the **Phase remainder** table (and next-phase seeds if any)
- Suggest next: optional `/pr-step update` (and GitFlow `/pr-step release` when promoting) and/or `/plan-phase` for the next phase in `{{BUILD_PLAN}}` (mention seeds if present)
- If `{{PROGRESS}}` has no `GitHub: connected` line and Owner wants PRs → soft remind `/github-connect` first (do not block complete). Connect also chooses Simple vs GitFlow.
