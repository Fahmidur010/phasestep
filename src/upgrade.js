'use strict';

const fs = require('fs');
const path = require('path');
const {
  DEFAULTS,
  normalizeAdapters,
  loadExistingConfig,
  installConstitution,
  installConfig,
  installCommands,
  installOwnerStubs,
  installCatalogs,
  scanAlongside,
  formatAlongsideReport,
} = require('./scaffold');

/**
 * Safe template refresh for existing Phasestep projects.
 *
 * Default: refresh constitution, commands, catalogs, and merge new phasestep.json keys.
 * Never overwrite Owner docs unless --force-docs.
 */
async function upgrade({
  packageRoot,
  targetDir,
  forceDocs = false,
  forceCommands = true,
  forceCatalogs = true,
  forceConstitution = true,
  adapters,
}) {
  console.log(`\nphasestep upgrade → ${targetDir}\n`);

  const existing = loadExistingConfig(targetDir);
  if (!existing) {
    console.error('No phasestep.json (or legacy phasegate.json) found. Run: npx phasestep init');
    process.exitCode = 1;
    return;
  }

  const prev = existing.data || {};
  const merged = { ...DEFAULTS, ...prev };

  // Migrate catalog defaults from .cursor/phasestep → .phasestep when still on legacy defaults
  const legacyStack = '.cursor/phasestep/stack-catalog.json';
  const legacyDesign = '.cursor/phasestep/design-catalog.json';
  if (!prev.stackCatalog || prev.stackCatalog === legacyStack) {
    const legacyFull = path.join(targetDir, legacyStack);
    const nextFull = path.join(targetDir, DEFAULTS.stackCatalog);
    if (fs.existsSync(legacyFull) && !fs.existsSync(nextFull)) {
      merged.stackCatalog = DEFAULTS.stackCatalog;
    } else if (prev.stackCatalog) {
      merged.stackCatalog = prev.stackCatalog;
    }
  }
  if (!prev.designCatalog || prev.designCatalog === legacyDesign) {
    const legacyFull = path.join(targetDir, legacyDesign);
    const nextFull = path.join(targetDir, DEFAULTS.designCatalog);
    if (fs.existsSync(legacyFull) && !fs.existsSync(nextFull)) {
      merged.designCatalog = DEFAULTS.designCatalog;
    } else if (prev.designCatalog) {
      merged.designCatalog = prev.designCatalog;
    }
  }

  // Preserve custom paths; fill missing keys from DEFAULTS
  for (const key of Object.keys(DEFAULTS)) {
    if (merged[key] === undefined || merged[key] === null) {
      merged[key] = DEFAULTS[key];
    }
  }

  if (adapters) {
    merged.adapters = normalizeAdapters(adapters);
  } else {
    merged.adapters = normalizeAdapters(merged.adapters || DEFAULTS.adapters);
  }

  console.log('  Merging phasestep.json keys…');
  installConfig(targetDir, merged, { force: true });

  const preScan = scanAlongside(targetDir, merged.adapters);

  if (forceConstitution) {
    console.log('  Refreshing constitution…');
    installConstitution(packageRoot, targetDir, merged, { force: true });
  }

  if (forceCommands) {
    console.log(`  Refreshing commands (${merged.adapters.join(', ')})…`);
    installCommands(packageRoot, targetDir, merged, {
      force: true,
      adapters: merged.adapters,
    });
  }

  if (forceCatalogs) {
    console.log('  Refreshing enrichment catalogs…');
    installCatalogs(packageRoot, targetDir, merged, { force: true });
  }

  if (forceDocs) {
    console.log('  --force-docs: rewriting Owner stubs…');
    installOwnerStubs(packageRoot, targetDir, merged, { force: true });
  } else {
    console.log('  Adding missing Owner stubs (existing docs untouched)…');
    installOwnerStubs(packageRoot, targetDir, merged, { force: false });
  }

  if (existing.path.endsWith('phasegate.json')) {
    console.log(
      '\n  note: renamed guidance — prefer phasestep.json (written this run). You may delete phasegate.json.'
    );
  }

  const alongside = formatAlongsideReport(preScan, {
    context: 'upgrade',
    force: !!forceCommands,
  });

  console.log(`
Done.

Adapters: ${merged.adapters.join(', ')}
Config:   phasestep.json
Commands/catalogs refreshed. Re-open the agent or reload commands if needed.

${alongside}

Next: /setup (resume) or /plan-phase N
`);
}

module.exports = { upgrade };
