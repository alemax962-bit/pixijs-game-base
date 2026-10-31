# Official Replicate costs (catalog)

**Snapshot:** 2026-10-31  
**Source:** Pricing section on each model’s Replicate page (not Retro Diffusion’s own website).  
**Code:** `tools/replicate/pricing.ts` + `tools/replicate/costs.ts`  
**Rule:** Always run `npm run estimate` and get user approval before generating.

> Replicate may change prices. If a page disagrees with this file, trust the live page and update this snapshot.

---

## replicate/flux-2d-game-assets

Page: https://replicate.com/replicate/flux-2d-game-assets

| | |
|--|--|
| Approx. cost | **$0.012** / run (~83 runs / $1) |
| Hardware | Nvidia H100 |
| Typical time | ~8 seconds |
| Billing note | “Varies depending on your inputs” |

---

## declare-lab/tango (Tango 2)

Page: https://replicate.com/declare-lab/tango

| | |
|--|--|
| Approx. cost | **$0.054** / run (~18 runs / $1) |
| Hardware | Nvidia L40S |
| Typical time | ~56 seconds (varies a lot with inputs) |

Use `model: "tango2"` in this repo.

---

## retro-diffusion/rd-animation

Page: https://replicate.com/retro-diffusion/rd-animation

| | |
|--|--|
| Cost | **$0.07** per output image |
| Volume | ~14 outputs / $1 |

---

## wan-video/wan-2.2-i2v-fast

Page: https://replicate.com/wan-video/wan-2.2-i2v-fast  

Pricing is **per output video**. Model notes that pricing is based on video duration at **16 fps**.

| Variant | Resolution | USD / video |
|---------|------------|-------------|
| base | 480p | **$0.05** (~20 / $1) |
| interpolate | 480p | **$0.065** |
| base | 720p | **$0.11** |
| interpolate | 720p | **$0.145** |

Also documented on https://replicate.com/blog/wan-22 (FAST I2V 480p $0.05).

---

## retro-diffusion/rd-fast

Page: https://replicate.com/retro-diffusion/rd-fast  

Billed **per output image** by pixel count (all styles).

| Up to | Max pixels | USD / image |
|-------|------------|-------------|
| 16×16 | ≤256 | **$0.017** |
| 32×32 | ≤1,024 | **$0.017** |
| 64×64 | ≤4,096 | **$0.018** |
| 96×96 | ≤9,216 | **$0.019** |
| 128×128 | ≤16,384 | **$0.02** |
| 192×192 | ≤36,864 | **$0.023** |
| 256×256 | ≤65,536 | **$0.028** |
| 320×320 | ≤102,400 | **$0.034** |
| 384×384 | >102,400 | **$0.042** |

---

## retro-diffusion/rd-plus

Page: https://replicate.com/retro-diffusion/rd-plus  

Billed **per output image**. Variant depends on **style**, then pixel count.

### Classic (`style: classic`)

| Up to | USD / image |
|-------|-------------|
| 32×32 | **$0.025** |
| 64×64 | **$0.03** |
| 96×96 | **$0.039** |
| 128×128 | **$0.051** |
| 192×192+ | **$0.085** |

### Small (`low_res`, `topdown_item`, `skill_icon`, `mc_item`, `mc_texture`)

| Up to | USD / image |
|-------|-------------|
| 16×16 | **$0.024** |
| 32×32 | **$0.025** |
| 64×64 | **$0.03** |
| 96×96 | **$0.039** |
| 128×128+ | **$0.051** |

### Large (default, retro, watercolor, textured, cartoon, ui_element, item_sheet, character_turnaround, environment, isometric, isometric_asset, topdown_map, topdown_asset)

| Up to | USD / image |
|-------|-------------|
| 64×64 | **$0.028** |
| 96×96 | **$0.03** |
| 128×128 | **$0.034** |
| 192×192 | **$0.044** |
| 256×256 | **$0.058** |
| 320×320 | **$0.077** |
| 384×384+ | **$0.099** |

---

## retro-diffusion/rd-tile

Page: https://replicate.com/retro-diffusion/rd-tile

### Small (`single_tile`, `tile_variation`, `tile_object`)

| Up to | USD / image |
|-------|-------------|
| 16×16 | **$0.024** |
| 32×32 | **$0.025** |
| 64×64 | **$0.03** |
| 96×96 | **$0.039** |
| 128×128+ | **$0.051** |

### Large (`scene_object`)

| Up to | USD / image |
|-------|-------------|
| 64×64 | **$0.028** |
| 96×96 | **$0.03** |
| 128×128 | **$0.034** |
| 192×192 | **$0.044** |
| 256×256 | **$0.058** |
| 320×320 | **$0.077** |
| 384×384+ | **$0.099** |

### Full tileset (`tileset`, `tileset_advanced`)

| | |
|--|--|
| Cost | **$0.10** per output image (flat) |

---

## Not the same as retrodiffusion.ai

Retro Diffusion’s **own** site lists RD Fast $0.03 / RD Plus $0.06 / animations from $0.07. Those are **their** API prices. This repo bills through **Replicate**, so use the tables above.
