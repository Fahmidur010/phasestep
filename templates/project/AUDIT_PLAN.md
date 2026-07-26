# Audit plan

Ordered **audit phases** for this product. Drafted by `/audit-project` from product, user flow, architecture, and design system (if any). Each phase is executed with `/audit-phase N` (read-only) and reported into `{{AUDIT_REPORTS_DIR}}/`.

This plan is for **assessment**, not delivery — future feature work stays in `{{BUILD_PLAN}}`.

**Status:** stub | drafting | accepted  
**Last updated:** —

## Audit dimensions (every phase)

Each phase MUST evaluate all dimensions (mark N/A with reason, never skip silently):

| Dimension | Checks |
|-----------|--------|
| Security | injection, authn/authz, secrets, untrusted input, data exposure, insecure defaults, vulnerable deps |
| Correctness & reliability | unhandled errors, race conditions, resource leaks, boundary handling |
| Architecture & maintainability | layer violations, circular deps, duplication, SOLID smells, test coverage on critical paths |
| Performance | N+1 queries, unbounded loops/allocations, blocking hot paths (evidence-based only) |
| Stack conformance | official rules/skills for the detected stack; native linter/analyzer output |
| Design system (UI only) | `{{DESIGN_SYSTEM}}` via `/audit-ds-phase` |

## Grounds

Every finding must cite one:

1. **Spec** — `{{PRODUCT_SPEC}}` / `{{USER_FLOW}}` / `{{ARCHITECTURE}}` / `{{DESIGN_SYSTEM}}`
2. **Universal** — dimension checklist above
3. **Stack** — official stack rules or tool output (linter/analyzer/tests); heuristic findings must be labeled heuristic

## Phase order

1. …
2. …
3. …

## Audit Phase 1 — [feature/module title]

### In scope
- Flows: …
- Areas / folders: …

### Out of scope
- …

### Evidence to run
- e.g. linter / analyzer / test command for this stack

## Audit Phase 2 — [feature/module title]

### In scope
- …

### Out of scope
- …

### Evidence to run
- …
