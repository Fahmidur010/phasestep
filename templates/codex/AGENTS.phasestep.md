## Phasestep workflow

This project uses **Phasestep** (phase-step agentic delivery with Behavior delta intent gates).

### Commands (invoke by name)

When the Owner asks to run a Phasestep stage, follow the matching command file under `.cursor/commands/` or `.claude/commands/` if present. Prefer those files as the source of truth for procedure.

| Invoke | Purpose |
|--------|---------|
| `/setup` or "run phasestep setup" | Progressive Owner-gated stub fill |
| `/plan-phase N` | Clarify STOP if needed → write `{{PHASE_PLANS_DIR}}/phase-N.md` |
| `/build-phase N [step]` | Pre-build consistency → implement; Behavior delta; intent gate |
| `/verify-phase N [step]` | Owner UAT from Trace / THEN outcomes; UNCHANGED spot-check when listed; optional Playwright (web UI) |
| `/refine-phase N [step]` | Fix after verify; Cross-cutting STOP if principle cascades |
| `/audit-phase N` | Build-phase acceptance audit (delivery) |
| `/audit-ds N\|all` | Design-system audit (delivery) |
| `/complete-phase N` | Mark done + progress + phase remainder / next seeds |
| `/session-log` | Optional mid-phase notes |
| `/map-project [refresh]` | Agent project map (navigation aid; no Owner gate) |
| `/github-connect [repo]` | Link GitHub remote + gh auth (no commit) |
| `/pr-step N [step?]` | Owner-gated branch → commit → push → PR → optional merge |
| `/audit-project` | Draft `{{AUDIT_PLAN}}` (Owner-gated audit phases) |
| `/audit-campaign N [reaudit]` | Campaign audit against audit plan |
| `/audit-campaign-ds N` | Design-system checks for a campaign phase |
| `/refine-audit N` | Fix only Owner-approved audit findings |
| `/complete-audit` | Audit summary; optional promotion to build plan |

### Artifacts

- Constitution: `{{CONSTITUTION}}`
- Product: `{{PRODUCT_SPEC}}`
- User flow: `{{USER_FLOW}}`
- Architecture: `{{ARCHITECTURE}}`
- Decisions: `{{DECISIONS}}`
- Build plan: `{{BUILD_PLAN}}`
- Audit plan: `{{AUDIT_PLAN}}` (reports in `{{AUDIT_REPORTS_DIR}}/`)
- Project map: `{{PROJECT_MAP}}` (agent navigation; optional until filled)
- Progress: `{{PROGRESS}}` (includes rolling **Phase health** resume block)
- Design system: `{{DESIGN_SYSTEM}}`
- Stack catalog: `{{STACK_CATALOG}}`
- Design catalog: `{{DESIGN_CATALOG}}`
- Config: `phasestep.json` (`buildCommand`: `{{BUILD_COMMAND}}`)

### Hard rules

1. Owner owns product decisions; agent drafts and stops at gates.
2. Docs/config only during `/setup` (no app code unless Owner-approved tooling install).
3. After build: Behavior delta (each SHALL with WHEN/THEN scenarios) → Owner intent gate → then verify.
4. Design component libraries are pick-one; never mix kits.
5. Mid-project setup: document what exists, plan remaining — do not reinvent the app. Prefer `{{PROJECT_MAP}}` when present; refresh via `/map-project` without Owner gate.
6. Principle / multi-feature changes: follow Cross-cutting STOP in `/refine-phase` before coding (decision + product sync, or scoped/defer).
7. Commit / push / PR / merge only via `/pr-step` (or explicit Owner ask that `/pr-step` executes) — never silent from build/refine.
8. **Additive install, sole delivery (recommended):** content outside these markers is the project's own agent guidance. Prefer **Sole Phasestep** via `/setup` (Owner-gated archive) for full results; **Alongside** is an explicit opt-in. Do not invent a merged meta-workflow.

If command markdown files are missing, run `npx phasestep upgrade` or `npx phasestep init`.
