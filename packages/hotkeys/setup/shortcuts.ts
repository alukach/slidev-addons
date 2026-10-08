import type { NavOperations, ShortcutOptions } from '@slidev/types'
import { slides } from '#slidev/slides'

// Any slide can claim a hotkey that jumps to it, via frontmatter:
//
//   ---
//   hotkey: t
//   ---
//
// Plus `End` to jump to the last slide.
// ponytail: read once at startup; a hotkey added while editing needs a reload.
// (Plain function instead of defineShortcutsSetup, which is an identity helper;
// this keeps @slidev/types a type-only import.)
export default (nav: NavOperations, base: ShortcutOptions[]): ShortcutOptions[] => [
  ...base,
  ...slides.value.flatMap((route) => {
    const key = route.meta?.slide?.frontmatter?.hotkey
    return key
      ? [{ name: `go_hotkey_${key}`, key: String(key), fn: () => nav.go(route.no), autoRepeat: false }]
      : []
  }),
  { name: 'go_last_end', key: 'end', fn: () => nav.goLast(), autoRepeat: false },
]
