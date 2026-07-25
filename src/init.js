'use strict';

const path = require('path');
const {
  DEFAULTS,
  normalizeAdapters,
  mergeConfig,
  installConstitution,
  installConfig,
  installCommands,
  installOwnerStubs,
  installCatalogs,
} = require('./scaffold');

async function init({ packageRoot, targetDir, force, adapters }) {
  console.log(`\nphasestep init → ${targetDir}\n`);

  const config = mergeConfig({
    ...DEFAULTS,
    ...(adapters ? { adapters } : {}),
  });
  config.adapters = normalizeAdapters(adapters || config.adapters);

  installConstitution(packageRoot, targetDir, config, { force });
  installConfig(targetDir, config, { force });
  installCommands(packageRoot, targetDir, config, {
    force,
    adapters: config.adapters,
  });
  installOwnerStubs(packageRoot, targetDir, config, { force });
  installCatalogs(packageRoot, targetDir, config, { force });

  const adapterNote = config.adapters.join(', ');
  console.log(`
Done.

Adapters: ${adapterNote}

Next:
  1. Open the project in your agent (Cursor, Claude Code, or Codex)
  2. Run /setup  (product → user flow → stack → architecture → decisions → design → build plan)
     Or fill ${config.productSpec}, ${config.userFlow}, ${config.buildPlan}, ${config.architecture} manually
  3. Then run /plan-phase 1

Constitution: ${config.constitutionPath}
Config:       phasestep.json
Stack catalog: ${config.stackCatalog}
Design catalog: ${config.designCatalog}
`);
}

module.exports = { init, DEFAULTS };
