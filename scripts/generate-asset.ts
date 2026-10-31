#!/usr/bin/env node
/**
 * CLI for Replicate asset generation with mandatory cost approval.
 *
 * Examples:
 *   npx tsx scripts/generate-asset.ts --model flux-2d-game-assets --prompt "FGAL iron sword, white background, game asset"
 *   npx tsx scripts/generate-asset.ts --model rd-plus --prompt "forest slime enemy" --style classic --width 64 --height 64
 *   npx tsx scripts/generate-asset.ts --model tango --prompt "short coin collect chime" --prefix sfx-coin
 *   npx tsx scripts/generate-asset.ts --model rd-animation --prompt "blue slime" --style four_angle_walking
 *
 * Agents: print estimate first (or run estimate-cost.ts), ask the user, then re-run with --yes only after approval.
 */
import 'dotenv/config';
import { runWithApproval } from '../tools/replicate/client.ts';
import { MODELS } from '../tools/replicate/models.ts';

function parseArgs(argv: string[]): Record<string, string | boolean> {
  const out: Record<string, string | boolean> = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]!;
    if (!arg.startsWith('--')) continue;
    const key = arg.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith('--')) {
      out[key] = true;
    } else {
      out[key] = next;
      i++;
    }
  }
  return out;
}

function printHelp(): void {
  const ids = Object.values(MODELS)
    .map((m) => `  ${m.id.padEnd(22)} ${m.slug}  (~$${m.approxCostUsd}/run)`)
    .join('\n');
  console.log(`Usage: npm run generate -- --model <id> --prompt "..." [options]

Models:
${ids}

Options:
  --model <id>          Required. Model id from the list above
  --prompt <text>       Required for image/audio/pixel models
  --image <url>         Required for wan-2.2-i2v-fast
  --style <name>        Retro Diffusion style preset
  --width <n> --height <n>
  --runs <n>            Number of separate predictions (default 1)
  --prefix <name>       Output filename prefix
  --num-images <n>      Batch outputs where supported
  --remove-bg           Pixel models: transparent background
  --spritesheet         rd-animation: return spritesheet PNG
  --yes                 Only after the user approved the shown cost
  --purpose <text>      Shown in the approval banner
  --help                Show this help
`);
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  const model = String(args.model ?? '');
  if (!model) {
    printHelp();
    process.exit(1);
  }

  const input: Record<string, unknown> = {};
  if (typeof args.prompt === 'string') input.prompt = args.prompt;
  if (typeof args.image === 'string') input.image = args.image;
  if (typeof args.style === 'string') input.style = args.style;
  if (typeof args.width === 'string') input.width = Number(args.width);
  if (typeof args.height === 'string') input.height = Number(args.height);
  if (typeof args['num-images'] === 'string') input.num_images = Number(args['num-images']);
  if (args['remove-bg']) input.remove_bg = true;
  if (args.spritesheet) input.return_spritesheet = true;

  const result = await runWithApproval({
    model,
    input,
    purpose: String(args.purpose ?? `Generate ${model} asset`),
    runs: typeof args.runs === 'string' ? Number(args.runs) : 1,
    yes: args.yes === true,
    filenamePrefix: typeof args.prefix === 'string' ? args.prefix : undefined,
  });

  console.log('\nDone.');
  console.log(`Estimated charge: $${result.estimateUsd.toFixed(4)}`);
  console.log('Files:');
  for (const p of result.savedPaths) console.log(`  ${p}`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
