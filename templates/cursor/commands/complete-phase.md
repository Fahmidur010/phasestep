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
2. [`{{PROGRESS}}`](../../{{PROGRESS}}) — mark Phase $ARGUMENTS done; add **session log** entry (required; do **not** tell Owner to run `/session-log` for this finale)
3. Update progress doc **Last Updated** if present
4. [`{{DECISIONS}}`](../../{{DECISIONS}}) — move newly locked decisions to Resolved

### Session log shape

| Date | Module | Summary | Left unfinished |

Or expanded block: built / UAT / audit / decisions / next phase command.

## Do not

- Auto-start the next phase unless Owner asks
- Commit unless asked

## Report

- Phase $ARGUMENTS: **complete**
- Suggest next: `/plan-phase` for the next phase in `{{BUILD_PLAN}}`
