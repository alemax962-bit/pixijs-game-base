# Image-to-video (non-pixel animation)

Collection: https://replicate.com/collections/image-to-video

Use when you need motion from a **still** that is **not** Retro Diffusion pixel animation.

## Default in this repo

`wan-video/wan-2.2-i2v-fast` — fast/cheap optimized Wan 2.2 I2V.

### Inputs (essentials)

| Field | Notes |
|-------|--------|
| `image` | **Required** source image URL |
| `prompt` | Motion description |
| `num_frames` | Often 81 |
| `resolution` | e.g. `480p` |
| `frames_per_second` | Pricing often tied to duration @ 16fps |
| `go_fast` | Prefer `true` for drafts |

Cost is **duration/resolution sensitive** — always estimate and get approval. The repo’s dollar estimate is a rough placeholder; check the model page for live pricing on large batches.

## Other options (pick with the user)

From the collection (quality / speed / features vary a lot):

- Quality: Runway Gen-4.5, Veo 3.1, Kling Video
- Speed: Grok Imagine Video, Hailuo Fast, Seedance Fast, Wan fast variants
- Start/end frames: Vidu Q3, Wan 2.7 I2V
- Draft iteration: Pruna `p-video`

When switching models, add a new entry to `tools/replicate/models.ts` with a conservative `approxCostUsd` and document it here.
