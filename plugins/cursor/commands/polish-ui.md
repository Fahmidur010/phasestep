---
name: polish-ui
description: Ordered craft polish pass — keep accepted Visual direction
argument-hint: [target?]
---

> **Install check:** If the workspace has no `phasestep.json` (or legacy `phasegate.json`), run **`/setup` first** — it scaffolds the project in-repo (same shape as `npx phasestep init`). If the file exists, the project is **already installed**; continue. Never require a separate terminal init when the Phasestep plugin is active.

Run an ordered **craft polish** pass on a UI target. Keep the accepted **Visual direction**; do not invent a new brand mid-pass.

`$ARGUMENTS` = target (route, screen, component path, or phase slug). If empty → ask once, or use current phase UI Files checklist.

## Required reading

1. [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) — Visual direction + tokens / components
2. Constitution craft floor (§1 Design wing)
3. Recent `/detect-ui` / `/critique-ui` findings for this target if present in chat
4. Phase plan when scoped to a build phase — stay inside Files checklist unless Owner expands scope

If Visual direction is missing/stub on a UI product → **STOP**:

```text
No accepted Visual direction:
1. Run /design-direction first
2. Polish against craft floor only (limited)
3. Cancel
```

## Intensity gate (before edits)

From a quick look (or critique):

```text
Polish intensity:
1. Light — spacing / type / chrome only (no layout rethink)
2. Standard — full ordered passes below
3. Heavy — direction may be weak; confirm direction still Accept first
4. Cancel
```

- **3** → if direction feels wrong, prefer `/design-direction refresh` before large edits.
- Do not start a full redesign under “polish.”

## Ordered passes (apply in order)

Only touch what the intensity allows. Prefer the **chosen component library**; never add a second kit.

1. **Spacing** — consistent rhythm; kill accidental uneven gaps  
2. **Color / chrome** — quiet frames; tokens over one-off hex; remove glow/slop chrome  
3. **Type** — hierarchy, measure, weight; no decorative gradient text  
4. **Layout** — alignment, density; one clear primary action  
5. **Details** — states, icons (no emoji-as-icons), focus, empty/error  

Motion is **out of scope** here — note candidates and soft-offer `/motion-ui` after; do not invent heavy animation in polish.

## Mid-pass rules

- Follow **Moments** / **Signature** from Visual direction — put richness there, not on every card  
- Craft floor bans always apply  
- If behavior changes → update Behavior delta / Trace on the owning step (same rules as mid-phase absorb)  
- If too large for this step → Side-work size STOP in [`refine-phase`](./refine-phase.md)

## After edits

1. Run `npm run build` — fix until pass  
2. Short report: what changed per pass; what was skipped  
3. **STOP — Next actions** (numbered; Owner replies with a number; **run the chosen workflow in this session**). Omit inapplicable options and renumber:

```text
After polish:
1. Detect — /detect-ui [target] (re-scan AS-* after edits)
2. Motion — /motion-ui [target] (if motion candidates noted)
3. Critique — /critique-ui [target]
4. Verify — /verify-phase PHASE STEP (when returning to delivery verify)
5. Audit design — /audit-ds PHASE (when in a DS audit loop)
6. Land work — /pr-step update
7. Done for now
```

## Do not

- Replace Visual direction silently
- Mix component libraries
- Ship nested card chrome / kickers / emoji-icons “for polish”
- Ask the Owner to type `/pr-step` — offer it as a numbered choice above
