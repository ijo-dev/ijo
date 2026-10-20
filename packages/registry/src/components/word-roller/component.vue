<script setup lang="ts">
/**
 * Rolls one word in a sentence through a list of alternatives, like a split-flap sign.
 * Put each word in an element with data-slot="word-roller-item".
 * Under `prefers-reduced-motion: reduce` the words cross-fade in place.
 */
import { onMounted, onUnmounted, ref, watch } from "vue";
import gsap from "gsap";

const props = withDefaults(
  defineProps<{
    duration?: number;
    hold?: number;
    ease?: string;
    direction?: "up" | "down";
    autoplay?: boolean;
  }>(),
  { duration: 0.6, hold: 1.6, ease: "power3.inOut", direction: "up", autoplay: true }
);

const scope = ref<HTMLElement | null>(null);
let ctx: gsap.Context | undefined;

const play = () => {
  ctx?.revert();
  const el = scope.value;
  if (!el) return;
  ctx = gsap.context(() => {
    const items = gsap.utils.toArray<HTMLElement>("[data-slot='word-roller-item']");
    if (items.length < 2) return;
    items.slice(1).forEach((item) => item.setAttribute("aria-hidden", "true"));
    const from = props.direction === "up" ? 100 : -100;

    gsap.matchMedia().add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        reduced: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const reduced = context.conditions?.reduced ?? false;
        gsap.set(items, reduced ? { autoAlpha: 0 } : { yPercent: from });
        gsap.set(items[0]!, reduced ? { autoAlpha: 1 } : { yPercent: 0 });
        if (!props.autoplay) return;

        const tl = gsap.timeline({ repeat: -1 });
        items.forEach((item, i) => {
          const next = items[(i + 1) % items.length]!;
          if (reduced) {
            tl.to(item, { autoAlpha: 0, duration: 0.2 }, `+=${props.hold}`).to(next, { autoAlpha: 1, duration: 0.2 }, "<");
          } else {
            tl.to(item, { yPercent: -from, duration: props.duration, ease: props.ease }, `+=${props.hold}`).fromTo(
              next,
              { yPercent: from },
              { yPercent: 0, duration: props.duration, ease: props.ease },
              "<"
            );
          }
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
  <span ref="scope" data-slot="word-roller" class="word-roller">
    <slot />
  </span>
</template>

<style scoped>
.word-roller {
  display: inline-grid;
  overflow: clip;
  vertical-align: bottom;
}
.word-roller :slotted([data-slot="word-roller-item"]) {
  grid-area: 1 / 1;
  white-space: nowrap;
}
</style>
