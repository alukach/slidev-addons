# @alukach/slidev-addon-tierlist

A drag-and-drop S–F tier list for [Slidev](https://sli.dev), for talks where you rank things live. Each chip on the tier list opens a detail slide, and each detail slide shows its current tier in a badge you can click to change.

**[Demo](https://alukach.github.io/slidev-addons/tierlist/)**

## Install

```sh
pnpm add @alukach/slidev-addon-tierlist
```

```yaml
# slides.md headmatter
addons:
  - '@alukach/slidev-addon-tierlist'
  - '@alukach/slidev-addon-hotkeys'   # optional: press T to jump back to the tier list
```

## Use

Add a tier list slide. Give it `routeAlias: tiers`. With the hotkeys addon, add `hotkey: t` so the presenter can return to it from any slide.

```md
---
layout: full
routeAlias: tiers
hotkey: t
class: '!p-1'
---

<TierList />
```

Then add one `concept` slide per thing to rank. A slide becomes a chip on the tier list when its frontmatter has a `concept` key and a `routeAlias`:

```md
---
layout: concept
routeAlias: dark-mode      # unique id, also the slide's URL
concept:
  title: Dark Mode
  emoji: 🌙                 # optional
---

## Why

- ...
```

`concept: Dark Mode` is shorthand for a title with no emoji. Chips start in the **Unranked** drawer, in slide order.

### Continue a concept

Set `conceptOf` instead of `concept`. The slide shares the parent's title and tier badge, and its heading says "(cont.)". It adds no chip.

```md
---
layout: concept
conceptOf: dark-mode
---
```

### Split a concept slide

Add a `::right::` slot to put text on the left and code or media on the right:

~~~md
## Why

- ...

::right::

```ts
const answer = 42
```
~~~

## Presenting

- Hover over the drawer on the right edge of the tier list to open it, or pin it open with 📍.
- Click a chip to open its slide. Drag chips between tiers, or back into the drawer.
- Click the badge on a concept slide to set its tier without leaving the slide.
- Rankings and visited state are saved in `localStorage`, so a reload keeps them. **Reset** in the drawer clears them. Clear rankings before you go on stage.
- Adding, renaming or removing concepts is safe: saved rankings are reconciled with the current deck.

## Provides

| Name | Kind | |
| --- | --- | --- |
| `<TierList />` | component | The tier list and Unranked drawer |
| `concept` | layout | Detail slide frame: emoji, title, tier badge, optional `::right::` slot |

## Customize

- Tier names: `TIERS` in `store.ts`.
- Tier colors: `COLORS` in `components/TierList.vue` and the `.t-*` classes in `layouts/concept.vue`. Keep the two in sync.

Neither is configurable from your deck yet. Open an issue if you need that.
