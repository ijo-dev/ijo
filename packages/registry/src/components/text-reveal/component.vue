<script setup lang="ts">
/**
 * Slides text up into view from behind a mask, one line, word or letter at a time.
 * Under `prefers-reduced-motion: reduce` the text fades in where it stands.
 */
import { onMounted, onUnmounted, ref, watch } from "vue";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

const props = withDefaults(
  defineProps<{
    as?: string;
    split?: "lines" | "words" | "chars";
    duration?: number;
    stagger?: number;
    ease?: string;
    delay?: number;
  }>(),
  { as: "p", split: "lines", duration: 0.8, stagger: 0.08, ease: "expo.out", delay: 0 }
);

const scope = ref<HTMLElement | null>(null);
let ctx: gsap.Context | undefined;

const play = () => {
  ctx?.revert();
  const el = scope.value;
  if (!el) return;
  ctx = gsap.context(() => {
    gsap.matchMedia().add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        reduced: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        if (context.conditions?.reduced) {
          gsap.from(el, { opacity: 0, duration: 0.2, delay: props.delay, clearProps: "opacity" });
          return;
        }
        SplitText.create(el, {
          type: props.split === "chars" ? "words,chars" : props.split,
          mask: props.split,
          autoSplit: props.split === "lines",
          onSplit: (self) =>
            gsap.from(self[props.split], {
              yPercent: 110,
              duration: props.duration,
              ease: props.ease,
              delay: props.delay,
              stagger: props.stagger,
            }),
        });
      }
    );
  }, el);
};

onMounted(play);
watch(() => ({ ...props }), play, { deep: true });
onUnmounted(() => ctx?.revert());
</script>

<template>
  <component :is="props.as" ref="scope" data-slot="text-reveal">
    <slot />
  </component>
</template>
