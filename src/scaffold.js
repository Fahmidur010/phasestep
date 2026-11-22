'use strict';

const fs = require('fs');
const path = require('path');

const DEFAULTS = {
  productSpec: 'docs/product.md',
  userFlow: 'docs/USER_FLOW.md',
  architecture: 'docs/architecture.md',
  decisions: 'docs/decisions.md',
  buildPlan: 'docs/BUILD_PLAN.md',
  auditPlan: 'docs/AUDIT_PLAN.md',
  auditReportsDir: 'docs/audit-reports',
  projectMap: 'docs/PROJECT_MAP.md',
  verificationMap: 'docs/VERIFICATION_MAP.md',
  progress: 'docs/PROGRESS.md',
  phasePlansDir: 'docs/phase-plans',
  designSystem: 'docs/DESIGN_SYSTEM.md',
  uiPrimitivesDir: 'components/ui',
  buildCommand: 'npm run build',
  constitutionPath: 'docs/PHASESTEP.md',
  stackCatalog: '.phasestep/stack-catalog.json',
  designCatalog: '.phasestep/design-catalog.json',
  adapters: ['cursor', 'claude', 'codex'],
  github: {
    remote: 'origin',
    repo: '',
    // workflow: omit until /github-connect — then "simple" | "gitflow"
  },
};

const COMMAND_FILES = [
  'README.md',
  'setup.md',
  'plan-phase.md',
  'build-phase.md',
  'verify-phase.md',
  'refine-phase.md',
  'audit-phase.md',
  'audit-campaign.md',
  'complete-phase.md',
  'session-log.md',
  'audit-ds.md',
  'audit-campaign-ds.md',
  'audit-project.md',
  'refine-audit.md',
  'complete-audit.md',
  'map-project.md',
  'github-connect.md',
  'pr-step.md',
];

const OWNER_STUBS = [
  ['project/product.md', 'productSpec'],
  ['project/USER_FLOW.md', 'userFlow'],
  ['project/architecture.md', 'architecture'],
  ['project/decisions.md', 'decisions'],
  ['project/BUILD_PLAN.md', 'buildPlan'],
  ['project/AUDIT_PLAN.md', 'auditPlan'],
  ['project/PROJECT_MAP.md', 'projectMap'],
  ['project/VERIFICATION_MAP.md', 'verificationMap'],
  ['project/PROGRESS.md', 'progress'],
  ['project/phase-plans-README.md', { dirKey: 'phasePlansDir' }],
  ['project/audit-reports-README.md', { dirKey: 'auditReportsDir' }],
  ['project/DESIGN_SYSTEM.md', 'designSystem'],
];

const LEGACY_CATALOG_DIR = path.join('.cursor', 'phasestep');
const CODEX_MARKER_START = '<!-- phasestep:codex:start -->';
const CODEX_MARKER_END = '<!-- phasestep:codex:end -->';

const ADAPTER_IDS = new Set(['cursor', 'claude', 'codex']);

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

function normalizeAdapters(raw) {
  const list = Array.isArray(raw) ? raw : DEFAULTS.adapters;
  const out = [];
  for (const id of list) {
    const key = String(id).toLowerCase().trim();
    if (!ADAPTER_IDS.has(key)) {
      throw new Error(`Unknown adapter: ${id} (expected cursor|claude|codex)`);
    }
    if (!out.includes(key)) out.push(key);
  }
  if (!out.length) out.push('cursor');
  return out;
}

