# retro-diffusion/rd-animation

Style-consistent animated pixel sprites / spritesheets.  
https://replicate.com/retro-diffusion/rd-animation

## Cost (official Replicate Pricing, snapshot 2026-10-31)

From https://replicate.com/retro-diffusion/rd-animation:

- **$0.07** per output image (~14 outputs / $1)

See `docs/COSTS.md`.

## Styles & sizes

| Style | Size notes |
|-------|------------|
| `four_angle_walking` | Prefer 48×48 |
| `walking_and_idle` | Prefer 48×48 |
| `small_sprites` | 32×32 only |
| `vfx` | 24–96 |

Set `return_spritesheet: true` for Pixi-friendly PNG sheets (else GIF).

## Example

```json
{
  "prompt": "Cool corgi with sunglasses",
  "style": "four_angle_walking",
  "width": 48,
  "height": 48,
  "return_spritesheet": true
}
```
