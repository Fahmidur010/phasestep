---
description: "(Optional) Manual session log — complete-phase usually handles finale"
argument-hint: [session-label] [phase-number]
---

**Fallback only.** Normal finale: **`/complete-phase N`** writes the session log.

Use for **mid-phase** notes or **post-complete refinements** when you want a log entry without completing (or re-completing) a phase.

Add a session log entry in [`{{PROGRESS}}`](../../{{PROGRESS}}) for **$1**, **Build Phase $2**.

## Before writing

1. Read the last 2–3 session log entries
2. Review `git diff` if code changed this session

## Entry format

| Date | Module | Summary | Left unfinished |

Or:

```markdown
### Session $1 — [Date] (Phase $2)

**Completed:** ...
**Decisions:** ...
**Verification:** Build ✅/❌ · Manual verify ✅/❌/pending · Audit ✅/❌/pending
**Next:** ...
```

## Also update

- Progress doc last-updated date if present
- Progress checkboxes if work completed this session

## Labels

Prefer short labels: `P1-foundation`, `refine-P3`, `mid-P4`, etc. Match the project’s convention.
