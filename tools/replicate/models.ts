/**
 * Canonical Replicate model catalog for this game base.
 * Keep costs conservative estimates — always confirm with the user before running.
 * Live pricing can drift; see each model's Replicate page.
 */

export type AssetKind = 'image' | 'pixel' | 'tile' | 'pixel-anim' | 'audio' | 'video';

export interface ModelDef {
  id: string;
  slug: string;
  kind: AssetKind;
  /** Approximate USD per single default run (1 output). */
  approxCostUsd: number;
  description: string;
  docs: string;
  /** How to scale estimate from CLI flags */
  costNotes: string;
  defaultInput: Record<string, unknown>;
}

export const MODELS = {
  /** Default for polished / non-pixel 2D game art */
  fluxGameAssets: {
    id: 'flux-2d-game-assets',
    slug: 'replicate/flux-2d-game-assets',
    kind: 'image',
    approxCostUsd: 0.012,
    description: 'Flux LoRA tuned for 2D game assets (icons, props, items)',
    docs: 'docs/models/flux-2d-game-assets.md',
    costNotes: 'Multiply by num_outputs. ~$0.012/run on H100.',
    defaultInput: {
      model: 'dev',
      go_fast: false,
      lora_scale: 1,
      megapixels: '1',
      num_outputs: 1,
      aspect_ratio: '1:1',
      output_format: 'png',
      guidance_scale: 3,
      output_quality: 90,
      prompt_strength: 0.8,
      num_inference_steps: 28,
    },
  },
  /** High quality pixel art */
  rdPlus: {
    id: 'rd-plus',
    slug: 'retro-diffusion/rd-plus',
    kind: 'pixel',
    approxCostUsd: 0.06,
    description: 'High-quality authentic pixel art (scenes, maps, UI, icons)',
    docs: 'docs/models/rd-plus.md',
    costNotes: '~$0.06 × num_images (Replicate/Retro Diffusion list price).',
    defaultInput: {
      style: 'default',
      width: 128,
      height: 128,
      num_images: 1,
      remove_bg: true,
      tile_x: false,
      tile_y: false,
      bypass_prompt_expansion: false,
    },
  },
  /** Cheap / draft pixel art */
  rdFast: {
    id: 'rd-fast',
    slug: 'retro-diffusion/rd-fast',
    kind: 'pixel',
    approxCostUsd: 0.03,
    description: 'Fast cheap pixel art for iteration (lower quality)',
    docs: 'docs/models/rd-fast.md',
    costNotes: '~$0.03 × num_images.',
    defaultInput: {
      style: 'game_asset',
      width: 128,
      height: 128,
      num_images: 1,
      remove_bg: true,
      tile_x: false,
      tile_y: false,
      bypass_prompt_expansion: false,
    },
  },
  /** Tilesets & tile objects */
  rdTile: {
    id: 'rd-tile',
    slug: 'retro-diffusion/rd-tile',
    kind: 'tile',
    approxCostUsd: 0.1,
    description: 'Pixel tilesets, single tiles, tile/scene objects',
    docs: 'docs/models/rd-tile.md',
    costNotes: 'Tilesets ~$0.10/run; single tiles/objects often ~$0.024–$0.06. Estimate uses $0.10.',
    defaultInput: {
      style: 'tileset',
      width: 32,
      height: 32,
      num_images: 1,
      bypass_prompt_expansion: false,
    },
  },
  /** Pixel sprite animations */
  rdAnimation: {
    id: 'rd-animation',
    slug: 'retro-diffusion/rd-animation',
    kind: 'pixel-anim',
    approxCostUsd: 0.07,
    description: 'Pixel art walk/idle/VFX animations & spritesheets',
    docs: 'docs/models/rd-animation.md',
    costNotes: 'Base animations ~$0.07/run; advanced styles can be $0.10–$0.25.',
    defaultInput: {
      style: 'four_angle_walking',
      width: 48,
      height: 48,
      return_spritesheet: true,
      bypass_prompt_expansion: false,
    },
  },
  /** Audio / SFX */
  tango: {
    id: 'tango',
    slug: 'declare-lab/tango',
    kind: 'audio',
    approxCostUsd: 0.054,
    description: 'Tango 2 text-to-audio for SFX and ambient sounds',
    docs: 'docs/models/tango.md',
    costNotes: '~$0.054/run (varies with steps). Prefer model=tango2.',
    defaultInput: {
      model: 'tango2',
      steps: 100,
      guidance: 3,
    },
  },
  /** Non-pixel image-to-video animation (cheap default from I2V collection) */
  wanI2vFast: {
    id: 'wan-2.2-i2v-fast',
    slug: 'wan-video/wan-2.2-i2v-fast',
    kind: 'video',
    approxCostUsd: 0.05,
    description: 'Fast cheap image-to-video for non-pixel motion loops',
    docs: 'docs/models/image-to-video.md',
    costNotes: 'Rough estimate; priced by duration/resolution. Confirm on Replicate before large batches.',
    defaultInput: {
      go_fast: true,
      num_frames: 81,
      resolution: '480p',
      frames_per_second: 16,
      sample_shift: 12,
    },
  },
} as const satisfies Record<string, ModelDef>;

export type ModelKey = keyof typeof MODELS;

export function getModel(keyOrId: string): ModelDef {
  const byKey = MODELS[keyOrId as ModelKey];
  if (byKey) return byKey;
  const byId = Object.values(MODELS).find((m) => m.id === keyOrId || m.slug === keyOrId);
  if (byId) return byId;
  throw new Error(
    `Unknown model "${keyOrId}". Known: ${Object.keys(MODELS).join(', ')} or ids ${Object.values(MODELS)
      .map((m) => m.id)
      .join(', ')}`,
  );
}

/** Pick the right image model from art direction. */
export function recommendImageModel(opts: {
  pixelArt?: boolean;
  draft?: boolean;
  tiles?: boolean;
}): ModelKey {
  if (opts.tiles) return 'rdTile';
  if (opts.pixelArt && opts.draft) return 'rdFast';
  if (opts.pixelArt) return 'rdPlus';
  return 'fluxGameAssets';
}
