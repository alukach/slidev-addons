# @alukach/slidev-addon-qrcode

A QR code for your [Slidev](https://sli.dev) deck, so the audience can open the slides on their phones. It can also link to a specific slide or any other URL, and clicking it opens the link.

**[Demo](https://alukach.github.io/slidev-addons/qrcode/)**

## Install

```sh
pnpm add @alukach/slidev-addon-qrcode
```

```yaml
# slides.md headmatter
addons:
  - '@alukach/slidev-addon-qrcode'
```

## Use

```md
<DeckQRCode />                   <!-- the deck's first slide -->
<DeckQRCode slide />             <!-- the slide it's on -->
<DeckQRCode :slide="12" />       <!-- slide 12 -->
<DeckQRCode url="https://…" />   <!-- any URL -->
```

The deck URL is built from the deck's address and `--base`, not the browser's current URL. So a QR code shown in the presenter view or overview still points the audience at the slides themselves. Slide links follow your deck's `routerMode` (`/12` or `/#/12`).

| Prop | Default | |
| --- | --- | --- |
| `url` | the deck | Any URL to encode instead |
| `slide` | `false` | `true` for the slide the QR code is on, or a slide number |
| `size` | `200` | Width and height in px |
| `full-width` | `false` | Fill the container's width instead of using `size` |
| `image` | | Logo in the middle. Paths starting with `/` load from your deck's `public/` folder. |
| `options` | | Any [qr-code-styling option](https://github.com/kozakdenys/qr-code-styling#api-documentation) |

## Style

`options` passes straight through to [qr-code-styling](https://github.com/kozakdenys/qr-code-styling), so every dot shape, corner style, gradient and color it supports is available:

```md
<DeckQRCode :options="{ dotsOptions: { type: 'classy-rounded', color: '#1e40af' } }" />
```

To style every QR code in a deck, put the same options under `themeConfig.qrcode` in the headmatter:

```yaml
themeConfig:
  qrcode:
    dotsOptions: { type: 'classy-rounded', color: '#1e40af' }
    cornersSquareOptions: { type: 'extra-rounded' }
    image: /logo.svg
```

Options are layered: built-in defaults, then `themeConfig.qrcode`, then the `options` prop. Nested objects such as `dotsOptions` are merged key by key, so `{ dotsOptions: { color: 'red' } }` keeps the default dot shape.

The defaults are chosen to scan reliably on any slide background:
- Black modules on a white background, with a quiet zone (margin) of 8% of the size.
- Error correction `Q`, or `H` when there's a logo, since the logo covers part of the code.
- SVG output rendered with crisp edges. Anti-aliased seams between modules can make codes unscannable.

Low-contrast colors and separated dot styles (`type: 'dots'`) look nice but scan less reliably. Test with a phone before you present.

## Compared to `slidev-addon-qrcode`

[`slidev-addon-qrcode`](https://github.com/kravetsone/slidev-addon-qrcode) provides a general `<QRCode>` component for arbitrary data. This addon is aimed at linking to your slides: it works out the deck and slide URLs, is clickable, and allows deck-wide styling. The component is named `<DeckQRCode>`, so the two can be installed together.

## Notes

This addon ships a small `vite.config.ts` that pre-bundles `qr-code-styling`, which is CommonJS, for `slidev` dev. Slidev merges it into your deck's Vite config.

## Credits

Ported from `CurrentUrlQRCode` in [developmentseed/ds-slidev-template](https://github.com/developmentseed/ds-slidev-template).
