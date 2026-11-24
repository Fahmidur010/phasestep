---
name: detect-ui
description: Anti-slop detector — fixed AS-* rules; findings only; no silent rewrite
argument-hint: [target?]
---

> **Install check:** If the workspace has no `phasestep.json` (or legacy `phasegate.json`), run **`/setup` first** — it scaffolds the project in-repo (same shape as `npx phasestep init`). If the file exists, the project is **already installed**; continue. Never require a separate terminal init when the Phasestep plugin is active.

Run a **read-only anti-slop detect** pass on a UI target. Apply the **fixed rule table** below — same rules every run. **Do not modify application files.**

`$ARGUMENTS` = target (route, screen name, component path, or phase slug). If empty → ask once what to scan, or use the current phase’s UI Files checklist.

This is the design wing **detector**. It does **not** replace `/critique-ui` (broader UX/visual review). Prefer detect first for slop hits, then critique for hierarchy / direction / a11y.

## Required reading

1. Constitution craft floor (§1 Design wing) — especially **Never ship (anti-slop)**
2. [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) — **Visual direction** Status + Bans + **Motion** (when present)
3. Phase plan when target is a build phase: [`docs/phase-plans/`](docs/phase-plans/)

If the product is non-UI (`docs/DESIGN_SYSTEM.md` Status `n/a`) → say so and stop (nothing to detect).

If Visual direction is missing/stub on a UI product → still run the table (craft-floor strength); note **Direction status: craft-floor-only**.

## Rule table (scan every applicable file)

Walk the target files once. For each rule, report a hit only when evidence is visible in code or rendered structure. Use the **stable ID** — do not renumber.

| ID | Detect when | Typical severity |
|----|-------------|------------------|
| **AS-01** | Decorative kicker / eyebrow / pill label above a headline with no product job | P1 |
| **AS-02** | Nested card-in-card chrome (card inside card for decoration) | P1 |
| **AS-03** | Emoji used as UI icons (toolbar, nav, empty-state glyph stand-in) | P1 |
| **AS-04** | Default AI look when direction is accepted — purple-glow, AI beige/cream+terracotta default, generic purple-indigo gradient theme | P0 if direction forbids; else P1 |
| **AS-05** | Gradient text used as decoration (not a single Signature move) | P1 |
| **AS-06** | Hero-metric / stat-strip template stacked without product reason | P1 |
| **AS-07** | Loud chrome / busy frames everywhere; Moments not concentrated (quiet-chrome inverted) | P1 |
| **AS-08** | Motion without named purpose, or essential motion ignoring reduced-motion | P1 |

Project **Bans** in Visual direction may add hits — label them `AS-BAN` with the ban text (still findings only).

Do **not** invent extra rule IDs in this pass. Broader UX issues → `/critique-ui`.

## Report shape

```markdown
## Detect — [target]
**Direction status:** accepted | craft-floor-only | n/a
**Summary:** one sentence (clean | N hits)

| ID | Pri | Where | Evidence | Suggested fix |
|----|-----|-------|----------|---------------|
| AS-01 | P1 | `path` / region | … | … |

**Counts:** hits= · P0= · P1= · P2=
**Clean rules:** AS-… (list IDs with no hit)
**Next:**
- Hits → `/polish-ui [target]` and/or `/refine-phase <slug>`
- Broader UX → `/critique-ui [target]`
- DS drift after fixes → `/audit-ds <slug>`
```

If zero hits → say **Clean** and still list **Clean rules** so the Owner sees the table was applied.

## Soft-offer after report

```text
After detect:
1. /polish-ui [target] — fix AS-* hits
2. /critique-ui [target] — broader UX/visual review
3. Done for now
```

## Do not

- Rewrite UI in this command
- Soften P0s to avoid friction
- Recommend external design tools or live/preview modes
- Expand into a full redesign under “detect”
