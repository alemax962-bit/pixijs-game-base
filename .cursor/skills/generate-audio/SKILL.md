---
name: generate-audio
description: Generate game sound effects and ambient audio with declare-lab/tango (Tango 2), including cost preview and required user approval. Use when creating SFX, UI sounds, or ambient loops for the PixiJS game.
---

# Generate audio (Tango 2)

## Model

- Slug: `declare-lab/tango`
- Always set `"model": "tango2"` unless the user asks otherwise
- Output: WAV → `public/assets/audio/`

## Workflow

1. `npm run estimate -- --model tango --steps 100`
2. Present ~$0.054/run estimate (scales roughly with steps) and ask approval
3. `npm run generate -- --model tango --prompt "..." --yes --prefix sfx-<name>`
4. `game.audio.load(key, url)` then `play` after a user gesture (`audio.unlock()`)

## Prompting

- Describe **sound**, not story: sources, materials, distance, duration vibe
- Good: `Short bright coin pickup chime with light sparkle, dry studio recording`
- Bad: `Happy reward music for level complete` (Tango is TTA/SFX-oriented; keep clips short and concrete)

Full reference: `docs/models/tango.md`
