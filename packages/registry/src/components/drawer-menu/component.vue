<script setup lang="ts">
/**
 * A menu button that slides a drawer in from the side, its links following one after another.
 * Put each link in an element with data-slot="drawer-menu-item".
 * Escape, the backdrop and the close button close it; focus is kept inside while open.
 * Under `prefers-reduced-motion: reduce` the drawer fades in place.
 */
import { nextTick, onMounted, onUnmounted, ref, useId, watch } from "vue";
import gsap from "gsap";

const props = withDefaults(
  defineProps<{
    label?: string;
    closeLabel?: string;
    duration?: number;
    side?: "left" | "right";
    stagger?: number;
    ease?: string;
  }>(),
  { label: "Menu", closeLabel: "Close", duration: 0.55, side: "right", stagger: 0.05, ease: "expo.out" }
);

const FOCUSABLE = "a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex='-1'])";
const id = useId();
const scope = ref<HTMLElement | null>(null);
const trigger = ref<HTMLButtonElement | null>(null);
const panel = ref<HTMLElement | null>(null);
const open = ref(false);
let ctx: gsap.Context | undefined;
let tl: gsap.core.Timeline | null = null;

const setup = () => {
  ctx?.revert();
  if (!scope.value) return;
  ctx = gsap.context(() => {
    gsap.matchMedia().add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        reduced: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const reduced = context.conditions?.reduced ?? false;
        const offset = props.side === "right" ? 1 : -1;
        tl = gsap
          .timeline({ paused: true })
          .set("[data-slot='drawer-menu-layer']", { visibility: "visible" })
          .fromTo("[data-slot='drawer-menu-overlay']", { opacity: 0 }, { opacity: 1, duration: 0.3 })
          .fromTo(
            "[data-slot='drawer-menu-panel']",
            reduced ? { opacity: 0 } : { xPercent: 100 * offset },
            reduced ? { opacity: 1, duration: 0.2 } : { xPercent: 0, duration: props.duration, ease: props.ease },
            0
          )
          .fromTo(
            "[data-slot='drawer-menu-item']",
            { opacity: 0, x: reduced ? 0 : 24 * offset },
            {
              opacity: 1,
              x: 0,
              duration: reduced ? 0.2 : props.duration * 0.8,
              ease: props.ease,
              stagger: reduced ? 0 : props.stagger,
            },
            reduced ? 0 : props.duration * 0.3
          );
        if (open.value) tl.progress(1);
      }
    );
  }, scope.value);
};

const onEscape = (event: KeyboardEvent) => {
  if (event.key === "Escape") open.value = false;
};

watch(open, async (isOpen) => {
  // Escape closes it from anywhere, even before focus has moved into the drawer.
  if (isOpen) document.addEventListener("keydown", onEscape);
  else document.removeEventListener("keydown", onEscape);
  if (!tl) return;
  if (isOpen) {
    tl.timeScale(1).play();
    await nextTick();
    requestAnimationFrame(() =>
      requestAnimationFrame(() => open.value && panel.value?.querySelector<HTMLElement>(FOCUSABLE)?.focus())
    );
  } else {
    tl.timeScale(1.6).reverse();
    if (panel.value?.contains(document.activeElement)) trigger.value?.focus();
  }
});

const onKeyDown = (event: KeyboardEvent) => {
  if (event.key !== "Tab" || !panel.value) return;
  const stops = [...panel.value.querySelectorAll<HTMLElement>(FOCUSABLE)];
  const [first, last] = [stops[0], stops[stops.length - 1]];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last?.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first?.focus();
  }
};

onMounted(setup);
watch(() => ({ ...props }), setup, { deep: true });
onUnmounted(() => {
  ctx?.revert();
  document.removeEventListener("keydown", onEscape);
});
</script>

<template>
  <div ref="scope" data-slot="drawer-menu">
    <button
      ref="trigger"
      type="button"
      data-slot="drawer-menu-trigger"
      :aria-expanded="open"
      :aria-controls="id"
      @click="open = true"
    >
      {{ props.label }}
    </button>
    <div data-slot="drawer-menu-layer" :data-open="open || undefined" class="layer" @keydown="onKeyDown">
      <div data-slot="drawer-menu-overlay" class="overlay" @click="open = false" />
      <div
        :id="id"
        ref="panel"
        role="dialog"
        aria-modal="true"
        :aria-label="props.label"
        data-slot="drawer-menu-panel"
        class="panel"
        :style="props.side === 'right' ? { right: 0 } : { left: 0 }"
      >
        <button type="button" data-slot="drawer-menu-close" @click="open = false">{{ props.closeLabel }}</button>
        <nav :aria-label="props.label"><slot /></nav>
      </div>
    </div>
  </div>
</template>

<style scoped>
.layer {
  position: fixed;
  inset: 0;
  z-index: 50;
  visibility: hidden;
}
.overlay {
  position: absolute;
  inset: 0;
  background: rgb(0 0 0 / 0.5);
}
.panel {
  position: absolute;
  top: 0;
  bottom: 0;
  width: min(320px, 85%);
  overflow-y: auto;
}
</style>
