#!/usr/bin/env node
/**
 * Scaffold a new game from PixiJS Game Base.
 *
 * Usage:
 *   npm create pixijs-game@latest my-game
 *   npx create-pixijs-game my-game
 *   npm run create -- my-game          (from this monorepo)
 *
 * Flags:
 *   --template <spec>   giget/degit-style source (default: env or built-in)
 *   --local             copy from the parent template checkout
 *   --no-install        skip npm install
 *   --yes / -y          non-interactive defaults
 */

import { spawn } from 'node:child_process';
import {
  cp,
  mkdir,
  readFile,
  readdir,
  rm,
  writeFile,
  access,
} from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CREATE_PKG_ROOT = path.resolve(__dirname, '..');
const MONOREPO_ROOT = path.resolve(CREATE_PKG_ROOT, '../..');

/** Override after you push: PIXIJS_GAME_TEMPLATE=github:you/PixiJSBase */
const DEFAULT_REMOTE_TEMPLATE =
  process.env.PIXIJS_GAME_TEMPLATE ?? 'github:OWNER/PixiJSBase#main';

const SKIP_NAMES = new Set([
  'node_modules',
  'dist',
  '.git',
  '.env',
  '.env.local',
  'packages',
  '.DS_Store',
]);

function parseArgs(argv) {
  const flags = {
    template: null,
    local: false,
    install: true,
    yes: false,
    help: false,
  };
  const positionals = [];

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') flags.help = true;
    else if (arg === '--local') flags.local = true;
    else if (arg === '--no-install') flags.install = false;
    else if (arg === '--yes' || arg === '-y') flags.yes = true;
    else if (arg === '--template') {
      flags.template = argv[++i] ?? null;
    } else if (arg.startsWith('--template=')) {
      flags.template = arg.slice('--template='.length);
    } else if (arg.startsWith('-')) {
      console.error(`Unknown flag: ${arg}`);
      process.exit(1);
    } else {
      positionals.push(arg);
    }
  }

  return { flags, targetName: positionals[0] ?? null };
}

function printHelp() {
  console.log(`create-pixijs-game — scaffold a PixiJS 2D game base

Usage:
  npm create pixijs-game@latest [dir]
  npx create-pixijs-game [dir]
  npm run create -- [dir]          # from the template monorepo

Options:
  --local              Copy from the local PixiJSBase checkout (dev / offline)
  --template <spec>    Remote template (giget), e.g. github:you/PixiJSBase
  --no-install         Do not run npm install
  -y, --yes            Skip prompts (use defaults)
  -h, --help           Show help

Env:
  PIXIJS_GAME_TEMPLATE   Default remote template spec
`);
}

function toPackageName(dirName) {
  return dirName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-') || 'pixijs-game';
}

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function ask(question, fallback, yes) {
  if (yes) return fallback;
  if (!input.isTTY) return fallback;
  const rl = createInterface({ input, output });
  try {
    const answer = await rl.question(`${question} (${fallback}): `);
    return answer.trim() || fallback;
  } finally {
    rl.close();
  }
}

async function copyLocalTemplate(srcRoot, destRoot) {
  const srcResolved = path.resolve(srcRoot);
  const destResolved = path.resolve(destRoot);
  await mkdir(destResolved, { recursive: true });
  const entries = await readdir(srcResolved, { withFileTypes: true });

  for (const entry of entries) {
    if (SKIP_NAMES.has(entry.name)) continue;
    const from = path.join(srcResolved, entry.name);
    const to = path.join(destResolved, entry.name);

    // Never copy the destination into itself when scaffolding inside the template repo
    if (path.resolve(from) === destResolved) continue;
    if (destResolved.startsWith(from + path.sep)) continue;

    await cp(from, to, {
      recursive: true,
      filter: (source) => {
        const resolved = path.resolve(source);
        if (resolved === destResolved || resolved.startsWith(destResolved + path.sep)) {
          return false;
        }
        const base = path.basename(source);
        if (SKIP_NAMES.has(base)) return false;
        return true;
      },
    });
  }
}

