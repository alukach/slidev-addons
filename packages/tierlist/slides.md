---
theme: default
title: slidev-addon-tierlist
colorSchema: dark
# GitHub Pages has no SPA fallback, so /<deck>/3 would 404. Hash URLs (/<deck>/#/3) always load.
routerMode: hash
transition: fade
addons:
  - '@/'              # this package; in your deck use '@alukach/slidev-addon-tierlist'
  - '@/../hotkeys'    # @alukach/slidev-addon-hotkeys, for the T shortcut
---

# @alukach/slidev-addon-tierlist

Rank topics live with your audience.

1. The next slide is the tier list. Every topic starts in the **Unranked** drawer on the right edge.
2. Click a chip to open its slide. Drag chips between tiers to rank them.
3. On a topic slide, click the badge in the top-right corner to set its tier.
4. Press **T** to return to the tier list.

---
layout: full
routeAlias: tiers
hotkey: t
class: '!p-1'
---

<TierList />

---
layout: concept
routeAlias: pizza
concept:
  title: Pizza
  emoji: 🍕
---

## Pros

- Shareable
- Good cold

## Cons

- Burns the roof of your mouth

---
layout: concept
routeAlias: tacos
concept:
  title: Tacos
  emoji: 🌮
---

## Pros

- Endless variety

::right::

```yaml
# This slide uses the ::right:: slot
layout: concept
routeAlias: tacos
concept:
  title: Tacos
  emoji: 🌮
```

---
layout: concept
routeAlias: sushi
concept:
  title: Sushi
  emoji: 🍣
---

## Pros

- Beautiful

---
layout: concept
conceptOf: sushi
---

## Still sushi

`conceptOf: sushi` continues a topic over another slide. It shares the title and tier badge, and adds no chip.

---
layout: concept
routeAlias: salad
concept: Salad
---

`concept: Salad` is shorthand for a title with no emoji.
