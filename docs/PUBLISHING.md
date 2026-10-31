# Publish guide — GitHub + npm

This base is two things:

| Piece | Name | Purpose |
|-------|------|---------|
| **Template repo** (this whole project) | GitHub: recommended `pixijs-game-base` | Source people clone / “Use this template” / scaffolder downloads |
| **Create package** | npm: `create-pixijs-game` | Enables `npm create pixijs-game` like CRA/Vite |

You do **not** need to publish the game template itself to npm. Only publish `create-pixijs-game`; it pulls the template from GitHub.

---

## 1. What to call things

### GitHub repository (recommended)

**`pixijs-game-base`** (this project: `alemax962-bit/pixijs-game-base`)

Why:

- Clear, searchable, matches npm-style kebab-case
- Works cleanly in URLs: `github.com/alemax962-bit/pixijs-game-base`
- Fits the scaffolder default: `github:alemax962-bit/pixijs-game-base`

Also fine:

- `pixijs-game-starter`
- `pixi-2d-game-base`

Avoid vague names (`game`, `base`, `pixi-app`) — this repo is meant to be found as a **starter + AI guidelines**.

> Your local folder can stay `PixiJSBase`; the GitHub name is independent.

### npm package (fixed)

**`create-pixijs-game`**

That exact prefix matters:

```bash
npm create pixijs-game@latest
# npm looks up the package named create-pixijs-game
```

Do not rename it to `pixijs-game-base` on npm unless you also change how users invoke create.

---

## 2. Push to GitHub

**You do not need `gh`.** Plain `git` + the GitHub website is enough.

### Prerequisites

- GitHub account
- Git installed (`git --version`)
- Ability to sign in when `git push` opens a browser / asks for credentials

### Option A — Website + git (recommended if `gh` is missing)

1. GitHub → **New repository** → name `pixijs-game-base` → **Public** → **do not** add README/license (you already have them).
2. Locally:

```bash
git remote add origin https://github.com/YOUR_USER/pixijs-game-base.git
# if origin already exists:
# git remote set-url origin https://github.com/YOUR_USER/pixijs-game-base.git

git push -u origin main
```

3. On GitHub: repo **Settings → General → Template repository** → enable.

If `origin` is already set (check with `git remote -v`), just commit and:

```bash
git push
```

### Option B — Install GitHub CLI (optional)

Only if you want `gh` commands later:

```powershell
winget install --id GitHub.cli
```

Then close/reopen the terminal and run `gh auth login`.

```bash
gh repo create pixijs-game-base --public --source=. --remote=origin --push
gh repo edit --enable-template-repository
```

### After the first push

Anyone can:

```bash
git clone https://github.com/YOUR_USER/pixijs-game-base.git

# Or GitHub → Use this template → Create a new repository
```

---

## 3. Wire the scaffolder to your real GitHub URL

Before publishing to npm, replace placeholders with your user/org and repo name.

### Files to edit

1. `packages/create-pixijs-game/bin/create-pixijs-game.mjs`  
   Set default remote, for example:

   ```js
   const DEFAULT_REMOTE_TEMPLATE =
     process.env.PIXIJS_GAME_TEMPLATE ?? 'github:YOUR_USER/pixijs-game-base#main';
   ```

2. `packages/create-pixijs-game/package.json`  
   Update `repository.url`, `bugs.url`, and `homepage` from `OWNER/PixiJSBase` to `YOUR_USER/pixijs-game-base`.

3. Optional: `README.md` examples that still say `YOUR_USER` / `OWNER`.

### Add `giget` (needed for remote `npm create`)

Remote scaffolds download the GitHub template via [giget](https://github.com/unjs/giget):

```bash
cd packages/create-pixijs-game
npm install giget --save
cd ../..
```

Or from the monorepo root (workspaces):

```bash
npm install giget -w create-pixijs-game
```

Commit those changes:

```bash
git add packages/create-pixijs-game
git commit -m "Point create-pixijs-game at the public GitHub template"
git push
```

---

## 4. Publish `create-pixijs-game` to npm

**All tokens live in `.env`** (gitignored). See `.env.example`.

### Prerequisites

- npm account: https://www.npmjs.com/signup
- Package name free: https://www.npmjs.com/package/create-pixijs-game

### If you use a security key (no authenticator OTP)

CLI `npm publish` asks for `--otp`, which security keys don’t provide. Use a **granular access token** instead:

1. Open https://www.npmjs.com/settings/~/tokens → **Generate New Token** → **Granular**
2. Permissions: **Read and write (publish and stage)**
3. Check **Bypass two-factor authentication** (confirm with your security key in the browser)
4. Copy the token into local `.env`:

```env
NPM_TOKEN=npm_…
REPLICATE_API_TOKEN=…   # if you use Replicate
```

5. Publish from the repo root:

```bash
npm run publish:create:dry   # optional
npm run publish:create       # reads NPM_TOKEN from .env
```

### If you use an authenticator app (OTP)

```bash
npm login
npm publish -w create-pixijs-game --access public --otp=123456
```

### Version bumps later

```bash
cd packages/create-pixijs-game
npm version patch   # 0.1.0 → 0.1.1
cd ../..
npm run publish:create
git push --follow-tags
```

---

## 5. How people use it after publish

### A) npm create (best DX)

```bash
npm create pixijs-game@latest my-adventure
cd my-adventure
npm run dev
```

Equivalent:

```bash
npx create-pixijs-game@latest my-adventure
```

Optional flags:

```bash
npx create-pixijs-game my-adventure --template github:YOUR_USER/pixijs-game-base
npx create-pixijs-game my-adventure --no-install
```

### B) GitHub template button

GitHub repo page → **Use this template** → new repo → clone → `npm install` → `npm run dev`.

### C) From a local checkout (no npm publish)

```bash
git clone git@github.com:YOUR_USER/pixijs-game-base.git
cd pixijs-game-base
npm install
npm run create -- my-adventure
cd my-adventure
npm run dev
```

---

## 6. Checklist

- [ ] Choose GitHub name (recommended: `pixijs-game-base`)
- [ ] Create empty repo on github.com (or optional `gh`)
- [ ] `git remote add origin …` (if needed) + `git push -u origin main`
- [ ] Enable **Template repository** in GitHub Settings
- [ ] Replace `OWNER` / `YOUR_USER` defaults in `packages/create-pixijs-game`
- [ ] Add `giget` dependency to the create package
- [ ] Commit + `git push`
- [ ] Put `NPM_TOKEN` in `.env` (granular token + Bypass 2FA if using a security key)
- [ ] `npm run publish:create`
- [ ] Verify: `npm create pixijs-game@latest test-game`

---

## 7. Troubleshooting

| Problem | Fix |
|---------|-----|
| `npm create pixijs-game` 404 | Package not published, or wrong name (must be `create-pixijs-game`) |
| Scaffolder warns about `OWNER/` | You forgot to set `DEFAULT_REMOTE_TEMPLATE` / `PIXIJS_GAME_TEMPLATE` |
| Remote create fails missing giget | `npm install giget -w create-pixijs-game` and republish |
| `git push` rejected | Pull/rebase, or confirm you own the remote; avoid force-push to `main` unless intentional |
| Name taken on npm | Pick another create name (e.g. `create-pixijs-game-base`) and tell users `npm create pixijs-game-base@latest` |

---

## Related

- Local create CLI: `packages/create-pixijs-game/README.md`
- Agent map: `AGENTS.md`
- Costs: `docs/COSTS.md`
