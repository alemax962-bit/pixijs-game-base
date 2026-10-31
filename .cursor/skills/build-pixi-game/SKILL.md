---
name: build-pixi-game
description: Extend the PixiJS Game Base with new scenes, systems, and genre-specific gameplay while keeping the architecture flexible for any 2D browser game. Use when scaffolding levels, menus, entities, or new engine systems.
---

# Build on the PixiJS base

## Architecture

```
Game → SceneManager → Scene (root Container)
         ├─ InputSystem
         ├─ AudioSystem
         └─ AssetSystem
```

1. Create `src/scenes/YourScene.ts` extending `Scene`
2. Register in `main.ts` (or a scene registry module)
3. Load assets in `enter()`, poll input in `update(dt)`, clean up in `exit()`

## Flexibility tips

- Top-down, platformer, puzzle, visual novel UI — all are Scenes
- Add systems under `src/game/systems/` only when shared across scenes
- Keep physics, dialogue, inventory as optional modules — do not force one genre into `Game`
- Generated assets → `public/assets/...` then alias through `AssetSystem`

## Checklist for a new feature

- [ ] Scene or system owns the state (not `main.ts`)
- [ ] Actions bound via `input.bind`
- [ ] Assets loaded by alias
- [ ] If AI assets needed → follow generate-* skills with cost approval

See `docs/ARCHITECTURE.md`
