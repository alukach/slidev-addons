---
theme: default
title: slidev-addon-qrcode
colorSchema: dark
# GitHub Pages has no SPA fallback, so /<deck>/3 would 404. Hash URLs (/<deck>/#/3) always load.
routerMode: hash
addons:
  - '@/'  # this package; in your deck use '@alukach/slidev-addon-qrcode'
---

# @alukach/slidev-addon-qrcode

A QR code linking to your deck, so the audience can follow along on their phones.

<div class="flex gap-12 items-center mt-8">
  <DeckQRCode />
  <div>

```md
<DeckQRCode />
```

Links to this deck's first slide. Scan it, or click it.

  </div>
</div>

---

# Link to this slide

<div class="flex gap-12 items-center mt-8">
  <DeckQRCode slide />
  <div>

```md
<DeckQRCode slide />
```

Or a specific slide: `<DeckQRCode :slide="4" />`

Links to the slide the QR code is on (here, slide 2).

  </div>
</div>

---

# Any URL, styled, with a logo

<div class="flex gap-12 items-center mt-8">
  <DeckQRCode
    url="https://github.com/alukach/slidev-addons"
    image="/logo.svg"
    :options="{ dotsOptions: { type: 'classy-rounded', color: '#1e40af' } }"
  />
  <div>

```md
<DeckQRCode
  url="https://github.com/alukach/slidev-addons"
  image="/logo.svg"
  :options="{ dotsOptions: { type: 'classy-rounded', color: '#1e40af' } }"
/>
```

`options` takes any [qr-code-styling](https://github.com/kozakdenys/qr-code-styling#api-documentation) option. For deck-wide styling, set `themeConfig.qrcode` in the headmatter.

  </div>
</div>

---
layout: two-cols
---

# Full width

`full-width` fills its container, here the right-hand column.

```md
<DeckQRCode full-width />
```

::right::

<div class="w-70 mx-auto mt-8">
  <DeckQRCode full-width />
</div>
