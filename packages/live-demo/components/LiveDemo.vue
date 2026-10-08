<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<{
  src: string          // live app URL for the iframe
  fallback?: string    // recorded video, used if the live demo fails
  scale?: number       // render the page at 1/scale size, then shrink it to fit (e.g. 0.5 = 2x more page)
  crop?: number        // px (in the page's own coordinates) to hide on every edge, e.g. 16 for Storybook's padding
  bar?: boolean        // show the controls bar
  url?: boolean        // show the URL in the bar
  lazy?: boolean       // defer loading until the iframe is visible (set false to preload)
}>(), { scale: 1, crop: 0, bar: true, url: false, lazy: true })

// Root-relative paths ("/demo-app/") point into public/, so prefix the deploy base.
const withBase = (u?: string) => u?.startsWith('/') ? import.meta.env.BASE_URL + u.slice(1) : u
const src = computed(() => withBase(props.src))
const fallback = computed(() => withBase(props.fallback))

const mode = ref<'live' | 'video'>('live')
const loaded = ref(false)

// The iframe is laid out at (100% / scale) plus the cropped margin on each side,
// then shifted up-left by the crop and shrunk back with a transform. The page
// sees a larger viewport (everything appears smaller) and its outer `crop` px
// fall outside the clipped viewport.
const frameStyle = computed(() => {
  const s = props.scale > 0 ? props.scale : 1
  const c = Math.max(0, props.crop)
  return {
    width: `calc(${100 / s}% + ${2 * c}px)`,
    height: `calc(${100 / s}% + ${2 * c}px)`,
    transform: `translate(${-c * s}px, ${-c * s}px) scale(${s})`,
  }
})
</script>

<template>
  <div class="demo" :class="{ bare: !props.bar }">
    <div v-if="props.bar" class="bar">
      <span class="dot" :class="mode === 'live' ? (loaded ? 'ok' : 'wait') : 'rec'" />
      <code v-if="props.url">{{ mode === 'live' ? src : fallback }}</code>
      <slot name="bar" />
      <div class="spacer" />
      <a v-if="mode === 'live'" :href="src" target="_blank" rel="noopener">Open ↗</a>
      <button v-if="props.fallback" @click="mode = mode === 'live' ? 'video' : 'live'">
        {{ mode === 'live' ? 'Use video' : 'Use live' }}
      </button>
    </div>
    <div class="viewport">
      <iframe
        v-if="mode === 'live'"
        :src="src"
        :style="frameStyle"
        :loading="props.lazy ? 'lazy' : 'eager'"
        allow="fullscreen; clipboard-write"
        @load="loaded = true"
      />
      <video v-else :src="fallback" controls autoplay muted loop playsinline />
    </div>
  </div>
</template>

<style scoped>
.demo {
  flex: 1; min-height: 0; height: 100%; display: flex; flex-direction: column;
  border: 1px solid #44444c; border-radius: 8px; overflow: hidden; background: #111;
}
.demo.bare { border: 0; border-radius: 0; background: transparent; }
.bar {
  display: flex; align-items: center; gap: 8px; padding: 4px 10px;
  background: #222228; font-size: .7rem;
}
.bar code {
  opacity: .7; background: none; min-width: 0;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.zoom { opacity: .5; flex: none; }
.spacer { flex: 1; }
.bar a, .bar button {
  flex: none; white-space: nowrap;
  padding: 2px 8px; border: 1px solid #555; border-radius: 4px; text-decoration: none;
}
.dot { width: 8px; height: 8px; border-radius: 50%; flex: none; }
.dot.ok { background: #4ade80; } .dot.wait { background: #facc15; } .dot.rec { background: #f87171; }
.viewport { position: relative; flex: 1; min-height: 0; overflow: hidden; }
iframe {
  position: absolute; top: 0; left: 0; border: 0; background: transparent;
  transform-origin: 0 0;
}
video { width: 100%; height: 100%; background: #000; }
</style>
