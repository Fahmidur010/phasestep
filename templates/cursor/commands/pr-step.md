---
description: Git handoff — update current work (Simple→main / GitFlow→develop) + GitFlow release/main/hotfix
argument-hint: [update|release|main|bugfix|hotfix …]
---

Automate Phasestep **git handoff** for the selected workflow (`phasestep.json` → `github.workflow`).

**Owner intent:** Running `/pr-step` **authorizes** the agent to `git add`, `git commit`, `git push`, and merge as needed for that verb. Do **not** ask the Owner to commit manually first, and do **not** insert Gate A/B/C Accept stops for each step.

**Day-to-day (both modes):** `/pr-step update` (or bare `/pr-step`) — commit **current** work and land it on the integration branch (Simple → `main`/`master`; GitFlow → `develop`).

`/build-phase` and `/refine-phase` still do **not** commit on their own — this command is the standard commit path.

## Shared preconditions

1. Prefer GitHub already linked via `/github-connect` (check `{{PROGRESS}}` for `GitHub: connected`, or `phasestep.json` `github.repo`). If **not** linked → **STOP**:

```text
GitHub is not connected for this project:
1. Run /github-connect now, then re-run /pr-step
2. Continue with manual git/PR checklist (agent prints steps; no git/gh automation)
3. Cancel
```

2. `git` and `gh` available; `gh auth status` OK — else **STOP** (fail soft):

```text
GitHub tooling not ready:
1. Install/auth checklist — /github-connect (or install git + gh, then gh auth login), then re-run /pr-step
2. Continue with manual git/PR checklist only (no automation)
3. Cancel
```

3. Read `github.workflow`. If **unset** → same **Git workflow** STOP as `/github-connect` (Simple / GitFlow / Decide later). After Simple or GitFlow, continue. If Decide later → stop.

## Shared safety

1. **Do not** force-push `main`, `develop`, or `release` (or the default branch)
2. Prefer `git merge --no-ff` when landing onto integration / promotion branches
3. Use `git` / `gh` with network as needed for pull / push
4. Never update git config; never `--no-verify` unless Owner explicitly asks in this chat
5. Do **not** commit secrets (`.env`, credentials, keys). If such files are dirty → **stop** and warn
6. After finishing, report: commit hash(es), branches touched, pushes, deletes, current checkout
7. No deploy/hosting recipes here — branch topology only (project Actions may react to pushes)

## Shared: ensure committed + pushed on current branch

Run **before** merge steps when the working tree is dirty **or** the branch is ahead of its remote.

1. Inspect in parallel: `git status`, `git diff` / staged, recent log, current branch
2. If dirty → stage shippable files (exclude secrets); draft a short **why** commit message; `git commit`
3. `git push -u <remote> HEAD` (default remote from `github.remote` / `origin`)
4. If push rejected (remote ahead) → pull/rebase or merge, resolve, push again — **no** force-push on shared branches

**Resolve “current work”** (for messages / branch naming / PROGRESS):

1. [`{{PROGRESS}}`](../../{{PROGRESS}}) **Phase health (resume)** — Phase / Step / Status  
2. Else current branch name  
3. Else one-line Owner note if needed  

Prefer verified / phase-complete work, but **do not** block the handoff with a verify gate — invoking `/pr-step` is consent to ship what’s on the branch.

### Slugify helper

When Owner passes free text after a verb (e.g. `hotfix login timeout on live`):

1. Lowercase; replace non-alphanumeric runs with `-`; trim `-`
2. Prefer short slug (≤48 chars); keep meaning
3. Branch = `hotfix/<slug>` or `bugfix/<slug>`

---

# Mode: Simple PR (`github.workflow` = `simple`)

Trunk-style: land current work onto the **default branch** (`main`/`master`).  
`/pr-step release`, `/pr-step main`, `/pr-step bugfix`, and `/pr-step hotfix` are **GitFlow-only** — if invoked here, remind Owner and offer `/github-connect` to switch workflow.

## Parse (Simple)

