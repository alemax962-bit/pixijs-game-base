# Prompting cheat sheet

## Flux 2D game assets

- Start with **`FGAL`**
- End with `white background, game asset` (optionally `pixel art` if you want that look from Flux — for true pixel grids prefer Retro Diffusion)
- Specify subject, material, angle

`FGAL wooden treasure chest, three-quarter view, closed, white background, game asset`

## Retro Diffusion (pixel)

- Short subject-focused prompts work; models expand prompts unless `bypass_prompt_expansion`
- Pick the **style** that matches the job (`game_asset`, `topdown_map`, `tileset`, …)
- Set exact `width`/`height` for engine needs (64, 128, …)
- Characters: mention silhouette extras (`cape`, `helmet`) sparingly

## Tango 2 (audio)

- Physical sound description + space
- Prefer short SFX prompts for games

`Metallic sword clash with short reverb tail, close mic`

## Image-to-video

- Describe **motion only** relative to the still
- Avoid changing identity/background unless intended

`Subtle idle breathing, cape drifts gently, camera locked`
