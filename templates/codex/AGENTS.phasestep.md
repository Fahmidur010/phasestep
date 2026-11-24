## Phasestep workflow

This project uses **Phasestep** (phase-step agentic delivery with Behavior delta intent gates).

### Commands (invoke by name)

When the Owner asks to run a Phasestep stage, follow the matching command file under `.cursor/commands/` or `.claude/commands/` if present. Prefer those files as the source of truth for procedure.

| Invoke | Purpose |
|--------|---------|
| `/setup` or "run phasestep setup" | Progressive Owner-gated stub fill |
| `/plan-phase <slug>` | Named phase; classic or **progressive**; may add to BUILD_PLAN; write `phase-<slug>.md` |
| `/build-phase <slug> [step]` | Build one step; progressive capture + **Step playback** (Goal / Done-when / Out of scope); Behavior delta; intent gate |
| `/verify-phase <slug> [step]` | Owner UAT from Trace; **Evidence bar** (agent_tool \| owner_uat \| not_run; inconclusive ≠ pass); optional Playwright / native / backend evidence |
| `/refine-phase <slug> [step]` | Fix after verify; **Failure brief**; **Encode lessons** if correction repeats; mid-phase absorb / Cross-cutting |
| `/design-direction [refresh]` | Set/refresh **Visual direction** in DESIGN_SYSTEM (Owner Accept) |
| `/critique-ui [target]` | Ranked UX/visual review — findings only; no silent rewrite |
| `/polish-ui [target]` | Ordered craft polish; keep accepted direction |
| `/motion-ui [target]` | Motion decision tree + implement; prefer none; sync Motion in DESIGN_SYSTEM |
| `/audit-phase <slug>` | Build-phase acceptance audit (delivery) |
| `/audit-ds <slug>\|all` | Design-system audit (delivery) |
| `/complete-phase <slug>` | Mark done + progress + phase remainder / next seeds |
| `/session-log` | Optional mid-phase notes (`<slug>`) |
| `/map-project [refresh]` | Agent project map (navigation aid; no Owner gate) |
| `/github-connect [repo]` | Link GitHub + choose Simple PR or GitFlow (no app commit) |
| `/pr-step` / `update` | Land current work; **Verified** line; open fails block code unless override. Simple→main · GitFlow→develop |
| `/pr-step release` | GitFlow: develop → **release** (live / deploy line); soft-remind `/pr-step main` when fully stable |
| `/pr-step main` | GitFlow: release → **main** (stable baseline) |
| `/pr-step bugfix …` | GitFlow non-live: from develop → fix → develop; soft-remind release; live bugs → hotfix |
| `/pr-step hotfix …` | GitFlow live: from release → fix → release + develop; soft-remind main |
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
- Verification map: `{{VERIFICATION_MAP}}` (durable prove-paths; context only; seed at setup, grow on verify/audit)
- Progress: `{{PROGRESS}}` (includes rolling **Phase health** resume block)
- Design system: `{{DESIGN_SYSTEM}}`
- Stack catalog: `{{STACK_CATALOG}}`
- Design catalog: `{{DESIGN_CATALOG}}`
- Config: `phasestep.json` (`buildCommand`: `{{BUILD_COMMAND}}`)

### Hard rules

1. Owner owns product decisions; agent drafts and stops at gates.
2. Docs/config only during `/setup` (no app code unless Owner-approved tooling install).
3. After build: Behavior delta (each SHALL with WHEN/THEN scenarios) → Owner intent gate → then verify.
4. Design wing is core: Visual direction + craft floor + Motion; component libraries are pick-one (never mix kits). Use `/design-direction`, `/critique-ui`, `/polish-ui`, `/motion-ui` for UI craft.
5. Mid-project setup: document what exists, plan remaining — do not reinvent the app. Prefer `{{PROJECT_MAP}}` when present; refresh via `/map-project` without Owner gate.
6. Principle / multi-feature changes: follow Cross-cutting STOP in `/refine-phase` before coding (decision + product sync, or scoped/defer).
7. Mid-phase side-work: absorb local Owner refinements into the current step’s plan + Behavior delta / Trace (no new command); if too large → Side-work size STOP; verify/audit use updated artifacts.
8. Progressive phases: `/plan-phase <slug>` → progressive → `/build-phase <slug> N` with Owner describing each step; **Step playback** before code when progressive / vague; plan grows for audit/complete.
9. Evidence bar: `/verify-phase` — matching surface; inconclusive / wrong surface ≠ pass; step PASS needs Owner Pass on ADDED/CHANGED Verify #.
10. Refine after Reject / fail: **Failure brief** (symptom → root cause → blast radius → fix shape) before application code.
11. Repeated Owner corrections: **Encode lessons** STOP (rule / lint-test / doc-only / skip) — prefer structure over re-teaching in chat.
12. Commit / push / merge only via `/pr-step` — invoke authorizes; report **Verified:** line; open Phase health fails block **code** unless Owner override; docs-only soft; never force-push; never silent from build/refine. Deploy stays project-local.
13. **Additive install, sole delivery (recommended):** content outside these markers is the project's own agent guidance. Prefer **Sole Phasestep** via `/setup` (Owner-gated archive) for full results; **Alongside** is an explicit opt-in. Do not invent a merged meta-workflow.

If command markdown files are missing, run `npx phasestep upgrade` or `npx phasestep init`.
