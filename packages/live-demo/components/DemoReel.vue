<script setup lang="ts">
/*
  Several LiveDemos on one slide, shown one at a time.

  <DemoReel :demos="[
    { label: 'Globe',   src: 'https://…', crop: 16 },
    { label: 'Viewer',  src: 'https://…', scale: 0.6 },
    { label: 'Uploads', src: 'https://…', fallback: '/media/uploads.mp4' },
  ]" />

  - The first demo shows when the slide opens; each → / Space advances to the
    next demo (they're registered as Slidev clicks, so ← goes back and the
    slide only advances after the last demo).
  - Tabs in the bar jump straight to any demo.
  - Every iframe stays loaded (just hidden), so switching is instant and
    page state is preserved.
  - `at` works like v-click's `at` if you need to offset the clicks.
*/
import { computed, onMounted, onUnmounted, shallowRef } from 'vue'
import { useSlideContext } from '@slidev/client'
import LiveDemo from './LiveDemo.vue'

interface Demo {
  src: string
  label?: string
  scale?: number
  crop?: number
  fallback?: string
  url?: boolean
}

const props = withDefaults(defineProps<{
  demos: Demo[]
  at?: string | number
  lazy?: boolean   // false (default): load every tab as soon as the slide mounts
}>(), { at: '+1', lazy: false })

const { $clicksContext: clicks, $nav: nav, $page: page } = useSlideContext()

const id = `demo-reel-${Math.random().toString(36).slice(2)}`
// shallowRef: a deep ref would unwrap info.currentOffset (a ComputedRef) and break `.value` below.
const info = shallowRef<ReturnType<typeof clicks.calculateSince>>(null)

onMounted(() => {
  const steps = props.demos.length - 1
  if (steps <= 0) return
  info.value = clicks.calculateSince(props.at, steps)
  if (info.value) clicks.register(id, info.value)
})
onUnmounted(() => clicks.unregister(id))

const active = computed(() => {
  const last = props.demos.length - 1
  if (!info.value) return 0
  const i = info.value.currentOffset.value + 1
  return Number.isFinite(i) ? Math.min(last, Math.max(0, i)) : 0
})

function show(i: number) {
  if (!info.value) return
  nav.value.go(page.value, info.value.start + i - 1)
}
</script>

<template>
  <div class="reel">
    <div
      v-for="(d, i) in props.demos"
      :key="i"
      class="layer"
      :class="{ active: i === active }"
      :aria-hidden="i !== active"
    >
      <LiveDemo
        :src="d.src"
        :scale="d.scale ?? 1"
        :crop="d.crop ?? 0"
        :fallback="d.fallback"
        :url="d.url ?? false"
        :lazy="props.lazy"
      >
        <template #bar>
          <nav class="tabs">
            <button
              v-for="(t, j) in props.demos"
              :key="j"
              class="tab"
              :class="{ current: j === active }"
              @click="show(j)"
            >
              {{ t.label ?? `Demo ${j + 1}` }}
            </button>
          </nav>
        </template>
      </LiveDemo>
    </div>
  </div>
</template>

<style scoped>
.reel { position: relative; flex: 1; min-height: 0; height: 100%; }
.layer {
  position: absolute; inset: 0; display: flex;
  visibility: hidden; opacity: 0; transition: opacity .2s ease, visibility 0s .2s;
}
.layer.active { visibility: visible; opacity: 1; transition: opacity .2s ease; }
.tabs { display: flex; gap: 4px; min-width: 0; overflow: hidden; }
.tab {
  padding: 2px 8px; border-radius: 4px; border: 1px solid transparent;
  opacity: .6; white-space: nowrap; font-size: .7rem;
}
.tab:hover { opacity: 1; }
.tab.current { opacity: 1; border-color: #666; background: #ffffff14; }
</style>
