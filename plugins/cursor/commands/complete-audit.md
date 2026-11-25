---
name: complete-audit
description: Close the project audit campaign with a summary once all audit phases are reported
argument-hint: []
---

> **Install check:** If the workspace has no `phasestep.json` (or legacy `phasegate.json`), run **`/setup` first** — it scaffolds the project in-repo (same shape as `npx phasestep init`). If the file exists, the project is **already installed**; continue. Never require a separate terminal init when the Phasestep plugin is active.

Close the **project audit** driven by [`docs/AUDIT_PLAN.md`](docs/AUDIT_PLAN.md) and write `docs/audit-reports/AUDIT_SUMMARY.md`.

## Preconditions

1. `docs/AUDIT_PLAN.md` is accepted.
2. Every phase in the plan has a report in [`docs/audit-reports/`](docs/audit-reports/). Missing phases → **STOP** and list them (`/audit-campaign N` to run).
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
6. Suggested next steps — e.g. "promote C-01, M-03 into `docs/BUILD_PLAN.md`" or "`/refine-audit 2`" (suggest, do not do)

## After

1. Update `docs/PROGRESS.md` — audit campaign complete + headline counts.
2. **STOP — Next actions** (numbered; **run on pick**):

```text
Audit complete:
1. Promote selected findings to build plan
2. Leave as report
3. Re-audit a phase — /audit-campaign N reaudit
4. Refine a phase — /refine-audit N
5. Plan delivery — /plan-phase <slug> (after promote, or for next build work)
```

- **1. Promote** → with Owner's selected IDs, add matching items to `docs/BUILD_PLAN.md` (scoped, referencing finding IDs); then offer numbered `/plan-phase` / `/build-phase` as needed
- **2. Leave as report** → done; reports remain the record
- **3 / 4 / 5** → **run the chosen workflow in this session** on pick (ask once for `N` / slug if missing)

Never modify application code from this command. Never leave bare “run `/…`” without numbers.
