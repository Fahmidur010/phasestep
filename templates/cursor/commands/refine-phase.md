---
description: Fix issues from audit or verification (phase or step)
argument-hint: [phase] [step?]
---

Fix issues for **Build Phase** from **intent rejection**, **verification**, **audit**, and/or **design-system audit**.

**Not for project-audit findings.** If the issues come from an `/audit-project` campaign report (`{{AUDIT_REPORTS_DIR}}/audit-phase-N.md`), stop and use `/refine-audit N` instead — it enforces the Owner-approval gate. If it is unclear which the Owner means, ask once.

## Parse arguments

`$ARGUMENTS` is `PHASE` optionally followed by `STEP`.

- With **STEP**: scope to that step
- Without: use Owner’s full-phase issue list

## Before coding

1. Read Owner’s issue list (delta rejection / verify failures / audit reports / chat notes)
2. Read [`{{PHASE_PLANS_DIR}}/phase-PHASE.md`](../../{{PHASE_PLANS_DIR}}/) — stay in scope; read Behavior delta if present
3. Read [`{{BUILD_PLAN}}`](../../{{BUILD_PLAN}}) Phase PHASE — do not start next phase
4. Product decision gaps → [`{{DECISIONS}}`](../../{{DECISIONS}}) and ask Owner
5. **Cross-cutting / principle change?** → run **Cross-cutting STOP** below **before any code**. Do not “just implement” a new core rule across the tree.

## Cross-cutting STOP (principle or multi-feature change)

Use when the Owner’s ask (or the fix) would:

- Change a **core principle** of how a feature works (not a local bug/typo/style fix), **or**
- Affect **other features / phases / steps** beyond the current refine scope, **or**
- Contradict accepted [`{{PRODUCT_SPEC}}`](../../{{PRODUCT_SPEC}}) / [`{{USER_FLOW}}`](../../{{USER_FLOW}}) without an explicit doc update

If unsure whether it qualifies → treat as cross-cutting once (ask via the gate).

**Do not write application code yet.** Show a short impact note:

```markdown
**Cross-cutting change** (Owner gate):
- **Principle / rule changing:** …
- **Was:** …
- **Would become:** …
- **Also affects:** (features / phases / steps — or `none beyond this step`)
- **Docs to sync:** product | user flow | architecture | decisions | build plan | phase plans
```

Then **STOP**:

```text
Cross-cutting change:
1. Record decision + sync product/flow (and architecture impact gate if needed) → then re-scope phases/steps → then refine
2. Scoped only to this step/phase — Owner accepts limited blast radius; other surfaces stay old behavior until planned
3. Defer — log in decisions as tbd/deferred; do not code the new principle yet
4. Not cross-cutting — continue as a normal local refine
```

- **1** → update [`{{DECISIONS}}`](../../{{DECISIONS}}) (Resolved); sync `{{PRODUCT_SPEC}}` / `{{USER_FLOW}}` same turn if behavior changed; use architecture impact gate if structure must change; reopen or adjust phase plans / `{{BUILD_PLAN}}` as needed; mark [`{{PROJECT_MAP}}`](../../{{PROJECT_MAP}}) stale if modules/hubs shift; **then** refine **one step at a time** with fresh WHEN/THEN deltas.
- **2** → document the limited scope in the Behavior delta **UNCHANGED** / risks; do not silently “fix” sibling features.
- **3** → Open row in decisions; stop coding the new principle.
- **4** → proceed under **Rules** below (local refine only).

Never silently rewrite product truth while refining. Never cascade fixes across features without **1** or an explicit **2**.

## Rules

- Minimal fixes only (unless Owner chose Cross-cutting option **1** and scoped the work)
- Do not implement the next unbuilt step
- Run `{{BUILD_COMMAND}}` after fixes
- Do not commit unless asked
- After a principle change: each touched step needs an updated Behavior delta (WHEN/THEN) + intent gate before verify

## Behavior delta update

If behavior changed (including after intent rejection or Cross-cutting option **1**/**2**): update the step’s Behavior delta (including **WHEN/THEN** scenarios under each changed `SHALL`); set **Intent status:** `pending_owner_review`; show revised delta in chat.

If purely structural/style with no behavior change: say **Behavior unchanged**.

## After fixes

1. List issue → fix (only after Cross-cutting STOP if it applied)
2. If delta updated: **STOP** — same numbered intent gate as `/build-phase`:

```text
Behavior delta ready:
1. Accept → /verify-phase PHASE STEP
2. Reject → continue refine, then re-review delta
```

3. Next:
   - After intent **1. Accept** → `/verify-phase PHASE STEP`
   - Verify failures → re `/verify-phase PHASE STEP`
   - audit-ds → re `/audit-ds PHASE`
   - audit → re `/audit-phase PHASE`
4. Step re-verify pass → `/build-phase PHASE <next>` if more steps
5. All steps verified + audits clean → `/complete-phase PHASE`

Do **not** add a separate session log for routine refine — `/complete-phase` handles the phase-complete entry (Owner may `/session-log` for mid-phase notes).
