# Design system

UI rules for this project. Used by `/design-direction`, `/detect-ui`, `/critique-ui`, `/polish-ui`, `/motion-ui`, `/audit-ds`, `/audit-campaign-ds`, and UI build steps.

Filled during `/setup` Stage 7 (design wing): **Visual direction** + product + user flow + architecture + **one** chosen component library (or Owner custom) + optional guidelines.

**Status:** stub | drafting | accepted | n/a  
**Chosen library:** none | [catalog id] | owner-custom  
**Guidelines cited:** —

---

## Visual direction

**Status:** stub | drafting | accepted | n/a  
**Page mode:** persuade | operate | read | mixed | —

Set or refresh with `/design-direction`. Owner Accept required before it sticks. Ban empty words (*clean / modern / premium / sleek / minimal* alone).

- **Product:** what this UI is for (one line)
- **Character:** personality / tone (concrete adjectives; not empty praise)
- **World:** materials, light, density, era — the place the UI lives in
- **Moments:** one or two memorable content moments (where richness goes)
- **Signature:** one distinctive visual habit (type, color move, layout quirk)
- **Bans:** project-specific never-dos (plus constitution craft floor)

---

## Principles

…

## Chosen system

- **Library / source:** …
- **Why this choice:** …
- **Forbidden:** do not introduce a second component library (e.g. mixing MUI + shadcn)

## Tokens

Colors, typography, spacing, radius…

## Component usage

Approved primitives / patterns from the chosen system. When to use what.

…

## Motion

**Status:** stub | drafting | accepted | n/a  

Filled/refined by `/motion-ui` (and Stage 7 draft). Prefer **no motion** unless purpose is clear. Sync here when Owner accepts durable motion rules.

- **Default:** none — earn every animation  
- **Allowed purposes:** feedback | spatial | state | prevent-jar | explanation | delight  
- **Tool preference:** CSS transition → starting-style / view transition → keyframes → WAAPI → library (Owner-gated)  
- **Properties:** transform / opacity preferred; no layout thrash for motion; never scale(0)-only show/hide  
- **Feel:** UI usually &lt;300ms; no ease-in on enter/feedback; interruptible when re-triggered often  
- **A11y:** honor `prefers-reduced-motion`; hover must not be the only signal  
- **Never:** decorative loops on chrome; motion on 100+/day keyboard paths; ignore reduced-motion  

## Accessibility

…

## Do / don’t

…

## Provenance

| Lane | Id / label | URL or path | Installed? |
|------|------------|-------------|------------|
| library / guideline / owner | | | |
