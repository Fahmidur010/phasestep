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
  assert(initAllOut.includes('github-connect') || initAllOut.includes('/github-connect'), 'init hints Setup Finish github-connect');
  assert(
    initAllOut.includes('first-slug') || initAllOut.includes('/plan-phase <'),
    'init Next hints plan-phase slug'
  );

  assert(fs.existsSync(path.join(TMP, 'phasestep.json')), 'phasestep.json written');
  assert(fs.existsSync(path.join(TMP, '.cursor', 'commands', 'setup.md')), 'cursor /setup');
  assert(fs.existsSync(path.join(TMP, '.cursor', 'commands', 'status.md')), 'cursor /status');
  assert(fs.existsSync(path.join(TMP, '.claude', 'commands', 'setup.md')), 'claude /setup');
  assert(fs.existsSync(path.join(TMP, '.claude', 'commands', 'status.md')), 'claude /status');
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
    '## Ensure project install (plugin + CLI — same project)',
    'Phasestep: installed',
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
  assert(setup.includes('Design wing'), 'setup.md Design wing stage');
  assert(setup.includes('Visual direction'), 'setup.md Visual direction');
  assert(setup.includes('/design-direction'), 'setup.md links design-direction');
  assert(!setup.includes('## Stage 7 — Design system (optional)'), 'setup Stage 7 no longer optional heading');
  assert(
    !read(path.join('docs', 'PROGRESS.md')).includes('Design system (optional)'),
    'PROGRESS stub no longer marks design optional'
  );
  assert(
    read(path.join('docs', 'PROGRESS.md')).includes('Design wing'),
    'PROGRESS stub lists Design wing'
  );
  assert(setup.includes('optional GitHub handoff'), 'setup Finish GitHub connect STOP');
  assert(setup.includes('1. Connect now'), 'setup Finish Connect now option');
  assert(setup.includes('2. Skip'), 'setup Finish Skip GitHub option');

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
  assert(verifyCmd.includes('Trace'), 'verify-phase uses Trace table');
  assert(verifyCmd.includes('Verify #'), 'verify-phase Verify # ids');
  assert(verifyCmd.includes('UNCHANGED spot-check'), 'verify-phase UNCHANGED spot-check');
  assert(verifyCmd.includes('No UNCHANGED non-goals'), 'verify-phase skip empty UNCHANGED');
  assert(verifyCmd.includes('lacks a WHEN/THEN scenario'), 'verify-phase blocks incomplete delta');
  assert(verifyCmd.includes('/pr-step'), 'verify-phase suggests pr-step');
  assert(verifyCmd.includes('Phase health (resume)'), 'verify-phase updates Phase health');
  assert(
    verifyCmd.includes('Verification map') || verifyCmd.includes('VERIFICATION_MAP'),
    'verify-phase uses verification map'
  );

  const auditPhaseCmdEarly = read(path.join('.cursor', 'commands', 'audit-phase.md'));
  assert(auditPhaseCmdEarly.includes('Behavior delta traceability'), 'audit-phase checks delta scenarios');
  assert(
    auditPhaseCmdEarly.includes('Verification map') ||
      auditPhaseCmdEarly.includes('VERIFICATION_MAP'),
    'audit-phase mentions verification map'
  );

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
  assert(setupCmd.includes('Spec quality checklist'), 'setup spec quality checklist');
  assert(setupCmd.includes('Accept with known gaps'), 'setup accept with known gaps');
  assert(setupCmd.includes('1. Greenfield'), 'setup mode numbered');
  assert(!setupCmd.includes('Accept | Reject | Edit'), 'setup no word-only Accept|Reject|Edit');

  const cursorReadme = read(path.join('.cursor', 'commands', 'README.md'));
  assert(cursorReadme.includes('Your other slash commands stay'), 'cursor README coexistence');
  assert(cursorReadme.includes('Sole Phasestep'), 'cursor README sole workflow');

  const rootReadme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
  assert(rootReadme.includes('## Supported agents'), 'root README Supported agents section');
  assert(rootReadme.includes('| `cursor` |'), 'root README cursor adapter row');
  assert(rootReadme.includes('| `claude` |'), 'root README claude adapter row');
  assert(rootReadme.includes('| `codex` |'), 'root README codex adapter row');

  const constitution = fs.readFileSync(path.join(ROOT, 'constitution', 'PHASESTEP.md'), 'utf8');
  assert(constitution.includes('Agent adapters (install matrix)'), 'constitution agent install matrix');
  assert(
    constitution.includes('Engineering constraints') || constitution.includes('quality armor'),
    'constitution engineering constraints'
  );
  assert(constitution.includes('Evidence bar'), 'constitution evidence bar hard rule');
  assert(constitution.includes('Failure brief'), 'constitution failure brief hard rule');
  assert(constitution.includes('Step playback'), 'constitution step playback hard rule');
  assert(
    constitution.includes('Encode lessons') || constitution.includes('encode lessons'),
    'constitution encode lessons hard rule'
  );
  assert(
    constitution.includes('Verified on ship') || constitution.includes('Verified line'),
    'constitution Verified on ship hard rule'
  );
  assert(constitution.includes('v1.1.0'), 'constitution evolution log 1.1.0');
  assert(constitution.includes('v1.2.0'), 'constitution evolution log 1.2.0');
  assert(constitution.includes('v1.3.0'), 'constitution evolution log 1.3.0');
  assert(constitution.includes('v1.4.0'), 'constitution evolution log 1.4.0');
  assert(
    constitution.includes('Design wing') || constitution.includes('design wing'),
    'constitution design wing'
  );
  assert(
    constitution.includes('critique-ui') && constitution.includes('polish-ui'),
    'constitution design-wing commands'
  );
  assert(constitution.includes('motion-ui'), 'constitution motion-ui command');
  assert(constitution.includes('detect-ui'), 'constitution detect-ui command');
  assert(
    constitution.includes('Verification map') || constitution.includes('VERIFICATION_MAP'),
    'constitution verification map artifact'
  );

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
  assert(cfg.verificationMap, 'config verificationMap key');
  assert(cfg.github && cfg.github.remote === 'origin', 'config github.remote default');

  const designStub = read(cfg.designSystem || 'docs/DESIGN_SYSTEM.md');
  assert(designStub.includes('## Visual direction'), 'DESIGN_SYSTEM stub has Visual direction');
  assert(designStub.includes('## Motion'), 'DESIGN_SYSTEM stub has Motion');

  const designDirectionCmd = read(path.join('.cursor', 'commands', 'design-direction.md'));
  assert(designDirectionCmd.includes('Visual direction'), 'design-direction mentions Visual direction');
  assert(designDirectionCmd.includes('1. Accept'), 'design-direction numbered Accept');
  assert(designDirectionCmd.includes('Character'), 'design-direction Character line');

  const detectUiCmd = read(path.join('.cursor', 'commands', 'detect-ui.md'));
  assert(detectUiCmd.includes('Do not modify'), 'detect-ui is read-only');
  assert(detectUiCmd.includes('AS-01'), 'detect-ui rule AS-01');
  assert(detectUiCmd.includes('AS-08'), 'detect-ui rule AS-08');
  assert(
    detectUiCmd.includes('external') || detectUiCmd.includes('live/preview'),
    'detect-ui bans external/live paths'
  );

  const critiqueUiCmd = read(path.join('.cursor', 'commands', 'critique-ui.md'));
  assert(critiqueUiCmd.includes('Do not modify'), 'critique-ui is read-only');
  assert(critiqueUiCmd.includes('P0'), 'critique-ui priority P0');
  assert(critiqueUiCmd.includes('/detect-ui'), 'critique-ui soft-offers detect-ui');

  const polishUiCmd = read(path.join('.cursor', 'commands', 'polish-ui.md'));
  assert(polishUiCmd.includes('Ordered passes') || polishUiCmd.includes('Spacing'), 'polish-ui ordered passes');
  assert(polishUiCmd.includes('Visual direction'), 'polish-ui keeps Visual direction');
  assert(polishUiCmd.includes('/motion-ui'), 'polish-ui soft-offers motion-ui');
  assert(polishUiCmd.includes('/detect-ui'), 'polish-ui soft-offers detect-ui');

  const motionUiCmd = read(path.join('.cursor', 'commands', 'motion-ui.md'));
  assert(motionUiCmd.includes('Should it move') || motionUiCmd.includes('animate?'), 'motion-ui decision gate');
  assert(motionUiCmd.includes('reduced-motion') || motionUiCmd.includes('prefers-reduced-motion'), 'motion-ui reduced-motion');
  assert(motionUiCmd.includes('## Motion') || motionUiCmd.includes('Motion'), 'motion-ui syncs Motion');

  assert(read(path.join('.cursor', 'commands', 'build-phase.md')).includes('/polish-ui'), 'build-phase soft-offers polish-ui');
  assert(read(path.join('.cursor', 'commands', 'build-phase.md')).includes('/motion-ui'), 'build-phase soft-offers motion-ui');
  assert(read(path.join('.cursor', 'commands', 'build-phase.md')).includes('/detect-ui'), 'build-phase soft-offers detect-ui');
  assert(
    read(path.join('.cursor', 'commands', 'build-phase.md')).includes('5. Continue to /verify-phase'),
    'build-phase UI soft-offer Continue is option 5'
  );
  assert(read(path.join('.cursor', 'commands', 'complete-phase.md')).includes('/detect-ui'), 'complete-phase soft-offers detect-ui');
  assert(
    read(path.join('.cursor', 'commands', 'complete-phase.md')).includes('5. Continue to complete confirm'),
    'complete-phase UI soft-offer Continue is option 5'
  );
  assert(
    read(path.join('.cursor', 'commands', 'motion-ui.md')).includes('5. Done for now'),
    'motion-ui after soft-offer Done is option 5'
  );
  assert(read(path.join('.cursor', 'commands', 'audit-ds.md')).includes('/critique-ui'), 'audit-ds soft-offers critique-ui');
  assert(read(path.join('.cursor', 'commands', 'audit-ds.md')).includes('/detect-ui'), 'audit-ds soft-offers detect-ui');
  assert(read(path.join('.cursor', 'commands', 'audit-ds.md')).includes('Motion'), 'audit-ds checks Motion');
  assert(read(path.join('.cursor', 'commands', 'audit-ds.md')).includes('/motion-ui'), 'audit-ds can route to motion-ui');
  assert(
    read('AGENTS.md').includes('/design-direction') || read('AGENTS.md').includes('design-direction'),
    'codex AGENTS lists design-direction'
  );
  assert(
    read('AGENTS.md').includes('/motion-ui') || read('AGENTS.md').includes('motion-ui'),
    'codex AGENTS lists motion-ui'
  );
  assert(
    read('AGENTS.md').includes('/detect-ui') || read('AGENTS.md').includes('detect-ui'),
    'codex AGENTS lists detect-ui'
  );

  const progressStub = read(cfg.progress);
  assert(progressStub.includes('Workflow mode'), 'PROGRESS workflow mode checklist');
  assert(progressStub.includes('GitHub: connected'), 'PROGRESS GitHub section');
  assert(progressStub.includes('Phase health (resume)'), 'PROGRESS Phase health section');
  assert(progressStub.includes('awaiting-intent'), 'PROGRESS Phase health status values');

  // audit campaign artifacts
  assert(fs.existsSync(path.join(TMP, cfg.auditPlan)), 'AUDIT_PLAN stub');
  assert(fs.existsSync(path.join(TMP, cfg.projectMap)), 'PROJECT_MAP stub');
  assert(fs.existsSync(path.join(TMP, cfg.verificationMap)), 'VERIFICATION_MAP stub');
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
    'github-connect.md',
    'pr-step.md',
    'design-direction.md',
    'detect-ui.md',
    'critique-ui.md',
    'polish-ui.md',
    'motion-ui.md',
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

  const verificationMapStub = read(cfg.verificationMap);
  assert(
    verificationMapStub.includes('How to prove') ||
      verificationMapStub.includes('Prove paths'),
    'VERIFICATION_MAP stub prove paths'
  );
  assert(
    verificationMapStub.includes('never overrides') ||
      verificationMapStub.includes('Context only'),
    'VERIFICATION_MAP is context only'
  );
  assert(
    verificationMapStub.includes('buildCommand') ||
      verificationMapStub.includes('BUILD_COMMAND') ||
      verificationMapStub.includes('npm run build'),
    'VERIFICATION_MAP seeds build command'
  );

  assert(setupCmd.includes('/map-project'), 'setup mid-project uses map-project');
  assert(setupCmd.includes('Project map (agent aid)'), 'setup documents project map');
  assert(
    setupCmd.includes('VERIFICATION_MAP') || setupCmd.includes('Verification map'),
    'setup seeds verification map'
  );

  const completePhaseCmd = read(path.join('.cursor', 'commands', 'complete-phase.md'));
  assert(completePhaseCmd.includes('Project map'), 'complete-phase updates project map');
  assert(completePhaseCmd.includes('/map-project refresh') || completePhaseCmd.includes('stale'), 'complete-phase stale or refresh');
  assert(completePhaseCmd.includes('/github-connect'), 'complete-phase soft-reminds github-connect');
  assert(completePhaseCmd.includes('Phase remainder'), 'complete-phase phase remainder');
  assert(completePhaseCmd.includes('Still open'), 'complete-phase remainder still open');
  assert(completePhaseCmd.includes('Carry into next'), 'complete-phase remainder carry into next');
  assert(
    completePhaseCmd.includes('Lessons encoded') || completePhaseCmd.includes('Encode lessons'),
    'complete-phase remainder lessons encoded'
  );
  assert(completePhaseCmd.includes('Next-phase seeds') || completePhaseCmd.includes('next-phase seed'), 'complete-phase next-phase seeds');
  assert(completePhaseCmd.includes('Phase health (resume)'), 'complete-phase updates Phase health');

  const planPhaseCmd = read(path.join('.cursor', 'commands', 'plan-phase.md'));
  assert(planPhaseCmd.includes('PROJECT_MAP') || planPhaseCmd.includes('project map') || planPhaseCmd.includes('/map-project'), 'plan-phase may use project map');
  assert(planPhaseCmd.includes('Clarify STOP') || planPhaseCmd.includes('Clarify before plan'), 'plan-phase clarify STOP');
  assert(planPhaseCmd.includes('1. Answer the questions'), 'plan-phase clarify option 1');
  assert(planPhaseCmd.includes('2. Use suggested defaults'), 'plan-phase clarify option 2');
  assert(planPhaseCmd.includes('4. Abort planning'), 'plan-phase clarify abort');
  assert(planPhaseCmd.includes('Clarify answers'), 'plan-phase records clarify answers');
  assert(planPhaseCmd.includes('Plan quality checklist'), 'plan-phase plan quality checklist');
  assert(planPhaseCmd.includes('Steps are Owner-verifiable') || planPhaseCmd.includes('Steps Owner-verifiable'), 'plan-phase checklist verifiable steps');
  assert(planPhaseCmd.includes('2. Write anyway'), 'plan-phase quality write anyway');
  assert(planPhaseCmd.includes('Resolve phase id'), 'plan-phase resolves named phase id');
  assert(planPhaseCmd.includes('Soft compat') || planPhaseCmd.includes('soft compat'), 'plan-phase soft-compat numeric');
  assert(planPhaseCmd.includes('slug') || planPhaseCmd.includes('kebab-case'), 'plan-phase prefers slug');
  assert(planPhaseCmd.includes('Steps stay numeric') || planPhaseCmd.includes('Step numbers stay integers'), 'plan-phase steps stay numeric');
  assert(planPhaseCmd.includes('Planning mode STOP') || planPhaseCmd.includes('How to plan'), 'plan-phase planning mode STOP');
  assert(planPhaseCmd.includes('Progressive'), 'plan-phase progressive mode');
  assert(
    planPhaseCmd.includes('not in BUILD_PLAN') || planPhaseCmd.includes('New phase STOP'),
    'plan-phase can add new BUILD_PLAN phase'
  );
  assert(planPhaseCmd.includes('1. Add it'), 'plan-phase new phase Add option');
  assert(
    planPhaseCmd.includes('Status:** `planned`') || planPhaseCmd.includes('Status:** planned'),
    'plan-phase progressive uses Status planned lifecycle'
  );

  const buildPlanStub = read(cfg.buildPlan || 'docs/BUILD_PLAN.md');
  assert(buildPlanStub.includes('Phase: auth') || buildPlanStub.includes('auth — Authentication'), 'BUILD_PLAN named phase example');
  assert(buildPlanStub.includes('slug') || buildPlanStub.includes('Phase ids'), 'BUILD_PLAN documents phase ids');
  assert(progressStub.includes('plan-phase <slug>') || progressStub.includes('/plan-phase <slug>'), 'PROGRESS Phase health next uses slug');

  const buildPhaseCmd = read(path.join('.cursor', 'commands', 'build-phase.md'));
  assert(buildPhaseCmd.includes('1. Accept →'), 'build-phase intent gate numbered');
  assert(buildPhaseCmd.includes('WHEN'), 'build-phase behavior delta WHEN');
  assert(buildPhaseCmd.includes('THEN'), 'build-phase behavior delta THEN');
  assert(buildPhaseCmd.includes('≥1 scenario'), 'build-phase requires scenarios per SHALL');
  assert(buildPhaseCmd.includes('Before the intent gate'), 'build-phase blocks incomplete delta');
  assert(buildPhaseCmd.includes('Pre-build consistency'), 'build-phase pre-build consistency');
  assert(buildPhaseCmd.includes('fail-soft') || buildPhaseCmd.includes('soft'), 'build-phase consistency fail-soft');
  assert(buildPhaseCmd.includes('blocking'), 'build-phase consistency blocking');
  assert(buildPhaseCmd.includes('2. Owner override'), 'build-phase consistency override');
  assert(buildPhaseCmd.includes('**Trace**') || buildPhaseCmd.includes('Trace (SHALL'), 'build-phase trace table');
  assert(buildPhaseCmd.includes('Verify #'), 'build-phase trace Verify #');
  assert(buildPhaseCmd.includes('Phase health (resume)'), 'build-phase updates Phase health');
  assert(buildPhaseCmd.includes('awaiting-intent'), 'build-phase Phase health awaiting-intent');
  assert(buildPhaseCmd.includes('Resolve phase id'), 'build-phase resolves named phase id');
  assert(buildPhaseCmd.includes('phase-slug') || buildPhaseCmd.includes('[phase-slug]'), 'build-phase argument-hint slug');
  assert(
    buildPhaseCmd.includes('Progressive step capture') || buildPhaseCmd.includes('progressive step capture'),
    'build-phase progressive step capture'
  );
  assert(buildPhaseCmd.includes('Step playback'), 'build-phase step playback STOP');
  assert(buildPhaseCmd.includes('Done when'), 'build-phase playback Done when');
  assert(
    buildPhaseCmd.includes('1. Proceed') || buildPhaseCmd.includes('Proceed — implement'),
    'build-phase playback Proceed option'
  );

  const verifyPhaseNamed = read(path.join('.cursor', 'commands', 'verify-phase.md'));
  assert(verifyPhaseNamed.includes('Resolve phase id'), 'verify-phase resolves named phase id');
  assert(verifyPhaseNamed.includes('Evidence bar'), 'verify-phase evidence bar');
  assert(
    verifyPhaseNamed.includes('Inconclusive') || verifyPhaseNamed.includes('inconclusive'),
    'verify-phase inconclusive ≠ pass'
  );
  assert(verifyPhaseNamed.includes('agent_tool'), 'verify-phase evidence grade agent_tool');
  assert(verifyPhaseNamed.includes('owner_uat'), 'verify-phase evidence grade owner_uat');
  assert(verifyPhaseNamed.includes('not_run'), 'verify-phase evidence grade not_run');
  assert(
    verifyPhaseNamed.includes('Wrong surface') || verifyPhaseNamed.includes('wrong surface'),
    'verify-phase wrong surface ≠ pass'
  );
  assert(
    verifyPhaseNamed.includes('Incomplete evidence') ||
      verifyPhaseNamed.includes('do not mark verified'),
    'verify-phase incomplete evidence path'
  );
  assert(completePhaseCmd.includes('Resolve phase id'), 'complete-phase resolves named phase id');
  assert(setup.includes('slug') && setup.includes('Phase:'), 'setup Stage 8 drafts named Phase: slug sections');
  const phasePlansReadme = read(path.join(cfg.phasePlansDir || 'docs/phase-plans', 'README.md'));
  assert(
    phasePlansReadme.includes('/plan-phase <slug>') || phasePlansReadme.includes('phase-<slug>'),
    'phase-plans README uses slug'
  );
  assert(!phasePlansReadme.includes('/plan-phase N'), 'phase-plans README no bare /plan-phase N');
  assert(
    phasePlansReadme.includes('../PHASESTEP.md') || phasePlansReadme.includes('PHASESTEP.md'),
    'phase-plans README constitution href casing'
  );
  assert(
    phasePlansReadme.includes('Progressive') || phasePlansReadme.includes('progressive'),
    'phase-plans README mentions progressive'
  );

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
  assert(refinePhaseCmd.includes('Phase health'), 'refine-phase updates Phase health');
  assert(refinePhaseCmd.includes('Resolve phase id'), 'refine-phase resolves named phase id');
  assert(refinePhaseCmd.includes('Mid-phase side-work'), 'refine-phase mid-phase side-work section');
  assert(refinePhaseCmd.includes('Failure brief'), 'refine-phase failure brief');
  assert(
    refinePhaseCmd.includes('Root cause') || refinePhaseCmd.includes('root cause'),
    'refine-phase root cause in failure brief'
  );
  assert(
    refinePhaseCmd.includes('Blast radius') || refinePhaseCmd.includes('blast radius'),
    'refine-phase blast radius in failure brief'
  );
  assert(refinePhaseCmd.includes('Encode lessons'), 'refine-phase encode lessons STOP');
  assert(
    refinePhaseCmd.includes('Promote to project rule') ||
      refinePhaseCmd.includes('Encode in structure'),
    'refine-phase encode lessons options'
  );
  assert(
    refinePhaseCmd.includes('Side-work size STOP') ||
      refinePhaseCmd.includes('too large for this step/phase'),
    'refine-phase side-work size STOP'
  );
  assert(refinePhaseCmd.includes('Park for a new'), 'refine-phase size STOP park option');
  assert(refinePhaseCmd.includes('Absorb anyway'), 'refine-phase size STOP absorb option');
  assert(
    refinePhaseCmd.includes('Stop and re-plan') || refinePhaseCmd.includes('re-plan now'),
    'refine-phase size STOP re-plan option'
  );
  assert(
    refinePhaseCmd.includes('never chat-only') || refinePhaseCmd.includes('Never chat-only'),
    'refine-phase forbids chat-only side-work'
  );
  assert(
    buildPhaseCmd.includes('Mid-phase side-work') || buildPhaseCmd.includes('mid-phase side-work'),
    'build-phase points to mid-phase side-work'
  );
  assert(
    buildPhaseCmd.includes('chat-only') || buildPhaseCmd.includes('Do **not** leave Owner chat'),
    'build-phase forbids chat-only refinements'
  );
  assert(
    verifyPhaseNamed.includes('Mid-phase side-work') ||
      verifyPhaseNamed.includes('absorbed into this step'),
    'verify-phase covers absorbed side-work'
  );
  assert(
    completePhaseCmd.includes('parked mid-phase') ||
      completePhaseCmd.includes('Side-work size STOP'),
    'complete-phase remainder includes parked side-work'
  );

  const sessionLogCmd = read(path.join('.cursor', 'commands', 'session-log.md'));
  assert(sessionLogCmd.includes('Phase health (resume)'), 'session-log refreshes Phase health');
  assert(sessionLogCmd.includes('Resolve phase id'), 'session-log resolves named phase id');

  assert(buildPhaseCmd.includes('Cross-cutting STOP') || buildPhaseCmd.includes('core principle'), 'build-phase points to cross-cutting');
  assert(buildPhaseCmd.includes('/pr-step'), 'build-phase points to pr-step for commits');

  const githubConnectCmd = read(path.join('.cursor', 'commands', 'github-connect.md'));
  assert(githubConnectCmd.includes('gh auth'), 'github-connect mentions gh auth');
  assert(githubConnectCmd.includes('1. Connect'), 'github-connect numbered gate');
  assert(githubConnectCmd.includes('Git workflow'), 'github-connect Git workflow STOP');
  assert(githubConnectCmd.includes('1. Simple PR'), 'github-connect Simple PR option');
  assert(githubConnectCmd.includes('2. GitFlow'), 'github-connect GitFlow option');
  assert(githubConnectCmd.includes('3. Decide later'), 'github-connect Decide later option');
  assert(
    githubConnectCmd.includes('release = live') || githubConnectCmd.includes('live / deploy'),
    'github-connect explains release vs main'
  );
  assert(githubConnectCmd.includes('GitFlow branches'), 'github-connect GitFlow bootstrap STOP');
  assert(githubConnectCmd.includes('Change git workflow'), 'github-connect change workflow option');

  const prStepCmd = read(path.join('.cursor', 'commands', 'pr-step.md'));
  assert(prStepCmd.includes('authorizes'), 'pr-step invoke authorizes git writes');
  assert(prStepCmd.includes('Verified evidence'), 'pr-step Verified evidence section');
  assert(
    prStepCmd.includes('Verified:') || prStepCmd.includes('**Verified**'),
    'pr-step Verified line'
  );
  assert(
    prStepCmd.includes('n/a docs-only') || prStepCmd.includes('docs-only'),
    'pr-step docs-only soft path'
  );
  assert(
    prStepCmd.includes('Open verify fails') || prStepCmd.includes('open rejects'),
    'pr-step open fails STOP for code'
  );
  assert(
    prStepCmd.includes('Owner override') || prStepCmd.includes('land anyway'),
    'pr-step Owner override option'
  );
  assert(!prStepCmd.includes('Gate A —'), 'pr-step has no Gate A');
  assert(!prStepCmd.includes('Gate B —'), 'pr-step has no Gate B');
  assert(!prStepCmd.includes('Gate C —'), 'pr-step has no Gate C');
  assert(prStepCmd.includes('merge --no-ff'), 'pr-step prefers merge --no-ff');
  assert(prStepCmd.includes('Fail soft') || prStepCmd.includes('fail soft'), 'pr-step fail soft');
  assert(prStepCmd.includes('GitHub is not connected'), 'pr-step numbered not-connected STOP');
  assert(prStepCmd.includes('GitHub tooling not ready'), 'pr-step numbered tooling STOP');
  assert(prStepCmd.includes('1. Run /github-connect now'), 'pr-step connect-now option');
  assert(prStepCmd.includes('2. Continue with manual git/PR checklist'), 'pr-step manual checklist option');
  assert(prStepCmd.includes('Mode: Simple PR'), 'pr-step Simple mode section');
  assert(prStepCmd.includes('Mode: GitFlow'), 'pr-step GitFlow mode section');
  assert(prStepCmd.includes('Phase health (resume)'), 'pr-step resolves current from Phase health');
  assert(prStepCmd.includes('*(empty)* or `update`') || prStepCmd.includes('*(empty)* → `update`'), 'pr-step empty args means update');
  assert(prStepCmd.includes('Verb: `update`') || prStepCmd.includes('| `update` |'), 'pr-step update verb');
  assert(prStepCmd.includes('Verb: `release`') || prStepCmd.includes('| `release` |'), 'pr-step release verb');
  assert(prStepCmd.includes('Verb: `main`') || prStepCmd.includes('| `main` |'), 'pr-step main verb');
  assert(prStepCmd.includes('bugfix'), 'pr-step bugfix verb');
  assert(prStepCmd.includes('authorizes the full path'), 'pr-step bugfix/hotfix full-path authorize');
  assert(prStepCmd.includes('Mis-route') || prStepCmd.includes('switch to `/pr-step hotfix'), 'pr-step bugfix mis-route to hotfix');
  assert(prStepCmd.includes('hotfix'), 'pr-step hotfix verb');
  assert(prStepCmd.includes('develop'), 'pr-step develop / GitFlow develop');
  assert(prStepCmd.includes('release (live') || prStepCmd.includes('Live / deploy'), 'pr-step release is live line');
  assert(prStepCmd.includes('from `release`') || prStepCmd.includes('branch from `release`'), 'pr-step hotfix from release');
  assert(prStepCmd.includes('release` and `develop`') || prStepCmd.includes('release` **and** `develop`') || prStepCmd.includes('release + develop'), 'pr-step hotfix lands release and develop');
  assert(prStepCmd.includes('fully stable'), 'pr-step release reminds pr-step main when stable');
  assert(
    prStepCmd.includes('Soft-remind: when ready for live, `/pr-step release`') ||
      prStepCmd.includes('Soft-remind: when ready for live'),
    'pr-step bugfix soft-reminds release'
  );
  assert(
    prStepCmd.includes('Soft-remind: when live is stable again, `/pr-step main`') ||
      prStepCmd.includes('when live is stable again'),
    'pr-step hotfix soft-reminds main'
  );
  assert(
    prStepCmd.includes('Do not** force-push') ||
      prStepCmd.includes('Do **not** force-push') ||
      prStepCmd.includes('Never force-push') ||
      prStepCmd.includes('No force-push'),
    'pr-step never force-push'
  );
  assert(
    prStepCmd.includes('No deploy/hosting') || prStepCmd.includes('no deploy/hosting'),
    'pr-step no deploy recipes'
  );
  assert(githubConnectCmd.includes('release = live') || githubConnectCmd.includes('live / deploy'), 'github-connect release is live');
  assert(progressStub.includes('GitHub workflow:'), 'PROGRESS GitHub workflow example');
  assert(progressStub.includes('hotfix'), 'PROGRESS hotfix example');
  assert(progressStub.includes('bugfix'), 'PROGRESS bugfix example');
  assert(!progressStub.includes('PR https://'), 'PROGRESS examples prefer local merge status not PR URL');
  assert(progressStub.includes('merge --no-ff'), 'PROGRESS notes merge --no-ff');

  const prStepClaude = read(path.join('.claude', 'commands', 'pr-step.md'));
  const githubConnectClaude = read(path.join('.claude', 'commands', 'github-connect.md'));
  assert(prStepClaude === prStepCmd, 'claude pr-step body matches cursor');
  assert(githubConnectClaude === githubConnectCmd, 'claude github-connect body matches cursor');

  const agentsMd = read('AGENTS.md');
  assert(agentsMd.includes('authorizes') || agentsMd.includes('invoke authorizes'), 'codex AGENTS mentions authorize');
  assert(agentsMd.includes('release') && agentsMd.includes('live'), 'codex AGENTS mentions release=live');
  assert(agentsMd.includes('hotfix'), 'codex AGENTS mentions hotfix');
  assert(agentsMd.includes('bugfix'), 'codex AGENTS mentions bugfix');
  assert(agentsMd.includes('/pr-step main') || agentsMd.includes('`/pr-step main`'), 'codex AGENTS mentions pr-step main');
  assert(
    agentsMd.includes('Mid-phase side-work') || agentsMd.includes('Side-work size STOP'),
    'codex AGENTS mentions mid-phase side-work'
  );
  assert(
    agentsMd.includes('Progressive phases') || agentsMd.includes('progressive'),
    'codex AGENTS mentions progressive phases'
  );
  assert(
    agentsMd.includes('Evidence bar') || agentsMd.includes('evidence bar'),
    'codex AGENTS mentions evidence bar'
  );
  assert(
    agentsMd.includes('Failure brief') || agentsMd.includes('failure brief'),
    'codex AGENTS mentions failure brief'
  );
  assert(
    agentsMd.includes('Step playback') || agentsMd.includes('step playback'),
    'codex AGENTS mentions step playback'
  );
  assert(
    agentsMd.includes('Verification map') || agentsMd.includes('VERIFICATION_MAP'),
    'codex AGENTS mentions verification map'
  );
  assert(
    agentsMd.includes('Encode lessons') || agentsMd.includes('encode lessons'),
    'codex AGENTS mentions encode lessons'
  );
  assert(
    agentsMd.includes('Verified') &&
      (agentsMd.includes('open fails') || agentsMd.includes('Owner override')),
    'codex AGENTS mentions Verified ship'
  );

  const auditPhaseCmd = read(path.join('.cursor', 'commands', 'audit-phase.md'));
  assert(
    auditPhaseCmd.includes('delivery-only') ||
      auditPhaseCmd.includes('named build phase') ||
      auditPhaseCmd.includes('Build Phase'),
    'audit-phase delivery only'
  );
  assert(auditPhaseCmd.includes('Resolve phase id'), 'audit-phase resolves named phase id');
  assert(
    auditPhaseCmd.includes('absorbed mid-phase') || auditPhaseCmd.includes('mid-phase absorbed'),
    'audit-phase covers absorbed side-work'
  );
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
  assert(
    auditCampaignCmd.includes('/audit-phase <slug>') || !auditCampaignCmd.includes('/audit-phase N'),
    'audit-campaign delivery pointer uses slug not bare N'
  );
  assert(auditCampaignCmd.includes('audit-campaign-ds'), 'audit-campaign invokes audit-campaign-ds');
  assert(auditCampaignCmd.includes('/audit-campaign N+1'), 'audit-campaign option 4 uses audit-campaign next');
  assert(!auditCampaignCmd.includes('Mode A'), 'audit-campaign has no delivery Mode A');

  const auditDs = read(path.join('.cursor', 'commands', 'audit-ds.md'));
  assert(auditDs.includes('Delivery-only'), 'audit-ds delivery only');
  assert(auditDs.includes('/refine-phase'), 'audit-ds refine-phase path');
  assert(auditDs.includes('Resolve phase id') || auditDs.includes('phase-slug'), 'audit-ds named phase slug');
  assert(
    auditDs.includes('mid-phase absorbed') || auditDs.includes('absorbed side-work'),
    'audit-ds covers absorbed side-work'
  );

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
  fs.rmSync(path.join(TMP, cfg.verificationMap));
  run(['upgrade', TMP]);
  assert(read(cfg.productSpec).includes('KEEP_ME'), 'upgrade preserves Owner docs');
  assert(fs.existsSync(path.join(TMP, cfg.auditPlan)), 'upgrade restores missing stubs');
  assert(
    fs.existsSync(path.join(TMP, cfg.verificationMap)),
    'upgrade restores VERIFICATION_MAP stub'
  );
  assert(
    JSON.parse(fs.readFileSync(path.join(TMP, 'phasestep.json'), 'utf8')).verificationMap,
    'upgrade merges verificationMap config key'
  );
  assert(
    read(path.join('.cursor', 'commands', 'setup.md')).includes('Greenfield vs existing'),
    'upgrade refreshed setup command'
  );

  // Soft-migrate GitHub section into existing PROGRESS without --force-docs
  const progressPath = path.join(TMP, cfg.progress);
  let progressBody = read(cfg.progress);
  progressBody = progressBody.replace(
    /### GitHub[\s\S]*?(?=\n---\n\n## Audit campaign|\n## Audit campaign|$)/,
    ''
  );
  fs.writeFileSync(progressPath, progressBody, 'utf8');
  assert(!read(cfg.progress).includes('### GitHub'), 'PROGRESS GitHub section stripped for migrate test');
  run(['upgrade', TMP]);
  assert(read(cfg.progress).includes('### GitHub'), 'upgrade soft-migrates PROGRESS GitHub section');
  assert(read(cfg.progress).includes('bugfix form-validation'), 'upgrade soft-migrate includes bugfix example');
  assert(!read(cfg.progress).includes('PR https://'), 'upgrade soft-migrate has no stale PR https example');
  assert(read(cfg.productSpec).includes('KEEP_ME'), 'upgrade GitHub migrate preserves Owner docs');

  // Soft-migrate Phase health into existing PROGRESS without --force-docs
  progressBody = read(cfg.progress);
  progressBody = progressBody.replace(
    /## Phase health[\s\S]*?(?=\n---\n\n## |\n## Setup\b|\n## Build progress\b|$)/,
    ''
  );
  fs.writeFileSync(progressPath, progressBody, 'utf8');
  assert(!read(cfg.progress).includes('Phase health (resume)'), 'PROGRESS Phase health stripped for migrate test');
  run(['upgrade', TMP]);
  assert(read(cfg.progress).includes('Phase health (resume)'), 'upgrade soft-migrates PROGRESS Phase health');
  assert(read(cfg.productSpec).includes('KEEP_ME'), 'upgrade Phase health migrate preserves Owner docs');

  // force-docs overwrites
  run(['upgrade', TMP, '--force-docs']);
  assert(!read(cfg.productSpec).includes('KEEP_ME'), 'upgrade --force-docs resets stubs');

  // cursor-only init
  const TMP2 = path.join(ROOT, 'tmp-smoke-cursor');
  rmrf(TMP2);
  const cursorInitOut = run(['init', TMP2, '--adapters=cursor']);
  assert(cursorInitOut.includes('Installed for:'), 'init prints install matrix');
  assert(cursorInitOut.includes('cursor → .cursor/commands/'), 'init matrix lists cursor path');
  assert(fs.existsSync(path.join(TMP2, '.cursor', 'commands', 'setup.md')), 'cursor-only setup');
  assert(!fs.existsSync(path.join(TMP2, '.claude', 'commands', 'setup.md')), 'no claude when cursor-only');
  assert(!fs.existsSync(path.join(TMP2, 'AGENTS.md')), 'no AGENTS when cursor-only');
  const cursorCheckOk = run(['check', TMP2]);
  assert(cursorCheckOk.includes('Supported agents'), 'check prints supported agents matrix');
  assert(cursorCheckOk.includes('Adapter: cursor'), 'check groups cursor adapter');
  assert(cursorCheckOk.includes('[x] cursor'), 'check marks selected cursor adapter');
  assert(cursorCheckOk.includes('[ ] claude'), 'check marks unselected claude adapter');
  assert(cursorCheckOk.includes('All required Phasestep artifacts present'), 'cursor-only check passes');
  assert(
    cursorCheckOk.includes('VERIFICATION_MAP') || cursorCheckOk.includes('verification'),
    'check requires VERIFICATION_MAP'
  );
  assert(
    cursorCheckOk.includes('PROJECT_MAP') || cursorCheckOk.includes('projectMap') || cursorCheckOk.includes('PROJECT_MAP.md'),
    'check requires PROJECT_MAP'
  );

  // Missing command file → incomplete adapter diagnostic
  fs.unlinkSync(path.join(TMP2, '.cursor', 'commands', 'setup.md'));
  let checkMissOut = '';
  try {
    run(['check', TMP2]);
    throw new Error('expected check to fail when setup.md missing');
  } catch (e) {
    if (e.message === 'expected check to fail when setup.md missing') throw e;
    checkMissOut = `${e.stdout || ''}${e.stderr || ''}`;
  }
  assert(checkMissOut.includes('MISS') && checkMissOut.includes('setup.md'), 'check reports missing setup.md');
  assert(checkMissOut.includes('Incomplete adapter install: cursor'), 'check flags incomplete cursor adapter');
  assert(checkMissOut.includes('npx phasestep upgrade'), 'check suggests upgrade for missing commands');

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

  // IDE plugins (generated; npm run smoke regenerates first)
  const cursorPlugin = path.join(ROOT, 'plugins', 'cursor');
  const claudePlugin = path.join(ROOT, 'plugins', 'claude');
  assert(
    fs.existsSync(path.join(cursorPlugin, '.cursor-plugin', 'plugin.json')),
    'cursor plugin manifest'
  );
  assert(
    fs.existsSync(path.join(claudePlugin, '.claude-plugin', 'plugin.json')),
    'claude plugin manifest'
  );
  assert(
    fs.existsSync(path.join(cursorPlugin, 'commands', 'setup.md')),
    'cursor plugin /setup'
  );
  assert(
    fs.existsSync(path.join(cursorPlugin, 'commands', 'status.md')),
    'cursor plugin /status'
  );
  assert(
    fs.existsSync(path.join(claudePlugin, 'commands', 'setup.md')),
    'claude plugin /setup'
  );
  assert(
    fs.existsSync(path.join(cursorPlugin, 'scaffold', 'phasestep.json')),
    'cursor plugin scaffold config'
  );
  assert(
    fs.existsSync(path.join(cursorPlugin, 'scaffold', 'SCAFFOLD.md')),
    'cursor plugin SCAFFOLD.md'
  );
  assert(
    fs.existsSync(path.join(claudePlugin, 'scaffold', 'phasestep.json')),
    'claude plugin scaffold config'
  );
  const pluginSetup = fs.readFileSync(
    path.join(cursorPlugin, 'commands', 'setup.md'),
    'utf8'
  );
  assert(
    pluginSetup.includes('Ensure project install'),
    'plugin setup has ensure-install gate'
  );
  assert(
    !pluginSetup.includes('](../../docs/'),
    'plugin commands use workspace-root links (no ../../docs)'
  );
  assert(
    fs.existsSync(path.join(ROOT, '.cursor-plugin', 'marketplace.json')),
    'cursor marketplace manifest'
  );
  assert(
    fs.existsSync(path.join(ROOT, '.claude-plugin', 'marketplace.json')),
    'claude marketplace manifest'
  );

  rmrf(TMP);
  rmrf(TMP2);
  rmrf(TMP3);
  rmrf(TMP4);
  console.log('\nAll smoke + setup contract checks passed.\n');
}

main();
