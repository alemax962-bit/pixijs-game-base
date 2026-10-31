# retro-diffusion/rd-plus

High-quality authentic pixel art.  
https://replicate.com/retro-diffusion/rd-plus

## Cost (official Replicate Pricing, snapshot 2026-10-31)

Priced **per output image** by style variant + pixel count. Full table: `docs/COSTS.md`.

Examples:

- `classic` @ ≤32² → **$0.025**
- large styles (e.g. `default`) @ ≤128² → **$0.034**
- large @ ≤256² → **$0.058**
- large @ 384²+ → **$0.099**

`num_images` multiplies.

## Useful styles

`default`, `retro`, `watercolor`, `textured`, `cartoon`, `ui_element`, `item_sheet`, `character_turnaround`, `environment`, `isometric`, `isometric_asset`, `topdown_map`, `topdown_asset`, `classic`, `topdown_item`, `low_res`, `mc_item`, `mc_texture`, `skill_icon`

## Inputs

`prompt`, `style`, `width`, `height`, `num_images`, `input_image`, `strength`, `input_palette`, `remove_bg`, `tile_x`, `tile_y`, `seed`, `bypass_prompt_expansion`

## Example

```json
{
  "prompt": "knight on horse creating shockwave slash",
  "style": "classic",
  "width": 128,
  "height": 128,
  "num_images": 1,
  "remove_bg": true
}
```
