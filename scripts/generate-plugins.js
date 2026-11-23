'use strict';

/**
 * Generate IDE plugins from templates/ + constitution/.
 * Source of truth stays templates/cursor/commands (same as CLI).
 *
 *   node scripts/generate-plugins.js
 */

const fs = require('fs');
const path = require('path');
const {
  DEFAULTS,
  COMMAND_FILES,
  varsFromConfig,
  applyVars,
  mergeConfig,
  normalizeAdapters,
} = require('../src/scaffold');

const ROOT = path.join(__dirname, '..');
const PKG = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
const VERSION = PKG.version;

const CURSOR_OUT = path.join(ROOT, 'plugins', 'cursor');
const CLAUDE_OUT = path.join(ROOT, 'plugins', 'claude');

function rmrf(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function write(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf8');
}

function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function workspaceLinks(body) {
  // Project-local commands use ../../path from .cursor/commands/.
  // Plugin commands are outside the repo — use workspace-root paths.
  return body.replace(/\]\(\.\.\/\.\.\//g, '](');
}

function withCommandFrontmatter(name, body) {
  const cmdName = name.replace(/\.md$/, '');
  if (cmdName === 'README') return body;
  if (/^---\r?\n/.test(body)) {
    if (/^---\r?\n[\s\S]*?\nname:\s*/m.test(body)) return body;
    return body.replace(/^---\r?\n/, `---\nname: ${cmdName}\n`);
  }
  return `---\nname: ${cmdName}\ndescription: Phasestep /${cmdName}\n---\n\n${body}`;
}

function ensureInstallPreamble() {
  return [
    '> **Install check:** If the workspace has no `phasestep.json` (or legacy `phasegate.json`), run **`/setup` first** — it scaffolds the project in-repo (same shape as `npx phasestep init`). If the file exists, the project is **already installed**; continue. Never require a separate terminal init when the Phasestep plugin is active.',
    '',
  ].join('\n');
}

function injectPreamble(body) {
  const preamble = ensureInstallPreamble();
  if (body.includes('**Install check:**')) return body;
  if (/^---\r?\n[\s\S]*?\n---\r?\n/.test(body)) {
    return body.replace(/^(---\r?\n[\s\S]*?\n---\r?\n)/, `$1\n${preamble}`);
  }
  return `${preamble}${body}`;
}

function readCursorTemplate(name) {
  return fs.readFileSync(path.join(ROOT, 'templates', 'cursor', 'commands', name), 'utf8');
}

function writeCommands(outDir, vars, adapter) {
  const cmdDir = path.join(outDir, 'commands');
  ensureDir(cmdDir);
  for (const name of COMMAND_FILES) {
    let raw;
    if (name === 'README.md') {
      const readmeRel =
        adapter === 'claude'
          ? path.join('claude', 'commands', 'README.md')
          : path.join('cursor', 'commands', 'README.md');
      raw = fs.readFileSync(path.join(ROOT, 'templates', readmeRel), 'utf8');
      let body = applyVars(raw, vars);
      body = workspaceLinks(body);
      // Plugin-oriented quick start note
      if (!body.includes('IDE plugin')) {
        body += [
          '',
          '---',
          '',
          '**IDE plugin:** After marketplace install, run `/setup` in a project. If `phasestep.json` is missing, `/setup` scaffolds it — no terminal `npx phasestep init` required. If you already ran the CLI, `/setup` reports **installed** and continues.',
          '',
        ].join('\n');
      }
      write(path.join(cmdDir, name), body);
      continue;
    }
    raw = readCursorTemplate(name);
    let body = applyVars(raw, vars);
    body = workspaceLinks(body);
    if (name !== 'setup.md') body = injectPreamble(body);
    body = withCommandFrontmatter(name, body);
    write(path.join(cmdDir, name), body);
  }
}

function writeScaffoldBundle(outDir, vars, config) {
  const scaffold = path.join(outDir, 'scaffold');
  rmrf(scaffold);
  ensureDir(scaffold);

  const instructions = `# Phasestep scaffold bundle

Agent: when \`phasestep.json\` is **missing**, copy these files into the **workspace root** (skip paths that already exist). Same outcome as \`npx phasestep init\`.

Do **not** tell the Owner to run terminal init when this plugin is installed.

## Copy map

| Bundle path | Workspace destination |
|-------------|------------------------|
| \`phasestep.json\` | \`phasestep.json\` |
| \`docs/**\` | \`docs/**\` (same relative paths) |
| \`.phasestep/**\` | \`.phasestep/**\` |

Optional (only if Owner wants repo-portable commands without the plugin):

| Bundle path | Destination |
|-------------|-------------|
| \`commands/**\` (from plugin \`commands/\`) | \`.cursor/commands/**\` and/or \`.claude/commands/**\` |

After copy, announce: \`Phasestep: installed (scaffolded)\`.
`;

  write(path.join(scaffold, 'SCAFFOLD.md'), instructions);

  write(
    path.join(scaffold, 'phasestep.json'),
    `${JSON.stringify({ ...config, adapters: normalizeAdapters(config.adapters) }, null, 2)}\n`
  );

  // Constitution
  const constitutionSrc = path.join(ROOT, 'constitution', 'PHASESTEP.md');
  write(
    path.join(scaffold, config.constitutionPath),
    fs.readFileSync(constitutionSrc, 'utf8')
  );

  // Owner stubs
  const stubs = [
    ['project/product.md', config.productSpec],
    ['project/USER_FLOW.md', config.userFlow],
    ['project/architecture.md', config.architecture],
    ['project/decisions.md', config.decisions],
    ['project/BUILD_PLAN.md', config.buildPlan],
    ['project/AUDIT_PLAN.md', config.auditPlan],
    ['project/PROJECT_MAP.md', config.projectMap],
    ['project/VERIFICATION_MAP.md', config.verificationMap],
    ['project/PROGRESS.md', config.progress],
    ['project/DESIGN_SYSTEM.md', config.designSystem],
  ];
  for (const [rel, dest] of stubs) {
    const raw = fs.readFileSync(path.join(ROOT, 'templates', rel), 'utf8');
    write(path.join(scaffold, dest), applyVars(raw, vars));
  }
  write(
    path.join(scaffold, config.phasePlansDir, 'README.md'),
    applyVars(
      fs.readFileSync(path.join(ROOT, 'templates', 'project', 'phase-plans-README.md'), 'utf8'),
      vars
    )
  );
  write(
    path.join(scaffold, config.auditReportsDir, 'README.md'),
    applyVars(
      fs.readFileSync(path.join(ROOT, 'templates', 'project', 'audit-reports-README.md'), 'utf8'),
      vars
    )
  );

  // Catalogs
  for (const name of ['stack-catalog.json', 'design-catalog.json', 'README.md']) {
    copyFile(
      path.join(ROOT, 'templates', 'enrichment', name),
      path.join(scaffold, '.phasestep', name)
    );
  }
}

function writeCursorPlugin(vars, config) {
  rmrf(CURSOR_OUT);
  ensureDir(CURSOR_OUT);

  write(
    path.join(CURSOR_OUT, '.cursor-plugin', 'plugin.json'),
    `${JSON.stringify(
      {
        name: 'phasestep',
        displayName: 'Phasestep',
        version: VERSION,
        description:
          'Phase-step agentic delivery with Behavior delta intent gates. Install once, run /setup — no separate terminal init required.',
        author: { name: 'Fahmidur010' },
        homepage: 'https://phasestep.vercel.app/',
        repository: 'https://github.com/Fahmidur010/phasestep',
        license: 'MIT',
        keywords: [
          'phasestep',
          'workflow',
          'agentic',
          'behavior-delta',
          'intent-gate',
          'delivery',
        ],
        logo: 'assets/logo.png',
      },
      null,
      2
    )}\n`
  );

  writeCommands(CURSOR_OUT, vars, 'cursor');
  writeScaffoldBundle(CURSOR_OUT, vars, {
    ...config,
    adapters: ['cursor', 'claude', 'codex'],
  });

  write(
    path.join(CURSOR_OUT, 'rules', 'phasestep.mdc'),
    `---
description: Phasestep project install detection — use when running Phasestep slash commands or delivery workflow
alwaysApply: false
---

Phasestep install marker: \`phasestep.json\` (or legacy \`phasegate.json\`) at the workspace root.

- **Present** → project is installed (CLI or prior scaffold). Do not re-init. Do not ask for \`npx phasestep init\`.
- **Missing** → run \`/setup\` (or copy from this plugin's \`scaffold/\` per \`scaffold/SCAFFOLD.md\`). Marketplace users must not need a separate terminal init.

Plugin and npm CLI produce the same project shape. Prefer plugin commands when this plugin is installed; CLI \`upgrade\`/\`check\` remain available for terminal/CI.
`
  );

  write(
    path.join(CURSOR_OUT, 'skills', 'phasestep-ensure-install', 'SKILL.md'),
    `---
name: phasestep-ensure-install
description: >
  Ensure a Phasestep project is installed in the workspace before delivery commands.
  Use when phasestep.json is missing, the user installed the Phasestep plugin, or they ask
  to start Phasestep / setup without running npm.
---

# Ensure Phasestep install

1. Look for \`phasestep.json\` or \`phasegate.json\` at the workspace root.
2. If **found** → report \`Phasestep: installed\` and stop (or continue the caller's command).
3. If **missing** → scaffold from this plugin's \`scaffold/\` bundle (see \`scaffold/SCAFFOLD.md\`), skipping existing files. Do **not** require \`npx phasestep init\`.
4. Then continue with \`/setup\` stages (or the command the user invoked).
`
  );

  write(
    path.join(CURSOR_OUT, 'README.md'),
    `# Phasestep (Cursor plugin)

Phase-step agentic delivery for Cursor.

## After marketplace install

1. Open any project in Cursor  
2. Run **\`/setup\`**  
3. If the project has no \`phasestep.json\`, the agent **scaffolds it in-repo** (same files as \`npx phasestep init\`)  
4. If \`phasestep.json\` already exists (you used the CLI before), it reports **installed** and continues  

No separate terminal init is required for the full Phasestep experience.

## Also via npm

\`\`\`bash
npx phasestep init
npx phasestep upgrade
npx phasestep check
\`\`\`

Same project shape either way. See [phasestep.vercel.app](https://phasestep.vercel.app/).

## Local load (dev)

Point Cursor at this folder as a plugin directory, or use the repo marketplace manifest at \`.cursor-plugin/marketplace.json\`.

Regenerate from package templates: \`npm run generate:plugins\`.
`
  );

  const logoPng = path.join(ROOT, 'plugins', '_assets', 'logo.png');
  const logoJpg = path.join(ROOT, 'plugins', '_assets', 'logo.jpg');
  if (fs.existsSync(logoPng)) {
    copyFile(logoPng, path.join(CURSOR_OUT, 'assets', 'logo.png'));
  } else if (fs.existsSync(logoJpg)) {
    copyFile(logoJpg, path.join(CURSOR_OUT, 'assets', 'logo.jpg'));
  }
}

function writeClaudePlugin(vars, config) {
  rmrf(CLAUDE_OUT);
  ensureDir(CLAUDE_OUT);

  write(
    path.join(CLAUDE_OUT, '.claude-plugin', 'plugin.json'),
    `${JSON.stringify(
      {
        name: 'phasestep',
        version: VERSION,
        description:
          'Phase-step agentic delivery with Behavior delta intent gates. Install once, run /setup — no separate terminal init required.',
        author: { name: 'Fahmidur010' },
        homepage: 'https://phasestep.vercel.app/',
        repository: 'https://github.com/Fahmidur010/phasestep',
        license: 'MIT',
        keywords: ['phasestep', 'workflow', 'agentic', 'behavior-delta', 'intent-gate'],
      },
      null,
      2
    )}\n`
  );

  writeCommands(CLAUDE_OUT, vars, 'claude');
  writeScaffoldBundle(CLAUDE_OUT, vars, {
    ...config,
    adapters: ['cursor', 'claude', 'codex'],
  });

  write(
    path.join(CLAUDE_OUT, 'skills', 'phasestep-ensure-install', 'SKILL.md'),
    `---
name: phasestep-ensure-install
description: >
  Ensure a Phasestep project is installed in the workspace before delivery commands.
  Use when phasestep.json is missing, the user installed the Phasestep plugin, or they ask
  to start Phasestep / setup without running npm.
---

# Ensure Phasestep install

1. Look for \`phasestep.json\` or \`phasegate.json\` at the workspace root.
2. If **found** → report \`Phasestep: installed\` and stop (or continue the caller's command).
3. If **missing** → scaffold from this plugin's \`scaffold/\` bundle (see \`scaffold/SCAFFOLD.md\`), skipping existing files. Do **not** require \`npx phasestep init\`.
4. Then continue with \`/setup\` stages (or the command the user invoked).
`
  );

  write(
    path.join(CLAUDE_OUT, 'README.md'),
    `# Phasestep (Claude Code plugin)

Phase-step agentic delivery for Claude Code.

## After marketplace install

1. Open any project  
2. Run **\`/setup\`**  
3. Missing \`phasestep.json\` → agent scaffolds from this plugin’s \`scaffold/\` (same as CLI init)  
4. Existing \`phasestep.json\` → **installed**; continue  

No separate terminal \`npx phasestep init\` required.

## Also via npm

\`\`\`bash
npx phasestep init
npx phasestep upgrade
npx phasestep check
\`\`\`

Regenerate: \`npm run generate:plugins\` from the Phasestep package repo.
`
  );
}

function writeMarketplaceManifests() {
  write(
    path.join(ROOT, '.cursor-plugin', 'marketplace.json'),
    `${JSON.stringify(
      {
        name: 'phasestep',
        owner: { name: 'Fahmidur010' },
        metadata: {
          description: 'Phasestep — phase-step agentic delivery for Cursor',
        },
        plugins: [
          {
            name: 'phasestep',
            source: 'plugins/cursor',
            description:
              'Phase-step agentic delivery with Behavior delta intent gates. /setup scaffolds the project — no separate terminal init.',
          },
        ],
      },
      null,
      2
    )}\n`
  );

  write(
    path.join(ROOT, '.claude-plugin', 'marketplace.json'),
    `${JSON.stringify(
      {
        name: 'phasestep',
        owner: { name: 'Fahmidur010' },
        metadata: {
          description: 'Phasestep — phase-step agentic delivery for Claude Code',
        },
        plugins: [
          {
            name: 'phasestep',
            source: './plugins/claude',
            description:
              'Phase-step agentic delivery with Behavior delta intent gates. /setup scaffolds the project — no separate terminal init.',
          },
        ],
      },
      null,
      2
    )}\n`
  );
}

function main() {
  const config = mergeConfig({ ...DEFAULTS });
  const vars = varsFromConfig(config);

  console.log(`\ngenerate-plugins → v${VERSION}\n`);
  writeCursorPlugin(vars, config);
  writeClaudePlugin(vars, config);
  writeMarketplaceManifests();
  console.log(`  write: plugins/cursor/ (${COMMAND_FILES.length} commands + scaffold)`);
  console.log(`  write: plugins/claude/ (${COMMAND_FILES.length} commands + scaffold)`);
  console.log('  write: .cursor-plugin/marketplace.json');
  console.log('  write: .claude-plugin/marketplace.json');
  console.log('\nDone.\n');
}

main();
