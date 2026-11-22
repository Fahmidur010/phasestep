---
description: Connect this project to GitHub (gh auth + remote) — no commit; choose Simple or GitFlow
argument-hint: [repo-url?]
---

Connect or refresh **GitHub** for this Phasestep project so `/pr-step` can hand off work. **Docs/config only for product code — no application commit.** Branch create/push is allowed **only** when Owner Accepts GitFlow bootstrap.

`$ARGUMENTS` may be a repo URL (`https://github.com/org/repo` or `org/repo`) or empty (detect existing `origin`).

## Preflight

1. Is `git` available? If not → **STOP** with install notes; cannot connect.
2. Is [`gh`](https://cli.github.com/) (GitHub CLI) available?
   - Missing → **STOP** once:

```text
GitHub CLI (gh) is required for Phasestep GitHub automation.
1. Install gh, then re-run /github-connect
2. Skip for now — continue without GitHub automation (manual git/PR)
```

3. Run `gh auth status` (or equivalent). If not logged in → **STOP**:

```text
gh is not authenticated.
1. Run gh auth login (Owner), then re-run /github-connect
2. Skip for now
```

Never store PATs in the repo or in Phasestep config. Owner authenticates via `gh` on their machine.

## Detect current state

1. Read `git remote -v` and default branch (`origin/HEAD` or `gh repo view` when possible).
2. Read [`phasestep.json`](../../phasestep.json) `github` object if present (`remote`, `repo`, `workflow`).
3. Read [`{{PROGRESS}}`](../../{{PROGRESS}}) for `GitHub: connected` and `GitHub workflow:` lines.
4. Note whether remote branches `develop` / `release` exist (for GitFlow bootstrap later).

## STOP — connect

Present findings (remotes, auth, pasted URL if any, current `github.workflow` if set), then:

```text
GitHub connect:
1. Connect / update — set origin (and phasestep.json github) from URL or detected remote
2. Use existing origin as-is — record in PROGRESS + config only
3. Change git workflow only — keep remote; jump to Git workflow STOP
4. Skip for now
```

### On 1. Connect / update

1. If Owner pasted `owner/repo` or URL → normalize to `owner/repo`.
2. If no `origin` → `git remote add origin <url>` (HTTPS or SSH as Owner prefers; ask once if unclear).
3. If `origin` exists and differs → **STOP** once: Keep current | Replace origin URL | Cancel.
4. Update `phasestep.json` `github.remote` / `github.repo` (preserve existing `workflow` if set).
5. Append to `{{PROGRESS}}`:

```text
GitHub: connected — owner/repo (origin) — YYYY-MM-DD
```

6. Confirm with `gh repo view` when network allows; if it fails, still record config and note verification failed.
7. Continue to **STOP — Git workflow** (unless Owner chose option 3 only and already has workflow — still show if they want to change).

### On 2. Use existing

Record `github.remote` / `github.repo` from current `origin` + PROGRESS connected line. No remote mutation. Continue to **STOP — Git workflow**.

### On 3. Change git workflow only

Skip remote changes. Jump to **STOP — Git workflow**.

### On 4. Skip

Record nothing required. Remind: `/pr-step` will fail soft until connect succeeds.

## STOP — Git workflow

Run after Connect / Use existing / Change workflow (not after Skip).

Skip this STOP only if `github.workflow` is already `simple` or `gitflow` **and** Owner did not choose “Change git workflow” / did not ask to revisit.

Present this numbered gate (include the explanations):

```text
Git workflow:
1. Simple PR — short-lived branch → merge into default branch (main/master).
   Best for solo / small apps / trunk-style teams.
   Day-to-day: /pr-step update (or bare /pr-step) — commit + push + merge into main.
   Invoking /pr-step authorizes those git writes (no Gate A/B/C).

2. GitFlow — feature/* → develop → release (live) → main (baseline).
   Common production pattern with automated deploy from release.
   - develop = ongoing integration
   - release = live / deploy line (what production tracks)
   - main = stable baseline — sync with /pr-step main when a cut is fully stable
   Day-to-day: /pr-step update → land on develop
   Promote live: /pr-step release (then remind /pr-step main when stable)
   Live bug: /pr-step hotfix <issue> → fix → release + develop (one command)
   Non-live bug: /pr-step bugfix <issue> → fix → develop (one command; not for live)
   Invoking /pr-step authorizes those git writes (no Gate A/B/C).

3. Decide later — leave workflow unset; /pr-step will ask again before git writes.
```

### On 1. Simple PR

1. Set `phasestep.json` → `github.workflow`: `"simple"`.
2. Append `GitHub workflow: simple — YYYY-MM-DD` to `{{PROGRESS}}`.
3. Remind: `/pr-step update` after verify / complete.

### On 2. GitFlow

1. Set `phasestep.json` → `github.workflow`: `"gitflow"`.
2. Append `GitHub workflow: gitflow — YYYY-MM-DD` to `{{PROGRESS}}`.
3. If remote (or local) `develop` / `release` are missing → **STOP — GitFlow branches**:

```text
GitFlow branches:
1. Create develop + release from current default and push -u
2. I already have them — record only
3. Cancel workflow choice (clear github.workflow / leave unset)
```

   - On **1**: from default branch (`main`/`master`), create `develop` and `release` if missing; `git push -u <remote> develop` and `release`. No app-file commits.
   - On **2**: record only; do not invent missing branches.
   - On **3**: remove `github.workflow` (or leave unset); note in PROGRESS that GitFlow was cancelled.

4. Remind verbs: `/pr-step update`, `/pr-step release` (live line), `/pr-step main` (baseline when stable), `/pr-step hotfix <issue>` (live), `/pr-step bugfix <issue>` (non-live).  
   Deploy/hosting Actions stay project-local — Phasestep does not install deploy workflows.

### On 3. Decide later

Do **not** set `github.workflow`. Remind: first `/pr-step` will re-show this Git workflow STOP.

## Hard rules

1. Never commit application code in this command.
2. Never force-change remotes without Owner Accept (option 1 + replace confirm).
3. Never invent credentials or write tokens to disk via Phasestep.
4. Empty brand-new folder with only a URL: tell Owner to `git clone` first (or init a repo), then re-run — do **not** clone over an existing filled project.
5. Changing workflow later: re-run `/github-connect` and choose **3. Change git workflow only** (or Connect again).
6. No deploy/hosting recipes here — branch topology only.
