# PixiJS Game Base

Flexible **PixiJS v8** starter for 2D browser games, shipped with **Cursor rules/skills** and a **Replicate** pipeline for generating images, pixel art, animations, and audio — with **mandatory cost approval** before any paid run.

## Create a new game (recommended)

Like `create-react-app` / `npm create vite`, scaffold a fresh project from this base:

```bash
# From a checkout of this repo (works today, no publish needed)
npm run create -- my-adventure

# After you publish create-pixijs-game + push the template to GitHub:
npm create pixijs-game@latest my-adventure
npx create-pixijs-game my-adventure --template github:alemax962-bit/pixijs-game-base
```

Then:

```bash
cd my-adventure
npm run dev
```

Also supported: mark this GitHub repo as a **Template repository**, then use **Use this template → Create a new repository**.

## Develop this template itself

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
| `docs/COSTS.md` | Official Replicate pricing tables (for estimates) |
| `tools/replicate/` | Model catalog, cost estimates, approved client |
| `scripts/generate-asset.ts` | CLI generator with approval gate |
| `packages/create-pixijs-game/` | `npm create pixijs-game` scaffolder |

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

Agents must follow `AGENTS.md` and the skills under `.cursor/skills/`. Official prices: `docs/COSTS.md`.

## GitHub + npm publish

**Full step-by-step:** [docs/PUBLISHING.md](docs/PUBLISHING.md)

| | Name |
|--|------|
| GitHub | https://github.com/alemax962-bit/pixijs-game-base |
| npm | `create-pixijs-game` → `npm create pixijs-game@latest` |

```bash
# Put NPM_TOKEN in .env (see .env.example), then:
npm run publish:create
```

## License

MIT — see [LICENSE](LICENSE).
