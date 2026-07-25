'use strict';

const fs = require('fs');
const path = require('path');

const DEFAULTS = {
  productSpec: 'docs/product.md',
  architecture: 'docs/architecture.md',
  decisions: 'docs/decisions.md',
  buildPlan: 'docs/BUILD_PLAN.md',
  progress: 'docs/PROGRESS.md',
  phasePlansDir: 'docs/phase-plans',
  designSystem: 'docs/DESIGN_SYSTEM.md',
  uiPrimitivesDir: 'components/ui',
  buildCommand: 'npm run build',
  constitutionPath: 'docs/PHASESTEP.md',
};

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeFile(filePath, content, { force }) {
  if (fs.existsSync(filePath) && !force) {
    console.log(`  skip (exists): ${filePath}`);
    return false;
  }
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  write: ${filePath}`);
  return true;
}

function readTemplate(packageRoot, rel) {
  return fs.readFileSync(path.join(packageRoot, 'templates', rel), 'utf8');
}

function applyVars(template, vars) {
  return template.replace(/\{\{([A-Z0-9_]+)\}\}/g, (_, key) => {
    if (!(key in vars)) {
      throw new Error(`Missing template variable: ${key}`);
    }
    return vars[key];
  });
}

async function init({ packageRoot, targetDir, force }) {
  console.log(`\nphasestep init → ${targetDir}\n`);

  const config = { ...DEFAULTS };
  const vars = {
    PRODUCT_SPEC: config.productSpec,
    ARCHITECTURE: config.architecture,
    DECISIONS: config.decisions,
    BUILD_PLAN: config.buildPlan,
    PROGRESS: config.progress,
    PHASE_PLANS_DIR: config.phasePlansDir,
    DESIGN_SYSTEM: config.designSystem,
    UI_PRIMITIVES_DIR: config.uiPrimitivesDir,
    BUILD_COMMAND: config.buildCommand,
    CONSTITUTION: config.constitutionPath,
  };

  const constitutionSrc = path.join(packageRoot, 'constitution', 'PHASESTEP.md');
  writeFile(
    path.join(targetDir, config.constitutionPath),
    fs.readFileSync(constitutionSrc, 'utf8'),
    { force }
  );

  writeFile(
    path.join(targetDir, 'phasestep.json'),
    `${JSON.stringify(config, null, 2)}\n`,
    { force }
  );

  const commandFiles = [
    'README.md',
    'plan-phase.md',
    'build-phase.md',
    'verify-phase.md',
    'refine-phase.md',
    'audit-phase.md',
    'complete-phase.md',
    'session-log.md',
    'audit-ds-phase.md',
  ];

  for (const name of commandFiles) {
    const raw = readTemplate(packageRoot, path.join('cursor', 'commands', name));
    writeFile(
      path.join(targetDir, '.cursor', 'commands', name),
      applyVars(raw, vars),
      { force }
    );
  }

  const stubs = [
    ['project/product.md', config.productSpec],
    ['project/architecture.md', config.architecture],
    ['project/decisions.md', config.decisions],
    ['project/BUILD_PLAN.md', config.buildPlan],
    ['project/PROGRESS.md', config.progress],
    ['project/phase-plans-README.md', path.join(config.phasePlansDir, 'README.md')],
    ['project/DESIGN_SYSTEM.md', config.designSystem],
  ];

  for (const [stubRel, destRel] of stubs) {
    const raw = readTemplate(packageRoot, stubRel);
    writeFile(path.join(targetDir, destRel), applyVars(raw, vars), { force });
  }

  console.log(`
Done.

Next:
  1. Fill in ${config.productSpec}, ${config.buildPlan}, ${config.architecture}
  2. Open the project in Cursor
  3. Run /plan-phase 1

Constitution: ${config.constitutionPath}
Config:       phasestep.json
`);
}

module.exports = { init, DEFAULTS };
