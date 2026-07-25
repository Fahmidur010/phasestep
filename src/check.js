'use strict';

const fs = require('fs');
const path = require('path');
const { DEFAULTS } = require('./init');

function exists(p) {
  return fs.existsSync(p);
}

async function check({ targetDir }) {
  const configPath = path.join(targetDir, 'phasestep.json');
  const legacyPath = path.join(targetDir, 'phasegate.json');
  const resolvedConfig = exists(configPath)
    ? configPath
    : exists(legacyPath)
      ? legacyPath
      : null;

  const config = resolvedConfig
    ? { ...DEFAULTS, ...JSON.parse(fs.readFileSync(resolvedConfig, 'utf8')) }
    : { ...DEFAULTS };

  if (resolvedConfig === legacyPath) {
    console.log('\nnote: found legacy phasegate.json — prefer renaming to phasestep.json\n');
  }

  const required = [
    config.constitutionPath || DEFAULTS.constitutionPath,
    config.productSpec,
    config.architecture,
    config.decisions,
    config.buildPlan,
    config.progress,
    path.join(config.phasePlansDir, 'README.md'),
    path.join('.cursor', 'commands', 'plan-phase.md'),
    path.join('.cursor', 'commands', 'build-phase.md'),
    path.join('.cursor', 'commands', 'verify-phase.md'),
    path.join('.cursor', 'commands', 'refine-phase.md'),
    path.join('.cursor', 'commands', 'audit-phase.md'),
    path.join('.cursor', 'commands', 'complete-phase.md'),
    path.join('.cursor', 'commands', 'session-log.md'),
    path.join('.cursor', 'commands', 'audit-ds-phase.md'),
    config.designSystem,
  ];

  console.log(`\nphasestep check → ${targetDir}\n`);
  let missing = 0;
  for (const rel of required) {
    const full = path.join(targetDir, rel);
    const ok = exists(full);
    console.log(`  ${ok ? 'ok  ' : 'MISS'}  ${rel}`);
    if (!ok) missing += 1;
  }

  if (missing) {
    console.log(`\n${missing} missing artifact(s). Run: npx phasestep init`);
    process.exitCode = 1;
  } else {
    console.log('\nAll required Phasestep artifacts present.');
  }
}

module.exports = { check };
