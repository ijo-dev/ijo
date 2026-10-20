<script setup lang="ts">
/**
 * An endless strip of logos, words or cards that slides past at a steady pace.
 * Put each item in an element with data-slot="marquee-item". Pauses off screen
 * and on hover or focus. Under `prefers-reduced-motion: reduce` it stays still.
 */
import { onMounted, onUnmounted, ref, watch } from "vue";
import gsap from "gsap";

const props = withDefaults(
  defineProps<{
    duration?: number;
    direction?: "left" | "right";
    pauseOnHover?: boolean;
    gap?: number;
    autoplay?: boolean;
  }>(),
  { duration: 24, direction: "left", pauseOnHover: true, gap: 32, autoplay: true }
);

const strip = ref<HTMLElement | null>(null);
const track = ref<HTMLElement | null>(null);
let ctx: gsap.Context | undefined;
let loop: gsap.core.Tween | null = null;

const setup = () => {
  ctx?.revert();
  const s = strip.value;
  const row = track.value;
  if (!s || !row || !props.autoplay) return;
  ctx = gsap.context(() => {
    gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
      const [from, to] = props.direction === "left" ? [0, -50] : [-50, 0];
      const tween = gsap.fromTo(row, { xPercent: from }, { xPercent: to, duration: props.duration, ease: "none", repeat: -1 });
      loop = tween;
      const observer = new IntersectionObserver(([entry]) => tween.paused(!entry?.isIntersecting));
      observer.observe(s);
      return () => {
        observer.disconnect();
        loop = null;
      };
    });
  }, s);
};

const ease = (timeScale: number) => {
  if (props.pauseOnHover && loop) gsap.to(loop, { timeScale, duration: 0.5, overwrite: true });
};

onMounted(setup);
watch(() => ({ ...props }), setup, { deep: true });
onUnmounted(() => ctx?.revert());
</script>

<template>
  <div
    ref="strip"
    data-slot="marquee"
    style="overflow: hidden"
    @pointerenter="ease(0)"
    @pointerleave="ease(1)"
    @focusin="ease(0)"
    @focusout="ease(1)"
  >
    <div ref="track" data-slot="marquee-track" style="display: flex; width: max-content">
      <div data-slot="marquee-copy" :style="{ display: 'flex', flexShrink: 0, gap: `${props.gap}px`, paddingInlineEnd: `${props.gap}px` }">
        <slot />
      </div>
      <div data-slot="marquee-copy" aria-hidden="true" inert :style="{ display: 'flex', flexShrink: 0, gap: `${props.gap}px`, paddingInlineEnd: `${props.gap}px` }">
        <slot />
      </div>
    </div>
  </div>
</template>
