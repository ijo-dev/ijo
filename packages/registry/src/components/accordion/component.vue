<script setup lang="ts">
/**
 * Sections that open and close smoothly, built on the native <details> element.
 * Put <details data-slot="accordion-item"> elements in the default slot, each with a
 * <summary> first. Under `prefers-reduced-motion: reduce` sections toggle instantly.
 */
import { onMounted, onUnmounted, ref, watch } from "vue";
import gsap from "gsap";

const props = withDefaults(defineProps<{ duration?: number; ease?: string; single?: boolean }>(), {
  duration: 0.45,
  ease: "power3.inOut",
  single: false,
});

const scope = ref<HTMLElement | null>(null);
let ctx: gsap.Context | undefined;

const heightWhen = (item: HTMLDetailsElement, open: boolean) => {
  const [wasOpen, inline] = [item.open, item.style.height];
  item.style.height = "";
  item.open = open;
  const height = item.offsetHeight;
  item.open = wasOpen;
  item.style.height = inline;
  return height;
};

const items = () => gsap.utils.toArray<HTMLDetailsElement>("[data-slot='accordion-item']", scope.value);

const toggle = (item: HTMLDetailsElement, open: boolean) => {
  item.dataset.state = open ? "open" : "closed";
  gsap.killTweensOf(item);
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    item.open = open;
    return;
  }
  const from = item.offsetHeight;
  const to = heightWhen(item, open);
  item.open = true;
  ctx?.add(() =>
    gsap.fromTo(
      item,
      { height: from, overflow: "hidden" },
      {
        height: to,
        duration: props.duration,
        ease: props.ease,
        onComplete: () => {
          item.open = open;
          gsap.set(item, { clearProps: "height,overflow" });
        },
      }
    )
  );
};

const onClick = (event: MouseEvent) => {
  const item = (event.target as Element).closest("summary")?.parentElement;
  const all = items();
  if (!(item instanceof HTMLDetailsElement) || !all.includes(item)) return;
  event.preventDefault();
  const open = item.dataset.state !== "open";
  if (open && props.single) all.forEach((other) => other !== item && other.dataset.state === "open" && toggle(other, false));
  toggle(item, open);
};

const setup = () => {
  ctx?.revert();
  ctx = gsap.context(() => {}, scope.value ?? undefined);
  items().forEach((item) => (item.dataset.state = item.open ? "open" : "closed"));
};

onMounted(setup);
watch(() => ({ ...props }), setup, { deep: true });
onUnmounted(() => ctx?.revert());
</script>

<template>
  <div ref="scope" data-slot="accordion" @click="onClick">
    <slot />
  </div>
</template>
