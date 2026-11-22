---
description: "(Optional) Manual session log — complete-phase usually handles finale"
argument-hint: [session-label] [phase-slug]
---

**Fallback only.** Normal finale: **`/complete-phase <slug>`** writes the session log.

Use for **mid-phase** notes or **post-complete refinements** when you want a log entry without completing (or re-completing) a phase.

Add a session log entry in [`{{PROGRESS}}`](../../{{PROGRESS}}) for **$1**, build phase **$2**.

## Resolve phase id

Second arg **$2** is **PHASE_RAW**. Prefer a **slug** from [`{{BUILD_PLAN}}`](../../{{BUILD_PLAN}}). Soft compat: integer `N` → existing `phase-N.md` or order → slug. Resolve **title**. Show **PHASE — Title**.

## Before writing

1. Read the last 2–3 session log entries
2. Review `git diff` if code changed this session

## Entry format

| Date | Module | Summary | Left unfinished |

Or:

```markdown
### Session $1 — [Date] (PHASE — Title)

**Completed:** ...
**Decisions:** ...
**Verification:** Build ✅/❌ · Manual verify ✅/❌/pending · Audit ✅/❌/pending
**Next:** ...
```

## Also update

- Progress doc last-updated date if present
- Progress checkboxes if work completed this session
- **Phase health (resume)** — refresh the fenced block from current phase slug/title/step/status/next (overwrite; do not invent history)

## Labels

Prefer short labels: `auth-foundation`, `refine-checkout`, `mid-auth`, etc. Match the project’s convention (slugs over bare numbers for new work).
