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
  const flutterEv = stack.verification.find((v) => v.id === 'flutter-analyzer-evidence');
  const rnEv = stack.verification.find((v) => v.id === 'react-native-device-evidence');
  const beEv = stack.verification.find((v) => v.id === 'backend-tool-evidence');
  assert(flutterEv && flutterEv.appliesTo.includes('flutter'), 'flutter-analyzer-evidence entry');
  assert(rnEv && rnEv.appliesTo.includes('react-native'), 'react-native-device-evidence entry');
  assert(beEv && beEv.appliesTo.includes('nodejs'), 'backend-tool-evidence entry');
  const pwBest = stack.community.find((c) => c.id === 'playwright-best-practices');
  assert(pwBest && Array.isArray(pwBest.recommendedWith), 'playwright-best-practices community companion');
  assert(
    pwBest.recommendedWith.includes('playwright-cli'),
    'best-practices recommendedWith playwright-cli'
  );

  const verifyCmd = read(path.join('.cursor', 'commands', 'verify-phase.md'));
  assert(verifyCmd.includes('Evidence by surface'), 'verify-phase evidence by surface');
  assert(verifyCmd.includes('Native evidence'), 'verify-phase native evidence');
  assert(verifyCmd.includes('Backend tool evidence'), 'verify-phase backend evidence');
  assert(verifyCmd.includes('Playwright evidence'), 'verify-phase Playwright section');
  assert(verifyCmd.includes('do **not** install silently'), 'verify-phase no silent install');
  assert(verifyCmd.includes('Mid-flight Playwright offer'), 'verify-phase mid-flight offer');
  assert(verifyCmd.includes('Don\'t ask again for build phase'), 'verify-phase decline per phase');
  assert(verifyCmd.includes('this step only'), 'verify-phase option 2 scoped to step');
  assert(verifyCmd.includes('Scenarios → checklist'), 'verify-phase maps scenarios to checklist');
  assert(verifyCmd.includes('THEN'), 'verify-phase uses THEN outcomes');
  assert(verifyCmd.includes('lacks a WHEN/THEN scenario'), 'verify-phase blocks incomplete delta');

  const auditPhaseCmdEarly = read(path.join('.cursor', 'commands', 'audit-phase.md'));
  assert(auditPhaseCmdEarly.includes('Behavior delta traceability'), 'audit-phase checks delta scenarios');

  const setupCmd = read(path.join('.cursor', 'commands', 'setup.md'));
  assert(setupCmd.includes('Accept matched surface evidence'), 'setup Stage 4 verification lane');
  assert(setupCmd.includes('Flutter / React Native'), 'setup native verification surface');
  assert(setupCmd.includes('Backend / CLI'), 'setup backend verification surface');
  assert(setupCmd.includes('playwright-cli'), 'setup mentions playwright-cli');
  assert(setupCmd.includes('playwright-best-practices'), 'setup recommended companions with Playwright');
  assert(setupCmd.includes('Workflow mode'), 'setup Workflow mode section');
  assert(setupCmd.includes('archived-workflow'), 'setup archive destination');
  assert(setupCmd.includes('Owner gate format'), 'setup documents numbered gates');
  assert(setupCmd.includes('1. Accept'), 'setup product gate numbered');
  assert(setupCmd.includes('1. Greenfield'), 'setup mode numbered');
  assert(!setupCmd.includes('Accept | Reject | Edit'), 'setup no word-only Accept|Reject|Edit');

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
  assert(cfg.projectMap, 'config projectMap key');

  const progressStub = read(cfg.progress);
  assert(progressStub.includes('Workflow mode'), 'PROGRESS workflow mode checklist');

  // audit campaign artifacts
  assert(fs.existsSync(path.join(TMP, cfg.auditPlan)), 'AUDIT_PLAN stub');
  assert(fs.existsSync(path.join(TMP, cfg.projectMap)), 'PROJECT_MAP stub');
  assert(
    fs.existsSync(path.join(TMP, cfg.auditReportsDir, 'README.md')),
    'audit-reports README'
  );
  for (const cmd of [
    'audit-project.md',
    'audit-campaign.md',
    'audit-campaign-ds.md',
    'audit-ds.md',
    'refine-audit.md',
    'complete-audit.md',
    'map-project.md',
  ]) {
    assert(fs.existsSync(path.join(TMP, '.cursor', 'commands', cmd)), `cursor ${cmd}`);
    assert(fs.existsSync(path.join(TMP, '.claude', 'commands', cmd)), `claude ${cmd}`);
  }
  assert(
    !fs.existsSync(path.join(TMP, '.cursor', 'commands', 'audit-ds-phase.md')),
    'no legacy audit-ds-phase on fresh init'
  );
  const auditProject = read(path.join('.cursor', 'commands', 'audit-project.md'));
  assert(auditProject.includes('Prerequisites (hard gate)'), 'audit-project prereq gate');
  assert(auditProject.includes('/audit-campaign'), 'audit-project hands off to audit-campaign');
  assert(auditProject.includes('1. Accept'), 'audit-project gate numbered');
  assert(!auditProject.includes('Accept | Reject | Edit'), 'audit-project no word-only gate');
  assert(auditProject.includes('/map-project'), 'audit-project prefers project map');
  assert(auditProject.includes('extracted'), 'audit-project uses extracted seams');

  const mapProjectCmd = read(path.join('.cursor', 'commands', 'map-project.md'));
  assert(mapProjectCmd.includes('Owner gate:** none') || mapProjectCmd.includes('Owner gate: none'), 'map-project no Owner gate');
  assert(mapProjectCmd.includes('extracted'), 'map-project extracted label');
  assert(mapProjectCmd.includes('heuristic'), 'map-project heuristic label');
  assert(mapProjectCmd.includes('Audience:** agents') || mapProjectCmd.includes('Audience: agents'), 'map-project agent audience');
  assert(mapProjectCmd.includes('Do **not** STOP for Owner Accept'), 'map-project no accept STOP');

  const projectMapStub = read(cfg.projectMap);
  assert(projectMapStub.includes('Agent navigation aid'), 'PROJECT_MAP stub audience');
  assert(projectMapStub.includes('Core hubs'), 'PROJECT_MAP stub hubs');
  assert(projectMapStub.includes('When Status is stale'), 'PROJECT_MAP defines stale');

  assert(setupCmd.includes('/map-project'), 'setup mid-project uses map-project');
  assert(setupCmd.includes('Project map (agent aid)'), 'setup documents project map');

  const completePhaseCmd = read(path.join('.cursor', 'commands', 'complete-phase.md'));
  assert(completePhaseCmd.includes('Project map'), 'complete-phase updates project map');
  assert(completePhaseCmd.includes('/map-project refresh') || completePhaseCmd.includes('stale'), 'complete-phase stale or refresh');

  const planPhaseCmd = read(path.join('.cursor', 'commands', 'plan-phase.md'));
  assert(planPhaseCmd.includes('PROJECT_MAP') || planPhaseCmd.includes('project map') || planPhaseCmd.includes('/map-project'), 'plan-phase may use project map');

  const buildPhaseCmd = read(path.join('.cursor', 'commands', 'build-phase.md'));
  assert(buildPhaseCmd.includes('1. Accept →'), 'build-phase intent gate numbered');
  assert(buildPhaseCmd.includes('WHEN'), 'build-phase behavior delta WHEN');
  assert(buildPhaseCmd.includes('THEN'), 'build-phase behavior delta THEN');
  assert(buildPhaseCmd.includes('≥1 scenario'), 'build-phase requires scenarios per SHALL');
  assert(buildPhaseCmd.includes('Before the intent gate'), 'build-phase blocks incomplete delta');

  const completeAuditCmd = read(path.join('.cursor', 'commands', 'complete-audit.md'));
  assert(completeAuditCmd.includes('1. Promote selected'), 'complete-audit gate numbered');
  assert(!completeAuditCmd.includes('Promote selected findings to build plan | Leave'), 'complete-audit no word-only gate');

  const refineAuditCmd = read(path.join('.cursor', 'commands', 'refine-audit.md'));
  assert(refineAuditCmd.includes('1. Approve'), 'refine-audit plan gate numbered');
  assert(refineAuditCmd.includes('Cross-cutting'), 'refine-audit cross-cutting redirect');

  const refinePhaseCmd = read(path.join('.cursor', 'commands', 'refine-phase.md'));
  assert(refinePhaseCmd.includes('Cross-cutting STOP'), 'refine-phase has cross-cutting STOP');
  assert(refinePhaseCmd.includes('1. Record decision'), 'refine-phase cross-cutting option 1');
  assert(refinePhaseCmd.includes('2. Scoped only'), 'refine-phase cross-cutting option 2');
  assert(refinePhaseCmd.includes('3. Defer'), 'refine-phase cross-cutting defer');
  assert(refinePhaseCmd.includes('4. Not cross-cutting'), 'refine-phase local-refine escape');

  assert(buildPhaseCmd.includes('Cross-cutting STOP') || buildPhaseCmd.includes('core principle'), 'build-phase points to cross-cutting');

  const auditPhaseCmd = read(path.join('.cursor', 'commands', 'audit-phase.md'));
  assert(auditPhaseCmd.includes('delivery-only') || auditPhaseCmd.includes('Build Phase'), 'audit-phase delivery only');
  assert(auditPhaseCmd.includes('Browser evidence'), 'audit-phase browser evidence');
  assert(auditPhaseCmd.includes('Native evidence'), 'audit-phase native evidence');
  assert(auditPhaseCmd.includes('/audit-campaign'), 'audit-phase points to audit-campaign');
  assert(!auditPhaseCmd.includes('Mode B'), 'audit-phase has no campaign Mode B');

  const auditCampaignCmd = read(path.join('.cursor', 'commands', 'audit-campaign.md'));
  assert(auditCampaignCmd.includes('campaign-only') || auditCampaignCmd.includes('Campaign Audit'), 'audit-campaign campaign only');
  assert(auditCampaignCmd.includes('Approve all findings for refinement'), 'audit-campaign Owner gate');
  assert(auditCampaignCmd.includes('Record findings; no fixes'), 'audit-campaign record option');
  assert(auditCampaignCmd.includes('reaudit'), 'audit-campaign reaudit');
  assert(auditCampaignCmd.includes('/audit-phase'), 'audit-campaign points to audit-phase for delivery');
  assert(auditCampaignCmd.includes('audit-campaign-ds'), 'audit-campaign invokes audit-campaign-ds');
  assert(auditCampaignCmd.includes('/audit-campaign N+1'), 'audit-campaign option 4 uses audit-campaign next');
  assert(!auditCampaignCmd.includes('Mode A'), 'audit-campaign has no delivery Mode A');

  const auditDs = read(path.join('.cursor', 'commands', 'audit-ds.md'));
  assert(auditDs.includes('Delivery-only'), 'audit-ds delivery only');
  assert(auditDs.includes('/refine-phase'), 'audit-ds refine-phase path');

  const auditCampaignDs = read(path.join('.cursor', 'commands', 'audit-campaign-ds.md'));
  assert(auditCampaignDs.includes('Campaign-only'), 'audit-campaign-ds campaign only');
  assert(auditCampaignDs.includes('/refine-audit'), 'audit-campaign-ds refine-audit path');

  const auditPlan = read(cfg.auditPlan);
  assert(auditPlan.includes('mid-flight'), 'AUDIT_PLAN mid-flight aligned');
  assert(auditPlan.includes('/audit-campaign'), 'AUDIT_PLAN uses audit-campaign');
  assert(!auditPlan.includes('Never invent installs mid-audit'), 'AUDIT_PLAN no forbid mid-flight');

  const refineAudit = read(path.join('.cursor', 'commands', 'refine-audit.md'));
  assert(refineAudit.includes('Approved for refinement'), 'refine-audit approval-only rule');
  assert(refineAudit.includes('/audit-campaign'), 'refine-audit reaudits via audit-campaign');
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
