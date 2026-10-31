# replicate/flux-2d-game-assets

Flux LoRA for 2D game assets.  
https://replicate.com/replicate/flux-2d-game-assets

## Cost / hardware

- ~**$0.012** per run (about 83 runs / $1) — varies by inputs
- Nvidia H100, typically ~8s

## API inputs (essentials)

| Field | Notes |
|-------|--------|
| `prompt` | **Required.** Include trigger **`FGAL`** |
| `model` | `dev` (quality, ~28 steps) or `schnell` (fast, ~4 steps) |
| `num_outputs` | Images per prediction |
| `aspect_ratio` | e.g. `1:1`, or `custom` + width/height |
| `num_inference_steps` | Default-ish 28 for `dev` |
| `guidance_scale` | Try 2–3.5 |
| `lora_scale` | Usually `1` |
| `go_fast` | Speed vs quality tradeoff |
| `output_format` | `png` / `webp` / … |
| `image` / `mask` | img2img / inpaint |

## Recommended defaults (this repo)

See `MODELS.fluxGameAssets` in `tools/replicate/models.ts`.

## Example request body

```json
{
  "prompt": "FGAL iron sword, white background, game asset",
  "model": "dev",
  "go_fast": false,
  "lora_scale": 1,
  "num_outputs": 1,
  "aspect_ratio": "1:1",
  "output_format": "png",
  "guidance_scale": 3,
  "num_inference_steps": 28
}
```

## HTTP

`POST https://api.replicate.com/v1/models/replicate/flux-2d-game-assets/predictions`  
Header: `Authorization: Bearer $REPLICATE_API_TOKEN`
