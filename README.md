# Slidev Addons

[Slidev](https://sli.dev) addons for live, interactive talks. Each is published to npm separately, so install only what you need.

| Package | What it does | Demo |
| --- | --- | --- |
| [`@alukach/slidev-addon-tierlist`](packages/tierlist) | Drag-and-drop S–F tier list that links to detail slides, for ranking topics live | [▶](https://alukach.github.io/slidev-addons/tierlist/) |
| [`@alukach/slidev-addon-live-demo`](packages/live-demo) | Embed live web apps, with zoom, crop, video fallback and multi-demo reels | [▶](https://alukach.github.io/slidev-addons/live-demo/) |
| [`@alukach/slidev-addon-hotkeys`](packages/hotkeys) | Give any slide a key that jumps to it | [▶](https://alukach.github.io/slidev-addons/hotkeys/) |
| [`@alukach/slidev-addon-laser`](packages/laser) | Fading laser-pointer trail, mirrored between presenter and audience | [▶](https://alukach.github.io/slidev-addons/laser/) |

## Use

```sh
pnpm add @alukach/slidev-addon-tierlist @alukach/slidev-addon-hotkeys
```

```yaml
# slides.md headmatter
addons:
  - '@alukach/slidev-addon-tierlist'
  - '@alukach/slidev-addon-hotkeys'
```

See each package's README for its components, layouts and frontmatter.

### Slidev 53 known issues

These come from Slidev itself and affect any Slidev 53 deck, not just these addons. If `slidev build` fails:

- **`ERR_PACKAGE_PATH_NOT_EXPORTED` … `markdown-it/lib/token.mjs`**: pin markdown-it 14. With pnpm, add to `pnpm-workspace.yaml`:
  ```yaml
  overrides:
    markdown-it: ^14.1.0
  ```
- **`[lightningcss minify] Invalid token in pseudo element`**: add `esbuild` as a dev dependency and a `vite.config.ts`:
  ```ts
  export default { build: { cssMinify: 'esbuild' } }
  ```

## Develop

Requires Node 24 (`.nvmrc`) and pnpm (`corepack enable`).

```sh
pnpm install
pnpm --filter @alukach/slidev-addon-tierlist dev   # one addon's demo, http://localhost:3030
pnpm build                                          # every demo, into site/dist/
```

See [AGENTS.md](AGENTS.md) for repo conventions.

## Release

1. Run `pnpm changeset`, choose the packages and bump type, and commit the changeset with your change.
2. When it reaches `main`, the [Release workflow](.github/workflows/release.yml) opens a "Version Packages" PR.
3. Merging that PR publishes the bumped packages to npm with provenance, tags them and creates GitHub releases.

The [Demos workflow](.github/workflows/demos.yml) builds every demo on each PR and deploys them to GitHub Pages from `main`.

### One-time setup

- **GitHub Pages**: Settings → Pages → Source: **GitHub Actions**.
- **npm trusted publishing**: npm only allows configuring a trusted publisher on a package that already exists. So, once per new package:
  1. Publish the first version by hand: `npm login`, then `pnpm release` from the repo root (it skips versions already on npm).
  2. On npmjs.com, open the package → Settings → Trusted Publisher → GitHub Actions, with owner `alukach`, repository `slidev-addons` and workflow `release.yml`.
  3. Optionally, set publishing access to "Require two-factor authentication and disallow tokens".

  After that, CI publishes without any npm token.

## License

MIT
