'use strict';

/**
 * Smoke + setup contract checks.
 *
 * This is not a live Cursor/Claude /setup chat E2E (that needs an Owner + agent).
 * It verifies CLI init/upgrade/check and that /setup template + catalogs are coherent.
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const BIN = path.join(ROOT, 'bin', 'phasestep.js');
const TMP = path.join(ROOT, 'tmp-smoke');

function run(args, opts = {}) {
  return execFileSync(process.execPath, [BIN, ...args], {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    ...opts,
  });
}

function rmrf(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
}

function assert(cond, msg) {
  if (!cond) {
    console.error(`FAIL: ${msg}`);
    process.exitCode = 1;
    throw new Error(msg);
  }
  console.log(`  ok: ${msg}`);
}

function read(rel) {
  return fs.readFileSync(path.join(TMP, rel), 'utf8');
}

function main() {
  console.log('\nphasestep smoke + setup contract\n');

  const versionOut = run(['version']);
  assert(/phasestep v\d+\.\d+\.\d+/.test(versionOut.trim()), 'version prints');

  rmrf(TMP);
  run(['init', TMP]);

  assert(fs.existsSync(path.join(TMP, 'phasestep.json')), 'phasestep.json written');
  assert(fs.existsSync(path.join(TMP, '.cursor', 'commands', 'setup.md')), 'cursor /setup');
  assert(fs.existsSync(path.join(TMP, '.claude', 'commands', 'setup.md')), 'claude /setup');
  assert(fs.existsSync(path.join(TMP, 'AGENTS.md')), 'codex AGENTS.md');
  assert(
    fs.existsSync(path.join(TMP, '.phasestep', 'stack-catalog.json')),
    'stack catalog'
  );
  assert(
    fs.existsSync(path.join(TMP, '.phasestep', 'design-catalog.json')),
    'design catalog'
  );

  const setup = read(path.join('.cursor', 'commands', 'setup.md'));
  const requiredStages = [
    '## Greenfield vs existing (mid-project) project',
    '## Stage 1 — Product',
    '## Stage 2',
    '## Stage 4',
    '## Stage 5',
    '## Stage 6',
    '## Stage 7',
    '## Stage 8',
    '## Stage 9',
    'Existing / mid-project',
    'Product sync delta',
    'pick-one',
  ];
  for (const needle of requiredStages) {
    assert(setup.includes(needle), `setup.md contains: ${needle}`);
  }

  const stack = JSON.parse(read(path.join('.phasestep', 'stack-catalog.json')));
  assert(stack.stacks && typeof stack.stacks === 'object', 'stack-catalog.stacks');
  assert(Array.isArray(stack.community), 'stack-catalog.community array');

  const design = JSON.parse(read(path.join('.phasestep', 'design-catalog.json')));
  assert(
    design.componentLibraries && typeof design.componentLibraries === 'object',
    'design-catalog.componentLibraries'
  );
  assert(design.guidelines && typeof design.guidelines === 'object', 'design-catalog.guidelines');

  const cfg = JSON.parse(read('phasestep.json'));
  assert(Array.isArray(cfg.adapters) && cfg.adapters.includes('cursor'), 'adapters include cursor');
  assert(cfg.userFlow && cfg.stackCatalog && cfg.designCatalog, 'config enrichment keys');

  // check passes
  run(['check', TMP]);

  // upgrade refreshes commands without wiping product stub content we edit
  const productPath = path.join(TMP, cfg.productSpec);
  fs.writeFileSync(productPath, '# Owner product\nKEEP_ME\n', 'utf8');
  run(['upgrade', TMP]);
  assert(read(cfg.productSpec).includes('KEEP_ME'), 'upgrade preserves Owner docs');
  assert(
    read(path.join('.cursor', 'commands', 'setup.md')).includes('Greenfield vs existing'),
    'upgrade refreshed setup command'
  );

  // force-docs overwrites
  run(['upgrade', TMP, '--force-docs']);
  assert(!read(cfg.productSpec).includes('KEEP_ME'), 'upgrade --force-docs resets stubs');

  // cursor-only init
  const TMP2 = path.join(ROOT, 'tmp-smoke-cursor');
  rmrf(TMP2);
  run(['init', TMP2, '--adapters=cursor']);
  assert(fs.existsSync(path.join(TMP2, '.cursor', 'commands', 'setup.md')), 'cursor-only setup');
  assert(!fs.existsSync(path.join(TMP2, '.claude', 'commands', 'setup.md')), 'no claude when cursor-only');
  assert(!fs.existsSync(path.join(TMP2, 'AGENTS.md')), 'no AGENTS when cursor-only');
  run(['check', TMP2]);

  rmrf(TMP);
  rmrf(TMP2);
  console.log('\nAll smoke + setup contract checks passed.\n');
}

main();
