<script setup lang="ts">
/**
 * A button that squashes and wobbles back into shape, like jelly, when you hover or press it.
 * Under `prefers-reduced-motion: reduce` it never moves. Attributes fall through to <button>.
 */
import { onUnmounted, ref } from "vue";
import gsap from "gsap";

const props = withDefaults(
  defineProps<{ intensity?: number; duration?: number; ease?: string; trigger?: "hover" | "press" | "both" }>(),
  { intensity: 0.5, duration: 0.8, ease: "elastic.out(1.2, 0.3)", trigger: "both" }
);

const el = ref<HTMLButtonElement | null>(null);

const jiggle = () => {
  const button = el.value;
  if (!button || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const squash = 0.18 * props.intensity;
  gsap.killTweensOf(button);
  gsap
    .timeline()
    .to(button, { scaleX: 1 + squash, scaleY: 1 - squash, duration: 0.1, ease: "power2.out" })
    .to(button, { scaleX: 1, scaleY: 1, duration: props.duration, ease: props.ease });
};

const onEnter = () => props.trigger !== "press" && jiggle();
const onDown = () => props.trigger !== "hover" && jiggle();

onUnmounted(() => {
  if (el.value) gsap.killTweensOf(el.value);
});
</script>

<template>
  <button ref="el" type="button" data-slot="jiggly-button" @pointerenter="onEnter" @pointerdown="onDown">
    <slot />
  </button>
</template>
