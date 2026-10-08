---
theme: default
title: slidev-addon-live-demo
colorSchema: dark
addons:
  - '@/'  # this package; in your deck use '@alukach/slidev-addon-live-demo'
---

# @alukach/slidev-addon-live-demo

Embed live web apps in slides.

- `<LiveDemo>`: one iframe, with a controls bar, zoom, crop and a video fallback.
- `<DemoReel>`: several LiveDemos on one slide, one per click.

The embedded "app" in this deck is a small stand-in page served from `public/`.

---

# LiveDemo

<LiveDemo src="/demo-app/index.html?feature=search" url class="h-90" />

```md
<LiveDemo src="/demo-app/index.html?feature=search" url />
```

---

# Zoomed out, with a video fallback

<div class="h-100">
<LiveDemo src="/demo-app/index.html" :scale="0.6" fallback="/media/demo-fallback.mp4" />
</div>

Click **Use video** in the bar to switch to the recording.

---

# Without the bar

<div class="h-100">
<LiveDemo src="/demo-app/index.html?feature=map-tiles" :bar="false" />
</div>

---

# DemoReel

Press → to step through the tabs, or click one.

<div class="h-90">
<DemoReel :demos="[
  { label: 'Search', src: '/demo-app/index.html?feature=search' },
  { label: 'Export', src: '/demo-app/index.html?feature=export' },
  { label: 'Zoomed', src: '/demo-app/index.html', scale: 0.5 },
]" />
</div>
