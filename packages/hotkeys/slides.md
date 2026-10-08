---
theme: default
title: slidev-addon-hotkeys
colorSchema: dark
addons:
  - '@/'  # this package; in your deck use '@alukach/slidev-addon-hotkeys'
---

# @alukach/slidev-addon-hotkeys

Give any slide a key that jumps to it.

Try it: press **A**, **B** or **C** from any slide. **End** goes to the last slide.

```yaml
---
hotkey: a
---
```

---
hotkey: a
---

# Slide A

This slide's frontmatter has `hotkey: a`.

---
hotkey: b
---

# Slide B

`hotkey: b`. Press **A** to jump back.

---
hotkey: c
---

# Slide C

`hotkey: c`

---

# The end

No hotkey here, but **End** always jumps to the last slide.
