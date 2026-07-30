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
  scanAlongside,
  formatAlongsideReport,
} = require('./scaffold');

async function init({ packageRoot, targetDir, force, adapters }) {
  console.log(`\nphasestep init → ${targetDir}\n`);

  const config = mergeConfig({
    ...DEFAULTS,
    ...(adapters ? { adapters } : {}),
  });
  config.adapters = normalizeAdapters(adapters || config.adapters);

  const preScan = scanAlongside(targetDir, config.adapters);

  installConstitution(packageRoot, targetDir, config, { force });
  installConfig(targetDir, config, { force });
  installCommands(packageRoot, targetDir, config, {
    force,
    adapters: config.adapters,
  });
  installOwnerStubs(packageRoot, targetDir, config, { force });
  installCatalogs(packageRoot, targetDir, config, { force });

  const adapterNote = config.adapters.join(', ');
  const openHint = [];
  if (config.adapters.includes('cursor')) openHint.push('Cursor');
  if (config.adapters.includes('claude')) openHint.push('Claude Code');
  if (config.adapters.includes('codex')) openHint.push('Codex');

  const alongside = formatAlongsideReport(preScan, { context: 'init', force: !!force });

  console.log(`
Done.

Adapters: ${adapterNote}

${alongside}

Next:
  1. Open the project in ${openHint.join(' / ')}
  2. Run /setup — choose Setup mode, then Workflow mode:
     Sole Phasestep (recommended) → Owner-gated archive of competing workflow files
     Alongside (opt-in) → keep your commands; additive use
     Mid-project app → Existing (mid-project) in Setup mode
     Or fill ${config.productSpec}, ${config.userFlow}, ${config.buildPlan}, ${config.architecture} manually
     (Setup Finish offers optional /github-connect — not during init)
  3. Then run /plan-phase 1

Constitution: ${config.constitutionPath}
Config:       phasestep.json
Stack catalog: ${config.stackCatalog}
Design catalog: ${config.designCatalog}
`);
}

module.exports = { init, DEFAULTS };
