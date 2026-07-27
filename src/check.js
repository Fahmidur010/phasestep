'use strict';

const fs = require('fs');
const path = require('path');
const {
  DEFAULTS,
  normalizeAdapters,
  commandPathsForAdapters,
  CODEX_MARKER_START,
  scanAlongside,
  formatAlongsideReport,
} = require('./scaffold');

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

  config.adapters = normalizeAdapters(config.adapters);

  const required = [
    config.constitutionPath || DEFAULTS.constitutionPath,
    config.productSpec,
    config.userFlow || DEFAULTS.userFlow,
    config.architecture,
    config.decisions,
    config.buildPlan,
    config.auditPlan || DEFAULTS.auditPlan,
    config.progress,
    path.join(config.phasePlansDir, 'README.md'),
    path.join(config.auditReportsDir || DEFAULTS.auditReportsDir, 'README.md'),
    config.stackCatalog || DEFAULTS.stackCatalog,
    config.designCatalog || DEFAULTS.designCatalog,
    config.designSystem,
  ];

  const { paths: commandPaths } = commandPathsForAdapters(config.adapters, config);
  required.push(...commandPaths);

  if (config.adapters.includes('codex')) {
    required.push('AGENTS.md');
  }

  console.log(`\nphasestep check → ${targetDir}\n`);
  console.log(`  adapters: ${config.adapters.join(', ')}\n`);

  let missing = 0;
  for (const rel of required) {
    const full = path.join(targetDir, rel);
    const ok = exists(full);
    console.log(`  ${ok ? 'ok  ' : 'MISS'}  ${rel}`);
    if (!ok) missing += 1;
  }

  if (config.adapters.includes('codex') && exists(path.join(targetDir, 'AGENTS.md'))) {
    const agents = fs.readFileSync(path.join(targetDir, 'AGENTS.md'), 'utf8');
    const hasBlock = agents.includes(CODEX_MARKER_START);
    console.log(`  ${hasBlock ? 'ok  ' : 'MISS'}  AGENTS.md phasestep block`);
    if (!hasBlock) missing += 1;
  }

  // Soft note: legacy catalog dir without failing check if config points elsewhere
  const legacyStack = path.join(targetDir, '.cursor', 'phasestep', 'stack-catalog.json');
  if (
    exists(legacyStack) &&
    (config.stackCatalog || DEFAULTS.stackCatalog) !==
      '.cursor/phasestep/stack-catalog.json'
  ) {
    console.log(
      '\nnote: legacy .cursor/phasestep/stack-catalog.json present; config prefers ' +
        (config.stackCatalog || DEFAULTS.stackCatalog)
    );
  }

  if (missing) {
    console.log(`\n${missing} missing artifact(s). Run: npx phasestep init  (or upgrade)`);
    process.exitCode = 1;
  } else {
    console.log('\nAll required Phasestep artifacts present.');
  }

  const scan = scanAlongside(targetDir, config.adapters);
  const alongside = formatAlongsideReport(scan, { context: 'check', force: false });
  if (alongside) {
    console.log('');
    console.log(alongside);
  }
}

module.exports = { check };
