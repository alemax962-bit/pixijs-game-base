---
name: generate-pixel-art
description: Generate authentic pixel art, tilesets, and draft sprites using Retro Diffusion models (rd-plus, rd-tile, rd-fast) with cost approval. Use when the game needs pixel art characters, maps, tiles, UI, or cheap iteration drafts.
---

# Generate pixel art (Retro Diffusion)

## Pick a model

| Need | Model id | ~USD |
|------|----------|------|
| Quality assets / maps / UI | `rd-plus` | $0.06/image |
| Fast cheap drafts | `rd-fast` | $0.03/image |
| Tilesets / tile objects | `rd-tile` | ~$0.06–$0.10 |

## Workflow

1. Choose style preset (see docs) — e.g. `game_asset`, `topdown_map`, `tileset`
2. Estimate → ask user → generate with `--yes`
3. Prefer `remove_bg` for sprites; `tile_x`/`tile_y` for seamless textures

```bash
npm run estimate -- --model rd-plus --num-images 1
npm run generate -- --model rd-plus --prompt "orange slime enemy" --style classic --width 64 --height 64 --remove-bg --yes --prefix slime
```

## Style hints

- Characters / items: `rd-plus` + `classic` or `default`, or `rd-fast` + `game_asset` while iterating
- Maps: `topdown_map` / `environment` / `isometric`
- Tiles: `rd-tile` styles `tileset`, `single_tile`, `tile_object`, `scene_object`

Details: `docs/models/rd-plus.md`, `rd-fast.md`, `rd-tile.md`
