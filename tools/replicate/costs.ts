import { getModel, type ModelDef } from './models.ts';

export interface CostEstimate {
  model: ModelDef;
  runs: number;
  outputsPerRun: number;
  approxUsdPerRun: number;
  approxUsdTotal: number;
  notes: string;
  disclaimer: string;
}

function outputsFromInput(input: Record<string, unknown>): number {
  if (typeof input.num_outputs === 'number') return input.num_outputs;
  if (typeof input.num_images === 'number') return input.num_images;
  return 1;
}

function usdPerRun(model: ModelDef, input: Record<string, unknown>): number {
  const outputs = outputsFromInput(input);

  switch (model.id) {
    case 'flux-2d-game-assets':
      return model.approxCostUsd * outputs;
    case 'rd-plus':
      return 0.06 * outputs;
    case 'rd-fast':
      return 0.03 * outputs;
    case 'rd-tile': {
      const style = String(input.style ?? 'tileset');
      if (style === 'tileset' || style === 'tileset_advanced') return 0.1;
      return 0.06 * outputs;
    }
    case 'rd-animation':
      return model.approxCostUsd;
    case 'tango': {
      const steps = typeof input.steps === 'number' ? input.steps : 100;
      // Base ~$0.054 at 100 steps; rough linear scale for estimate only
      return model.approxCostUsd * (steps / 100);
    }
    case 'wan-2.2-i2v-fast': {
      const frames = typeof input.num_frames === 'number' ? input.num_frames : 81;
      const fps = typeof input.frames_per_second === 'number' ? input.frames_per_second : 16;
      const seconds = frames / fps;
      // Conservative placeholder — confirm live pricing for batches
      return Math.max(0.02, seconds * 0.01);
    }
    default:
      return model.approxCostUsd * outputs;
  }
}

export function estimateCost(
  modelKeyOrId: string,
  input: Record<string, unknown> = {},
  runs = 1,
): CostEstimate {
  const model = getModel(modelKeyOrId);
  const merged = { ...model.defaultInput, ...input };
  const approxUsdPerRun = usdPerRun(model, merged);
  const approxUsdTotal = approxUsdPerRun * runs;

  return {
    model,
    runs,
    outputsPerRun: outputsFromInput(merged),
    approxUsdPerRun: roundMoney(approxUsdPerRun),
    approxUsdTotal: roundMoney(approxUsdTotal),
    notes: model.costNotes,
    disclaimer:
      'Estimate only. Replicate bills actual usage; prices change. Do not run until the user approves.',
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
    `Runs    : ${estimate.runs}`,
    `Outputs : ~${estimate.outputsPerRun} per run`,
    `Est/run : $${estimate.approxUsdPerRun.toFixed(4)}`,
    `Est total: $${estimate.approxUsdTotal.toFixed(4)} USD`,
    `Notes   : ${estimate.notes}`,
    `Docs    : ${estimate.model.docs}`,
    '',
    estimate.disclaimer,
    '════════════════════════════════════════',
  ];
  return lines.join('\n');
}

function roundMoney(n: number): number {
  return Math.round(n * 10000) / 10000;
}
