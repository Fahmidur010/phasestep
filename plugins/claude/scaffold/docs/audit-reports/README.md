# Audit reports

One report per audit phase, written by `/audit-campaign N` when running against [`docs/AUDIT_PLAN.md`](../../docs/AUDIT_PLAN.md).

```text
audit-phase-1.md
audit-phase-2.md
…
AUDIT_SUMMARY.md   ← written by /complete-audit when all phases are done
```

## Report contract

- **Read-only evidence** — audits never change application code
- Findings have stable IDs (`C-01`, `M-02`, `Mi-03`) so refine/re-audit updates the same entry
- Every finding cites its **ground** (spec / universal dimension / stack rule or tool output)
- Statuses: `Open` → `Approved for refinement` → `Fixed` / `Partially fixed` / `Blocked` · or `Deferred`
- Fixes happen only via `/refine-audit N` on Owner-approved findings, then `/audit-campaign N reaudit` verifies

## Reading order

1. Title table (status, date, next step)
2. Snapshot (counts by severity)
3. Critical → Major → Minor findings
4. Out of scope / not checked
5. Owner decision record
