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
  // Non-TTY / --yes → all adapters (no interactive hang in CI)
  const initAllOut = run(['init', TMP, '--yes']);
  assert(initAllOut.includes('all adapters') || initAllOut.includes('Adapters:'), 'init --yes runs');

  assert(fs.existsSync(path.join(TMP, 'phasestep.json')), 'phasestep.json written');
  assert(fs.existsSync(path.join(TMP, '.cursor', 'commands', 'setup.md')), 'cursor /setup');
  assert(fs.existsSync(path.join(TMP, '.claude', 'commands', 'setup.md')), 'claude /setup');
  assert(fs.existsSync(path.join(TMP, 'AGENTS.md')), 'codex AGENTS.md');
  assert(
    read('AGENTS.md').includes('Playwright'),
    'codex AGENTS mentions Playwright'
  );
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
    '## Workflow mode — sole Phasestep (recommended) vs alongside',
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
    'Sole Phasestep (recommended)',
    'Accept archive',
    'Never silent moves',
  ];
  for (const needle of requiredStages) {
    assert(setup.includes(needle), `setup.md contains: ${needle}`);
  }

  const stack = JSON.parse(read(path.join('.phasestep', 'stack-catalog.json')));
  assert(stack.stacks && typeof stack.stacks === 'object', 'stack-catalog.stacks');
  assert(Array.isArray(stack.community), 'stack-catalog.community array');
  assert(Array.isArray(stack.verification), 'stack-catalog.verification array');
  const pwCli = stack.verification.find((v) => v.id === 'playwright-cli');
  const pwMcp = stack.verification.find((v) => v.id === 'playwright-mcp');
  assert(pwCli && pwCli.lane === 'official', 'playwright-cli official verification entry');
  assert(pwMcp && pwMcp.kind === 'mcp', 'playwright-mcp verification entry');
  assert(
    Array.isArray(pwCli.appliesTo) &&
      pwCli.appliesTo.includes('nextjs') &&
      pwCli.appliesTo.includes('tanstack') &&
      pwCli.appliesTo.includes('laravel'),
    'playwright-cli appliesTo web stacks'
  );
  assert(!pwCli.appliesTo.includes('flutter'), 'playwright-cli excludes flutter');
  assert(!pwCli.appliesTo.includes('react-native'), 'playwright-cli excludes react-native');
  assert(
    pwCli.installRecipes.some((r) => r.id === 'playwright-cli-browser'),
    'playwright-cli browser install recipe'
  );
  assert(
    pwMcp.detectInstalled.fileContainsAny.some((f) => f.file === '.mcp.json'),
    'playwright-mcp detects Claude .mcp.json'
  );
  assert(
    pwMcp.installRecipes.some((r) => r.id === 'claude-mcp-playwright'),
    'playwright-mcp Claude install recipe'
  );
  assert(!pwCli.why.includes('WHEN-THEN'), 'playwright-cli why has no unshipped WHEN/THEN');
  const pwBest = stack.community.find((c) => c.id === 'playwright-best-practices');
  assert(pwBest && Array.isArray(pwBest.recommendedWith), 'playwright-best-practices community companion');
  assert(
    pwBest.recommendedWith.includes('playwright-cli'),
    'best-practices recommendedWith playwright-cli'
  );

  const verifyCmd = read(path.join('.cursor', 'commands', 'verify-phase.md'));
  assert(verifyCmd.includes('Playwright evidence'), 'verify-phase Playwright section');
  assert(verifyCmd.includes('do **not** install silently'), 'verify-phase no silent install');
  assert(verifyCmd.includes('Mid-flight Playwright offer'), 'verify-phase mid-flight offer');
  assert(verifyCmd.includes('Don\'t ask again for build phase'), 'verify-phase decline per phase');
  assert(verifyCmd.includes('this step only'), 'verify-phase option 2 scoped to step');

  const setupCmd = read(path.join('.cursor', 'commands', 'setup.md'));
  assert(setupCmd.includes('Verification (web UI'), 'setup Stage 4 verification lane');
  assert(setupCmd.includes('playwright-cli'), 'setup mentions playwright-cli');
  assert(setupCmd.includes('recommended companions'), 'setup recommended companions with Playwright');
  assert(setupCmd.includes('Workflow mode'), 'setup Workflow mode section');
  assert(setupCmd.includes('archived-workflow'), 'setup archive destination');

  const cursorReadme = read(path.join('.cursor', 'commands', 'README.md'));
  assert(cursorReadme.includes('Your other slash commands stay'), 'cursor README coexistence');
  assert(cursorReadme.includes('Sole Phasestep'), 'cursor README sole workflow');

  const design = JSON.parse(read(path.join('.phasestep', 'design-catalog.json')));
  assert(
    design.componentLibraries && typeof design.componentLibraries === 'object',
    'design-catalog.componentLibraries'
  );
  assert(design.guidelines && typeof design.guidelines === 'object', 'design-catalog.guidelines');

  const cfg = JSON.parse(read('phasestep.json'));
  assert(Array.isArray(cfg.adapters) && cfg.adapters.includes('cursor'), 'adapters include cursor');
  assert(cfg.userFlow && cfg.stackCatalog && cfg.designCatalog, 'config enrichment keys');
  assert(cfg.auditPlan && cfg.auditReportsDir, 'config audit keys');

  const progressStub = read(cfg.progress);
  assert(progressStub.includes('Workflow mode'), 'PROGRESS workflow mode checklist');

  // audit campaign artifacts
  assert(fs.existsSync(path.join(TMP, cfg.auditPlan)), 'AUDIT_PLAN stub');
  assert(
    fs.existsSync(path.join(TMP, cfg.auditReportsDir, 'README.md')),
    'audit-reports README'
  );
  for (const cmd of ['audit-project.md', 'refine-audit.md', 'complete-audit.md']) {
    assert(fs.existsSync(path.join(TMP, '.cursor', 'commands', cmd)), `cursor ${cmd}`);
    assert(fs.existsSync(path.join(TMP, '.claude', 'commands', cmd)), `claude ${cmd}`);
  }
  const auditProject = read(path.join('.cursor', 'commands', 'audit-project.md'));
  assert(auditProject.includes('Prerequisites (hard gate)'), 'audit-project prereq gate');
  const auditPhaseCmd = read(path.join('.cursor', 'commands', 'audit-phase.md'));
  assert(auditPhaseCmd.includes('Browser evidence'), 'audit-phase browser evidence');
  assert(auditPhaseCmd.includes('both modes'), 'audit-phase browser evidence both modes');
  assert(auditPhaseCmd.includes('Mid-flight Playwright offer'), 'audit-phase mid-flight offer');
  assert(auditPhaseCmd.includes('build phase N'), 'audit-phase Mode A decline key');

  const auditPlan = read(cfg.auditPlan);
  assert(auditPlan.includes('mid-flight'), 'AUDIT_PLAN mid-flight aligned');
  assert(!auditPlan.includes('Never invent installs mid-audit'), 'AUDIT_PLAN no forbid mid-flight');
  for (const needle of [
    'Mode A — Build audit',
    'Mode B — Campaign audit',
    'Approve all findings for refinement',
    'Record findings; no fixes',
    'reaudit',
  ]) {
    assert(auditPhaseCmd.includes(needle), `audit-phase contains: ${needle}`);
  }
  const refineAudit = read(path.join('.cursor', 'commands', 'refine-audit.md'));
  assert(refineAudit.includes('Approved for refinement'), 'refine-audit approval-only rule');
  const auditPlanStub = read(cfg.auditPlan);
  assert(auditPlanStub.includes('Audit dimensions'), 'audit plan dimensions table');
  assert(auditPlanStub.includes('Browser evidence'), 'audit plan browser evidence dimension');

  // check passes
  run(['check', TMP]);

  // upgrade refreshes commands without wiping product stub content we edit,
  // and re-creates missing Owner stubs (new-in-version artifacts)
  const productPath = path.join(TMP, cfg.productSpec);
  fs.writeFileSync(productPath, '# Owner product\nKEEP_ME\n', 'utf8');
  fs.rmSync(path.join(TMP, cfg.auditPlan));
  run(['upgrade', TMP]);
  assert(read(cfg.productSpec).includes('KEEP_ME'), 'upgrade preserves Owner docs');
  assert(fs.existsSync(path.join(TMP, cfg.auditPlan)), 'upgrade restores missing stubs');
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

  // Non-TTY init without flags still installs all (no hang)
  const TMP3 = path.join(ROOT, 'tmp-smoke-nontty');
  rmrf(TMP3);
  const nonttyOut = run(['init', TMP3]);
  assert(
    nonttyOut.includes('Non-interactive') || nonttyOut.includes('Adapters: cursor, claude, codex'),
    'non-TTY init defaults to all adapters'
  );
  assert(fs.existsSync(path.join(TMP3, '.cursor', 'commands', 'setup.md')), 'non-TTY wrote cursor');
  assert(fs.existsSync(path.join(TMP3, 'AGENTS.md')), 'non-TTY wrote codex');

  // prompt choice helper (unit-ish)
  const { findChoice } = require('../src/prompt');
  assert(findChoice('1').adapters.join(',') === 'cursor', 'menu 1 → cursor');
  assert(findChoice('2').adapters.join(',') === 'claude', 'menu 2 → claude');
  assert(findChoice('3').adapters.join(',') === 'codex', 'menu 3 → codex');
  assert(findChoice('').adapters.length === 3, 'menu default → all');
  assert(findChoice('claude-code').adapters.join(',') === 'claude', 'alias claude-code');

  // Alongside existing Cursor commands + AGENTS
  const TMP4 = path.join(ROOT, 'tmp-smoke-alongside');
  rmrf(TMP4);
  fs.mkdirSync(path.join(TMP4, '.cursor', 'commands'), { recursive: true });
  fs.writeFileSync(path.join(TMP4, '.cursor', 'commands', 'my-ship.md'), '# custom ship\n', 'utf8');
  fs.writeFileSync(
    path.join(TMP4, '.cursor', 'commands', 'setup.md'),
    '# CUSTOM_SETUP_KEEP\n',
    'utf8'
  );
  fs.writeFileSync(path.join(TMP4, 'AGENTS.md'), '# My agent rules\nKEEP_AGENTS\n', 'utf8');
  const alongOut = run(['init', TMP4, '--adapters=cursor,codex']);
  assert(alongOut.includes('Alongside existing workflow'), 'init Alongside section');
  assert(alongOut.includes('WARN') && alongOut.includes('collision'), 'init warns name collision');
  assert(alongOut.includes('my-ship.md'), 'init lists foreign command');
  assert(alongOut.includes('Sole Phasestep'), 'init points to Sole workflow mode');
  assert(
    fs
      .readFileSync(path.join(TMP4, '.cursor', 'commands', 'setup.md'), 'utf8')
      .includes('CUSTOM_SETUP_KEEP'),
    'alongside keeps colliding setup.md'
  );
  assert(
    fs.existsSync(path.join(TMP4, '.cursor', 'commands', 'my-ship.md')),
    'alongside keeps foreign command'
  );
  assert(
    fs.existsSync(path.join(TMP4, '.cursor', 'commands', 'plan-phase.md')),
    'alongside installs non-colliding commands'
  );
  const agentsAlongside = fs.readFileSync(path.join(TMP4, 'AGENTS.md'), 'utf8');
  assert(agentsAlongside.includes('KEEP_AGENTS'), 'alongside preserves AGENTS content');
  assert(agentsAlongside.includes('phasestep:codex:start'), 'alongside appends phasestep block');
  assert(agentsAlongside.includes('Additive'), 'AGENTS block mentions additive');
  const checkAlong = run(['check', TMP4]);
  assert(checkAlong.includes('Foreign commands'), 'check notes foreign commands');
  assert(checkAlong.includes('All required Phasestep artifacts present'), 'alongside check passes');

  rmrf(TMP);
  rmrf(TMP2);
  rmrf(TMP3);
  rmrf(TMP4);
  console.log('\nAll smoke + setup contract checks passed.\n');
}

main();
