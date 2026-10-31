---
name: generate-game-assets
description: Generate non-pixel 2D game images via replicate/flux-2d-game-assets with cost estimation and user approval. Use when creating icons, props, items, UI art, or general 2D game sprites that are not strict pixel art.
---

# Generate game assets (Flux)

## When to use

- Items, weapons, icons, props, concept sheets that are **not** strict pixel-art
- Prefer Retro Diffusion skills instead for authentic pixel / tiles / pixel anim

## Mandatory workflow

1. Draft prompt (see [prompting](../../../docs/models/flux-2d-game-assets.md))
2. Estimate: `npm run estimate -- --model flux-2d-game-assets --runs 1`
3. Show the cost banner to the user and **ask permission**
4. On approval: `npm run generate -- --model flux-2d-game-assets --prompt "..." --yes --prefix <name>`
5. Import via `AssetSystem` from `/assets/images/...`

Never call the Replicate HTTP API without going through `tools/replicate/client.ts` approval helpers.

## Prompt essentials

- Include trigger word **`FGAL`**
- Add `white background, game asset` (or flat color bg) for clean cutouts
- Be concrete: material, silhouette, view angle

Example: `FGAL iron sword, side view, white background, game asset`

## Defaults

See `MODELS.fluxGameAssets` in `tools/replicate/models.ts` (`model: "dev"`, 28 steps, `lora_scale: 1`).
