# Phasestep (Cursor plugin)

Phase-step agentic delivery for Cursor.

## After marketplace install

1. Open any project in Cursor  
2. Run **`/setup`**  
3. If the project has no `phasestep.json`, the agent **scaffolds it in-repo** (same files as `npx phasestep init`)  
4. If `phasestep.json` already exists (you used the CLI before), it reports **installed** and continues  

No separate terminal init is required for the full Phasestep experience.

## Also via npm

```bash
npx phasestep init
npx phasestep upgrade
npx phasestep check
```

Same project shape either way. See [phasestep.vercel.app](https://phasestep.vercel.app/).

## Local load (dev)

Point Cursor at this folder as a plugin directory, or use the repo marketplace manifest at `.cursor-plugin/marketplace.json`.

Regenerate from package templates: `npm run generate:plugins`.
