#!/usr/bin/env node
/**
 * Publish packages/create-pixijs-game using NPM_TOKEN from .env
 * (for accounts that use a security key instead of OTP).
 *
 *   1. Put NPM_TOKEN in .env (see .env.example)
 *   2. npm run publish:create
 */
import 'dotenv/config';
import { spawn } from 'node:child_process';
import { writeFile, unlink } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const token = process.env.NPM_TOKEN?.trim();

if (!token) {
  console.error(
    'Missing NPM_TOKEN in .env\n' +
      '1. Create a granular token at https://www.npmjs.com/settings/~/tokens\n' +
      '2. Enable Bypass 2FA + Read and write (publish and stage)\n' +
      '3. Add NPM_TOKEN=... to .env (never commit .env)\n' +
      '4. Re-run: npm run publish:create',
  );
  process.exit(1);
}

const dryRun = process.argv.includes('--dry-run');
const args = ['publish', '-w', 'create-pixijs-game', '--access', 'public'];
if (dryRun) args.push('--dry-run');

const userconfig = path.join(os.tmpdir(), `pixijs-npmrc-${process.pid}`);
await writeFile(userconfig, `//registry.npmjs.org/:_authToken=${token}\n`, 'utf8');

console.log(
  dryRun
    ? 'Dry-run publish create-pixijs-game (using NPM_TOKEN from .env)'
    : 'Publishing create-pixijs-game (using NPM_TOKEN from .env)…',
);

try {
  const code = await new Promise<number>((resolve) => {
    const child = spawn(
      process.platform === 'win32' ? 'npm.cmd' : 'npm',
      [...args, '--userconfig', userconfig],
      {
        cwd: root,
        env: process.env,
        stdio: 'inherit',
        shell: process.platform === 'win32',
      },
    );
    child.on('exit', (c) => resolve(c ?? 1));
  });
  process.exit(code);
} finally {
  await unlink(userconfig).catch(() => undefined);
}
