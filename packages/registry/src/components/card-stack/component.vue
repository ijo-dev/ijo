<script setup lang="ts">
/**
 * A pile of cards: the top one lifts away and slides to the back, and the rest move up.
 * Put each card in an element with data-slot="card-stack-item".
 * Under `prefers-reduced-motion: reduce` cards swap with a quick fade.
 */
import { onMounted, onUnmounted, ref, watch } from "vue";
import gsap from "gsap";

const props = withDefaults(
  defineProps<{ duration?: number; offset?: number; rotation?: number; ease?: string; nextLabel?: string }>(),
  { duration: 0.7, offset: 14, rotation: 4, ease: "power3.out", nextLabel: "Next card" }
);

const scope = ref<HTMLElement | null>(null);
const status = ref("");
let ctx: gsap.Context | undefined;
let order: HTMLElement[] = [];
let original: HTMLElement[] = [];
let busy = false;

const place = (cards: HTMLElement[]) => ({
  y: (i: number) => i * props.offset,
  scale: (i: number) => 1 - Math.min(i, 3) * 0.05,
  rotation: (i: number) => (i === 0 ? 0 : i % 2 ? props.rotation : -props.rotation),
  opacity: (i: number) => (i > 2 ? 0 : 1),
  zIndex: (i: number) => cards.length - i,
});

const settle = (cards: HTMLElement[]) =>
  cards.forEach((card, i) => {
    card.inert = i !== 0;
    card.setAttribute("aria-hidden", String(i !== 0));
  });

const setup = () => {
  ctx?.revert();
  if (!scope.value) return;
  ctx = gsap.context(() => {
    const cards = gsap.utils.toArray<HTMLElement>("[data-slot='card-stack-item']");
    order = cards;
    original = cards;
    gsap.set(cards, place(cards));
    settle(cards);
  }, scope.value);
};

const next = () => {
  const [top, ...rest] = order;
  if (!top || rest.length === 0 || busy) return;
  const cards = [...rest, top];
  order = cards;
  busy = true;
  const done = () => {
    busy = false;
    settle(cards);
    status.value = `Card ${original.indexOf(cards[0]!) + 1} of ${cards.length}`;
  };
  ctx?.add(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap
        .timeline({ onComplete: done })
        .to(top, { opacity: 0, duration: 0.15 })
        .set(cards, place(cards))
        .from(cards[0]!, { opacity: 0, duration: 0.15 });
      return;
    }
    gsap
      .timeline({ onComplete: done })
      .to(top, { yPercent: -60, rotation: -props.rotation * 3, duration: props.duration * 0.45, ease: "power2.in" })
      .set(cards, { zIndex: (i: number) => cards.length - i })
      .to(cards, { ...place(cards), yPercent: 0, duration: props.duration * 0.55, ease: props.ease, stagger: 0.03 });
  });
};

const onPileClick = (event: MouseEvent) => {
  if ((event.target as Element).closest("a, button, input, select, textarea")) return;
  next();
};

onMounted(setup);
watch(() => [props.offset, props.rotation], setup);
onUnmounted(() => ctx?.revert());
</script>

<template>
  <div ref="scope" data-slot="card-stack">
    <div data-slot="card-stack-pile" :style="{ display: 'grid', paddingBottom: `${props.offset * 2}px` }" @click="onPileClick">
      <slot />
    </div>
    <button type="button" data-slot="card-stack-next" @click="next">{{ props.nextLabel }}</button>
    <span role="status" class="sr-only">{{ status }}</span>
  </div>
</template>

<style scoped>
[data-slot="card-stack-pile"] > :slotted(*) {
  grid-area: 1 / 1;
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
