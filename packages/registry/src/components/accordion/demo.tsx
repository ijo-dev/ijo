"use client";

import { Accordion, AccordionItem, type AccordionProps } from "./component";

const FAQ = [
  {
    q: "Do you deliver outside Lagos?",
    a: "Yes, to every state. Lagos orders placed by noon arrive the next day; everywhere else takes 2–4 working days.",
  },
  {
    q: "Can I get it ground?",
    a: "Choose whole bean, or a grind for V60, French press or moka pot at checkout. Whole bean keeps its flavour longest.",
  },
  {
    q: "How fresh is it?",
    a: "Every bag is roasted on a Tuesday in Yaba and shipped within three days. The roast date is printed on the label.",
  },
];

/** Bọ̀ Coffee's delivery questions. */
export function AccordionDemo(props: Omit<AccordionProps, "children">) {
  return (
    <Accordion {...props} className="flex w-full max-w-[460px] flex-col gap-2">
      {FAQ.map((item, index) => (
        <AccordionItem
          key={item.q}
          defaultOpen={index === 0}
          className="group rounded-[8px] bg-[var(--surface-3)] [&_summary::-webkit-details-marker]:hidden"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-[15px] font-medium text-[var(--text)]">
            {item.q}
            <span
              aria-hidden
              className="inline-block text-[18px] leading-none text-[var(--grape-11)] transition-transform duration-200 group-data-[state=open]:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="px-4 pb-4 text-[14px] leading-[21px] text-[var(--text-muted)]">{item.a}</p>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
