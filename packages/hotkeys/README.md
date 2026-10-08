# @alukach/slidev-addon-hotkeys

Give any [Slidev](https://sli.dev) slide a keyboard shortcut that jumps to it from anywhere in the deck. Useful for returning to a hub slide, an agenda, or the closing slide during Q&A.

**[Demo](https://alukach.github.io/slidev-addons/hotkeys/)**

## Install

```sh
pnpm add @alukach/slidev-addon-hotkeys
```

```yaml
# slides.md headmatter
addons:
  - '@alukach/slidev-addon-hotkeys'
```

## Use

Add `hotkey` to a slide's frontmatter:

```md
---
hotkey: e
---

# Thank you
```

Pressing `E` on any slide now jumps here. The addon also binds `End` to the last slide.

## Notes

- Avoid keys Slidev already uses, such as `d` (dark mode), `o` (overview), `g` (go to) and the arrow keys.
- Hotkeys are read when the deck loads. Reload after adding one while `slidev` is running.
- If your deck has its own `setup/shortcuts.ts`, both apply.
