<script setup lang="ts">
/**
 * Shuffles a line of text through random characters until it settles on the real words.
 * Put plain text in the default slot. Assistive tech only ever hears the real text.
 * Under `prefers-reduced-motion: reduce` the text fades in instead.
 */
import { onMounted, onUnmounted, ref, watch } from "vue";
import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(ScrambleTextPlugin);

const props = withDefaults(
  defineProps<{
    duration?: number;
    chars?: string;
    revealDelay?: number;
    speed?: number;
    replayOnHover?: boolean;
  }>(),
  { duration: 1.2, chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", revealDelay: 0.3, speed: 0.6, replayOnHover: false }
);

const visual = ref<HTMLElement | null>(null);
let ctx: gsap.Context | undefined;
let text = "";

const scramble = () =>
  gsap.to(visual.value, {
    duration: props.duration,
    scrambleText: {
      text,
      chars: props.chars,
      revealDelay: props.revealDelay,
      speed: props.speed,
      tweenLength: false,
    },
  });

const play = () => {
  ctx?.revert();
  const el = visual.value;
  if (!el) return;
  // Read the real text once, before any scramble has touched it.
  text ||= (el.textContent ?? "").trim();
  ctx = gsap.context(() => {
    gsap.matchMedia().add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        reduced: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        if (context.conditions?.reduced) {
          gsap.from(el, { opacity: 0, duration: 0.2, clearProps: "opacity" });
          return;
        }
        scramble();
      }
    );
  }, el);
};

const replay = () => {
  const el = visual.value;
  if (!el || !props.replayOnHover || gsap.isTweening(el)) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  ctx?.add(scramble);
};

onMounted(play);
watch(() => ({ ...props }), play, { deep: true });
onUnmounted(() => ctx?.revert());
</script>

<template>
  <span data-slot="scramble-text" class="scramble-text" @pointerenter="replay" @focus="replay">
    <span class="sr-only"><slot /></span>
    <span ref="visual" data-slot="scramble-text-visual" aria-hidden="true"><slot /></span>
  </span>
</template>

<style scoped>
.scramble-text {
  position: relative;
  display: inline-block;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}
</style>
