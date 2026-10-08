---
theme: default
title: slidev-addon-laser
colorSchema: dark
addons:
  - '@/'  # this package; in your deck use '@alukach/slidev-addon-laser'
themeConfig:
  laserColor: '#ef4444'
  laserWidth: 6
  laserFade: 900
---

# @alukach/slidev-addon-laser

A fading laser trail for pointing at things.

- **Hold Shift and drag** to draw.
- Or click the scribble button in the nav bar (bottom left, on hover) to turn it on, then just move the pointer.

---

# Point at something

<div class="grid grid-cols-3 gap-6 mt-12 text-center text-5xl">
  <div>🛰️</div><div>🗺️</div><div>📈</div>
</div>

<p class="mt-12 opacity-60">Open <code>/presenter</code> in another window: strokes drawn there appear here too.</p>
