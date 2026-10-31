# retro-diffusion/rd-tile

Pixel tilesets and tile-related assets.  
https://replicate.com/retro-diffusion/rd-tile

## Cost (official Replicate Pricing, snapshot 2026-10-31)

Full table: `docs/COSTS.md`.

- `tileset` / `tileset_advanced`: flat **$0.10** / output image
- `single_tile` / `tile_variation` / `tile_object`: **$0.024–$0.051** by size
- `scene_object`: **$0.028–$0.099** by size

## Styles

| Style | Use |
|-------|-----|
| `tileset` | Wang-style full tileset from one prompt |
| `tileset_advanced` | Blend two prompts/textures |
| `single_tile` | One detailed tile texture |
| `tile_variation` | Variations of an input tile |
| `tile_object` | Small props on tiles |
| `scene_object` | Larger map props |

`width`/`height` are **tile** size for tilesets, not always the full sheet size.

## Example

```json
{
  "prompt": "volcanic beach with blue water and black sand",
  "style": "tileset",
  "width": 16,
  "height": 16,
  "num_images": 1
}
```
