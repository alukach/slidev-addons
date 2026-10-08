# @alukach/slidev-addon-live-demo

Embed live web apps in [Slidev](https://sli.dev) slides. Each demo has a controls bar, zoom and crop, and an optional recorded video to fall back on if the live app misbehaves on stage.

**[Demo](https://alukach.github.io/slidev-addons/live-demo/)**

## Install

```sh
pnpm add @alukach/slidev-addon-live-demo
```

```yaml
# slides.md headmatter
addons:
  - '@alukach/slidev-addon-live-demo'
```

## `<LiveDemo>`

```md
<LiveDemo src="https://your.app/page" fallback="/media/page.mp4" :scale="0.6" url />
```

It fills its container, so give the container a height (for example a grid cell with `h-full`, or `class="h-100"`).

| Prop | Default | |
| --- | --- | --- |
| `src` | required | Page URL. Paths starting with `/` load from your deck's `public/` folder, and respect `--base`. |
| `fallback` | | Video to switch to with the bar's "Use video" button. |
| `scale` | `1` | Render the page larger, then shrink it to fit. `0.5` shows twice as much page. |
| `crop` | `0` | Pixels to hide on every edge, in the page's own coordinates. Useful for Storybook's padding. |
| `bar` | `true` | Show the controls bar: status dot, Open ↗, video toggle. |
| `url` | `false` | Show the URL in the bar. |
| `lazy` | `true` | Load only when visible. Set `:lazy="false"` to preload, e.g. on the first slide. |

The status dot is yellow while loading, green once loaded, and red when showing the video.

## `<DemoReel>`

Several LiveDemos on one slide, shown one at a time. Each click (→ or Space) advances to the next demo, and ← goes back. The slide only advances after the last demo. The bar has a tab per demo for jumping directly. Every iframe stays loaded, so switching is instant and page state is kept.

```md
<DemoReel :demos="[
  { label: 'Viewer', src: 'https://…', scale: 0.6 },
  { label: 'Upload', src: 'https://…', fallback: '/media/upload.mp4' },
]" />
```

Each demo takes `src`, `label`, `scale`, `crop`, `fallback` and `url`, as above. `DemoReel` also takes `at`, which works like `v-click`'s `at`, and `lazy` (default `false`).

## Framing

The embedded app must allow being framed by your deck's origin. Check that it doesn't send `X-Frame-Options: DENY`, and that any CSP `frame-ancestors` includes the deck's domain.
