---
name: critique-ui
description: Ranked UX/visual critique — findings only; no silent rewrite
argument-hint: [target?]
---

> **Install check:** If the workspace has no `phasestep.json` (or legacy `phasegate.json`), run **`/setup` first** — it scaffolds the project in-repo (same shape as `npx phasestep init`). If the file exists, the project is **already installed**; continue. Never require a separate terminal init when the Phasestep plugin is active.

Perform a **read-only** UX / visual critique for a UI target. **Do not modify application files.**

`$ARGUMENTS` = target (route, screen name, component path, or phase slug). If empty → ask once what to critique, or use the current phase’s UI Files checklist.

## Soft-offer before critique

If `/detect-ui` has not just run this chat for the same target, **STOP** once (optional; numbered; **run on pick**):

```text
Before /critique-ui:
1. Detect first — /detect-ui [target], then return to /critique-ui
2. Proceed with /critique-ui now
3. Skip soft-offer
```

## Required reading

1. [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) — **Visual direction** + tokens / components / do-don’t
2. Constitution craft floor (§1 Design wing)
3. Recent `/detect-ui` findings for this target if present in chat
4. [`docs/product.md`](docs/product.md) / [`docs/USER_FLOW.md`](docs/USER_FLOW.md) for job-of-the-screen
5. Phase plan when target is a build phase: [`docs/phase-plans/`](docs/phase-plans/)

If Visual direction is missing/stub on a UI product → **STOP**:

```text
No accepted Visual direction:
1. Direction first — /design-direction (run in this session), then return here
2. Critique against craft floor only (weaker)
3. Cancel
```

## Checks (ranked)

Score each finding **P0** (blocks trust / primary job) · **P1** (clear craft/DS miss) · **P2** (polish).

Cover at least:

| Area | Ask |
|------|-----|
| **Direction fit** | Matches Character / World / Moments / Signature? Or generic AI default? |
| **Craft floor / detect** | Carry forward open `AS-*` hits; kickers, nested cards, emoji-icons, purple-glow / AI beige, empty “premium” chrome? |
| **Hierarchy** | Can a new user find the primary action in 3 seconds? |
| **Spacing / type** | Uneven gaps, cramped measure, random font sizes? |
| **States** | Empty / loading / error / disabled considered? |
| **DS conformance** | Wrong primitives, hard-coded colors where tokens exist? |
| **A11y smoke** | Contrast, hit targets, focus — flag obvious misses |

## Report shape

```markdown
## Critique — [target]
**Direction status:** accepted | craft-floor-only | n/a
**Summary:** one sentence

| Pri | Finding | Where | Suggested fix |
|-----|---------|-------|---------------|
| P0 | … | `path` / region | … |
| P1 | … | … | … |

**Counts:** P0= · P1= · P2=
```

## Soft-offer after report (required STOP)

Numbered; Owner replies with a number; **run the chosen workflow in this session**. Omit inapplicable options and renumber.

```text
After critique:
1. Detect — /detect-ui [target] (AS-* anti-slop first)
2. Polish — /polish-ui [target]
3. Refine step — /refine-phase <slug>
4. Audit design — /audit-ds <slug>
5. Direction — /design-direction refresh (only if direction itself is wrong)
6. Done for now
```

## Do not

- Rewrite UI in this command (no “while I’m here” edits)
- Invent a new Visual direction silently — offer numbered `/design-direction` above
- Soften P0s into nits to avoid Owner friction
- Recommend external design tools or live/preview modes
- Leave bare “Next: `/…`” for the Owner to type
