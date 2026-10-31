import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { getModel, type ModelDef } from './models.ts';
import { estimateCost } from './costs.ts';
import { requestRunApproval } from './approve.ts';

const REPLICATE_API = 'https://api.replicate.com/v1';

export interface RunOptions {
  model: string;
  input: Record<string, unknown>;
  purpose: string;
  runs?: number;
  /** User already approved after seeing the cost estimate */
  yes?: boolean;
  /** Skip download; return remote URLs only */
  outputDir?: string;
  filenamePrefix?: string;
}

export interface RunResult {
  urls: string[];
  savedPaths: string[];
  estimateUsd: number;
}

function requireToken(): string {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) {
    throw new Error(
      'Missing REPLICATE_API_TOKEN. Copy .env.example to .env and add your key from https://replicate.com/account/api-tokens',
    );
  }
  return token;
}

async function createPrediction(
  token: string,
  model: ModelDef,
  input: Record<string, unknown>,
): Promise<{ id: string; urls: string[] }> {
  // Prefer models endpoint (always latest) over version pin
  const res = await fetch(`${REPLICATE_API}/models/${model.slug}/predictions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Prefer: 'wait',
    },
    body: JSON.stringify({ input }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Replicate create failed (${res.status}): ${body}`);
  }

  let prediction = (await res.json()) as {
    id: string;
    status: string;
    output?: unknown;
    error?: string;
    urls?: { get: string };
  };

  // Poll if Prefer: wait did not finish
  while (prediction.status !== 'succeeded' && prediction.status !== 'failed' && prediction.status !== 'canceled') {
    await sleep(1500);
    const poll = await fetch(`${REPLICATE_API}/predictions/${prediction.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!poll.ok) {
      throw new Error(`Replicate poll failed (${poll.status})`);
    }
    prediction = (await poll.json()) as typeof prediction;
  }

  if (prediction.status !== 'succeeded') {
    throw new Error(`Prediction ${prediction.id} ${prediction.status}: ${prediction.error ?? 'unknown'}`);
  }

  return { id: prediction.id, urls: normalizeOutputUrls(prediction.output) };
}

function normalizeOutputUrls(output: unknown): string[] {
  if (!output) return [];
  if (typeof output === 'string') return [output];
  if (Array.isArray(output)) {
    return output.flatMap((item) => (typeof item === 'string' ? [item] : []));
  }
  return [];
}

async function download(url: string, dest: string): Promise<void> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await mkdir(path.dirname(dest), { recursive: true });
  await writeFile(dest, buf);
}

function extensionFromUrl(url: string, kind: ModelDef['kind']): string {
  const clean = url.split('?')[0] ?? url;
  const ext = path.extname(clean);
  if (ext) return ext;
  if (kind === 'audio') return '.wav';
  if (kind === 'video') return '.mp4';
  if (kind === 'pixel-anim') return '.png';
  return '.png';
}

function defaultSubdir(kind: ModelDef['kind']): string {
  switch (kind) {
    case 'audio':
      return 'audio';
    case 'video':
      return 'sprites';
    case 'pixel-anim':
      return 'sprites';
    default:
      return 'images';
  }
}

/**
 * Estimate → ask user → run → download.
 * Agents MUST NOT call createPrediction directly; use this entrypoint.
 */
export async function runWithApproval(options: RunOptions): Promise<RunResult> {
  const model = getModel(options.model);
  const runs = options.runs ?? 1;
  const mergedInput = { ...model.defaultInput, ...options.input };

  if (!mergedInput.prompt && model.kind !== 'video') {
    throw new Error('input.prompt is required');
  }
  if (model.kind === 'video' && !mergedInput.image) {
    throw new Error('image-to-video requires input.image (URL or data URI)');
  }

  const estimate = estimateCost(model.id, mergedInput, runs);
  const approved = await requestRunApproval({
    estimate,
    purpose: options.purpose,
    forceYes: options.yes === true,
  });

  if (!approved) {
    throw new Error('Run canceled — user did not approve the estimated cost.');
  }

  const token = requireToken();
  const outRoot =
    options.outputDir ??
    path.resolve(process.cwd(), process.env.ASSET_OUTPUT_DIR ?? 'public/assets', defaultSubdir(model.kind));

  const urls: string[] = [];
  const savedPaths: string[] = [];
  const prefix = options.filenamePrefix ?? model.id;

  for (let i = 0; i < runs; i++) {
    console.log(`\nRunning ${model.slug} (${i + 1}/${runs})...`);
    const result = await createPrediction(token, model, mergedInput);
    urls.push(...result.urls);

    for (let j = 0; j < result.urls.length; j++) {
      const url = result.urls[j]!;
      const ext = extensionFromUrl(url, model.kind);
      const stamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${prefix}-${stamp}-r${i}-o${j}${ext}`;
      const dest = path.join(outRoot, filename);
      await download(url, dest);
      savedPaths.push(dest);
      console.log(`Saved ${dest}`);
    }
  }

  return { urls, savedPaths, estimateUsd: estimate.approxUsdTotal };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
