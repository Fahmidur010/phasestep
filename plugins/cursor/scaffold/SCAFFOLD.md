# Phasestep scaffold bundle

Agent: when `phasestep.json` is **missing**, copy these files into the **workspace root** (skip paths that already exist). Same outcome as `npx phasestep init`.

Do **not** tell the Owner to run terminal init when this plugin is installed.

## Copy map

| Bundle path | Workspace destination |
|-------------|------------------------|
| `phasestep.json` | `phasestep.json` |
| `docs/**` | `docs/**` (same relative paths) |
| `.phasestep/**` | `.phasestep/**` |

Optional (only if Owner wants repo-portable commands without the plugin):

| Bundle path | Destination |
|-------------|-------------|
| `commands/**` (from plugin `commands/`) | `.cursor/commands/**` and/or `.claude/commands/**` |

After copy, announce: `Phasestep: installed (scaffolded)`.
