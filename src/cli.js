'use strict';

const path = require('path');
const { init } = require('./init');
const { check } = require('./check');
const { upgrade } = require('./upgrade');
const { parseAdaptersFlag } = require('./scaffold');

const ROOT = path.join(__dirname, '..');

async function run(args) {
  const cmd = args[0];

  if (!cmd || cmd === 'help' || cmd === '--help' || cmd === '-h') {
    printHelp();
    return;
  }

  if (cmd === 'version' || cmd === '--version' || cmd === '-V') {
    const pkg = require('../package.json');
    console.log(`phasestep v${pkg.version}`);
    return;
  }

  if (cmd === 'init') {
    const positional = args.slice(1).filter((a) => !a.startsWith('--'));
    const target = path.resolve(process.cwd(), positional[0] || '.');
    const force = args.includes('--force');
    const adapters = parseAdaptersFlag(args);
    await init({ packageRoot: ROOT, targetDir: target, force, adapters });
    return;
  }

  if (cmd === 'upgrade') {
    const positional = args.slice(1).filter((a) => !a.startsWith('--'));
    const target = path.resolve(process.cwd(), positional[0] || '.');
    const adapters = parseAdaptersFlag(args);
    await upgrade({
      packageRoot: ROOT,
      targetDir: target,
      forceDocs: args.includes('--force-docs'),
      adapters,
    });
    return;
  }

  if (cmd === 'check') {
    const target = path.resolve(process.cwd(), args[1] || '.');
    await check({ targetDir: target });
    return;
  }

  console.error(`Unknown command: ${cmd}`);
  printHelp();
  process.exit(1);
}

function printHelp() {
  console.log(`
phasestep — phase-step agentic workflow with Behavior delta intent gates

Usage:
  npx phasestep init [dir] [--force] [--adapters=cursor,claude,codex]
  npx phasestep upgrade [dir] [--force-docs] [--adapters=cursor,claude,codex]
  npx phasestep check [dir]
  phasestep version
  phasestep help

Commands:
  init     Scaffold constitution, adapters, docs stubs, catalogs, phasestep.json
  upgrade  Refresh package-owned templates (commands, catalogs, constitution);
           merge new config keys; never overwrite Owner docs unless --force-docs
  check    Verify required Phasestep artifacts exist in a project

Adapters (default: cursor,claude,codex):
  cursor   .cursor/commands/*
  claude   .claude/commands/*
  codex    AGENTS.md managed Phasestep block
`);
}

module.exports = { run };
