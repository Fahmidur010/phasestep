# Phasegate — Cursor adapter

Phase-by-phase, step-by-step: **build → Behavior delta (intent) → owner verify → next step**. Audits after all steps pass.

**Constitution:** [`{{CONSTITUTION}}`](../../{{CONSTITUTION}})  
**Config:** [`phasegate.json`](../../phasegate.json)  
**Master plan:** [`{{BUILD_PLAN}}`](../../{{BUILD_PLAN}})  
**Phase plans:** [`{{PHASE_PLANS_DIR}}/`](../../{{PHASE_PLANS_DIR}}/)  
**Progress:** [`{{PROGRESS}}`](../../{{PROGRESS}})

---

## Workflow

```text
/plan-phase N
/build-phase N S           → Behavior delta
  └─ accept intent → /verify-phase N S
  └─ reject intent → /refine-phase N S
…all steps verified…
/audit-ds-phase N          → UI projects
/audit-phase N
/refine-phase N            → if needed
/complete-phase N
```

`/build-phase N` with no step = next unfinished step only.

`/session-log` = optional mid-phase or post-complete notes (`/complete-phase` writes the phase-complete log).

---

## Commands

| Command | Args | Who | Purpose |
|---------|------|-----|---------|
| plan-phase | `N` | Agent | Write phase plan |
| build-phase | `N` or `N S` | Agent | One step + Behavior delta |
| verify-phase | `N` or `N S` | Owner | Manual verification checklist |
| refine-phase | `N` or `N S` | Agent | Fix intent / UAT / audit issues |
| audit-phase | `N` | Agent | Code/architecture audit |
| audit-ds-phase | `N` or `all` | Agent | Design-system audit (UI projects) |
| complete-phase | `N` | Agent | Mark complete + session log |
| session-log | label, `N` | Agent | Optional mid-phase log |

---

## Rules

- Plan before build
- One step at a time
- Review Behavior delta before verify
- Verify each step before the next
- Audit only after all steps verified
- Do not commit unless Owner asks
- After build/refine: run `{{BUILD_COMMAND}}`
