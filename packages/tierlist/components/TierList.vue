<script setup lang="ts">
import { computed, ref } from "vue";
import draggable from "vuedraggable";
import { useNav } from "@slidev/client";
import { TIERS, conceptById, reset, state } from "../store";

const { go } = useNav();

const COLORS: Record<string, string> = {
  S: "#ff7f7f",
  A: "#ffbf7f",
  B: "#ffdf7f",
  C: "#bfff7f",
  D: "#7fbfff",
  F: "#bf7fbf",
};

const group = "tiers";
const open = (id: string) => go(id);

// Drawer: opens on hover, while a drag is in progress, or when pinned.
const pinned = ref(false);
const hovering = ref(false);
const dragging = ref(false);
const drawerOpen = computed(
  () => pinned.value || hovering.value || dragging.value,
);

// v-fit: shrink a tier row's chips (via the --s CSS variable) until they fit.
// Re-runs when the row resizes or its chips change (drop, reorder, visited).
const MIN_SCALE = 0.4;
const STEP = 0.05;
type FitEl = HTMLElement & {
  _fit?: { ro: ResizeObserver; mo: MutationObserver };
};
const vFit = {
  mounted(el: FitEl) {
    let frame = 0;
    const fit = () => {
      let s = 1;
      el.style.setProperty("--s", "1");
      const overflows = () =>
        el.scrollHeight > el.clientHeight + 1 ||
        el.scrollWidth > el.clientWidth + 1;
      while (s > MIN_SCALE && overflows()) {
        s = Math.max(MIN_SCALE, Math.round((s - STEP) * 100) / 100);
        el.style.setProperty("--s", String(s));
      }
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(fit);
    };
    const ro = new ResizeObserver(schedule);
    const mo = new MutationObserver(schedule);
    ro.observe(el);
    mo.observe(el, { childList: true, subtree: true, characterData: true });
    el._fit = { ro, mo };
    schedule();
  },
  unmounted(el: FitEl) {
    el._fit?.ro.disconnect();
    el._fit?.mo.disconnect();
  },
};

const dragHandlers = {
  onStart: () => {
    dragging.value = true;
  },
  onEnd: () => {
    dragging.value = false;
  },
};
</script>

<template>
  <div class="board">
    <div class="tiers">
      <div v-for="t in TIERS" :key="t" class="row">
        <div class="label" :style="{ background: COLORS[t] }">{{ t }}</div>
        <draggable
          v-model="state.tiers[t]"
          :group="group"
          item-key="id"
          v-fit
          class="drop"
          ghost-class="ghost"
          :animation="150"
          v-bind="dragHandlers"
        >
          <template #item="{ element }">
            <button
              class="chip"
              :class="{ visited: state.visited.includes(element) }"
              :title="`Open: ${conceptById(element)?.title}`"
              @click="open(element)"
            >
              <span>{{ conceptById(element)?.emoji }}</span>
              {{ conceptById(element)?.title }}
            </button>
          </template>
        </draggable>
      </div>
    </div>

    <aside
      class="drawer"
      :class="{ open: drawerOpen, pinned }"
      @mouseenter="hovering = true"
      @mouseleave="hovering = false"
      @dragenter="hovering = true"
    >
      <div class="tab">
        <span class="tab-label">Unranked · {{ state.pool.length }}</span>
      </div>
      <div class="panel">
        <header>
          <span>Unranked</span>
          <button
            class="icon"
            :title="pinned ? 'Unpin drawer' : 'Pin drawer open'"
            @click="pinned = !pinned"
          >
            {{ pinned ? "📌" : "📍" }}
          </button>
        </header>
        <draggable
          v-model="state.pool"
          :group="group"
          item-key="id"
          class="pool"
          ghost-class="ghost"
          :animation="150"
          v-bind="dragHandlers"
        >
          <template #item="{ element }">
            <button
              class="chip"
              :class="{ visited: state.visited.includes(element) }"
              @click="open(element)"
            >
              <span>{{ conceptById(element)?.emoji }}</span>
              {{ conceptById(element)?.title }}
            </button>
          </template>
        </draggable>
        <button
          class="reset"
          title="Move everything back to Unranked"
          @click="reset"
        >
          Reset
        </button>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.board {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* Tier rows: full height, leaving room only for the collapsed drawer tab. */
.tiers {
  position: absolute;
  inset: 0 32px 0 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.row {
  flex: 1;
  min-height: 0;
  display: flex;
  background: #1f1f23;
}
.label {
  width: 120px;
  flex: none;
  display: grid;
  place-items: center;
  font-size: 3.25rem;
  font-weight: 800;
  color: #111;
}
.drop {
  --s: 1; /* set by v-fit */
  flex: 1;
  min-width: 0;
  display: flex;
  flex-wrap: wrap;
  gap: calc(10px * var(--s));
  padding: 8px 12px;
  align-content: safe center;
  align-items: center;
  overflow: auto;
}
.drop .chip {
  gap: calc(8px * var(--s));
  padding: calc(10px * var(--s)) calc(18px * var(--s));
  font-size: calc(1.3rem * var(--s));
}

/* Right-side drawer. Collapsed: a 32px tab. Open: overlays the tiers. */
.drawer {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 32px;
  display: flex;
  background: #18181c;
  border-left: 1px solid #3a3a42;
  transition:
    width 0.2s ease,
    box-shadow 0.2s ease;
  z-index: 10;
}
.drawer.open {
  width: 360px;
  box-shadow: -12px 0 32px rgba(0, 0, 0, 0.5);
}
.tab {
  width: 32px;
  flex: none;
  display: grid;
  place-items: center;
  cursor: pointer;
  background: #232329;
}
.tab-label {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0.75;
  white-space: nowrap;
}
.panel {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s;
}
.drawer.open .panel {
  opacity: 1;
  pointer-events: auto;
}
.panel header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.8;
}
.icon {
  font-size: 1rem;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid #444;
}
.drawer.pinned .icon {
  border-color: #aaa;
}
.pool {
  flex: 1;
  min-height: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: stretch;
  padding: 8px;
  border: 1px dashed #555;
  border-radius: 6px;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  /* border-radius: 8px; */
  cursor: grab;
  background: #2d2d33;
  color: #fff;
  border: 1px solid #44444c;
  font-size: 1.3rem;
  font-weight: 700;
  white-space: nowrap;
}
.chip:hover {
  border-color: #aaa;
}
.chip:active {
  cursor: grabbing;
}
.chip.visited {
}
.ghost {
  opacity: 0.3;
}
.pool .chip {
  white-space: normal;
  text-align: left;
  font-size: 0.85rem;
}
.reset {
  align-self: flex-start;
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 4px;
  border: 1px solid #555;
  opacity: 0.6;
}
.reset:hover {
  opacity: 1;
}
</style>
