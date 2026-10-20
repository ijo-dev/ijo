<script setup lang="ts">
/**
 * Reveals items as they scroll into view, in small staggered groups.
 * Put each item in an element with data-slot="scroll-reveal-item".
 * Under `prefers-reduced-motion: reduce` every item is simply visible.
 */
import { onMounted, onUnmounted, ref, watch } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const props = withDefaults(
  defineProps<{
    duration?: number;
    distance?: number;
    stagger?: number;
    ease?: string;
    start?: string;
    once?: boolean;
    /** The element that scrolls; leave out for the page. While it is null nothing is set up. */
    scroller?: HTMLElement | null;
  }>(),
  { duration: 0.7, distance: 32, stagger: 0.08, ease: "power3.out", start: "top 85%", once: true }
);

const scope = ref<HTMLElement | null>(null);
let ctx: gsap.Context | undefined;

const setup = () => {
  ctx?.revert();
  // A scroller was asked for but isn't mounted yet: wait for it.
  if (props.scroller === null) return;
  const el = scope.value;
  if (!el) return;
  ctx = gsap.context(() => {
    const items = gsap.utils.toArray<HTMLElement>("[data-slot='scroll-reveal-item']");
    if (items.length === 0) return;
    gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
      gsap.set(items, { opacity: 0, y: props.distance });
      ScrollTrigger.batch(items, {
        scroller: props.scroller ?? undefined,
        start: props.start,
        once: props.once,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: props.duration,
            ease: props.ease,
            stagger: props.stagger,
            overwrite: true,
          }),
        onLeaveBack: props.once
          ? undefined
          : (batch) => gsap.to(batch, { opacity: 0, y: props.distance, duration: props.duration / 2, overwrite: true }),
      });
    });
  }, el);
};

onMounted(setup);
watch(() => ({ ...props }), setup, { deep: true });
onUnmounted(() => ctx?.revert());
</script>

<template>
  <div ref="scope" data-slot="scroll-reveal">
    <slot />
  </div>
</template>
