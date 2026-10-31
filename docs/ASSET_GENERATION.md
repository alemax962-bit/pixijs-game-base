# Asset generation overview

All paid generation goes through **Replicate** using `REPLICATE_API_TOKEN`.

## Approval policy (required)

1. Precalculate cost with `npm run estimate -- --model <id> ...`
2. Show the banner to the human user
3. Wait for explicit approval
4. Run `npm run generate -- ... --yes`

Agents must not silently spend money. The CLI refuses non-TTY runs without `--yes`.

## Model routing

| Asset type | Model id | Slug |
|------------|----------|------|
| General 2D game art | `flux-2d-game-assets` | `replicate/flux-2d-game-assets` |
| Quality pixel art | `rd-plus` | `retro-diffusion/rd-plus` |
| Draft pixel art | `rd-fast` | `retro-diffusion/rd-fast` |
| Tiles / tilesets | `rd-tile` | `retro-diffusion/rd-tile` |
| Pixel animation | `rd-animation` | `retro-diffusion/rd-animation` |
| Audio / SFX | `tango` | `declare-lab/tango` (`tango2`) |
| Non-pixel video | `wan-2.2-i2v-fast` | `wan-video/wan-2.2-i2v-fast` (see I2V doc for alternatives) |

## Approximate costs (verify live)

| Model | Estimate |
|-------|----------|
| flux-2d-game-assets | ~$0.012 / run |
| rd-fast | ~$0.03 / image |
| rd-plus | ~$0.06 / image |
| rd-tile | ~$0.06–$0.10 |
| rd-animation | ~$0.07 / run |
| tango | ~$0.054 / run |
| wan-2.2-i2v-fast | duration-based — estimate carefully |

Catalog + defaults: `tools/replicate/models.ts`  
Prompting: `docs/PROMPTING.md` and `docs/models/*`
