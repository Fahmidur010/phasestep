---
name: phasestep-ensure-install
description: >
  Ensure a Phasestep project is installed in the workspace before delivery commands.
  Use when phasestep.json is missing, the user installed the Phasestep plugin, or they ask
  to start Phasestep / setup without running npm.
---

# Ensure Phasestep install

1. Look for `phasestep.json` or `phasegate.json` at the workspace root.
2. If **found** → report `Phasestep: installed` and stop (or continue the caller's command).
3. If **missing** → scaffold from this plugin's `scaffold/` bundle (see `scaffold/SCAFFOLD.md`), skipping existing files. Do **not** require `npx phasestep init`.
4. Then continue with `/setup` stages (or the command the user invoked).