| Args | Action |
|------|--------|
| *(empty)* or `update` | Commit + push current branch → merge into default → report |
| anything else | Treat as `update` (ignore extras; no phase/step command shape) |

## Procedure: `update`

1. Detect default branch (`main`/`master`).
2. If on default already with dirty tree → commit + push on default (still no force). Prefer a short-lived branch when Phase health suggests a phase/step name: `phasestep/phase-N-step-S` or `phasestep/phase-N` or `phasestep/update-YYYYMMDD`.
3. Run **Shared: ensure committed + pushed** on the working branch.
4. Checkout default; pull; `git merge --no-ff <working-branch>`; push default.
5. Optionally delete the working branch locally + remote after successful merge (ask once only if unclear whether to keep it).
6. PROGRESS:

```text
GitHub PR: update [phase N step S] → main — branch … — status merged — date
```

(Use “merged” even when merge was local `--no-ff` + push; note method in the report.)

7. Suggest next Phasestep command as appropriate.

---

# Mode: GitFlow (`github.workflow` = `gitflow`)

Phasestep GitFlow (release-as-live — not classic “main = production”):

```text
feature/* · bugfix/*
        └─► develop ─► release (live / deploy line) ─► main (stable baseline)
                         ▲
              hotfix/* ──┴── merge hotfix → release + develop
```

| Branch | Role |
|--------|------|
| `develop` | Day-to-day integration |
| `release` | **Live / deploy line** (what production tracks in automated setups) |
| `main` | Stable baseline snapshot — update with `/pr-step main` when a cut is fully stable |
| `bugfix/*` | Non-live fixes from `develop` → land on `develop` |
| `hotfix/*` | Live fixes from `release` → land on `release` **and** `develop` |

## Parse (GitFlow)

| Verb | Aliases | Action |
|------|---------|--------|
| `update` | `develop` | Commit + push → merge into `develop` → delete old branch → open next feature branch |
| `release` | — | Merge `develop` → `release` and push (promotes to live line) |
| `main` | `promote` | Merge `release` → `main` (+ optional tag) — baseline sync, not the live firehose |
| `bugfix` | — | Non-live: branch from `develop`, fix, land on `develop` (same session or finish later) |
| `hotfix` | — | **Live issue:** branch from `release`, fix, land on `release` **and** `develop` — no extra `/pr-step` needed |

*(empty)* → `update`. Unknown verb → stop and show this table.

### Slugs

- Next feature after `update`: ask for descriptive slug if missing → `feature/phase-<slug>`
- `bugfix …` / `hotfix …` → slugify remaining args (see Slugify helper). Keep the Owner’s issue text as the fix brief.

If `develop` / `release` missing → create from default **with Owner confirmation** (same idea as `/github-connect` bootstrap), then continue.

---

## Verb: `update` (alias `develop`)

1. Current branch must be `feature/*` or `bugfix/*` (else stop — or create `feature/phase-<slug>` from `develop` if Owner is starting the handoff from develop with a named slug).
2. Record `OLD_BRANCH`; run **Shared: ensure committed + pushed**.
3. Resolve **next** branch: Owner slug / `feature/phase-<slug>` — if missing and current is already named, **ask** (do not invent).
4. Checkout `develop`; pull; `git merge --no-ff OLD_BRANCH`; push `develop`.
5. Delete `OLD_BRANCH` local + remote; checkout/create next feature branch; `git push -u`.
6. On merge conflict → stop with conflict paths; do not force.
7. PROGRESS: `GitHub PR: update <OLD_BRANCH> → develop — status merged — date`
8. Soft-remind: `/pr-step release` when promoting to the live/`release` line.

---

## Verb: `release`

