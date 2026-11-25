---
description: Fix Owner-approved findings from an audit-phase report (never unapproved ones)
argument-hint: [audit-phase-id]
---

Fix findings for **Audit Phase $ARGUMENTS** that the Owner marked **Approved for refinement** in [`{{AUDIT_REPORTS_DIR}}/audit-phase-$ARGUMENTS.md`](../../{{AUDIT_REPORTS_DIR}}/).

## Preconditions

1. The report exists and has at least one finding with status `Approved for refinement`.
2. If none are approved → **STOP**: tell the Owner to approve findings first (option 1 or 2 on the report), or acknowledge the report. Never fix `Open` / `Deferred` findings.

## Before coding — STOP gate

1. Read the report; list the approved finding IDs.
2. For each: propose the fix approach in one or two lines, and note any **behavior impact** (if a fix changes product behavior, flag it — it may need a Behavior delta and product sync, not a silent change).
3. If the approved fixes (or Owner notes) change a **core principle** or cascade beyond this audit phase’s surfaces → **STOP** with the same **Cross-cutting** numbered options as [`refine-phase`](./refine-phase.md) (record decision + sync product/flow / scoped only / defer / not cross-cutting) **before** coding. Do not silently redesign the product under an audit refine.
4. **STOP.** Show the fix plan and wait:

```text
Refine plan for Audit Phase $ARGUMENTS:
1. Approve
2. Edit (notes)
3. Cancel
```

## Fixing

1. Fix **one finding at a time**, smallest change that closes the finding.
2. Stay within the audit phase's scope — do not refactor unrelated code "while you're there".
3. Run the phase's **Evidence** commands (linter/analyzer/tests) and `{{BUILD_COMMAND}}` after fixes.
4. If a fix requires a product decision → **stop**, add to [`{{DECISIONS}}`](../../{{DECISIONS}}), ask the Owner (or run Cross-cutting STOP if multi-feature).
5. Do not commit unless asked — use `/pr-step` after reaudit if the Owner wants a PR for the fixes.

## After fixes

1. Update each finding in the report: `Fixed` | `Partially fixed` (why) | `Blocked` (what blocks it). Never delete findings.
2. Update the report snapshot counts and `{{PROGRESS}}`.
3. Behavior changed? Present a short **Behavior delta** (same shape as `/build-phase` — each changed `SHALL` with **WHEN/THEN** scenarios) and **STOP** for intent:
```text
Behavior delta (after refine-audit):
1. Accept
2. Reject (revise fixes / delta)
```
4. **STOP — Next actions** (numbered; run on pick):

```text
Refine-audit fixes recorded.
1. Re-audit — /audit-campaign $ARGUMENTS reaudit
2. Land work — /pr-step update
3. Done for now
```

Re-audit confirms findings closed (or reopens them). Fixes are not "done" until re-audit passes and the Owner acknowledges. Never leave bare `/audit-campaign … reaudit` for them to type.
