# Progress & session log

Phasestep progress tracker. Update during builds; `/complete-phase` marks phases done and appends a session log entry. Optional `/session-log` for mid-phase notes.

**Last updated:** [date]

---

## Phase health (resume)

Rolling snapshot for mid-session resume. **Overwrite** the fenced block on each material gate (`/build-phase` → intent → `/verify-phase` → `/refine-phase` → `/complete-phase`). Do not append history here — use **Session log** for that.

```text
Phase: —
Step: —
Status: idle
Verified steps: none
Open rejects / fails: none
Evidence: none
Next: /setup or /plan-phase 1
Updated: —
```

Status values: `idle` · `building` · `awaiting-intent` · `awaiting-verify` · `verified` · `refining` · `auditing` · `complete`

---

## Setup

Status: `[ ]` not started · `[~]` in progress · `[x]` done · `[-]` skipped

- [ ] Setup mode (greenfield | mid-project)
- [ ] Workflow mode (sole | alongside)
- [ ] Product (`product.md`) accepted
- [ ] User flow (`USER_FLOW.md`) accepted (or skipped)
- [ ] Product + flow dual-locked
- [ ] Stack identity confirmed
- [ ] Stack enrichment (catalog) accepted / skipped
- [ ] Architecture accepted
- [ ] Decisions reviewed
- [ ] Design system (optional) — library pick-one + guidelines
- [ ] Build plan accepted
- [ ] `buildCommand` confirmed

```text
Setup mode: mid-project
Workflow mode: sole
Archived workflow: .phasestep/archived-workflow/YYYY-MM-DD/
```

(or `Workflow mode: alongside`)

### Stack enrichment log

| Date | Lane (official/community/verification) | Stack / id | Action | Provenance (URL) |
|------|---------------------------|------------|--------|------------------|
| | | | | |

### Design enrichment log

| Date | Lane (library/guideline/owner) | Id | Action | Provenance (URL) |
|------|--------------------------------|-----|--------|------------------|
| | | | | |

### Playwright mid-flight declines (optional)

When Owner declines the mid-flight Playwright offer during `/verify-phase`, `/audit-phase`, or `/audit-campaign`:

```text
Playwright mid-flight: declined — build phase 2
Playwright mid-flight: declined — audit phase 1
```

- **build phase N** — quiets `/verify-phase` and `/audit-phase` for that delivery phase  
- **audit phase N** — quiets `/audit-campaign` for that campaign audit phase  

Do not re-offer for that phase after a decline is recorded.

### GitHub (optional — via `/github-connect` + `/pr-step`)

Offered at `/setup` Finish (Connect now / Skip). Re-run `/github-connect` anytime if skipped or remote changes. After connect, Owner picks **Simple PR** or **GitFlow** (`github.workflow` in `phasestep.json`).

```text
GitHub: connected — owner/repo (origin) — YYYY-MM-DD
GitHub workflow: simple | gitflow — YYYY-MM-DD
GitHub: skipped at setup — YYYY-MM-DD
GitHub PR: update [phase N step S] → main — branch … — status merged — date
GitHub PR: update feature/phase-slug → develop — status merged — date
GitHub: release promoted — develop → release — date
GitHub: main promoted — release → main — tag vX.Y.Z — date
GitHub: hotfix login-timeout → release + develop — status merged — date
GitHub: bugfix form-validation → develop — status merged — date
```

("merged" includes local `merge --no-ff` + push; `/pr-step` prefers that over `gh pr create`.)

---

## Audit campaign (optional — via `/audit-project`)

Status: `[ ]` not started · `[~]` in progress · `[x]` done

- [ ] Audit plan (`AUDIT_PLAN.md`) accepted
- [ ] Audit Phase 1 — reported / refined / re-audited
- [ ] Audit Phase 2 — …
- [ ] Audit summary (`AUDIT_SUMMARY.md`) written

---

## Build progress

Status: `[ ]` not started · `[~]` in progress · `[x]` done

### Phase 1 — …

- [ ] …

### Phase 2 — …

- [ ] …

---

## Session log

| Date | Module | Summary | Left unfinished |
|------|--------|---------|-----------------|
| | | | |
