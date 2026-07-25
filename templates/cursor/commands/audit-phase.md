---
description: Read-only code audit for a build phase (after all steps verified)
argument-hint: [phase-id]
---

Perform a **read-only** audit on **Build Phase $ARGUMENTS**. **Do not modify files.**

**When:** only after **all** steps are Owner-**verified** (unless Owner explicitly wants an early audit).

## Required

Read [`{{PHASE_PLANS_DIR}}/phase-$ARGUMENTS.md`](../../{{PHASE_PLANS_DIR}}/phase-$ARGUMENTS.md)

Use **Audit checkpoints** and **Files checklist** as scope.

## Scope

1. Phase plan deliverables
2. Files created/changed for this phase (`git diff`, plan list)
3. Verify against:
   - [`{{ARCHITECTURE}}`](../../{{ARCHITECTURE}})
   - [`{{PRODUCT_SPEC}}`](../../{{PRODUCT_SPEC}})
   - [`{{DESIGN_SYSTEM}}`](../../{{DESIGN_SYSTEM}}) if present
   - Any stack practice docs the project defines

## Check

- Steps in the plan are reflected in code
- Architecture layering / forbidden imports respected
- Auth / role guards match phase requirements (if applicable)
- Schema/data migrations present when claimed
- Every **Audit checkpoint** evaluated
- Short SOLID pass on changed surfaces

## Report format

**Critical (C)** / **Major (M)** / **Minor (Mi)** — file, line, issue, suggested fix

End with counts and:
- Issues → `/refine-phase $ARGUMENTS` then re-audit
- No C/M → ready for `/complete-phase $ARGUMENTS` after Owner confirmation
