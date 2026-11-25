---
description: Motion craft pass — decide if/why/how, then implement (Owner-gated)
argument-hint: [target?]
---

Run a **motion craft** pass on a UI target. Prefer **no motion** unless purpose is clear. Keep accepted **Visual direction** and the **Motion** section of the design system.

`$ARGUMENTS` = target (route, screen, component path, or phase slug). If empty → ask once, or use current phase UI Files checklist.

## Required reading

1. [`{{DESIGN_SYSTEM}}`](../../{{DESIGN_SYSTEM}}) — Visual direction + **Motion** + tokens
2. Constitution craft floor (§1 Design wing) — quiet chrome; reduced-motion respectful
3. Recent `/critique-ui` / `/polish-ui` notes for this target if present
4. Phase plan when scoped to a build phase — stay inside Files checklist unless Owner expands

If Visual direction is missing/stub on a UI product → **STOP**:

```text
No accepted Visual direction:
1. Run /design-direction first
2. Motion craft-floor only (limited — prefer none)
3. Cancel
```

## Decision tree (before any motion code)

Walk **in order**. Skip to Cancel if a gate fails.

### 1 — Should it move at all?

- High-frequency / keyboard-heavy / 100+ times per day controls → **default never**
- Decorative motion with no job → **refuse**
- If unsure → prefer none

```text
Motion — animate?
1. Yes — continues (name purpose next)
2. No — leave as-is / remove existing excess motion
3. Cancel
```

### 2 — Purpose (one word)

Pick **one**: `feedback` | `spatial` | `state` | `prevent-jar` | `explanation` | `delight`

If you cannot name one cleanly → **do not animate**.

### 3 — Cheapest tool that works

Prefer in order:

1. CSS `transition`  
2. CSS `@starting-style` / view transitions when appropriate  
3. CSS `@keyframes`  
4. WAAPI  
5. Motion library (only if already in project or Owner accepts adding it)

Do **not** add a new animation dependency without Owner Accept.

### 4 — Properties & feel

- Animate **`transform` / `opacity`** (and compositor-friendly props) — avoid layout thrash (`top`/`left`/`width`/`height` for motion)
- Never `scale(0)` as the only show/hide trick  
- Transform origin at the trigger when spatial  
- UI duration usually **&lt; 300ms**; no `ease-in` on enter/feedback (prefer ease-out / standard curves / springs when gesture-driven)
- Interruptible when rapid re-trigger is likely; exits should not strand mid-state  

### 5 — Reduced motion & hover

Ship with the animation:

- `prefers-reduced-motion: reduce` → shorten or disable non-essential motion  
- Hover-only effects must not be the only way to understand state  

## Intensity / scope gate

```text
Motion scope:
1. Light — one control / one transition
2. Standard — screen’s primary interactions
3. Heavy — choreography across regions (confirm purpose list first)
4. Cancel
```

Do not invent a motion system under a “light” pass.

## Implement

1. Apply only what the tree approved  
2. Prefer chosen component library motion primitives if they exist  
3. If behavior changes → update Behavior delta / Trace (mid-phase absorb rules)  
4. If too large → Side-work size STOP in [`refine-phase`](./refine-phase.md)  
5. Sync durable choices into [`{{DESIGN_SYSTEM}}`](../../{{DESIGN_SYSTEM}}) **Motion** (purposes allowed, never-dos, default duration) — docs only for that sync; Owner sees the delta in the report  

## After edits

1. Run `{{BUILD_COMMAND}}` — fix until pass  
2. Report: purpose · tool · what moved · what was refused · DS Motion sync  
3. **STOP — Next actions** (numbered; Owner replies with a number; **run the chosen workflow in this session**). Omit inapplicable options and renumber:

```text
After motion:
1. Detect — /detect-ui [target] (re-scan AS-* if chrome/motion drifted)
2. Critique — /critique-ui [target]
3. Polish — /polish-ui [target] (if chrome/spacing drifted)
4. Verify — /verify-phase PHASE STEP
5. Audit design — /audit-ds PHASE
6. Land work — /pr-step update
7. Done for now
```

## Do not

- Animate everything “for polish”  
- Ignore reduced-motion  
- Replace Visual direction or add a second component kit  
- Ask the Owner to type `/pr-step` — offer it as a numbered choice above  
