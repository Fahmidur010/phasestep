---
description: Close the project audit campaign with a summary once all audit phases are reported
argument-hint: []
---

Close the **project audit** driven by [`{{AUDIT_PLAN}}`](../../{{AUDIT_PLAN}}) and write `{{AUDIT_REPORTS_DIR}}/AUDIT_SUMMARY.md`.

## Preconditions

1. `{{AUDIT_PLAN}}` is accepted.
2. Every phase in the plan has a report in [`{{AUDIT_REPORTS_DIR}}/`](../../{{AUDIT_REPORTS_DIR}}/). Missing phases → **STOP** and list them (`/audit-phase N` to run).
3. Ask once whether the Owner wants to close with findings still open — closing does **not** require zero findings, only awareness.

## Write `AUDIT_SUMMARY.md`

Preview-friendly, summary first:

1. Title table — date, phases audited, overall status
2. **Snapshot** — totals by severity × status (Open / Approved / Fixed / Deferred / Blocked)
3. **Open Critical/Major** — table with ID, phase, one-line issue (these are the headline)
4. Per-phase one-line results with links to each `audit-phase-N.md`
5. Clean areas — explicitly note what passed
6. Suggested next steps — e.g. "promote C-01, M-03 into `{{BUILD_PLAN}}`" or "`/refine-audit 2`" (suggest, do not do)

## After

1. Update `{{PROGRESS}}` — audit campaign complete + headline counts.
2. **STOP.** Options:

```text
Audit complete → Promote selected findings to build plan | Leave as report | Re-open a phase
```

- **Promote** → with Owner's selected IDs, add matching items to `{{BUILD_PLAN}}` (scoped, referencing finding IDs) — delivery then flows through normal `/plan-phase` → `/build-phase`
- **Leave as report** → done; reports remain the record
- **Re-open** → direct to `/audit-phase N reaudit` or `/refine-audit N`

Never modify application code from this command.