1. Invoking `/pr-step release` **is** consent to commit/push if needed and update `release` (the **live / deploy** line).
2. If dirty or ahead → **Shared: ensure committed + pushed** on current branch; if still on `feature/*`, land via update steps onto `develop` first (or stop and tell Owner to `/pr-step update`).
3. Checkout `develop`; pull; checkout `release`; pull; `git merge --no-ff develop`; push `release`.
4. PROGRESS: `GitHub: release promoted — develop → release — date`
5. **Soft-remind (required in the end report):**  
   `release` is now the live line. When this cut is **fully stable**, run `/pr-step main` so `main` stays the production-ready baseline. Do not skip that forever.  
   Do **not** run project deploy scripts unless Owner asks outside this contract (pushes may trigger their Actions).

---

## Verb: `main` (alias `promote`)

1. Invoking `/pr-step main` **is** consent to merge `release` → `main`/`master` (ask once if default name unclear). This updates the **stable baseline**, not a substitute for hotfixing live (`release`).
2. Checkout `release`; pull; checkout `main`; pull; `git merge --no-ff release`; push `main`.
3. Optional tag: ask once for `vX.Y.Z` or skip.
4. PROGRESS: `GitHub: main promoted — release → main — tag … — date`
5. Never force-push.

---

## Verb: `bugfix [issue…]`

Non-live defect on work that is **not** on the live `release` line.

1. Slugify remaining args → `bugfix/<slug>` (if missing, ask once for a short name + issue brief).
2. From `develop`: create/checkout branch; push `-u`.
3. Implement the fix from the Owner’s issue brief (minimal change). Prefer a quick Owner confirm if behavior is product-facing.
4. When fixed: **Shared: ensure committed + pushed**; checkout `develop`; pull; `git merge --no-ff bugfix/<slug>`; push `develop`; delete bugfix branch local + remote.
5. PROGRESS: `GitHub: bugfix <slug> → develop — status merged — date`
6. No need for a second `/pr-step update` when the fix completes in this run. If the fix spills to another session, stay on the bugfix branch and re-run `/pr-step bugfix` (or `/pr-step update` while on that branch) to finish the land.

---

## Verb: `hotfix [issue…]`

**Live production issue** (app already on `release`).

Invoking `/pr-step hotfix …` **authorizes the full path**: create branch from `release` → fix → merge into **`release` and `develop`**. Owner does **not** need `/pr-step update` or `/pr-step release` afterward for the same fix.

1. Parse remaining args as **issue brief** + slugify → `hotfix/<slug>`. If no args → ask once: short name + what’s broken on live.
2. Checkout `release`; pull.
3. If not already on a matching `hotfix/*` branch → create/checkout `hotfix/<slug>` from `release`; push `-u`.
4. Implement the fix for the stated issue (minimal, targeted). Prefer Owner confirm if UAT-sensitive.
5. When the fix is done (same session):
   - **Shared: ensure committed + pushed** on the hotfix branch
   - Checkout `release`; pull; `git merge --no-ff hotfix/<slug>`; push `release` (live line updated — project deploy may run)
   - Checkout `develop`; pull; `git merge --no-ff hotfix/<slug>` (or merge the same commits / merge release into develop if that’s cleaner and conflict-free); push `develop`
   - Delete `hotfix/<slug>` local + remote after both lands succeed
6. On conflict → stop with paths; do not force; leave hotfix branch for resume.
7. PROGRESS:

```text
GitHub: hotfix <slug> → release + develop — status merged — date
```

8. Soft-remind: when live is stable again, `/pr-step main` to sync the baseline.
9. **Resume:** if already on `hotfix/*` with a completed fix from a prior turn, re-running `/pr-step hotfix` (with or without args) finishes steps 5–8 only — do not reinvent the issue.

---

## Hard rules

1. Invoking the matching `/pr-step` verb authorizes the git writes for that verb — no Gate A/B/C.
2. Still **STOP** for: not connected, tooling missing, workflow unset, secrets in the dirty set, merge conflicts, missing slug/issue when required.
3. Fail soft without `gh`/auth — checklist, not fake success.
4. No force-push; no token files; no GitHub Issues/Projects automation.
5. No deploy/hosting install in this command.
6. GitFlow: **live = `release`**; **baseline = `main`**; hotfix from `release` → `release` + `develop`.
