---
description: Read-only audit — build phase acceptance, or a project audit-plan phase
argument-hint: [phase-id] [reaudit?]
---

Perform a **read-only** audit for **Phase $ARGUMENTS**. **Do not modify files.**

## Mode

Two audit modes share this command:

| Mode | When | Scope source |
|------|------|--------------|
| **Build audit** | Delivery loop — after all steps of build phase N are Owner-verified | [`{{PHASE_PLANS_DIR}}/phase-N.md`](../../{{PHASE_PLANS_DIR}}/) |
| **Campaign audit** | Project audit driven by `/audit-project` | [`{{AUDIT_PLAN}}`](../../{{AUDIT_PLAN}}) Audit Phase N |

Resolve mode: if `{{AUDIT_PLAN}}` is accepted and defines Audit Phase N, and no `phase-N.md` build plan exists (or the Owner is clearly mid-campaign), use **Campaign**. If both exist and intent is unclear → **ask once** which phase the Owner means.

`reaudit` argument → re-verify a previously reported campaign phase (see Re-audit).

---

## Browser evidence (both modes — web UI)

Use when the phase touches a **browser UI** (Mode A: UI steps / checkpoints; Mode B: In scope includes web UI). Otherwise skip.

1. Check [`{{STACK_CATALOG}}`](../../{{STACK_CATALOG}}) `verification` + `detectInstalled` / `{{PROGRESS}}` enrichment log.
2. If Playwright CLI is available → exercise critical in-scope flows; attach CLI outcomes under Evidence (prefer CLI over MCP).
3. If only MCP is available → use it; note higher token cost.
4. If neither is installed → **Mid-flight Playwright offer** before finishing the report.

Decline keys in `{{PROGRESS}}`:

| Mode | Decline line |
|------|----------------|
| **A — Build audit** | `Playwright mid-flight: declined — build phase N` (same key as `/verify-phase` for that delivery phase) |
| **B — Campaign audit** | `Playwright mid-flight: declined — audit phase N` |

If the matching decline line exists → record "Playwright not configured" (Mode B: under Out of scope / not checked; Mode A: note in the report); do not offer again. Continue Owner-only.

Otherwise **STOP once**:

```text
Playwright is not configured, but this audit includes web UI.
1. Install now — playwright-cli (+ recommended companions) | optional MCP
2. Continue this audit Owner-only — no browser evidence
3. Don't ask again for this phase — record decline in PROGRESS (build phase N | audit phase N)
```

- **Install now** → same catalog recipes as `/setup` Stage 4 section C; Owner selects; log in PROGRESS; re-run browser evidence.
- **Continue Owner-only** → proceed without browser evidence (this audit only; may offer again next time unless declined).
- **Don't ask again** → append the mode's decline line to `{{PROGRESS}}`.

Never install silently. Never block the audit if Owner chooses 2 or 3.

5. Playwright evidence supports findings; it is **not** a fourth ground by itself — cite Spec / Universal / Stack(+tool) as usual (Mode B) or architecture/product/stack (Mode A).

---

## Mode A — Build audit (delivery loop)

**When:** only after **all** steps are Owner-**verified** (unless Owner explicitly wants an early audit).

1. Read `{{PHASE_PLANS_DIR}}/phase-$ARGUMENTS.md`; use **Audit checkpoints** and **Files checklist** as scope.
2. Audit files created/changed for this phase (`git diff`, plan list) against:
   - [`{{ARCHITECTURE}}`](../../{{ARCHITECTURE}})
   - [`{{PRODUCT_SPEC}}`](../../{{PRODUCT_SPEC}})
   - [`{{DESIGN_SYSTEM}}`](../../{{DESIGN_SYSTEM}}) if present
   - Stack practice docs the project defines
3. Check: steps reflected in code; layering/forbidden imports; auth/role guards; migrations present when claimed; every audit checkpoint evaluated; short SOLID pass on changed surfaces.
4. If this phase has a **web UI** surface → follow **Browser evidence** above (attach outcomes to the report; mid-flight if Playwright missing).
5. Report **Critical (C) / Major (M) / Minor (Mi)** — file, line, issue, suggested fix. End with counts and:
   - Issues → `/refine-phase $ARGUMENTS` then re-audit
   - No C/M → ready for `/complete-phase $ARGUMENTS` after Owner confirmation

