<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { onSlideEnter, useNav, useSlideContext } from '@slidev/client'
import { TIERS, conceptById, markVisited, setTier, tierOf } from '../store'
import type { Tier } from '../store'

const { $frontmatter } = useSlideContext()
const { go } = useNav()

// A continuation slide sets `conceptOf: <routeAlias>` to share that concept's
// header (emoji, title, tier badge) without adding another tier-list chip.
const continuation = computed(() => !!$frontmatter.conceptOf)
const id = computed(() => ($frontmatter.conceptOf ?? $frontmatter.routeAlias) as string)
const concept = computed(() => conceptById(id.value))
const tier = computed(() => tierOf(id.value))

onSlideEnter(() => markVisited(id.value))

// Tier picker: click the badge to open, pick a tier (or Unranked), click outside / Esc to close.
const open = ref(false)
const picker = ref<HTMLElement>()
function choose(t: Tier | null) {
  setTier(id.value, t)
  open.value = false
}
function onDocPointer(e: PointerEvent) {
  if (open.value && picker.value && !picker.value.contains(e.target as Node)) open.value = false
}
function onKey(e: KeyboardEvent) {
  if (open.value && e.key === 'Escape') {
    open.value = false
    e.stopPropagation()
  }
}
onMounted(() => {
  document.addEventListener('pointerdown', onDocPointer, true)
  document.addEventListener('keydown', onKey, true)
})
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocPointer, true)
  document.removeEventListener('keydown', onKey, true)
})
</script>

<template>
  <div class="slidev-layout concept">
    <header>
      <h1>{{ concept?.emoji }} {{ concept?.title }}<span v-if="continuation" class="cont"> (cont.)</span></h1>
      <div ref="picker" class="picker">
        <button
          class="badge"
          :class="tier ? `t-${tier}` : 'unranked'"
          title="Change tier"
          aria-haspopup="listbox"
          :aria-expanded="open"
          @click="open = !open"
        >
          {{ tier ?? '?' }}
        </button>
        <div v-if="open" class="menu" role="listbox">
          <button
            v-for="t in TIERS"
            :key="t"
            class="option"
            :class="[`t-${t}`, { current: tier === t }]"
            role="option"
            :aria-selected="tier === t"
            @click="choose(t)"
          >
            {{ t }}
          </button>
          <button
            class="option unranked wide"
            :class="{ current: tier === null }"
            role="option"
            :aria-selected="tier === null"
            @click="choose(null)"
          >
            Unranked
          </button>
        </div>
      </div>
    </header>
    <!-- Optional `::right::` slot: text on the left, the slot's content (code, media) on the right. -->
    <div v-if="$slots.right" class="body split">
      <div class="main"><slot /></div>
      <div class="side"><slot name="right" /></div>
    </div>
    <div v-else class="body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.concept { display: flex; flex-direction: column; height: 100%; padding: 1.5rem 2rem; }
header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
h1 { flex: 1; margin: 0 !important; font-size: 1.8rem !important; }
.back {
  font-size: .8rem; padding: 4px 10px; border-radius: 6px;
  border: 1px solid #555; opacity: .75;
}
.back:hover { opacity: 1; }
.cont { opacity: .5; font-weight: 400; }

.picker { position: relative; }
.badge {
  width: 48px; height: 48px; border-radius: 8px; display: grid; place-items: center;
  font-weight: 800; font-size: 1.5rem; color: #111; cursor: pointer;
  transition: transform .1s ease, box-shadow .1s ease;
}
.badge:hover { transform: scale(1.06); box-shadow: 0 0 0 2px #fff4; }

.menu {
  position: absolute; top: calc(100% + 6px); right: 0; z-index: 20;
  display: grid; grid-template-columns: repeat(3, 40px); gap: 4px;
  padding: 6px; background: #18181c; border: 1px solid #3a3a42; border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, .5);
}
.option {
  height: 40px; border-radius: 6px; display: grid; place-items: center;
  font-weight: 800; font-size: 1.1rem; color: #111; cursor: pointer;
  outline: 2px solid transparent; outline-offset: 1px;
}
.option:hover { filter: brightness(1.1); }
.option.current { outline-color: #fff; }
.option.wide { grid-column: 1 / -1; font-size: .75rem; font-weight: 600; letter-spacing: .05em; }

.t-S { background: #ff7f7f } .t-A { background: #ffbf7f } .t-B { background: #ffdf7f }
.t-C { background: #bfff7f } .t-D { background: #7fbfff } .t-F { background: #bf7fbf }
.unranked { background: #444; color: #ddd; }
.body { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: .75rem; }

/* Content headings sit below the 1.8rem slide title. */
.body :deep(h2) { font-size: 1.3rem; line-height: 1.3; margin: .5rem 0 0; color: #808080; } /* white at 50% over black, as a solid color */
.body :deep(h3) { font-size: 1.1rem; line-height: 1.3; margin: .25rem 0 0; }
.body :deep(h4) { font-size: 1rem; margin: 0; }
.body :deep(:is(p, ul, ol, table) + h2) { margin-top: 1rem; }

/* Two-column variant used when the slide has a ::right:: slot. */
.body.split { display: grid; grid-template-columns: 1fr 1.7fr; gap: 1.5rem; flex-direction: unset; }
.main { min-width: 0; }
.side { min-width: 0; min-height: 0; display: flex; flex-direction: column; justify-content: center; gap: .5rem; }
/* Code on the right is the focus: bigger than Slidev's default code size. */
.side :deep(pre), .side :deep(.slidev-code) { font-size: .85rem !important; line-height: 1.55 !important; overflow-x: auto; }
.side :deep(.slidev-code-wrapper), .side :deep(pre) { margin: 0; }
</style>
