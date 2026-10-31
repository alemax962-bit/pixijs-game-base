# create-pixijs-game

Scaffold a new **PixiJS Game Base** project (PixiJS v8 + Cursor guidelines + Replicate asset tooling).

## Usage

Once published to npm:

```bash
npm create pixijs-game@latest
# or
npm create pixijs-game@latest my-adventure
npx create-pixijs-game my-adventure
```

From a local checkout of this monorepo (no publish needed):

```bash
# at repo root
npm run create -- my-adventure
# or
node packages/create-pixijs-game/bin/create-pixijs-game.mjs my-adventure --local
```

### Remote template

Default remote template: `github:alemax962-bit/pixijs-game-base`.

```bash
npx create-pixijs-game my-game
npx create-pixijs-game my-game --template github:alemax962-bit/pixijs-game-base
```

## What you get

- PixiJS scene-based game shell
- Committed `.cursor/` rules & skills
- Replicate generate/estimate CLIs with cost approval
- `.env` from `.env.example`

## Publish (maintainers)

See [docs/PUBLISHING.md](../../docs/PUBLISHING.md).

```bash
npm login
npm publish -w create-pixijs-game --access public
```
