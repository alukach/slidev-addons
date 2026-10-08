# AGENTS.md

Code conventions for AI coding agents (and humans) working in this repo. For process (setup, commits, releasing), see [CONTRIBUTING.md](CONTRIBUTING.md).

## What this is

A pnpm monorepo of [Slidev](https://sli.dev) addons. Each directory in `packages/` is one addon, published to npm separately as `@alukach/slidev-addon-<dir>`. Follow Slidev's addon guide: https://sli.dev/guide/write-addon.

## Layout of a package

```
packages/<name>/
  package.json     # name, "files", engines.slidev, scripts
  README.md        # user-facing docs: install, usage, props/frontmatter, demo link
  LICENSE          # copy of the root LICENSE
  slides.md        # demo deck; doubles as the dev preview and the deployed demo
  vite.config.ts   # demo-only Slidev 53 workaround; NOT in "files" (see Vite config below)
  components/      # auto-registered Vue components
  layouts/         # new layouts (never override Slidev's built-in ones)
  setup/           # Slidev setup hooks, e.g. setup/shortcuts.ts
  global-top.vue, custom-nav-controls.vue   # global layers, if needed
  public/          # demo-only assets; NOT in "files"
```

Slidev compiles `.vue` and `.ts` itself, so there is no build step for the addons. Publish source as-is.

## Rules

- **Addon naming**: `@alukach/slidev-addon-<name>`, keywords `["slidev-addon", "slidev"]`, `engines.slidev` set to the tested range.
- **`files` is a whitelist.** List only what the addon needs at runtime. The demo deck, `public/` and `vite.config.ts` must stay out of the tarball. Check with `pnpm pack --dry-run` in the package directory.
- **Addons must not**: add global wildcard styles, override built-in layouts, or override deck configuration (Vite, UnoCSS). Use `scoped` styles. Those things belong in themes, per the Slidev guide.
- **Packages are independent.** No package may import from another. If addons work well together (tierlist + hotkeys), show it in the demo deck and README, not as a dependency.
- **Vite config**: Slidev merges every addon's `vite.config.ts` into the user's deck, so normally it's demo-only and excluded from `files`. If an addon needs Vite config at runtime (e.g. `packages/qrcode` pre-bundles a CommonJS dependency), publish it, and put the demo-only workaround behind `process.env.SLIDEV_ADDONS_DEMO`, which that package's `build` script sets.
- **Shared versions** (Slidev, Vue, esbuild) live in the `catalog:` in `pnpm-workspace.yaml`. Reference them as `"catalog:"` and change versions there.
- **Configuration from a deck** goes through `themeConfig` in the headmatter (see `packages/laser/laser.ts`) or slide frontmatter (see `packages/hotkeys`), not environment variables or new files.
- **Paths from `public/`**: user-facing `src` props that accept root-relative paths must prefix `import.meta.env.BASE_URL` so decks deployed under a subpath work (see `withBase` in `packages/live-demo/components/LiveDemo.vue`).
- Keep code small. Prefer native platform features (CSS, browser APIs) over new dependencies. A new runtime dependency goes in that package's `dependencies`, never the root.

## Demo decks

Each package's `slides.md` loads the package itself with:

```yaml
addons:
  - '@/'   # Slidev 53 resolves the documented './' against the parent dir; '@/' is the deck root
```

and sibling addons with `'@/../<dir>'`. In comments and docs, always show users the npm name instead.

Demo decks must also set `routerMode: hash`. They're deployed to GitHub Pages, which has no SPA fallback, so history-mode deep links like `/tierlist/3` would 404.

A demo should show every feature in the README, with short on-slide instructions for anything interactive. The demos are the docs' screenshots, CI test, and dev environment in one.

## Process

Follow [CONTRIBUTING.md](CONTRIBUTING.md) for setup, commands, commit messages, changing or adding an addon, and releases. In short:

- `pnpm build` must pass. There's no unit test suite.
- Every commit (or squash-merged PR title) is a Conventional Commit, scoped to the package directory: `feat(tierlist): …`. CI rejects PR titles that aren't.
- Don't bump versions, edit CHANGELOGs, create tags or publish. release-please does that.
- When adding an addon, do every step in CONTRIBUTING.md → Adding an addon. `pnpm check` (also run in CI) catches a package that's missing from the release-please config, the README table or the site index.

### What agents can't do

Some steps need a human with npm or repository admin access: merging release PRs, the first publish of a new package, and configuring npm trusted publishing. When your change needs one, finish your part, then tell the maintainer exactly which steps remain, linking CONTRIBUTING.md → Maintainers.
