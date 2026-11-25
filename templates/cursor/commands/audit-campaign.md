---
description: Read-only campaign audit against AUDIT_PLAN (project audit track)
argument-hint: [phase-id] [reaudit?]
---

Perform a **read-only campaign audit** for **Audit Phase $ARGUMENTS**. **Do not modify files.**

**This command is campaign-only** (project audit track via `/audit-project`). For delivery build-phase acceptance use `/audit-phase <slug>` (not this command).

**Precondition:** `{{AUDIT_PLAN}}` accepted and defines Audit Phase $ARGUMENTS. Otherwise **STOP** (numbered; run on pick):

```text
Audit plan missing or not accepted:
1. Draft / accept plan — /audit-project
2. Abort campaign
```

`reaudit` argument → re-verify a previously reported campaign phase (see Re-audit).

## Evidence by surface

| Surface | Path |
|---------|------|
| **Web UI** | **Browser evidence** below |
| **Flutter / React Native** | **Native evidence** below — never Playwright |
| **Backend / CLI / API-only** | **Backend tool evidence** below — never Playwright |

### Native evidence (Flutter / RN)

1. Run catalog / `buildCommand` tools (`flutter analyze` / `flutter test`, or RN typecheck/tests).
2. Attach outcomes under Evidence; Owner/device UAT remains the gate for UI judgment.
3. Do **not** run mid-flight Playwright. Record “native — Owner/device UAT” if tools were not run.

### Backend tool evidence

1. Run `buildCommand` / lint / tests from the plan or catalog `backend-tool-evidence`.
2. Attach outcomes under Evidence. Optional HTTP smoke only if Owner asked.
3. If scope secretly includes a web UI → switch to Browser evidence / Playwright.

### Browser evidence (web UI)

When In scope includes browser UI:

1. Check [`{{STACK_CATALOG}}`](../../{{STACK_CATALOG}}) `verification` + `detectInstalled` / `{{PROGRESS}}` enrichment log.
2. If Playwright CLI is available → exercise critical in-scope flows; attach CLI outcomes (prefer CLI over MCP).
3. If only MCP is available → use it; note higher token cost.
4. If neither is installed → **Mid-flight Playwright offer** before finishing the report.

Check `{{PROGRESS}}` for:

```text
Playwright mid-flight: declined — audit phase N
```

If present → record "Playwright not configured" under **Out of scope / not checked**; do not offer again. Continue Owner-only.

Otherwise **STOP once**:

```text
Playwright is not configured, but this campaign audit includes web UI.
1. Install now — playwright-cli (+ recommended companions) | optional MCP
2. Continue this audit Owner-only — no browser evidence
3. Don't ask again for audit phase N — record decline in PROGRESS
```

- **Install now** → same catalog recipes as `/setup` Stage 4 section C; Owner selects; log in PROGRESS; re-run browser evidence.
- **Continue Owner-only** → proceed; note under Out of scope / not checked.
- **Don't ask again** → append `Playwright mid-flight: declined — audit phase N` to `{{PROGRESS}}`.

Never install silently. Never block the audit if Owner chooses 2 or 3.

5. Playwright evidence supports findings; it is **not** a fourth ground — cite Spec / Universal / Stack(+tool) as usual.

## Scope

Only this phase's **In scope** flows and areas from `{{AUDIT_PLAN}}` (+ shared code they directly touch). Respect Out of scope.

## Grounds — every finding must cite one

1. **Spec** — `{{PRODUCT_SPEC}}` / `{{USER_FLOW}}` / `{{ARCHITECTURE}}` / `{{DESIGN_SYSTEM}}` (conformance to accepted truth)
2. **Universal** — the plan's Audit dimensions checklist (security, correctness, architecture, performance)
3. **Stack** — official stack rules/skills installed for this project, or **tool evidence** (linter / analyzer / tests / **Playwright CLI or MCP** for web UI). Findings without tool or rule backing must be labeled **heuristic**

Cannot confirm something (no tool, no rule)? Report **"needs manual review"** — never inflate to C/M on a guess.

## Coverage

Evaluate **every dimension** in the plan's table. Mark N/A with a reason. Never skip silently.

If In scope includes browser UI → **Browser evidence**. If native mobile → **Native evidence**. If API/CLI only → **Backend tool evidence**.

## Write the report

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

If the phase has UI in scope and `{{DESIGN_SYSTEM}}` exists, run `/audit-campaign-ds $ARGUMENTS` (or note as a separate step).

## STOP — Owner gate

Update `{{PROGRESS}}` (phase audited), then:

```text
Audit Phase $ARGUMENTS report ready:
1. Approve all for refine — mark all Approved; then /refine-audit $ARGUMENTS
2. Select findings to fix — Owner picks IDs; then /refine-audit $ARGUMENTS
3. Record only — findings stay Open; stop here
4. Next campaign phase — record like 3, then /audit-campaign N+1
5. Complete campaign — /complete-audit (when all phases reported)
```

On **1 / 2 / 4 / 5**, mark statuses as needed, then **run the named command in this session**. Options 1–2 **never** fix code here — fixes only in `/refine-audit`. Option 4 uses `/audit-campaign` (never `/audit-phase`). Omit **5** until all campaign phases are reported; renumber.

## Re-audit (`/audit-campaign N reaudit`)

1. Read the existing report; focus on findings marked `Fixed` / `Partially fixed` by `/refine-audit`.
2. Independently re-verify each (code + re-run Evidence commands).
3. Update statuses: confirmed → `Fixed (verified)`; not actually fixed → back to `Open` with a note.
4. Refresh snapshot counts; **STOP** with the same Owner options (run on pick).