async function downloadRemoteTemplate(spec, destRoot) {
  // Dynamic import so the create package stays dependency-free when using --local
  let giget;
  try {
    ({ downloadTemplate: giget } = await import('giget'));
  } catch {
    console.error(
      'Remote templates need the "giget" package.\n' +
        '  npm install -g giget\n' +
        'or from the monorepo: npm install -w create-pixijs-game giget\n' +
        'or use --local to copy from a checkout of PixiJSBase.',
    );
    process.exit(1);
  }

  const tmp = `${destRoot}.__tmp_scaffold__`;
  await rm(tmp, { recursive: true, force: true });
  await rm(destRoot, { recursive: true, force: true });

  console.log(`Downloading template ${spec} …`);
  await giget(spec, { dir: tmp, force: true });

  // If the template is a monorepo and content is at root, use as-is.
  // Strip packages/create-pixijs-game from the copy so games stay lean.
  await mkdir(destRoot, { recursive: true });
  const entries = await readdir(tmp, { withFileTypes: true });
  for (const entry of entries) {
    if (SKIP_NAMES.has(entry.name)) continue;
    await cp(path.join(tmp, entry.name), path.join(destRoot, entry.name), {
      recursive: true,
    });
  }
  await rm(tmp, { recursive: true, force: true });
}

async function customizeProject(destRoot, projectName) {
  const pkgPath = path.join(destRoot, 'package.json');
  const pkg = JSON.parse(await readFile(pkgPath, 'utf8'));
  pkg.name = toPackageName(projectName);
  pkg.private = true;
  delete pkg.bin;
  delete pkg.workspaces;
  if (pkg.scripts) {
    delete pkg.scripts.create;
  }
  // Keep game scripts only
  await writeFile(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

  const envExample = path.join(destRoot, '.env.example');
  const envPath = path.join(destRoot, '.env');
  if ((await exists(envExample)) && !(await exists(envPath))) {
    await cp(envExample, envPath);
  }

  // Drop create-package leftovers if somehow present
  await rm(path.join(destRoot, 'packages'), { recursive: true, force: true });
}

function runNpmInstall(cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['install'], {
      cwd,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`npm install exited with ${code}`));
    });
  });
}

async function resolveTemplateMode(flags) {
  if (flags.local) return { mode: 'local', source: MONOREPO_ROOT };
  if (flags.template) return { mode: 'remote', source: flags.template };

  const looksLikeMonorepo =
    (await exists(path.join(MONOREPO_ROOT, 'src', 'main.ts'))) &&
    (await exists(path.join(MONOREPO_ROOT, 'packages', 'create-pixijs-game')));

  if (looksLikeMonorepo) {
    return { mode: 'local', source: MONOREPO_ROOT };
  }

  return { mode: 'remote', source: DEFAULT_REMOTE_TEMPLATE };
}

async function main() {
  const { flags, targetName } = parseArgs(process.argv.slice(2));
  if (flags.help) {
    printHelp();
    return;
  }

  const nameInput = await ask(
    'Project directory',
    targetName ?? 'my-pixijs-game',
    flags.yes && !!targetName,
  );
  if (!nameInput) {
    console.error('Project name is required.');
    process.exit(1);
  }

  const destRoot = path.resolve(process.cwd(), nameInput);
  const projectLabel = path.basename(destRoot);
  if (await exists(destRoot)) {
    const entries = await readdir(destRoot);
    if (entries.length > 0) {
      console.error(`Target directory is not empty: ${destRoot}`);
      process.exit(1);
    }
  }

  const template = await resolveTemplateMode(flags);
  console.log(`\nScaffolding into ${destRoot}`);
  console.log(`Template: ${template.mode} → ${template.source}\n`);

  if (template.mode === 'local') {
    if (!(await exists(path.join(template.source, 'src', 'main.ts')))) {
      console.error(`Local template not found at ${template.source}`);
      process.exit(1);
    }
    await copyLocalTemplate(template.source, destRoot);
  } else {
    if (template.source.includes('OWNER/')) {
      console.warn(
        '⚠️  Default remote still uses OWNER/PixiJSBase.\n' +
          '   Set PIXIJS_GAME_TEMPLATE=github:your-user/PixiJSBase or pass --template …\n' +
          '   Or run with --local from a checkout of this repo.\n',
      );
    }
    await downloadRemoteTemplate(template.source, destRoot);
  }

  await customizeProject(destRoot, projectLabel);

  if (flags.install) {
    console.log('\nInstalling dependencies…');
    await runNpmInstall(destRoot);
  }

  const cdHint = path.relative(process.cwd(), destRoot) || '.';
  console.log(`
✔ Created ${projectLabel}

Next:
  cd ${cdHint}
  # optional: put REPLICATE_API_TOKEN in .env
  npm run dev

Read AGENTS.md and .cursor/ for AI guidelines.
`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
