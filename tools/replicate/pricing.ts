/**
 * Official Replicate model-page pricing, scraped into this repo so agents
 * do not need to look it up again.
 *
 * Source of truth on the web: each model's Replicate page → Pricing section.
 * Snapshot date: 2026-10-31
 *
 * Human-readable tables: docs/COSTS.md
 */

export const PRICING_SNAPSHOT = '2026-10-31';

export const OFFICIAL_PAGES = {
  fluxGameAssets: 'https://replicate.com/replicate/flux-2d-game-assets',
  tango: 'https://replicate.com/declare-lab/tango',
  rdPlus: 'https://replicate.com/retro-diffusion/rd-plus',
  rdFast: 'https://replicate.com/retro-diffusion/rd-fast',
  rdTile: 'https://replicate.com/retro-diffusion/rd-tile',
  rdAnimation: 'https://replicate.com/retro-diffusion/rd-animation',
  wanI2vFast: 'https://replicate.com/wan-video/wan-2.2-i2v-fast',
} as const;

/** Approximate / fixed per-run models (Replicate "Run time and cost" blurb). */
export const FIXED_RUN_PRICES = {
  /** "This model costs approximately $0.012 to run … 83 runs per $1" */
  'flux-2d-game-assets': {
    usdPerRun: 0.012,
    runsPerDollar: 83,
    hardware: 'Nvidia H100',
    typicalSeconds: 8,
    billing: 'approximate_per_run' as const,
    source: OFFICIAL_PAGES.fluxGameAssets,
  },
  /** "This model costs approximately $0.054 to run … 18 runs per $1" */
  tango: {
    usdPerRun: 0.054,
    runsPerDollar: 18,
    hardware: 'Nvidia L40S',
    typicalSeconds: 56,
    billing: 'approximate_per_run' as const,
    source: OFFICIAL_PAGES.tango,
  },
  /** Flat: "$0.07 per output image" */
  'rd-animation': {
    usdPerOutput: 0.07,
    outputsPerDollar: 14,
    billing: 'per_output_image' as const,
    source: OFFICIAL_PAGES.rdAnimation,
  },
} as const;

type PixelTier = { maxSide: number; maxPixels: number; usd: number };

/** RD Fast — all styles; priced by output pixel count. */
export const RD_FAST_TIERS: PixelTier[] = [
  { maxSide: 16, maxPixels: 256, usd: 0.017 },
  { maxSide: 32, maxPixels: 1024, usd: 0.017 },
  { maxSide: 64, maxPixels: 4096, usd: 0.018 },
  { maxSide: 96, maxPixels: 9216, usd: 0.019 },
  { maxSide: 128, maxPixels: 16384, usd: 0.02 },
  { maxSide: 192, maxPixels: 36864, usd: 0.023 },
  { maxSide: 256, maxPixels: 65536, usd: 0.028 },
  { maxSide: 320, maxPixels: 102400, usd: 0.034 },
  { maxSide: 384, maxPixels: Infinity, usd: 0.042 },
];

const RD_PLUS_CLASSIC_STYLES = new Set(['classic']);
const RD_PLUS_SMALL_STYLES = new Set([
  'low_res',
  'topdown_item',
  'skill_icon',
  'mc_item',
  'mc_texture',
]);
const RD_PLUS_LARGE_STYLES = new Set([
  'default',
  'retro',
  'watercolor',
  'textured',
  'cartoon',
  'ui_element',
  'item_sheet',
  'character_turnaround',
  'environment',
  'isometric',
  'isometric_asset',
  'topdown_map',
  'topdown_asset',
]);

/** RD Plus classic variant tiers. */
export const RD_PLUS_CLASSIC_TIERS: PixelTier[] = [
  { maxSide: 32, maxPixels: 1024, usd: 0.025 },
  { maxSide: 64, maxPixels: 4096, usd: 0.03 },
  { maxSide: 96, maxPixels: 9216, usd: 0.039 },
  { maxSide: 128, maxPixels: 16384, usd: 0.051 },
  { maxSide: 192, maxPixels: Infinity, usd: 0.085 },
];

/** RD Plus small variant tiers. */
export const RD_PLUS_SMALL_TIERS: PixelTier[] = [
  { maxSide: 16, maxPixels: 256, usd: 0.024 },
  { maxSide: 32, maxPixels: 1024, usd: 0.025 },
  { maxSide: 64, maxPixels: 4096, usd: 0.03 },
  { maxSide: 96, maxPixels: 9216, usd: 0.039 },
  { maxSide: 128, maxPixels: Infinity, usd: 0.051 },
];

