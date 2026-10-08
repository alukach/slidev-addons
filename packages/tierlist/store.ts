import { computed, reactive, watch } from 'vue'
import { slides } from '#slidev/slides'

export const TIERS = ['S', 'A', 'B', 'C', 'D', 'F'] as const
export type Tier = typeof TIERS[number]

export interface Concept {
  id: string     // the slide's routeAlias
  title: string
  emoji: string
}

/*
 * Concepts are derived from slides.md. A slide opts in with a `concept` key
 * in its frontmatter, and must have a `routeAlias` (used as the concept id):
 *
 *   ---
 *   layout: concept
 *   routeAlias: sts
 *   concept: STS Implementation          # title only
 *   ---
 *
 *   ---
 *   routeAlias: sts
 *   concept: { title: STS Implementation, emoji: 🔑 }
 *   ---
 *
 * Order in the Unranked pool follows slide order.
 */
export const CONCEPTS = computed<Concept[]>(() => {
  const out: Concept[] = []
  for (const route of slides.value) {
    const fm = route.meta?.slide?.frontmatter ?? {}
    const c = fm.concept
    if (!c) continue
    const id = fm.routeAlias
    if (!id) {
      console.warn(`[tierlist] slide ${route.no} has \`concept\` but no \`routeAlias\`; skipped`)
      continue
    }
    const meta = typeof c === 'object' ? c : { title: c === true ? fm.title : c }
    out.push({ id: String(id), title: String(meta.title ?? id), emoji: String(meta.emoji ?? '') })
  }
  return out
})

const KEY = 'tierdeck:v1'

interface State {
  pool: string[]
  tiers: Record<Tier, string[]>
  visited: string[]
}

function empty(): State {
  return {
    pool: [],
    tiers: Object.fromEntries(TIERS.map(t => [t, []])) as Record<Tier, string[]>,
    visited: [],
  }
}

// Fit a (possibly stale) saved state to the current concept list:
// drop unknown ids and duplicates, and put any unplaced concept in the pool.
function reconcile(saved: Partial<State>): State {
  const ids = CONCEPTS.value.map(c => c.id)
  const known = new Set(ids)
  const placed = new Set<string>()
  const keep = (list: unknown) =>
    (Array.isArray(list) ? list : []).filter((id: string) => known.has(id) && !placed.has(id) && !!placed.add(id))
  const next = empty()
  for (const t of TIERS) next.tiers[t] = keep(saved.tiers?.[t])
  next.pool = keep([...(saved.pool ?? []), ...ids])
  next.visited = (saved.visited ?? []).filter(id => known.has(id))
  return next
}

function load(): State {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return reconcile(JSON.parse(raw))
  }
  catch {}
  return reconcile({})
}

// Module-level singleton: survives navigation between slides.
export const state = reactive<State>(load())

// Re-fit when slides.md changes (HMR while editing, add/remove a concept).
watch(CONCEPTS, () => Object.assign(state, reconcile(JSON.parse(JSON.stringify(state)))))

watch(state, (s) => {
  try { localStorage.setItem(KEY, JSON.stringify(s)) }
  catch {}
}, { deep: true })

export const conceptById = (id: string) => CONCEPTS.value.find(c => c.id === id)

export function tierOf(id: string): Tier | null {
  for (const t of TIERS) if (state.tiers[t].includes(id)) return t
  return null
}

export function markVisited(id: string) {
  if (!state.visited.includes(id)) state.visited.push(id)
}

export function reset() {
  Object.assign(state, reconcile({}))
}

// Move a concept to a tier (appended at the end), or back to the pool with `null`.
export function setTier(id: string, tier: Tier | null) {
  if (tierOf(id) === tier && (tier !== null || state.pool.includes(id))) return
  state.pool = state.pool.filter(x => x !== id)
  for (const t of TIERS) state.tiers[t] = state.tiers[t].filter(x => x !== id)
  if (tier) state.tiers[tier].push(id)
  else state.pool.push(id)
}
