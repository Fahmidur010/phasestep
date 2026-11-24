---
description: Set or refresh Visual direction in DESIGN_SYSTEM.md (Owner Accept)
argument-hint: [refresh?]
---

Set or refresh **Visual direction** for this project (Phasestep design wing). **Docs only** — no application code.

Writes into [`{{DESIGN_SYSTEM}}`](../../{{DESIGN_SYSTEM}}) under **Visual direction**. Does **not** invent a second product doc.

`$ARGUMENTS` may be `refresh` (or empty = set / complete if stub).

## When to run

- `/setup` Stage 7 (UI products) before or with DS draft
- UI work starts and Visual direction is missing / stub / rejected
- Owner wants a new look (refresh) without abandoning the design wing

**Non-UI:** if Stage 7 already recorded **N/A**, say so and stop unless Owner is adding UI now.

## Required reading

1. [`{{PRODUCT_SPEC}}`](../../{{PRODUCT_SPEC}})
2. [`{{USER_FLOW}}`](../../{{USER_FLOW}}) if present
3. [`{{ARCHITECTURE}}`](../../{{ARCHITECTURE}}) if present
4. [`{{DESIGN_SYSTEM}}`](../../{{DESIGN_SYSTEM}}) — current Visual direction + Chosen system
5. Constitution craft floor (§1 Design wing)

## Process

### 1 — Context

From product + flow, name the primary surfaces and **page mode** (`persuade` | `operate` | `read` | `mixed`).

If Owner already has brand rules / Figma / tokens → note them; direction must fit, not fight them.

### 2 — Propose direction (2–3 options when inventing)

Propose **2–3** distinct directions when Visual direction is empty or Owner asked for options. Each option is five concrete lines — **no** empty words (*clean / modern / premium / sleek / minimal* alone):

```markdown
**Direction A — [short label]**
- **Product:** …
- **Character:** …
- **World:** …
- **Moments:** …
- **Signature:** …
- **Page mode:** …
- **Bans:** …
```

If refreshing with a clear Owner brief → one proposed direction is enough (still STOP for Accept).

### 3 — Owner gate

```text
Visual direction:
1. Accept option A (or the single proposal)
2. Accept option B
3. Accept option C (if offered)
4. Edit — Owner will steer; restate and STOP again
5. Re-roll — new options (after two re-rolls, ask what quality is missing)
```

On **Accept**: write **Visual direction** into `{{DESIGN_SYSTEM}}` (Status `accepted`; fill Product / Character / World / Moments / Signature / Page mode / Bans). Keep Chosen system / tokens unless Owner also asked to change them.

On refresh Accept: replace the Visual direction section; note date in [`{{PROGRESS}}`](../../{{PROGRESS}}) design log.

### 4 — Soft next

- If Stage 7 incomplete → continue `/setup` (library + full DS accept)
- If building UI → remind agent to follow accepted direction + craft floor
- Optional: `/detect-ui` / `/polish-ui` / `/critique-ui` / `/motion-ui` after screens exist

## Do not

- Skip Owner Accept
- Write application UI in this command
- Mix a second component library while setting direction
- Treat library pick as a substitute for Visual direction
