---
name: animate-assets
description: Animate game assets using rd-animation for pixel spritesheets or image-to-video models for non-pixel motion. Always estimates cost and requires user approval before Replicate runs.
---

# Animate assets

## Pixel art animation → `rd-animation`

Styles:

- `four_angle_walking` — 4-dir walk (width/height typically 48)
- `walking_and_idle` — walk + idle
- `small_sprites` — 32×32 multi-action sheet
- `vfx` — explosions, fire, portals (24–96)

Prefer `--spritesheet` / `return_spritesheet: true` for Pixi `Spritesheet` loading.

```bash
npm run generate -- --model rd-animation --prompt "blue slime" --style four_angle_walking --spritesheet --yes --prefix slime-walk
```

Official: **$0.07**/output. Docs: `docs/models/rd-animation.md`, `docs/COSTS.md`

## Non-pixel motion → image-to-video

Use collection guidance in `docs/models/image-to-video.md`. Default cheap/fast catalog model: `wan-2.2-i2v-fast` (needs `--image <url>` + `--prompt`).

Always estimate duration/resolution cost and get approval first. For game loops, keep clips short and describe subtle motion (idle breathe, flag wave) rather than cinematic camera moves unless requested.
