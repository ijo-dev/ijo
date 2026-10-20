<script setup lang="ts">
/**
 * A button that leans toward the pointer while it hovers, then springs back when it leaves.
 * Only runs where there is a precise hovering pointer. Under `prefers-reduced-motion:
 * reduce` it never moves. Attributes and listeners fall through to the <button>.
 */
import { onMounted, onUnmounted, ref, watch } from "vue";
import gsap from "gsap";

const props = withDefaults(
  defineProps<{ strength?: number; depth?: number; duration?: number; ease?: string }>(),
  { strength: 0.35, depth: 0.5, duration: 0.9, ease: "elastic.out(1, 0.4)" }
);

const button = ref<HTMLButtonElement | null>(null);
const label = ref<HTMLElement | null>(null);
let ctx: gsap.Context | undefined;

const setup = () => {
  ctx?.revert();
  const b = button.value;
  const l = label.value;
  if (!b || !l) return;
  ctx = gsap.context(() => {
    gsap.matchMedia().add(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
      () => {
        const follow = { duration: 0.4, ease: "power3.out" };
        const bx = gsap.quickTo(b, "x", follow);
        const by = gsap.quickTo(b, "y", follow);
        const lx = gsap.quickTo(l, "x", follow);
        const ly = gsap.quickTo(l, "y", follow);
        const move = (event: PointerEvent) => {
          const box = b.getBoundingClientRect();
          const dx = event.clientX - (box.left + box.width / 2);
          const dy = event.clientY - (box.top + box.height / 2);
          bx(dx * props.strength);
          by(dy * props.strength);
          lx(dx * props.strength * props.depth);
          ly(dy * props.strength * props.depth);
        };
        const leave = () =>
          gsap.to([b, l], { x: 0, y: 0, duration: props.duration, ease: props.ease, overwrite: true });
        b.addEventListener("pointermove", move);
        b.addEventListener("pointerleave", leave);
        return () => {
          b.removeEventListener("pointermove", move);
          b.removeEventListener("pointerleave", leave);
        };
      }
    );
  }, b);
};

onMounted(setup);
watch(() => ({ ...props }), setup, { deep: true });
onUnmounted(() => ctx?.revert());
</script>

<template>
  <button ref="button" type="button" data-slot="magnetic-button">
    <span ref="label" data-slot="magnetic-button-label" style="display: inline-block"><slot /></span>
  </button>
</template>
