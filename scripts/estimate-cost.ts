#!/usr/bin/env node
/**
 * Print a cost estimate without running anything.
 * Agents should run this (or equivalent) before asking the user for approval.
 */
import { estimateCost, formatCostReport } from '../tools/replicate/costs.ts';
import { MODELS } from '../tools/replicate/models.ts';

function parseArgs(argv: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]!;
    if (!arg.startsWith('--')) continue;
    const key = arg.slice(2);
    const next = argv[i + 1];
    if (next && !next.startsWith('--')) {
      out[key] = next;
      i++;
    }
  }
  return out;
}

function main(): void {
  const args = parseArgs(process.argv.slice(2));
  if (!args.model) {
    console.log('Usage: npm run estimate -- --model <id> [--runs N] [--num-images N] [--steps N] [--purpose "..."]');
    console.log('\nModels:', Object.values(MODELS).map((m) => m.id).join(', '));
    process.exit(1);
  }

  const input: Record<string, unknown> = {};
  if (args['num-images']) input.num_images = Number(args['num-images']);
  if (args.steps) input.steps = Number(args.steps);
  if (args.style) input.style = args.style;
  if (args['num-frames']) input.num_frames = Number(args['num-frames']);

  const estimate = estimateCost(args.model, input, args.runs ? Number(args.runs) : 1);
  console.log(formatCostReport(estimate, args.purpose ?? 'Cost estimate only (no run)'));
}

main();
