---
description: Connect this project to GitHub (gh auth + remote) — no commit
argument-hint: [repo-url?]
---

Connect or refresh **GitHub** for this Phasestep project so `/pr-step` can open PRs. **Docs/config only — no application code, no commit, no push, no merge.**

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
2. Read [`phasestep.json`](../../phasestep.json) `github` object if present (`remote`, `repo`).
3. Read [`{{PROGRESS}}`](../../{{PROGRESS}}) for an existing `GitHub: connected` line.

## STOP — connect

Present findings (remotes, auth, pasted URL if any), then:

```text
GitHub connect:
1. Connect / update — set origin (and phasestep.json github) from URL or detected remote
2. Use existing origin as-is — record in PROGRESS + config only
3. Skip for now
```

### On 1. Connect / update

1. If Owner pasted `owner/repo` or URL → normalize to `owner/repo`.
2. If no `origin` → `git remote add origin <url>` (HTTPS or SSH as Owner prefers; ask once if unclear).
3. If `origin` exists and differs → **STOP** once: Keep current | Replace origin URL | Cancel.
4. Update `phasestep.json`:

```json
"github": {
  "remote": "origin",
  "repo": "owner/repo"
}
```

5. Append to `{{PROGRESS}}`:

```text
GitHub: connected — owner/repo (origin) — YYYY-MM-DD
```

6. Confirm with `gh repo view` when network allows; if it fails, still record config and note verification failed.

### On 2. Use existing

Record `github.remote` / `github.repo` from current `origin` + PROGRESS line. No remote mutation.

### On 3. Skip

Record nothing required. Remind: `/pr-step` will fail soft until connect succeeds.

## Hard rules

1. Never commit, push, or merge in this command.
2. Never force-change remotes without Owner Accept (option 1 + replace confirm).
3. Never invent credentials or write tokens to disk via Phasestep.
4. Empty brand-new folder with only a URL: tell Owner to `git clone` first (or init a repo), then re-run — do **not** clone over an existing filled project.
