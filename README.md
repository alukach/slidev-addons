# Slidev Addons

[Slidev](https://sli.dev) addons for live, interactive talks. Each is published to npm separately, so install only what you need.

| Package | What it does | Demo |
| --- | --- | --- |
| [`@alukach/slidev-addon-tierlist`](packages/tierlist) | Drag-and-drop S–F tier list that links to detail slides, for ranking topics live | [▶](https://alukach.github.io/slidev-addons/tierlist/) |
| [`@alukach/slidev-addon-live-demo`](packages/live-demo) | Embed live web apps, with zoom, crop, video fallback and multi-demo reels | [▶](https://alukach.github.io/slidev-addons/live-demo/) |
| [`@alukach/slidev-addon-hotkeys`](packages/hotkeys) | Give any slide a key that jumps to it | [▶](https://alukach.github.io/slidev-addons/hotkeys/) |
| [`@alukach/slidev-addon-laser`](packages/laser) | Fading laser-pointer trail, mirrored between presenter and audience | [▶](https://alukach.github.io/slidev-addons/laser/) |
| [`@alukach/slidev-addon-qrcode`](packages/qrcode) | QR code linking to the deck, a slide, or any URL | [▶](https://alukach.github.io/slidev-addons/qrcode/) |

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

Requires Node 24 (`.nvmrc`) and pnpm via corepack 0.36 or later. Older corepack, including the one bundled with Node 20, can't run pnpm 12:

```sh
npm install -g corepack@latest && corepack enable
```

```sh
pnpm install
pnpm --filter @alukach/slidev-addon-tierlist dev   # one addon's demo, http://localhost:3030
pnpm build                                          # every demo, into site/dist/
```

See [AGENTS.md](AGENTS.md) for repo conventions.

## Release

Releases are driven by [Conventional Commits](https://www.conventionalcommits.org) and [release-please](https://github.com/googleapis/release-please).

1. Commit with a Conventional Commit message: `fix:` for a patch, `feat:` for a minor, `feat!:` (or a `BREAKING CHANGE:` footer) for a breaking change. The package is the one whose files the commit touches. While a package is below 1.0, breaking changes bump the minor version (`bump-minor-pre-major`).
2. When it reaches `main`, the [Release workflow](.github/workflows/release.yml) opens or updates a release PR for each affected package, with the version bump and changelog.
3. Merging a release PR tags it (e.g. `slidev-addon-tierlist-v0.2.0`), creates the GitHub release, and publishes to npm with provenance.

Commits with other types (`docs:`, `chore:`, `ci:`, `refactor:`, `test:`) don't trigger a release. If you squash-merge PRs, the PR title becomes the commit message, so write it as a Conventional Commit.

Config: [`release-please-config.json`](release-please-config.json), with current versions in [`.release-please-manifest.json`](.release-please-manifest.json).

The [Demos workflow](.github/workflows/demos.yml) builds every demo on each PR and deploys them to GitHub Pages from `main`.

### One-time setup

- **GitHub Pages**: Settings → Pages → Source: **GitHub Actions**.
- **Release PRs**: Settings → Actions → General → enable **Allow GitHub Actions to create and approve pull requests**.
- **npm trusted publishing**: npm only allows configuring a trusted publisher on a package that already exists. So, once per new package:
  1. Publish the first version by hand: `npm login`, then `pnpm release` from the repo root (it skips versions already on npm). For a new package, do this after merging its first release PR. That release's CI publish fails for the new package, since npm has no trusted publisher for it yet. Other packages in the same run still publish.
  2. On npmjs.com, open the package → Settings → Trusted Publisher → GitHub Actions, with owner `alukach`, repository `slidev-addons`, workflow `release.yml`, and no environment.
  3. Optionally, set publishing access to "Require two-factor authentication and disallow tokens".

  After that, CI publishes without any npm token.

## License

MIT
