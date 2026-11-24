---
description: Ranked UX/visual critique — findings only; no silent rewrite
argument-hint: [target?]
---

Perform a **read-only** UX / visual critique for a UI target. **Do not modify application files.**

`$ARGUMENTS` = target (route, screen name, component path, or phase slug). If empty → ask once what to critique, or use the current phase’s UI Files checklist.

## Soft-offer before critique

If `/detect-ui` has not just run this chat for the same target, **STOP** once (optional):

```text
Before /critique-ui:
1. /detect-ui first — fixed AS-* anti-slop, then return to /critique-ui
2. Proceed with /critique-ui now
3. Skip soft-offer
```

## Required reading

1. [`{{DESIGN_SYSTEM}}`](../../{{DESIGN_SYSTEM}}) — **Visual direction** + tokens / components / do-don’t
2. Constitution craft floor (§1 Design wing)
3. Recent `/detect-ui` findings for this target if present in chat
4. [`{{PRODUCT_SPEC}}`](../../{{PRODUCT_SPEC}}) / [`{{USER_FLOW}}`](../../{{USER_FLOW}}) for job-of-the-screen
5. Phase plan when target is a build phase: [`{{PHASE_PLANS_DIR}}/`](../../{{PHASE_PLANS_DIR}}/)

If Visual direction is missing/stub on a UI product → **STOP**:

```text
No accepted Visual direction:
1. Run /design-direction first
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
**Next:**
- Anti-slop only → `/detect-ui [target]` then `/polish-ui`
- Fixes → `/polish-ui [target]` and/or `/refine-phase <slug>`
- DS drift → `/audit-ds <slug>` after polish
```

## Do not

- Rewrite UI in this command (no “while I’m here” edits)
- Invent a new Visual direction silently — use `/design-direction`
- Soften P0s into nits to avoid Owner friction
- Recommend external design tools or live/preview modes
