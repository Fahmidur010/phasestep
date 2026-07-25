---
description: Fix issues from audit or verification (phase or step)
argument-hint: [phase] [step?]
---

Fix issues for **Build Phase** from **intent rejection**, **verification**, **audit**, and/or **design-system audit**.

## Parse arguments

`$ARGUMENTS` is `PHASE` optionally followed by `STEP`.

- With **STEP**: scope to that step
- Without: use Owner’s full-phase issue list

## Before coding

1. Read Owner’s issue list (delta rejection / verify failures / audit reports)
2. Read [`{{PHASE_PLANS_DIR}}/phase-PHASE.md`](../../{{PHASE_PLANS_DIR}}/) — stay in scope; read Behavior delta if present
3. Read [`{{BUILD_PLAN}}`](../../{{BUILD_PLAN}}) Phase PHASE — do not start next phase
4. Product decision gaps → [`{{DECISIONS}}`](../../{{DECISIONS}}) and ask Owner

## Rules

- Minimal fixes only
- Do not implement the next unbuilt step
- Run `{{BUILD_COMMAND}}` after fixes
- Do not commit unless asked

## Behavior delta update

If behavior changed (including after intent rejection): update the step’s Behavior delta; set **Intent status:** `pending_owner_review`; show revised delta in chat.

If purely structural/style with no behavior change: say **Behavior unchanged**.

## After fixes

1. List issue → fix
2. If delta updated: Owner accept/reject intent again
3. Next:
   - Intent rejection → accept → `/verify-phase PHASE STEP`
   - Verify failures → re `/verify-phase PHASE STEP`
   - audit-ds → re `/audit-ds-phase PHASE`
   - audit → re `/audit-phase PHASE`
4. Step re-verify pass → `/build-phase PHASE <next>` if more steps
5. All steps verified + audits clean → `/complete-phase PHASE`

Do **not** add a separate session log for routine refine — `/complete-phase` handles the phase-complete entry (Owner may `/session-log` for mid-phase notes).
