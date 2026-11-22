# Build plan

Ordered phases for this product. Drafted in `/setup` Stage 8 from product, user flow, architecture, decisions, and design system (if any). Each phase is later planned with `/plan-phase <slug>` into `{{PHASE_PLANS_DIR}}/phase-<slug>.md`.

**Status:** stub | drafting | accepted  
**Last updated:** —

## Phase ids

- Each phase has a **slug** (filesystem-safe kebab-case: `auth`, `checkout`) and a **title** (human name).
- Invokes use the slug: `/plan-phase auth`, `/build-phase auth 3`. **Steps stay numeric.**
- Soft compat: legacy `phase-1.md` / `/plan-phase 1` still resolve when those files or ordered numeric headings exist; **new** plans use slugs.
- New features mid-project: `/plan-phase <new-slug>` can **add** the phase here (Owner Accept), then **progressive** mode — steps recorded at each `/build-phase <slug> N`.

## Open decision constraints

Copy from `{{DECISIONS}}` during setup. Do not invent answers here.

| ID | Status | Blocker? | How this plan treats it |
|----|--------|----------|-------------------------|
| | tbd / deferred / override | yes/no | out of scope / risk / Owner override |

## Phase order

1. auth — Authentication
2. …

## Phase: auth — Authentication

### In scope
- …

### Out of scope
- …

### Risks / dependencies
- …

## Phase: example-slug — Example title

### In scope
- …

### Out of scope
- …

### Risks / dependencies
- …
