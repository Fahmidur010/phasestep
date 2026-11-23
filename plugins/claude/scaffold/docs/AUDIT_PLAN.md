# Audit plan

Ordered **audit phases** for this product. Drafted by `/audit-project` from product, user flow, architecture, and design system (if any). Each phase is executed with `/audit-campaign N` (read-only) and reported into `docs/audit-reports/`.

This plan is for **assessment**, not delivery — future feature work stays in `docs/BUILD_PLAN.md`.

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
| Design system (UI only) | `docs/DESIGN_SYSTEM.md` via `/audit-campaign-ds` (campaign) or `/audit-ds` (delivery) |
| Browser evidence (web UI) | If Playwright is installed: run CLI (preferred) or MCP against in-scope flows; attach outcomes as evidence. If missing → mid-flight STOP once (1. Install now | 2. Owner-only | 3. Don't ask again for this audit phase). Never silent install. |
| Native evidence (Flutter / RN) | Analyzer/tests + Owner device UAT — never Playwright. See catalog `flutter-analyzer-evidence` / `react-native-device-evidence`. |
| Backend tool evidence (API/CLI) | `buildCommand` / lint / tests + Owner contract UAT — never invent a browser path. See catalog `backend-tool-evidence`. |

## Grounds

Every finding must cite one:

1. **Spec** — `docs/product.md` / `docs/USER_FLOW.md` / `docs/architecture.md` / `docs/DESIGN_SYSTEM.md`
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
- Web UI phases: Playwright CLI (preferred) or MCP if installed — see `.phasestep/stack-catalog.json` `verification` lane; mid-flight offer if missing (Owner-gated)

## Audit Phase 2 — [feature/module title]

### In scope
- …

### Out of scope
- …

### Evidence to run
- …
- Web UI phases: Playwright CLI (preferred) or MCP if installed; mid-flight if missing
