# retro-diffusion/rd-tile

Pixel tilesets and tile-related assets.  
https://replicate.com/retro-diffusion/rd-tile

## Cost

- Full tilesets (`tileset` / `tileset_advanced`): ~**$0.10** / run
- Single tiles / objects: often ~**$0.024–$0.06** — confirm on Replicate

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
