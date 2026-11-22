'use strict';

const fs = require('fs');
const path = require('path');
const {
  DEFAULTS,
  COMMAND_FILES,
  normalizeAdapters,
  CODEX_MARKER_START,
  scanAlongside,
  formatAlongsideReport,
} = require('./scaffold');

function exists(p) {
  return fs.existsSync(p);
}

const ADAPTER_MATRIX = [
  {
    id: 'cursor',
    label: 'Cursor',
    installs: '.cursor/commands/*.md',
    invoke: 'slash commands (/setup, …)',
  },
  {
    id: 'claude',
    label: 'Claude Code',
    installs: '.claude/commands/*.md',
    invoke: 'slash commands (same names)',
  },
  {
    id: 'codex',
    label: 'Codex',
    installs: 'AGENTS.md managed block',
    invoke: 'follow AGENTS / ask by command name',
  },
];

function commandNames() {
  return COMMAND_FILES.filter((name) => name !== 'README.md');
}

function checkPaths(targetDir, rels, lines) {
  let missing = 0;
  const misses = [];
  for (const rel of rels) {
    const full = path.join(targetDir, rel);
    const ok = exists(full);
    lines.push(`  ${ok ? 'ok  ' : 'MISS'}  ${rel}`);
    if (!ok) {
      missing += 1;
      misses.push(rel);
    }
  }
  return { missing, misses };
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
  const lines = [];

  console.log(`\nphasestep check → ${targetDir}\n`);

  console.log('Supported agents (selected adapters are required):');
  for (const row of ADAPTER_MATRIX) {
    const on = config.adapters.includes(row.id);
    console.log(
      `  ${on ? '[x]' : '[ ]'} ${row.id.padEnd(7)} ${row.label.padEnd(12)} → ${row.installs}`
    );
  }
  console.log(`\n  adapters in config: ${config.adapters.join(', ')}\n`);

  const docs = [
    config.constitutionPath || DEFAULTS.constitutionPath,
    config.productSpec,
    config.userFlow || DEFAULTS.userFlow,
    config.architecture,
    config.decisions,
    config.buildPlan,
    config.auditPlan || DEFAULTS.auditPlan,
    config.projectMap || DEFAULTS.projectMap,
    config.verificationMap || DEFAULTS.verificationMap,
    config.progress,
    path.join(config.phasePlansDir, 'README.md'),
    path.join(config.auditReportsDir || DEFAULTS.auditReportsDir, 'README.md'),
    config.stackCatalog || DEFAULTS.stackCatalog,
    config.designCatalog || DEFAULTS.designCatalog,
    config.designSystem,
  ];

  console.log('Docs & catalogs');
  let missing = 0;
  const allMisses = [];
  {
    const r = checkPaths(targetDir, docs, lines);
    missing += r.missing;
    allMisses.push(...r.misses);
    for (const line of lines.splice(0)) console.log(line);
  }

  const cmdNames = commandNames();
  const incompleteAdapters = [];

  for (const row of ADAPTER_MATRIX) {
    if (!config.adapters.includes(row.id)) continue;

    if (row.id === 'codex') {
      console.log('\nAdapter: codex (Codex)');
      const agentsRel = 'AGENTS.md';
      const agentsFull = path.join(targetDir, agentsRel);
      const agentsOk = exists(agentsFull);
      console.log(`  ${agentsOk ? 'ok  ' : 'MISS'}  ${agentsRel}`);
      if (!agentsOk) {
        missing += 1;
        allMisses.push(agentsRel);
        incompleteAdapters.push('codex');
      } else {
        const agents = fs.readFileSync(agentsFull, 'utf8');
        const hasBlock = agents.includes(CODEX_MARKER_START);
        console.log(`  ${hasBlock ? 'ok  ' : 'MISS'}  AGENTS.md phasestep block`);
        if (!hasBlock) {
          missing += 1;
          allMisses.push('AGENTS.md phasestep block');
          incompleteAdapters.push('codex');
        }
      }
      continue;
    }

    const dir =
      row.id === 'cursor' ? path.join('.cursor', 'commands') : path.join('.claude', 'commands');
    const rels = cmdNames.map((name) => path.join(dir, name));
    console.log(`\nAdapter: ${row.id} (${row.label}) — ${rels.length} command files`);
    const r = checkPaths(targetDir, rels, lines);
    missing += r.missing;
    allMisses.push(...r.misses);
    for (const line of lines.splice(0)) console.log(line);
    if (r.missing) {
      incompleteAdapters.push(row.id);
      console.log(
        `  → ${r.missing} missing under ${dir}/ (expected ${cmdNames.length} Phasestep commands)`
      );
    }
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
    console.log(`\n${missing} missing artifact(s).`);
    if (incompleteAdapters.length) {
      console.log(
        `Incomplete adapter install: ${incompleteAdapters.join(', ')} — run: npx phasestep upgrade`
      );
      console.log(
        '(upgrade refreshes command files / AGENTS block for adapters listed in phasestep.json)'
      );
    } else {
      console.log('Run: npx phasestep init  (or upgrade)');
    }
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

module.exports = { check, ADAPTER_MATRIX };
