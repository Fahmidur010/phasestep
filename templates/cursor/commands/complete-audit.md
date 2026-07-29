---
description: Close the project audit campaign with a summary once all audit phases are reported
argument-hint: []
---

Close the **project audit** driven by [`{{AUDIT_PLAN}}`](../../{{AUDIT_PLAN}}) and write `{{AUDIT_REPORTS_DIR}}/AUDIT_SUMMARY.md`.

## Preconditions

1. `{{AUDIT_PLAN}}` is accepted.
2. Every phase in the plan has a report in [`{{AUDIT_REPORTS_DIR}}/`](../../{{AUDIT_REPORTS_DIR}}/). Missing phases → **STOP** and list them (`/audit-campaign N` to run).
3. Ask once whether the Owner wants to close with findings still open — closing does **not** require zero findings, only awareness:

```text
Close audit with open findings still present?
1. Yes — close anyway (awareness recorded)
2. No — keep campaign open (refine / reaudit first)
```

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
Audit complete:
1. Promote selected findings to build plan
2. Leave as report
3. Re-open a phase
```

- **1. Promote** → with Owner's selected IDs, add matching items to `{{BUILD_PLAN}}` (scoped, referencing finding IDs) — delivery then flows through normal `/plan-phase` → `/build-phase`
- **2. Leave as report** → done; reports remain the record
- **3. Re-open** → direct to `/audit-campaign N reaudit` or `/refine-audit N`

Never modify application code from this command.
