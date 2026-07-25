'use strict';

const readline = require('readline');
const { normalizeAdapters } = require('./scaffold');

const MENU = [
  {
    key: '1',
    adapters: ['cursor'],
    label: 'Cursor',
    summary: 'Cursor (.cursor/commands/)',
  },
  {
    key: '2',
    adapters: ['claude'],
    label: 'Claude Code',
    summary: 'Claude Code (.claude/commands/)',
  },
  {
    key: '3',
    adapters: ['codex'],
    label: 'Codex',
    summary: 'Codex (AGENTS.md managed block)',
  },
  {
    key: '4',
    adapters: ['cursor', 'claude', 'codex'],
    label: 'All',
    summary: 'All adapters (Cursor + Claude Code + Codex)',
  },
];

function ask(rl, question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(String(answer || '').trim()));
  });
}

function isYes(answer) {
  const a = String(answer || '').trim().toLowerCase();
  return a === '' || a === 'y' || a === 'yes';
}

function findChoice(input) {
  const raw = String(input || '').trim().toLowerCase();
  if (!raw) return MENU.find((m) => m.key === '4');

  const byKey = MENU.find((m) => m.key === raw);
  if (byKey) return byKey;

  const aliases = {
    cursor: '1',
    'claude-code': '2',
    claude: '2',
    codex: '3',
    all: '4',
  };
  if (aliases[raw]) return MENU.find((m) => m.key === aliases[raw]);
  return null;
}

/**
 * Interactive adapter picker for `phasestep init`.
 * Returns normalized adapter ids, or null if the user cancels.
 */
async function promptAdapters({ stdin = process.stdin, stdout = process.stdout } = {}) {
  if (!stdin.isTTY || !stdout.isTTY) {
    const adapters = normalizeAdapters(['cursor', 'claude', 'codex']);
    console.log(
      'Non-interactive terminal — installing all adapters (cursor, claude, codex).\n' +
        'Pass --adapters=cursor|claude|codex to choose explicitly.\n'
    );
    return adapters;
  }

  const rl = readline.createInterface({ input: stdin, output: stdout });
  try {
    while (true) {
      console.log('Which agent workflow are you using?\n');
      console.log('  1. Cursor');
      console.log('  2. Claude Code');
      console.log('  3. Codex');
      console.log('  4. All (Cursor + Claude Code + Codex)  [default]\n');

      const choiceRaw = await ask(rl, 'Enter choice [1-4] (default 4): ');
      const choice = findChoice(choiceRaw);
      if (!choice) {
        console.log('\nInvalid choice. Enter 1, 2, 3, or 4.\n');
        continue;
      }

      console.log(`\nSelected: ${choice.summary}`);
      const confirm = await ask(rl, 'Proceed with this setup? [Y/n]: ');
      if (!isYes(confirm)) {
        console.log('\nOkay — pick again, or press Ctrl+C to cancel.\n');
        continue;
      }

      return normalizeAdapters(choice.adapters);
    }
  } finally {
    rl.close();
  }
}

module.exports = {
  promptAdapters,
  findChoice,
  MENU,
};
