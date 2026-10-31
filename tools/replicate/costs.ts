import { getModel, type ModelDef } from './models.ts';
import {
  FIXED_RUN_PRICES,
  PRICING_SNAPSHOT,
  priceRdFast,
  priceRdPlus,
  priceRdTile,
  priceWanI2vFast,
} from './pricing.ts';

export interface CostEstimate {
  model: ModelDef;
  runs: number;
  outputsPerRun: number;
  approxUsdPerRun: number;
  approxUsdTotal: number;
  pricingVariant: string;
  notes: string;
  disclaimer: string;
}

function outputsFromInput(input: Record<string, unknown>): number {
  if (typeof input.num_outputs === 'number') return input.num_outputs;
  if (typeof input.num_images === 'number') return input.num_images;
  return 1;
}

function usdPerRun(model: ModelDef, input: Record<string, unknown>): { usd: number; variant: string; notes: string } {
  const outputs = outputsFromInput(input);

  switch (model.id) {
    case 'flux-2d-game-assets': {
      const fixed = FIXED_RUN_PRICES['flux-2d-game-assets'];
      return {
        usd: fixed.usdPerRun * outputs,
        variant: 'approx_per_run',
        notes: `Official page (~$${fixed.usdPerRun}/run, ~${fixed.runsPerDollar}/$1, ${fixed.hardware}). × num_outputs.`,
      };
    }
    case 'rd-plus': {
      const priced = priceRdPlus(input);
      return {
        usd: priced.usdPerImage * outputs,
        variant: priced.variant,
        notes: `Official Replicate tier ${priced.variant}: $${priced.usdPerImage}/image × ${outputs}. See docs/COSTS.md`,
      };
    }
    case 'rd-fast': {
      const priced = priceRdFast(input);
      return {
        usd: priced.usdPerImage * outputs,
        variant: priced.variant,
        notes: `Official Replicate tier by pixels: $${priced.usdPerImage}/image × ${outputs}. See docs/COSTS.md`,
      };
    }
    case 'rd-tile': {
      const priced = priceRdTile(input);
      return {
        usd: priced.usdPerImage * outputs,
        variant: priced.variant,
        notes: `Official Replicate tier ${priced.variant}: $${priced.usdPerImage}/image × ${outputs}. See docs/COSTS.md`,
      };
    }
    case 'rd-animation': {
      const fixed = FIXED_RUN_PRICES['rd-animation'];
      return {
        usd: fixed.usdPerOutput * outputs,
        variant: 'per_output_image',
        notes: `Official: $${fixed.usdPerOutput} per output image (~${fixed.outputsPerDollar}/$1).`,
      };
    }
    case 'tango': {
      const fixed = FIXED_RUN_PRICES.tango;
      return {
        usd: fixed.usdPerRun,
        variant: 'approx_per_run',
        notes: `Official page (~$${fixed.usdPerRun}/run, ~${fixed.runsPerDollar}/$1, ${fixed.hardware}). Varies with inputs/steps.`,
      };
    }
    case 'wan-2.2-i2v-fast': {
      const priced = priceWanI2vFast(input);
      return {
        usd: priced.usdPerVideo,
        variant: priced.variant,
        notes: `Official Replicate: $${priced.usdPerVideo}/video (${priced.variant}). Pricing based on duration at 16 fps.`,
      };
    }
    default:
      return {
        usd: model.approxCostUsd * outputs,
        variant: 'fallback',
        notes: model.costNotes,
      };
  }
}

export function estimateCost(
  modelKeyOrId: string,
  input: Record<string, unknown> = {},
  runs = 1,
): CostEstimate {
  const model = getModel(modelKeyOrId);
  const merged = { ...model.defaultInput, ...input };
  const priced = usdPerRun(model, merged);
  const approxUsdPerRun = priced.usd;
  const approxUsdTotal = approxUsdPerRun * runs;

  return {
    model,
    runs,
    outputsPerRun: outputsFromInput(merged),
    approxUsdPerRun: roundMoney(approxUsdPerRun),
    approxUsdTotal: roundMoney(approxUsdTotal),
    pricingVariant: priced.variant,
    notes: priced.notes,
    disclaimer: `Based on official Replicate pricing tables (snapshot ${PRICING_SNAPSHOT}). Live bills may differ if Replicate changes prices. Do not run until the user approves.`,
  };
}

export function formatCostReport(estimate: CostEstimate, purpose: string): string {
  const lines = [
    '════════════════════════════════════════',
    '  REPLICATE RUN — COST PREVIEW (APPROVAL REQUIRED)',
    '════════════════════════════════════════',
    `Purpose : ${purpose}`,
    `Model   : ${estimate.model.slug}`,
    `Kind    : ${estimate.model.kind}`,
    `Variant : ${estimate.pricingVariant}`,
    `Runs    : ${estimate.runs}`,
    `Outputs : ~${estimate.outputsPerRun} per run`,
    `Est/run : $${estimate.approxUsdPerRun.toFixed(4)}`,
    `Est total: $${estimate.approxUsdTotal.toFixed(4)} USD`,
    `Notes   : ${estimate.notes}`,
    `Docs    : ${estimate.model.docs} | docs/COSTS.md`,
    '',
    estimate.disclaimer,
    '════════════════════════════════════════',
  ];
  return lines.join('\n');
}

function roundMoney(n: number): number {
  return Math.round(n * 10000) / 10000;
}
