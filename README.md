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

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup, commit conventions, adding an addon and releasing. See [AGENTS.md](AGENTS.md) for code conventions.

## License

MIT
