<script setup lang="ts">
/**
 * Pins a section in place and turns vertical scrolling into a sideways walk through a
 * row of panels. Put each panel in an element with data-slot="pinned-scroll-item".
 * Under `prefers-reduced-motion: reduce` nothing pins; the row scrolls sideways natively.
 */
import { onMounted, onUnmounted, ref, watch } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const props = withDefaults(
  defineProps<{ scrub?: number; length?: number; snap?: boolean; scroller?: HTMLElement | null }>(),
  { scrub: 0.6, length: 1, snap: false, scroller: null }
);

const section = ref<HTMLElement | null>(null);
const track = ref<HTMLElement | null>(null);
let ctx: gsap.Context | undefined;

const setup = () => {
  ctx?.revert();
  const s = section.value;
  const row = track.value;
  if (!s || !row) return;
  ctx = gsap.context(() => {
    const panels = gsap.utils.toArray<HTMLElement>("[data-slot='pinned-scroll-item']");
    gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
      const travel = () => Math.max(0, row.scrollWidth - s.clientWidth);
      gsap.set(s, { overflowX: "hidden" });
      gsap.to(row, {
        x: () => -travel(),
        ease: "none",
        scrollTrigger: {
          trigger: s,
          scroller: props.scroller ?? undefined,
          pin: true,
          start: "top top",
          end: () => `+=${travel() * props.length}`,
          scrub: props.scrub === 0 ? true : props.scrub,
          snap: props.snap && panels.length > 1 ? 1 / (panels.length - 1) : undefined,
          invalidateOnRefresh: true,
        },
      });
    });
  }, s);
};

onMounted(setup);
watch(() => ({ ...props }), setup, { deep: true });
onUnmounted(() => ctx?.revert());
</script>

<template>
  <div ref="section" data-slot="pinned-scroll" style="overflow-x: auto; overscroll-behavior-x: contain">
    <div ref="track" data-slot="pinned-scroll-track" style="display: flex; width: max-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
[data-slot="pinned-scroll-track"] > :slotted(*) {
  flex-shrink: 0;
}
</style>
