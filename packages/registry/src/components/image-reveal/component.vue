<script setup lang="ts">
/**
 * Uncovers an image with a sliding mask as it scrolls into view, while the image
 * settles from a slight zoom. Plays once. Under `prefers-reduced-motion: reduce`
 * the image fades in instead.
 */
import { onMounted, onUnmounted, ref, watch } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HIDDEN = {
  up: "inset(100% 0% 0% 0%)",
  down: "inset(0% 0% 100% 0%)",
  left: "inset(0% 0% 0% 100%)",
  right: "inset(0% 100% 0% 0%)",
} as const;

const props = withDefaults(
  defineProps<{
    duration?: number;
    direction?: keyof typeof HIDDEN;
    zoom?: number;
    ease?: string;
    start?: string;
    scroller?: HTMLElement | null;
  }>(),
  { duration: 1.2, direction: "up", zoom: 1.25, ease: "expo.inOut", start: "top 85%" }
);

const frame = ref<HTMLElement | null>(null);
const media = ref<HTMLElement | null>(null);
let ctx: gsap.Context | undefined;

const setup = () => {
  ctx?.revert();
  // A scroller was asked for but isn't mounted yet: wait for it.
  if (props.scroller === null) return;
  const f = frame.value;
  const m = media.value;
  if (!f || !m) return;
  ctx = gsap.context(() => {
    gsap.matchMedia().add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        reduced: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const scrollTrigger = { trigger: f, scroller: props.scroller ?? undefined, start: props.start, once: true };
        if (context.conditions?.reduced) {
          gsap.from(f, { opacity: 0, duration: 0.3, clearProps: "opacity", scrollTrigger });
          return;
        }
        gsap
          .timeline({ scrollTrigger })
          .fromTo(
            f,
            { clipPath: HIDDEN[props.direction] },
            { clipPath: "inset(0% 0% 0% 0%)", duration: props.duration, ease: props.ease }
          )
          .from(m, { scale: props.zoom, duration: props.duration * 1.2, ease: "power2.out" }, 0);
      }
    );
  }, f);
};

onMounted(setup);
watch(() => ({ ...props }), setup, { deep: true });
onUnmounted(() => ctx?.revert());
</script>

<template>
  <div ref="frame" data-slot="image-reveal" style="overflow: hidden">
    <div ref="media" data-slot="image-reveal-media" style="width: 100%; height: 100%">
      <slot />
    </div>
  </div>
</template>
