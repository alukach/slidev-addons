# AGENTS.md

Instructions for AI coding agents (and humans) working in this repo.

## What this is

A pnpm monorepo of [Slidev](https://sli.dev) addons. Each directory in `packages/` is one addon, published to npm separately as `@alukach/slidev-addon-<dir>`. Follow Slidev's addon guide: https://sli.dev/guide/write-addon.

## Layout of a package

```
packages/<name>/
  package.json     # name, "files", engines.slidev, scripts
  README.md        # user-facing docs: install, usage, props/frontmatter, demo link
  LICENSE          # copy of the root LICENSE
  slides.md        # demo deck; doubles as the dev preview and the deployed demo
  vite.config.ts   # demo-only Slidev 53 workaround; NOT in "files"
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

A demo should show every feature in the README, with short on-slide instructions for anything interactive. The demos are the docs' screenshots, CI test, and dev environment in one.

## Commands

Node 24 (`.nvmrc`), pnpm from `packageManager`.

```sh
pnpm install
pnpm --filter @alukach/slidev-addon-<name> dev   # live preview of one demo
pnpm build                                        # build all demos into site/dist (CI runs this)
pnpm changeset                                    # record a release note (required for user-facing changes)
```

There is no unit test suite. `pnpm build` is the check: it must pass, and for behavior changes, run `dev` and try the demo in a browser.

## Adding an addon

1. Copy the shape of an existing package (e.g. `packages/hotkeys`): `package.json` (update name, description, `files`, `homepage`, build `--base`/`--out` dir), `README.md`, `LICENSE`, `slides.md`, `vite.config.ts`.
2. Add it to the table in the root `README.md` and to `site/index.html`.
3. `pnpm install && pnpm build`.
4. `pnpm changeset` with a `minor` bump for the new package.
5. After the first publish, a maintainer must configure npm trusted publishing for it (root README → Release → One-time setup).

## Changing an addon

- Update its `README.md` whenever props, frontmatter keys, `themeConfig` keys or behavior change.
- Update its `slides.md` so the demo shows the change.
- Add a changeset: `patch` for fixes, `minor` for features, `major` for breaking changes to props, frontmatter, layouts or component names.

## Releasing

Don't bump versions or publish by hand. Changesets + `.github/workflows/release.yml` do it: merging the "Version Packages" PR publishes to npm through trusted publishing (OIDC, no tokens). `scripts/publish.sh` uses `pnpm pack` (which resolves `catalog:`) and `npm publish` (which does OIDC).
