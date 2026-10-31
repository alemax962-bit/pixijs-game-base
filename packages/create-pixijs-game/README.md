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

After you push the template repo to GitHub:

```bash
npx create-pixijs-game my-game --template github:YOUR_USER/PixiJSBase
# or permanently:
# set PIXIJS_GAME_TEMPLATE=github:YOUR_USER/PixiJSBase
```

Remote mode needs [`giget`](https://github.com/unjs/giget) available (`npm i -g giget` or install it next to the create package when publishing).

## What you get

- PixiJS scene-based game shell
- Committed `.cursor/` rules & skills
- Replicate generate/estimate CLIs with cost approval
- `.env` from `.env.example`

## Publish (maintainers)

1. Replace `OWNER` in this package’s `package.json` / default template with your GitHub org/user.
2. Set default `PIXIJS_GAME_TEMPLATE` / `DEFAULT_REMOTE_TEMPLATE` to `github:you/PixiJSBase`.
3. From `packages/create-pixijs-game`: add `giget` as a dependency, then `npm publish --access public`.
4. Mark the GitHub repo as a **Template repository** so people can also use “Use this template”.
