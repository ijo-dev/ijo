<script setup lang="ts">
/**
 * Reveals a stack of elements by lifting them into place, one after another.
 *
 * Under `prefers-reduced-motion: reduce` the children cross-fade in place with
 * no travel and no stagger.
 */
import { onMounted, onUnmounted, ref, watch } from "vue";
import gsap from "gsap";

const props = withDefaults(
  defineProps<{
    /** Seconds each child takes to arrive. */
    duration?: number;
    /** How far below its resting place each child starts, in pixels. */
    distance?: number;
    /** Seconds between one child starting and the next. */
    stagger?: number;
    /** A GSAP ease name, e.g. "expo.out". */
    ease?: string;
    /** Seconds to wait before the first child moves. */
    delay?: number;
    /** Reveal children one after another, or all together. */
    staggered?: boolean;
  }>(),
  { duration: 0.9, distance: 24, stagger: 0.06, ease: "expo.out", delay: 0, staggered: true }
);

const scope = ref<HTMLElement | null>(null);
let ctx: gsap.Context | undefined;

const play = () => {
  ctx?.revert();
  ctx = gsap.context(() => {
    const items = gsap.utils.toArray<HTMLElement>("[data-slot='rise-in-item']");
    if (items.length === 0) return;

    const mm = gsap.matchMedia();
    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        reduced: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const reduced = context.conditions?.reduced ?? false;
        gsap.from(items, {
          y: reduced ? 0 : props.distance,
          opacity: 0,
          duration: reduced ? 0.2 : props.duration,
          delay: props.delay,
          ease: reduced ? "none" : props.ease,
          stagger: reduced || !props.staggered ? 0 : props.stagger,
          clearProps: "transform,opacity",
        });
      },
      scope.value ?? undefined
    );
  }, scope.value ?? undefined);
};

onMounted(play);
watch(() => ({ ...props }), play, { deep: true });
onUnmounted(() => ctx?.revert());
</script>

<template>
  <div ref="scope" data-slot="rise-in">
    <slot />
  </div>
</template>