function parseAdaptersFlag(args) {
  const flag = args.find((a) => a.startsWith('--adapters='));
  if (!flag) return null;
  return flag
    .slice('--adapters='.length)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function varsFromConfig(config) {
  return {
    PRODUCT_SPEC: config.productSpec,
    USER_FLOW: config.userFlow,
    ARCHITECTURE: config.architecture,
    DECISIONS: config.decisions,
    BUILD_PLAN: config.buildPlan,
    AUDIT_PLAN: config.auditPlan,
    AUDIT_REPORTS_DIR: config.auditReportsDir,
    PROJECT_MAP: config.projectMap,
    VERIFICATION_MAP: config.verificationMap,
    PROGRESS: config.progress,
    PHASE_PLANS_DIR: config.phasePlansDir,
    DESIGN_SYSTEM: config.designSystem,
    UI_PRIMITIVES_DIR: config.uiPrimitivesDir,
    BUILD_COMMAND: config.buildCommand,
    CONSTITUTION: config.constitutionPath,
    STACK_CATALOG: config.stackCatalog,
    DESIGN_CATALOG: config.designCatalog,
  };
}

function mergeConfig(existing) {
  const merged = { ...DEFAULTS, ...(existing || {}) };
  merged.adapters = normalizeAdapters(merged.adapters);
  return merged;
}

function loadExistingConfig(targetDir) {
  const configPath = path.join(targetDir, 'phasestep.json');
  const legacyPath = path.join(targetDir, 'phasegate.json');
  if (fs.existsSync(configPath)) {
    return {
      path: configPath,
      data: JSON.parse(fs.readFileSync(configPath, 'utf8')),
    };
  }
  if (fs.existsSync(legacyPath)) {
    return {
      path: legacyPath,
      data: JSON.parse(fs.readFileSync(legacyPath, 'utf8')),
    };
  }
  return null;
}

function resolveCatalogPaths(targetDir, config) {
  const stack = config.stackCatalog || DEFAULTS.stackCatalog;
  const design = config.designCatalog || DEFAULTS.designCatalog;
  const legacyStack = path.join(LEGACY_CATALOG_DIR, 'stack-catalog.json');
  const legacyDesign = path.join(LEGACY_CATALOG_DIR, 'design-catalog.json');

  // Prefer configured path; if missing on disk but legacy exists, keep writing to configured (upgrade migrates)
  return {
    stackCatalog: stack,
    designCatalog: design,
    legacyStack,
    legacyDesign,
    hasLegacy:
      fs.existsSync(path.join(targetDir, legacyStack)) ||
      fs.existsSync(path.join(targetDir, legacyDesign)),
  };
}

function installConstitution(packageRoot, targetDir, config, { force }) {
  const constitutionSrc = path.join(packageRoot, 'constitution', 'PHASESTEP.md');
  writeFile(
    path.join(targetDir, config.constitutionPath),
    fs.readFileSync(constitutionSrc, 'utf8'),
    { force }
  );
}

function installConfig(targetDir, config, { force }) {
  const out = { ...config, adapters: normalizeAdapters(config.adapters) };
  writeFile(
    path.join(targetDir, 'phasestep.json'),
    `${JSON.stringify(out, null, 2)}\n`,
    { force }
  );
}

function installCommands(packageRoot, targetDir, config, { force, adapters }) {
  const vars = varsFromConfig(config);
  const list = adapters || normalizeAdapters(config.adapters);

  if (list.includes('cursor')) {
    for (const name of COMMAND_FILES) {
      const raw = readTemplate(packageRoot, path.join('cursor', 'commands', name));
      writeFile(
        path.join(targetDir, '.cursor', 'commands', name),
        applyVars(raw, vars),
        { force }
      );
    }
  }

  if (list.includes('claude')) {
    for (const name of COMMAND_FILES) {
      if (name === 'README.md') {
        const raw = readTemplate(packageRoot, path.join('claude', 'commands', 'README.md'));
        writeFile(
          path.join(targetDir, '.claude', 'commands', 'README.md'),
          applyVars(raw, vars),
          { force }
        );
        continue;
      }
      const raw = readTemplate(packageRoot, path.join('cursor', 'commands', name));
      writeFile(
        path.join(targetDir, '.claude', 'commands', name),
        applyVars(raw, vars),
        { force }
      );
    }
  }

  if (list.includes('codex')) {
    installCodexAgents(packageRoot, targetDir, config, { force });
  }
}

function installCodexAgents(packageRoot, targetDir, config, { force }) {
  const vars = varsFromConfig(config);
  const blockRaw = readTemplate(packageRoot, path.join('codex', 'AGENTS.phasestep.md'));
  const block = `${CODEX_MARKER_START}\n${applyVars(blockRaw, vars).trim()}\n${CODEX_MARKER_END}\n`;
  const agentsPath = path.join(targetDir, 'AGENTS.md');

  if (!fs.existsSync(agentsPath)) {
    writeFile(agentsPath, `# AGENTS\n\n${block}`, { force: true });
    return;
  }

  const existing = fs.readFileSync(agentsPath, 'utf8');
  const start = existing.indexOf(CODEX_MARKER_START);
  const end = existing.indexOf(CODEX_MARKER_END);

  if (start !== -1 && end !== -1 && end > start) {
    if (!force) {
      console.log(`  skip (exists managed block): ${agentsPath}`);
      return;
    }
    const next =
      existing.slice(0, start) +
      block +
      existing.slice(end + CODEX_MARKER_END.length).replace(/^\r?\n/, '');
    fs.writeFileSync(agentsPath, next, 'utf8');
    console.log(`  write: ${agentsPath} (phasestep block)`);
    return;
  }

  if (!force) {
    // Append managed block once without --force so first upgrade/init adds guidance
    fs.writeFileSync(agentsPath, `${existing.replace(/\s*$/, '')}\n\n${block}`, 'utf8');
    console.log(`  write: ${agentsPath} (append phasestep block)`);
    return;
  }

  fs.writeFileSync(agentsPath, `${existing.replace(/\s*$/, '')}\n\n${block}`, 'utf8');
  console.log(`  write: ${agentsPath} (append phasestep block)`);
}

function installOwnerStubs(packageRoot, targetDir, config, { force }) {
  const vars = varsFromConfig(config);
  for (const [stubRel, key] of OWNER_STUBS) {
    const destRel =
      typeof key === 'object' && key !== null
        ? path.join(config[key.dirKey], 'README.md')
        : config[key];
    const raw = readTemplate(packageRoot, stubRel);
    writeFile(path.join(targetDir, destRel), applyVars(raw, vars), { force });
  }
}

/** Section appended to existing PROGRESS.md on upgrade when missing (no full stub rewrite). */
const PROGRESS_GITHUB_SECTION = `### GitHub (optional — via \`/github-connect\` + \`/pr-step\`)

Offered at \`/setup\` Finish (Connect now / Skip). Re-run \`/github-connect\` anytime if skipped or remote changes. After connect, Owner picks **Simple PR** or **GitFlow** (\`github.workflow\`).

\`\`\`text
GitHub: connected — owner/repo (origin) — YYYY-MM-DD
GitHub workflow: simple | gitflow — YYYY-MM-DD
GitHub: skipped at setup — YYYY-MM-DD
GitHub PR: update [phase N step S] → main — branch … — status merged — date
GitHub PR: update feature/phase-slug → develop — status merged — date
GitHub: release promoted — develop → release — date
GitHub: main promoted — release → main — tag vX.Y.Z — date
GitHub: hotfix login-timeout → release + develop — status merged — date
GitHub: bugfix form-validation → develop — status merged — date
\`\`\`

("merged" includes local \`merge --no-ff\` + push; \`/pr-step\` prefers that over \`gh pr create\`.)

`;

const PROGRESS_PHASE_HEALTH_SECTION = `## Phase health (resume)

Rolling snapshot for mid-session resume. **Overwrite** the fenced block on each material gate (\`/build-phase\` → intent → \`/verify-phase\` → \`/refine-phase\` → \`/complete-phase\`). Do not append history here — use **Session log** for that.

\`\`\`text
Phase: — (slug — Title; legacy Phase N ok)
Step: —
Status: idle
Verified steps: none
Open rejects / fails: none
Evidence: none
Next: /setup or /plan-phase <slug>
Updated: —
\`\`\`

Status values: \`idle\` · \`building\` · \`awaiting-intent\` · \`awaiting-verify\` · \`verified\` · \`refining\` · \`auditing\` · \`complete\`

`;

/**
 * Soft-migrate: if PROGRESS exists but lacks a GitHub section, insert it
 * before Audit campaign (or append). Never overwrites Owner checklist content.
 * @returns {boolean} whether the file was updated
 */
function ensureProgressGitHubSection(targetDir, config) {
  const rel = (config && config.progress) || DEFAULTS.progress;
  const full = path.join(targetDir, rel);
  if (!fs.existsSync(full)) return false;

  const body = fs.readFileSync(full, 'utf8');
  if (/###\s*GitHub/i.test(body) || /GitHub \(optional/i.test(body)) {
    return false;
  }

  const block = `\n---\n\n${PROGRESS_GITHUB_SECTION}`;
  let next;
  const auditIdx = body.search(/\n##\s+Audit campaign\b/);
  if (auditIdx !== -1) {
    next = `${body.slice(0, auditIdx).replace(/\s*$/, '')}${block}${body.slice(auditIdx)}`;
  } else {
    next = `${body.replace(/\s*$/, '')}${block}`;
  }

  fs.writeFileSync(full, next, 'utf8');
  console.log(`  update: ${rel} (added GitHub section)`);
  return true;
}

/**
 * Soft-migrate: if PROGRESS exists but lacks Phase health, insert it
 * before Build progress (or append). Never overwrites Owner content.
 * @returns {boolean} whether the file was updated
 */
function ensureProgressPhaseHealthSection(targetDir, config) {
  const rel = (config && config.progress) || DEFAULTS.progress;
  const full = path.join(targetDir, rel);
  if (!fs.existsSync(full)) return false;

  const body = fs.readFileSync(full, 'utf8');
  if (/##\s*Phase health/i.test(body) || /Phase health \(resume\)/i.test(body)) {
    return false;
  }

  const block = `\n---\n\n${PROGRESS_PHASE_HEALTH_SECTION}`;
  let next;
  const buildIdx = body.search(/\n##\s+Build progress\b/);
  if (buildIdx !== -1) {
    next = `${body.slice(0, buildIdx).replace(/\s*$/, '')}${block}${body.slice(buildIdx)}`;
  } else {
    const setupIdx = body.search(/\n##\s+Setup\b/);
    if (setupIdx !== -1) {
      next = `${body.slice(0, setupIdx).replace(/\s*$/, '')}${block}${body.slice(setupIdx)}`;
    } else {
      next = `${body.replace(/\s*$/, '')}${block}`;
    }
  }

  fs.writeFileSync(full, next, 'utf8');
  console.log(`  update: ${rel} (added Phase health section)`);
  return true;
}
function installCatalogs(packageRoot, targetDir, config, { force }) {
  const paths = resolveCatalogPaths(targetDir, config);

  writeFile(
    path.join(targetDir, paths.stackCatalog),
    readTemplate(packageRoot, path.join('enrichment', 'stack-catalog.json')),
    { force }
  );
  writeFile(
    path.join(targetDir, paths.designCatalog),
    readTemplate(packageRoot, path.join('enrichment', 'design-catalog.json')),
    { force }
  );
  writeFile(
    path.join(targetDir, path.dirname(paths.stackCatalog), 'README.md'),
    readTemplate(packageRoot, path.join('enrichment', 'README.md')),
    { force }
  );

  // Soft-migrate: if legacy catalogs exist and new paths were written, note it
  if (paths.hasLegacy && paths.stackCatalog !== paths.legacyStack) {
    console.log(
      `  note: legacy catalogs under ${LEGACY_CATALOG_DIR}/ may remain; prefer ${paths.stackCatalog}`
    );
  }
}

function commandPathsForAdapters(adapters, config) {
  const list = normalizeAdapters(adapters || config.adapters);
  const paths = [];
  if (list.includes('cursor')) {
    for (const name of COMMAND_FILES) {
      if (name === 'README.md') continue;
      paths.push(path.join('.cursor', 'commands', name));
    }
  }
  if (list.includes('claude')) {
    for (const name of COMMAND_FILES) {
      if (name === 'README.md') continue;
      paths.push(path.join('.claude', 'commands', name));
    }
  }
  return { adapters: list, paths };
}

/**
 * Scan command dirs + AGENTS for coexistence with foreign workflows.
 * Call before install/upgrade to see what already exists.
 */
function scanAlongside(targetDir, adapters) {
  const list = normalizeAdapters(adapters);
  const owned = new Set(COMMAND_FILES);
  const collisions = [];
  const foreign = [];

  for (const adapter of ['cursor', 'claude']) {
    if (!list.includes(adapter)) continue;
    const relDir =
      adapter === 'cursor' ? path.join('.cursor', 'commands') : path.join('.claude', 'commands');
    const fullDir = path.join(targetDir, relDir);
    if (!fs.existsSync(fullDir)) continue;
    for (const name of fs.readdirSync(fullDir).filter((f) => f.endsWith('.md')).sort()) {
      const rel = path.join(relDir, name);
      if (owned.has(name)) {
        collisions.push({ adapter, name, rel });
      } else {
        foreign.push({ adapter, name, rel });
      }
    }
  }

  let agents = 'n/a';
  let agentsOutside = false;
  if (list.includes('codex')) {
    const agentsPath = path.join(targetDir, 'AGENTS.md');
    if (!fs.existsSync(agentsPath)) {
      agents = 'missing';
    } else {
      const text = fs.readFileSync(agentsPath, 'utf8');
      const start = text.indexOf(CODEX_MARKER_START);
      const end = text.indexOf(CODEX_MARKER_END);
      if (start !== -1 && end !== -1 && end > start) {
        agents = 'has-block';
        const outside = `${text.slice(0, start)}${text.slice(end + CODEX_MARKER_END.length)}`.trim();
        agentsOutside = outside.length > 0;
      } else {
        agents = 'no-block';
        agentsOutside = text.trim().length > 0;
      }
    }
  }

  return {
    adapters: list,
    collisions,
    foreign,
    agents,
    agentsOutside,
  };
}

/**
 * Format Alongside section for init / upgrade / check.
 * @param {'init'|'upgrade'|'check'} context
 * @param {boolean} force — whether Phasestep-owned command files were/will be overwritten
 */
function formatAlongsideReport(scan, { context, force }) {
  const lines = [];
  lines.push('Alongside existing workflow');
  lines.push('');

  if (scan.foreign.length) {
    lines.push(
      `  Foreign commands left alone (${scan.foreign.length}): ${scan.foreign
        .map((f) => f.rel)
        .join(', ')}`
    );
  } else if (context !== 'check') {
    lines.push('  Foreign commands: none detected');
  }

  if (context === 'check') {
    if (scan.foreign.length) {
      lines.push(
        '  note: Phasestep is additive — your other slash commands stay; pick a primary loop'
      );
    }
    if (scan.adapters.includes('codex') && scan.agentsOutside) {
      lines.push(
        '  note: AGENTS.md has content outside the Phasestep markers (preserved)'
      );
    }
    if (!scan.foreign.length && !(scan.adapters.includes('codex') && scan.agentsOutside)) {
      return '';
    }
    return lines.join('\n');
  }

  if (scan.collisions.length) {
    if (force) {
      if (context === 'upgrade') {
        lines.push(
          `  Refreshed ${scan.collisions.length} Phasestep-named command file(s); foreign commands were not touched`
        );
      } else {
        lines.push(
          `  Overwrote Phasestep-named files (${scan.collisions.length}) — foreign commands were not touched`
        );
        for (const c of scan.collisions.slice(0, 8)) {
          lines.push(`         ${c.rel}`);
        }
      }
    } else {
      lines.push(
        `  WARN  Name collision(s) skipped (${scan.collisions.length}) — kept your file; Phasestep body not installed for:`
      );
      for (const c of scan.collisions.slice(0, 8)) {
        lines.push(`         ${c.rel}`);
      }
      if (scan.collisions.length > 8) {
        lines.push(`         … +${scan.collisions.length - 8} more`);
      }
      lines.push(
        '         Fix: rename your custom file, or re-run with --force to replace Phasestep-named commands only'
      );
    }
  } else {
    lines.push('  Name collisions: none');
  }

  if (scan.adapters.includes('codex')) {
    if (scan.agents === 'missing') {
      lines.push('  AGENTS.md: will be created with Phasestep block');
    } else if (scan.agents === 'no-block') {
      lines.push('  AGENTS.md: Phasestep block appended (your content preserved)');
    } else if (scan.agents === 'has-block') {
      lines.push(
        scan.agentsOutside
          ? '  AGENTS.md: Phasestep block present; content outside markers preserved'
          : '  AGENTS.md: Phasestep managed block present'
      );
    }
  }

  lines.push('');
  lines.push(
    '  Phasestep is additive — pick a primary loop; do not expect the agent to merge two workflows.'
  );
  if (context === 'init') {
    lines.push('  Mid-project: run /setup → Existing (mid-project).');
    lines.push(
      '  Then /setup Workflow mode: Sole Phasestep (recommended, Owner-gated archive) or Alongside (opt-in).'
    );
  }

  return lines.join('\n');
}

module.exports = {
  DEFAULTS,
  COMMAND_FILES,
  ADAPTER_IDS,
  CODEX_MARKER_START,
  CODEX_MARKER_END,
  ensureDir,
  writeFile,
  readTemplate,
  applyVars,
  normalizeAdapters,
  parseAdaptersFlag,
  varsFromConfig,
  mergeConfig,
  loadExistingConfig,
  installConstitution,
  installConfig,
  installCommands,
  installCodexAgents,
  installOwnerStubs,
  ensureProgressGitHubSection,
  ensureProgressPhaseHealthSection,
  installCatalogs,
  commandPathsForAdapters,
  resolveCatalogPaths,
  scanAlongside,
  formatAlongsideReport,
};
