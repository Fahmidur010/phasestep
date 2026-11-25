---
description: Draft an Owner-gated full-project audit plan (feature-listed phases), then drive phase-by-phase audits
argument-hint: [resume?]
---

Run **Phasestep project audit planning** — draft [`{{AUDIT_PLAN}}`](../../{{AUDIT_PLAN}}) from accepted project truth, get Owner acceptance, then hand off to `/audit-campaign N`. **Docs only — never modify application code.**

This is for **assessing an existing codebase**. It does not require stack enrichment, decisions, or a delivery build plan.

## Prerequisites (hard gate)

These must be substantive and Owner-accepted (not stubs):

1. [`{{PRODUCT_SPEC}}`](../../{{PRODUCT_SPEC}}) — current behavior (mid-project: as-is truth)
2. [`{{USER_FLOW}}`](../../{{USER_FLOW}}) — interaction map
3. [`{{ARCHITECTURE}}`](../../{{ARCHITECTURE}}) — how code is actually structured
4. [`{{DESIGN_SYSTEM}}`](../../{{DESIGN_SYSTEM}}) — **only if the project has UI**

If any are missing → **STOP** and direct the Owner to `/setup` (Existing / mid-project mode) for **those stages only**. Do not draft an audit plan from guesses.

## Resume

If `{{AUDIT_PLAN}}` is already **accepted**: report phase statuses from [`{{AUDIT_REPORTS_DIR}}/`](../../{{AUDIT_REPORTS_DIR}}/) and `{{PROGRESS}}`, then suggest the next `/audit-campaign N`. Do not redraft an accepted plan unless the Owner asks to revise it.

## Draft the audit plan

1. **Project map:** if [`{{PROJECT_MAP}}`](../../{{PROJECT_MAP}}) is missing, empty, or stale and the codebase is non-trivial → run `/map-project` (or `refresh`) first. No Owner gate. Prefer map **Seams** / **Modules** / **Core hubs** over random folder lists.
2. Read product + flow + architecture (+ DS if UI). Detect stack(s) from the repo (same signals as [`{{STACK_CATALOG}}`](../../{{STACK_CATALOG}}) `detect` blocks).
3. Slice the project into **feature/module audit phases** derived from flows, architecture seams, and the project map (e.g. Auth & sessions, Pharmacy dispensing, Pathology orders, Shared UI). Not random folders. Prefer **extracted** seams; treat **heuristic** seams cautiously.
4. For each phase fill the `{{AUDIT_PLAN}}` shape:
   - **In scope** — flows + areas/folders
   - **Out of scope**
   - **Evidence to run** — this stack's native tooling (linter / analyzer / tests), e.g. `dart analyze`, `cargo clippy`, `npx eslint`, framework test command
5. Keep the **Audit dimensions** table intact — every phase must evaluate all dimensions (N/A allowed with reason).
6. Order phases by risk: security-sensitive and core-journey surfaces first (map hubs often belong early).

## STOP — Owner gate

```text
Audit plan draft ready:
1. Accept
2. Reject
3. Edit (notes)
```

- **1. Accept** → set plan Status: accepted; update `{{PROGRESS}}` (Audit section); then **STOP — Next actions**:

```text
Audit plan accepted.
1. Start campaign — /audit-campaign 1
2. Done for now
```

  On **1**, run `/audit-campaign 1` in this session.
- **2. Reject / 3. Edit** → apply notes, re-show, stop again

## Hard rules

1. **Read-only toward application code.** This command writes only `{{AUDIT_PLAN}}` and `{{PROGRESS}}` (run `/map-project` separately if the map needs a refresh).
2. Do not invent unbuilt features into the plan as if they exist — audit what is there.
3. Findings/fixes are not part of this command: audits run via `/audit-campaign N`; fixes only via `/refine-audit N` after Owner approval.
4. Report-only by default — completing an audit never obligates fixes.
5. Project map is **context** — never override accepted product/flow/architecture.
