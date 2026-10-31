# PixiJS Game Base

Flexible **PixiJS v8** starter for 2D browser games, shipped with **Cursor rules/skills** and a **Replicate** pipeline for generating images, pixel art, animations, and audio — with **mandatory cost approval** before any paid run.

Use this repo as the foundation for larger games so agents (and humans) share the same architecture and asset workflow.

## Quick start

```bash
cp .env.example .env   # add REPLICATE_API_TOKEN when you need AI assets
npm install
npm run dev
```

Open the Vite URL (default http://localhost:5173). You should see the demo scene.

## Project map

| Path | What it is |
|------|------------|
| `src/game/` | Engine shell: `Game`, scenes, input, audio, assets |
| `src/scenes/` | Game content (start here for new gameplay) |
| `.cursor/rules/` | Always-on / scoped Cursor rules (**committed**) |
| `.cursor/skills/` | Task skillsets for agents (**committed**) |
| `AGENTS.md` | Entry guide for AI coding agents |
| `docs/` | Architecture + per-model API/prompt docs |
| `tools/replicate/` | Model catalog, cost estimates, approved client |
| `scripts/generate-asset.ts` | CLI generator with approval gate |

## Generate assets (Replicate)

1. Put your token in `.env` as `REPLICATE_API_TOKEN`.
2. Estimate cost (no charge):

```bash
npm run estimate -- --model flux-2d-game-assets --runs 1
```

3. Ask the user / yourself to approve the dollar amount.
4. Generate:

```bash
npm run generate -- --model flux-2d-game-assets --prompt "FGAL iron sword, white background, game asset" --yes --prefix sword
```

### Model ids

| id | Use |
|----|-----|
| `flux-2d-game-assets` | Default non-pixel 2D game art |
| `rd-plus` | Quality pixel art |
| `rd-fast` | Cheap pixel drafts |
| `rd-tile` | Tilesets / tile props |
| `rd-animation` | Pixel sprite animations |
| `tango` | Audio (Tango 2) |
| `wan-2.2-i2v-fast` | Cheap image-to-video |

Agents must follow `AGENTS.md` and the skills under `.cursor/skills/`.

## GitHub

`.cursor/` is **not** gitignored — push it so anyone cloning the repo gets the same AI guidelines.

```bash
git remote add origin git@github.com:YOU/pixijs-game-base.git
git push -u origin main
```

## License

MIT — see [LICENSE](LICENSE).
