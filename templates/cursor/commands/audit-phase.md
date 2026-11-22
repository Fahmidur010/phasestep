---
description: Read-only named build-phase acceptance audit (delivery loop)
argument-hint: [phase-slug]
---

Perform a **read-only build audit** for one **named build phase**. **Do not modify files.**

**This command is delivery-only.** For project audit-plan phases use `/audit-campaign N` (not this command).

## Resolve phase id

`$ARGUMENTS` is **PHASE_RAW**. Prefer a **slug** from [`{{BUILD_PLAN}}`](../../{{BUILD_PLAN}}). Soft compat: integer `N` → existing `phase-N.md` or BUILD_PLAN order → slug. Resolve **title**. Plan file: `phase-<id>.md`. Below, **PHASE** = resolved id.

**When:** only after **all** steps of this build phase are Owner-**verified** (unless Owner explicitly wants an early audit).

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

When the phase touches a **browser UI** (UI steps / checkpoints):

1. Check [`{{STACK_CATALOG}}`](../../{{STACK_CATALOG}}) `verification` + `detectInstalled` / `{{PROGRESS}}` enrichment log.
2. If Playwright CLI is available → exercise critical flows; attach CLI outcomes (prefer CLI over MCP).
3. If only MCP is available → use it; note higher token cost.
4. If neither is installed → **Mid-flight Playwright offer** before finishing.

Check `{{PROGRESS}}` for:

```text
Playwright mid-flight: declined — build phase PHASE
```

If present → note “Playwright not configured”; do not offer again. Continue Owner-only.

Otherwise **STOP once**:

```text
Playwright is not configured, but this build audit includes web UI.
1. Install now — playwright-cli (+ recommended companions) | optional MCP
2. Continue this audit Owner-only — no browser evidence
3. Don't ask again for build phase PHASE — record decline in PROGRESS
```

- **Install now** → same catalog recipes as `/setup` Stage 4 section C; Owner selects; log in PROGRESS; re-run browser evidence.
- **Continue Owner-only** → proceed without browser evidence.
- **Don't ask again** → append `Playwright mid-flight: declined — build phase PHASE` to `{{PROGRESS}}`.

Never install silently. Never block the audit if Owner chooses 2 or 3.

5. Playwright evidence supports findings; cite architecture/product/stack as usual.

## Audit steps

1. Read `{{PHASE_PLANS_DIR}}/phase-PHASE.md`; use **Audit checkpoints** and **Files checklist** as scope (includes paths added via mid-phase absorbed side-work).
2. Audit files created/changed for this phase (`git diff`, plan list) against:
   - [`{{ARCHITECTURE}}`](../../{{ARCHITECTURE}})
   - [`{{PRODUCT_SPEC}}`](../../{{PRODUCT_SPEC}})
   - [`{{DESIGN_SYSTEM}}`](../../{{DESIGN_SYSTEM}}) if present
   - Stack practice docs the project defines
3. Check: steps reflected in code; layering/forbidden imports; auth/role guards; migrations present when claimed; every audit checkpoint evaluated; short SOLID pass on changed surfaces.
4. **Behavior delta traceability:** for each verified step in the phase plan, read its Behavior delta scenarios — confirm implemented behavior matches each **THEN** (and REMOVED scenarios if present), including refinements absorbed mid-phase. Flag mismatches as findings.
5. If this phase has a **web UI** surface → follow **Browser evidence** above. If **native** or **backend-only** → follow Native / Backend tool evidence above.
6. If UI in scope and `{{DESIGN_SYSTEM}}` exists → run `/audit-ds PHASE` (or note as a separate step).
7. Report **Critical (C) / Major (M) / Minor (Mi)** — file, line, issue, suggested fix. End with counts and:
   - Issues → `/refine-phase PHASE` then re-run `/audit-phase PHASE`
   - No C/M → ready for `/complete-phase PHASE` after Owner confirmation
