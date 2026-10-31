# Agent guide — PixiJS Game Base

This repository is a **flexible PixiJS 2D browser-game starter** plus **Cursor guidelines** for building larger games. Read this file first, then follow links into `.cursor/` and `docs/`.

## Where guidance lives

| Location | Purpose |
|----------|---------|
| `AGENTS.md` (this file) | Entry map for any AI coding agent |
| `.cursor/rules/*.mdc` | Always-on / scoped project rules (committed to git) |
| `.cursor/skills/*/SKILL.md` | Task skillsets — generate art, audio, animate, structure scenes |
| `docs/` | Human + agent reference (architecture, prompting, per-model API) |
| `docs/COSTS.md` | **Official Replicate pricing tables** (no need to re-search) |
| `docs/PUBLISHING.md` | Push to GitHub, publish `create-pixijs-game` to npm, how users scaffold |
| `tools/replicate/` | Cost estimates + approved Replicate API client |
| `scripts/generate-asset.ts` | CLI that **must** get user cost approval before paid runs |

## Hard rules for asset generation

1. **Always** generate still images with `replicate/flux-2d-game-assets` **or** the Retro Diffusion pixel models (`rd-plus` / `rd-tile` / `rd-fast`) depending on art style — never invent a different image model unless the user asks.
2. **Always** generate audio with `declare-lab/tango` (`model: tango2`).
3. **Pixel animations** → `retro-diffusion/rd-animation`. **Non-pixel motion** → image-to-video models from the [image-to-video collection](https://replicate.com/collections/image-to-video) (default catalog entry: `wan-video/wan-2.2-i2v-fast`).
4. **Never** call Replicate (or spend money) without:
   - Estimating cost (`npm run estimate` or `tools/replicate/costs.ts`)
   - Showing the estimate to the user
   - Getting explicit approval
   - Then running with `--yes` / `yes: true`
5. Set `REPLICATE_API_TOKEN` in `.env` (see `.env.example`). Never commit `.env`.

## Scaffolding a new game repo

Prefer the create CLI (does not invent a one-off folder layout):

```bash
npm run create -- my-game          # from this monorepo
# later: npm create pixijs-game@latest my-game
```

Do not hand-copy selectively unless the user asks — the scaffolder includes `.cursor/`, docs, and tools.

## Building games on this base

- Keep genre logic in **Scenes** under `src/scenes/`.
- Reuse `Game`, `SceneManager`, `InputSystem`, `AudioSystem`, `AssetSystem`.
- Prefer composition over deep inheritance.
- Put shipped assets under `public/assets/{images,audio,sprites}/`.
- Read `.cursor/skills/build-pixi-game/SKILL.md` when scaffolding features.

## Skill quick index

- Generate non-pixel / Flux game art → `.cursor/skills/generate-game-assets/`
- Generate pixel art / tiles → `.cursor/skills/generate-pixel-art/`
- Generate SFX / ambient audio → `.cursor/skills/generate-audio/`
- Animate assets → `.cursor/skills/animate-assets/`
- Extend the Pixi architecture → `.cursor/skills/build-pixi-game/`
