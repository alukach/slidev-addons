<script setup lang="ts">
/*
  A QR code for this deck (or any URL), so the audience can open the slides on
  their phones. It's also a link: clicking it opens the URL.

  <DeckQRCode />                  the deck's first slide
  <DeckQRCode slide />            the slide it's on
  <DeckQRCode :slide="12" />      slide 12
  <DeckQRCode url="https://…" />  any URL

  Styling goes straight to qr-code-styling (https://github.com/kozakdenys/qr-code-styling),
  layered: built-in defaults < headmatter `themeConfig.qrcode` < the `options` prop.

  Ported from developmentseed/ds-slidev-template
  (theme/components/CurrentUrlQRCode.vue @ 2094436).
*/
import QRCodeStyling from 'qr-code-styling'
import type { Options } from 'qr-code-styling'
import { computed, onMounted, ref, watch } from 'vue'
import { useSlideContext } from '@slidev/client'

const props = withDefaults(defineProps<{
  url?: string                // defaults to this deck's URL
  slide?: boolean | number    // true: the slide it's on; a number: that slide
  size?: number               // px
  image?: string              // logo in the middle; paths starting with / load from public/
  fullWidth?: boolean         // fill the container's width instead of using `size`
  options?: Partial<Options>  // any qr-code-styling option
}>(), { slide: false, size: 200, fullWidth: false })

const { $page: page, $slidev: slidev } = useSlideContext()

// Built from the deck's base URL rather than location.href, so a QR code shown
// in the presenter view or overview still links to the audience-facing slides.
const target = computed(() => {
  if (props.url) return props.url
  const root = location.origin + import.meta.env.BASE_URL
  if (props.slide === false) return root
  const no = props.slide === true ? page.value : props.slide
  return slidev.configs.routerMode === 'hash' ? `${root}#/${no}` : `${root}${no}`
})

const withBase = (u?: string) => u?.startsWith('/') ? import.meta.env.BASE_URL + u.slice(1) : u

// Merge option layers, one level deep (qr-code-styling nests e.g. dotsOptions.color).
type Layer = Partial<Options> | undefined
const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v)
function merge(...layers: Layer[]) {
  const out: Record<string, any> = {}
  for (const layer of layers) {
    for (const [k, v] of Object.entries(layer ?? {}))
      out[k] = isObj(v) && isObj(out[k]) ? { ...out[k], ...v } : v
  }
  return out as Partial<Options>
}

const options = computed(() => {
  // fullWidth renders large and lets CSS scale it down to the container.
  const px = props.fullWidth ? 600 : props.size
  const o = merge(
    {
      type: 'svg',
      // A light background with a quiet zone keeps it scannable on dark slides.
      margin: Math.round(px * 0.08),
      qrOptions: { errorCorrectionLevel: 'Q' },
      dotsOptions: { type: 'rounded', color: '#000' },
      backgroundOptions: { color: '#fff' },
      imageOptions: { hideBackgroundDots: true, imageSize: 0.4, margin: 4 },
    },
    slidev.configs.themeConfig?.qrcode,
    props.options,
    { data: target.value, width: px, height: px },
  )
  o.image = withBase(props.image ?? o.image)
  // A logo hides part of the code; the highest error correction compensates.
  if (o.image && !props.options?.qrOptions?.errorCorrectionLevel && !slidev.configs.themeConfig?.qrcode?.qrOptions?.errorCorrectionLevel)
    o.qrOptions = { ...o.qrOptions, errorCorrectionLevel: 'H' }
  return o
})

const el = ref<HTMLElement>()
onMounted(() => {
  const qr = new QRCodeStyling(options.value)
  qr.append(el.value)
  watch(options, o => qr.update(o))
})
</script>

<template>
  <a
    ref="el"
    class="deck-qrcode"
    :class="{ 'full-width': fullWidth }"
    :href="target"
    :title="target"
    :aria-label="`QR code: ${target}`"
    target="_blank"
    rel="noopener"
  />
</template>

<style scoped>
/* !important: themes style links (e.g. the default theme's dashed underline) */
.deck-qrcode { display: inline-flex; line-height: 0; border: 0 !important; text-decoration: none !important; }
.deck-qrcode.full-width { display: flex; width: 100%; }
.deck-qrcode.full-width :deep(:is(svg, canvas)) { width: 100% !important; height: auto !important; }
/* Anti-aliased seams between SVG modules make the code unscannable. */
.deck-qrcode :deep(svg) { shape-rendering: crispEdges; }
</style>