---

## Mode B — Campaign audit (project audit plan)

**Precondition:** `{{AUDIT_PLAN}}` accepted and defines Audit Phase $ARGUMENTS. Otherwise → run `/audit-project` first.

### Scope

Only this phase's **In scope** flows and areas from `{{AUDIT_PLAN}}` (+ shared code they directly touch). Respect Out of scope.

### Grounds — every finding must cite one

1. **Spec** — `{{PRODUCT_SPEC}}` / `{{USER_FLOW}}` / `{{ARCHITECTURE}}` / `{{DESIGN_SYSTEM}}` (conformance to accepted truth)
2. **Universal** — the plan's Audit dimensions checklist (security, correctness, architecture, performance)
3. **Stack** — official stack rules/skills installed for this project, or **tool evidence** (run the phase's Evidence commands: linter / analyzer / tests / **Playwright CLI or MCP** for web UI). Findings without tool or rule backing must be labeled **heuristic**

Cannot confirm something (no tool, no rule)? Report **"needs manual review"** — never inflate to C/M on a guess.

### Coverage

Evaluate **every dimension** in the plan's table. Mark N/A with a reason. Never skip silently.

If In scope includes browser UI → follow **Browser evidence** above before finishing the report.

### Write the report

Write/update [`{{AUDIT_REPORTS_DIR}}/audit-phase-$ARGUMENTS.md`](../../{{AUDIT_REPORTS_DIR}}/) — preview-first shape:

```markdown
# Audit Phase N — [title]

| Field | Value |
|-------|-------|
| Status | Reported — findings open |
| Date | YYYY-MM-DD |
| Plan | AUDIT_PLAN.md · Phase N |
| Next | Owner decision below |

## Snapshot

| Severity | Open | Approved for fix | Fixed | Deferred |
|----------|------|------------------|-------|----------|
| Critical | n | 0 | 0 | 0 |
| Major | n | 0 | 0 | 0 |
| Minor | n | 0 | 0 | 0 |

**Top risks:** one line per open Critical

---

## Critical

### C-01 — [one-line issue]

| | |
|-|-|
| **Where** | `path/file.ext:line` |
| **Ground** | Spec / Universal (dimension) / Stack (rule or tool) |
| **Evidence** | what proves it (tool output, spec line) |
| **Suggested fix** | one line |
| **Status** | Open |

## Major
…

## Minor
…

---

## Out of scope / not checked
- …

## Owner decision
- [ ] Approved for refinement: (IDs)
- [ ] Recorded; no fixes
```

Stable IDs (`C-01`, `M-02`, `Mi-03`) — refine and re-audit update the same entries, never renumber.

If the phase has UI in scope and `{{DESIGN_SYSTEM}}` exists, run `/audit-ds-phase` checks for those surfaces (or note it as a separate step).

### STOP — Owner gate

Update `{{PROGRESS}}` (phase audited), then:

```text
Audit Phase $ARGUMENTS report ready:
1. Approve all findings for refinement → all findings marked Approved; then run /refine-audit $ARGUMENTS
2. Select findings to fix → Owner picks IDs; selected marked Approved, rest stay Open/Deferred; then /refine-audit $ARGUMENTS
3. Record findings; no fixes → findings stay Open; stop here
4. Continue to Phase N+1 → same recording as 3, then start the next audit phase
```

Options 1–2 **never** fix code in this command — fixes happen only in `/refine-audit`. Option 4 records identically to 3, then proceeds to the next phase.

### Re-audit (`/audit-phase N reaudit`)

1. Read the existing report; focus on findings marked `Fixed` / `Partially fixed` by `/refine-audit`.
2. Independently re-verify each (code + re-run Evidence commands).
3. Update statuses: confirmed → `Fixed (verified)`; not actually fixed → back to `Open` with a note.
4. Refresh snapshot counts; **STOP** with the same Owner options.

All campaign phases reported → suggest `/complete-audit`.
