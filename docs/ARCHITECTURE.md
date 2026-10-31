# Architecture

## Goals

- Run **any** 2D browser game genre on one PixiJS shell
- Keep engine code thin; put game content in scenes
- Make Cursor agents productive via `.cursor/` + `docs/`

## Runtime stack

| Piece | Role |
|-------|------|
| Vite + TypeScript | Dev server & bundling |
| PixiJS v8 | WebGL rendering |
| `Game` | Owns `Application`, ticker, systems |
| `Scene` / `SceneManager` | Stackable game states |
| `InputSystem` | Keyboard + pointer with action aliases |
| `AudioSystem` | Web Audio SFX / music |
| `AssetSystem` | Pixi Assets facade |

## Suggested folders for larger games

```
src/
  game/           # engine (shared)
  scenes/         # menus, levels, overlays
  entities/       # optional gameplay objects
  data/           # JSON levels, balance tables
  ui/             # HUD widgets as Containers
public/assets/
  images/
  audio/
  sprites/        # sheets, gif/mp4 loops if needed
```

## Genre adapters (patterns, not required code)

- **Platformer**: Scene holds tilemap + player entity; gravity in a `PhysicsSystem` or inside the player update
- **Top-down RPG**: Scene holds map layers + camera follow container
- **Puzzle**: Scene owns board grid; input maps to cell selection
- **Shoot-em-up**: Object pools as plain arrays of sprites updated each tick

Avoid baking one genre into `Game.ts`.
