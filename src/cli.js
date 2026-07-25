'use strict';

const path = require('path');
const { init } = require('./init');
const { check } = require('./check');

const ROOT = path.join(__dirname, '..');

async function run(args) {
  const cmd = args[0];

  if (!cmd || cmd === 'help' || cmd === '--help' || cmd === '-h') {
    printHelp();
    return;
  }

  if (cmd === 'version' || cmd === '--version' || cmd === '-V') {
    const pkg = require('../package.json');
    console.log(`phasegate v${pkg.version}`);
    return;
  }

  if (cmd === 'init') {
    const target = path.resolve(process.cwd(), args[1] || '.');
    const force = args.includes('--force');
    await init({ packageRoot: ROOT, targetDir: target, force });
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
phasegate — phase-step agentic workflow with Behavior delta intent gates

Usage:
  phasegate init [dir] [--force]
  phasegate check [dir]
  phasegate version
  phasegate help

Commands:
  init    Scaffold constitution, Cursor commands, docs stubs, phasegate.json
  check   Verify required Phasegate artifacts exist in a project
`);
}

module.exports = { run };
