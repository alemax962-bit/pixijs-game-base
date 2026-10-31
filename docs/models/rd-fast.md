# retro-diffusion/rd-fast

Fast / cheap pixel art for iteration (lower fidelity than rd-plus).  
https://replicate.com/retro-diffusion/rd-fast

## Cost (official Replicate Pricing, snapshot 2026-10-31)

Priced **per output image** by pixel count (all styles). Full table: `docs/COSTS.md`.

| Size | USD |
|------|-----|
| ≤32² | **$0.017** |
| 128² | **$0.02** |
| 256² | **$0.028** |
| 384²+ | **$0.042** |

## Useful styles

`default`, `simple`, `detailed`, `retro`, `game_asset`, `portrait`, `texture`, `ui`, `item_sheet`, `character_turnaround`, `1_bit`, `low_res`, `mc_item`, `mc_texture`, `no_style`

## When to use

- Prompt exploration
- Placeholder sprites before final `rd-plus` pass

## Example

```json
{
  "prompt": "spaceship side view",
  "style": "game_asset",
  "width": 128,
  "height": 128,
  "remove_bg": true,
  "num_images": 1
}
```