/** RD Plus large variant tiers. */
export const RD_PLUS_LARGE_TIERS: PixelTier[] = [
  { maxSide: 64, maxPixels: 4096, usd: 0.028 },
  { maxSide: 96, maxPixels: 9216, usd: 0.03 },
  { maxSide: 128, maxPixels: 16384, usd: 0.034 },
  { maxSide: 192, maxPixels: 36864, usd: 0.044 },
  { maxSide: 256, maxPixels: 65536, usd: 0.058 },
  { maxSide: 320, maxPixels: 102400, usd: 0.077 },
  { maxSide: 384, maxPixels: Infinity, usd: 0.099 },
];

/** RD Tile small (single_tile, tile_variation, tile_object). */
export const RD_TILE_SMALL_TIERS: PixelTier[] = [
  { maxSide: 16, maxPixels: 256, usd: 0.024 },
  { maxSide: 32, maxPixels: 1024, usd: 0.025 },
  { maxSide: 64, maxPixels: 4096, usd: 0.03 },
  { maxSide: 96, maxPixels: 9216, usd: 0.039 },
  { maxSide: 128, maxPixels: Infinity, usd: 0.051 },
];

/** RD Tile large (scene_object). */
export const RD_TILE_LARGE_TIERS: PixelTier[] = [
  { maxSide: 64, maxPixels: 4096, usd: 0.028 },
  { maxSide: 96, maxPixels: 9216, usd: 0.03 },
  { maxSide: 128, maxPixels: 16384, usd: 0.034 },
  { maxSide: 192, maxPixels: 36864, usd: 0.044 },
  { maxSide: 256, maxPixels: 65536, usd: 0.058 },
  { maxSide: 320, maxPixels: 102400, usd: 0.077 },
  { maxSide: 384, maxPixels: Infinity, usd: 0.099 },
];

/** Full tileset styles — flat. */
export const RD_TILE_FULL_USD = 0.1;

/** Wan 2.2 I2V Fast — per output video on model page. */
export const WAN_I2V_FAST = {
  '480p': { base: 0.05, interpolate: 0.065 },
  '720p': { base: 0.11, interpolate: 0.145 },
} as const;

function pickTier(pixels: number, tiers: PixelTier[]): number {
  for (const tier of tiers) {
    if (pixels <= tier.maxPixels) return tier.usd;
  }
  return tiers[tiers.length - 1]!.usd;
}

function dimensions(input: Record<string, unknown>): { w: number; h: number; pixels: number } {
  const w = typeof input.width === 'number' ? input.width : 128;
  const h = typeof input.height === 'number' ? input.height : 128;
  return { w, h, pixels: w * h };
}

export function priceRdPlus(input: Record<string, unknown>): { usdPerImage: number; variant: string } {
  const style = String(input.style ?? 'default');
  const { pixels } = dimensions(input);
  if (RD_PLUS_CLASSIC_STYLES.has(style)) {
    return { usdPerImage: pickTier(pixels, RD_PLUS_CLASSIC_TIERS), variant: 'rd_plus_classic' };
  }
  if (RD_PLUS_SMALL_STYLES.has(style)) {
    return { usdPerImage: pickTier(pixels, RD_PLUS_SMALL_TIERS), variant: 'rd_plus_small' };
  }
  // Unknown styles fall into large (default family)
  if (!RD_PLUS_LARGE_STYLES.has(style) && style !== 'default') {
    // still use large table — matches most non-classic/small presets
  }
  return { usdPerImage: pickTier(pixels, RD_PLUS_LARGE_TIERS), variant: 'rd_plus_large' };
}

export function priceRdFast(input: Record<string, unknown>): { usdPerImage: number; variant: string } {
  const { pixels } = dimensions(input);
  return { usdPerImage: pickTier(pixels, RD_FAST_TIERS), variant: 'rd_fast' };
}

export function priceRdTile(input: Record<string, unknown>): { usdPerImage: number; variant: string } {
  const style = String(input.style ?? 'tileset');
  if (style === 'tileset' || style === 'tileset_advanced') {
    return { usdPerImage: RD_TILE_FULL_USD, variant: 'rd_tile_full' };
  }
  const { pixels } = dimensions(input);
  if (style === 'scene_object') {
    return { usdPerImage: pickTier(pixels, RD_TILE_LARGE_TIERS), variant: 'rd_tile_large' };
  }
  return { usdPerImage: pickTier(pixels, RD_TILE_SMALL_TIERS), variant: 'rd_tile_small' };
}

export function priceWanI2vFast(input: Record<string, unknown>): { usdPerVideo: number; variant: string } {
  const resolution = String(input.resolution ?? '480p') as '480p' | '720p';
  const table = WAN_I2V_FAST[resolution] ?? WAN_I2V_FAST['480p'];
  const interpolate = input.interpolate_output === true;
  return {
    usdPerVideo: interpolate ? table.interpolate : table.base,
    variant: `${interpolate ? 'interpolate' : 'base'}/${resolution}`,
  };
}
