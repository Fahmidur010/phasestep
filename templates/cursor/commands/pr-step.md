---
description: Owner-gated branch, commit, PR, and optional merge via git + gh
argument-hint: [phase] [step?]
---

Run the **GitHub delivery handoff** for Phasestep work: branch → commit → push → PR → optional merge. Agent runs `git` / `gh`; **Owner Accepts every irreversible step** (numbered gates). Never silent commit/push/merge.

## Parse arguments

`$ARGUMENTS` is `PHASE` optionally followed by `STEP` (same as `/build-phase`).

- With **STEP** → scope to that step (branch `phasestep/phase-PHASE-step-STEP`)
- Without **STEP** → phase-level handoff (branch `phasestep/phase-PHASE`), typically after `/complete-phase`

## Preconditions

1. Prefer GitHub already linked via `/github-connect` (check `{{PROGRESS}}` for `GitHub: connected`, or `phasestep.json` `github.repo`). If **not** linked → **STOP**:

```text
GitHub is not connected for this project:
1. Run /github-connect now, then re-run /pr-step
2. Continue with manual git/PR checklist (agent prints steps; no git/gh automation)
3. Cancel
```

   On **1**: run `/github-connect` (or tell Owner to), then resume this command.  
   On **2**: print a short manual checklist (branch → commit → push → PR → merge); do **not** run `git`/`gh` write actions; end.  
   On **3**: stop.

2. Read [`{{PHASE_PLANS_DIR}}/phase-PHASE.md`](../../{{PHASE_PLANS_DIR}}/) — step/phase status, Files checklist, Behavior delta.
3. **Intent / verify:**
   - Step handoff: step should be **verified** and Behavior delta **accepted**. If `pending_owner_review` or unverified → **STOP**:

```text
Work is not ready for a normal PR:
1. Finish intent + /verify-phase first
2. Open Draft WIP PR anyway (Owner accepts incomplete verify)
3. Cancel
```

   - Phase handoff: phase should be **complete** (or Owner explicitly wants a PR for in-progress phase → same WIP options).

## Preflight (tooling)

1. `git` and `gh` available; `gh auth status` OK — else **STOP** (fail soft; no fake success):

```text
GitHub tooling not ready:
1. Install/auth checklist — point Owner to /github-connect (or install git + gh, then gh auth login), then re-run /pr-step
2. Continue with manual git/PR checklist only (no automation)
3. Cancel
```

2. `git status` — list staged/unstaged/untracked. Propose **include set** from phase plan Files checklist + clearly related changes. If unrelated junk is present → ask which paths to include; never commit the whole tree blindly.
3. Detect default branch (`main`/`master` via `gh repo view` or `origin/HEAD`).
4. Never `--force`, never `--no-verify` unless Owner explicitly asked in this chat (record that ask).

## Gate A — Branch + commit

Propose:
- **Branch name** (see Parse arguments; adjust if exists)
- **Commit message** (short why: phase/step title + one-line Behavior delta headline)
- **Paths to stage**

**STOP:**

```text
Gate A — branch + commit:
1. Accept — create/switch branch, stage listed paths, commit
2. Edit — message / branch / path list, then show Gate A again
3. Cancel
```

On **1**: create/switch branch; `git add` only agreed paths; commit with agreed message; show `git log -1` + status. Do **not** push yet.

## Gate B — Push + PR

Draft PR:
- **Title:** `[Phase PHASE]` step title or phase title
- **Body (Markdown):** summary; Behavior delta WHEN/THEN bullets (or “phase complete”); verify notes; links to phase plan / product if useful; checklist of out-of-scope

**STOP:**

```text
Gate B — push + PR:
1. Accept — push branch + create PR
2. Push only — no PR yet
3. Cancel
```

On **1**: `git push -u <remote> HEAD`; `gh pr create` (use `--draft` if Owner chose WIP earlier). Print PR URL.  
On **2**: push only; print branch remote URL.  
Never push unrelated local branches.

## Gate C — Merge (optional)

Only after a PR exists (this run or URL Owner provides).

1. `gh pr checks` (or status). If not green → report failures; **do not** merge; offer Wait / Cancel only (or re-run checks).
2. If green (or no checks configured and Owner still wants merge) → **STOP:**

```text
Gate C — merge:
1. Merge when ready (gh pr merge — follow repo default / squash if that is the remote default)
2. Wait — leave PR open
3. Cancel
```

On **1**: merge via `gh`; confirm result; optionally note local default-branch pull as Owner’s next manual step (do not auto-delete forks/policies Owner didn’t ask for).  
On **2**/**3**: stop.

**Never** merge without Gate C option **1**.

## After

1. Append to [`{{PROGRESS}}`](../../{{PROGRESS}}) (session log or GitHub section):

```text
GitHub PR: phase PHASE [step STEP] — branch … — PR <url> — status open|merged|pushed-only — date
```

2. Suggest next: continue `/build-phase` / `/plan-phase` / `/complete-phase` as appropriate.
3. Do not start the next phase unless Owner asks.

## Hard rules

1. Owner gates A/B/C are mandatory for those actions — numbers only is fine.
2. This command is the **standard** path for commit/push/PR/merge. `/build-phase` and `/refine-phase` still do not commit on their own.
3. Fail soft without `gh`/auth — checklist, not fake success.
4. No force-push; no token files; no GitHub Issues/Projects automation in v1.
