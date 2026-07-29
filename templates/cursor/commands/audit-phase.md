---
description: Read-only build-phase acceptance audit (delivery loop)
argument-hint: [phase-id]
---

Perform a **read-only build audit** for **Build Phase $ARGUMENTS**. **Do not modify files.**

**This command is delivery-only.** For project audit-plan phases use `/audit-campaign N` (not this command).

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
Playwright mid-flight: declined — build phase N
```

If present → note “Playwright not configured”; do not offer again. Continue Owner-only.

Otherwise **STOP once**:

```text
Playwright is not configured, but this build audit includes web UI.
1. Install now — playwright-cli (+ recommended companions) | optional MCP
2. Continue this audit Owner-only — no browser evidence
3. Don't ask again for build phase N — record decline in PROGRESS
```

- **Install now** → same catalog recipes as `/setup` Stage 4 section C; Owner selects; log in PROGRESS; re-run browser evidence.
- **Continue Owner-only** → proceed without browser evidence.
- **Don't ask again** → append `Playwright mid-flight: declined — build phase N` to `{{PROGRESS}}`.

Never install silently. Never block the audit if Owner chooses 2 or 3.

5. Playwright evidence supports findings; cite architecture/product/stack as usual.

## Audit steps

1. Read `{{PHASE_PLANS_DIR}}/phase-$ARGUMENTS.md`; use **Audit checkpoints** and **Files checklist** as scope.
2. Audit files created/changed for this phase (`git diff`, plan list) against:
   - [`{{ARCHITECTURE}}`](../../{{ARCHITECTURE}})
   - [`{{PRODUCT_SPEC}}`](../../{{PRODUCT_SPEC}})
   - [`{{DESIGN_SYSTEM}}`](../../{{DESIGN_SYSTEM}}) if present
   - Stack practice docs the project defines
3. Check: steps reflected in code; layering/forbidden imports; auth/role guards; migrations present when claimed; every audit checkpoint evaluated; short SOLID pass on changed surfaces.
4. If this phase has a **web UI** surface → follow **Browser evidence** above. If **native** or **backend-only** → follow Native / Backend tool evidence above.
5. If UI in scope and `{{DESIGN_SYSTEM}}` exists → run `/audit-ds $ARGUMENTS` (or note as a separate step).
6. Report **Critical (C) / Major (M) / Minor (Mi)** — file, line, issue, suggested fix. End with counts and:
   - Issues → `/refine-phase $ARGUMENTS` then re-run `/audit-phase $ARGUMENTS`
   - No C/M → ready for `/complete-phase $ARGUMENTS` after Owner confirmation
