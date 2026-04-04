'use client';

import { useMemo, useState } from 'react';
import type { FAQItem } from '@/lib/site-content';

type FAQAccordionProps = {
  items: FAQItem[];
  visibleCount?: number;
  moreLabel?: string;
  lessLabel?: string;
  defaultOpenIndex?: number | null;
};

export function FAQAccordion({
  items,
  visibleCount,
  moreLabel = 'View all FAQ →',
  lessLabel = 'Show fewer',
  defaultOpenIndex = null,
}: FAQAccordionProps) {
  const initialCount = visibleCount && visibleCount > 0 ? visibleCount : items.length;
  const canToggleCount = items.length > initialCount;
  const [expandedAll, setExpandedAll] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

  const visibleItems = useMemo(
    () => (expandedAll ? items : items.slice(0, initialCount)),
    [expandedAll, initialCount, items],
  );

  return (
    <div>
      <div className="border-t border-stone-200">
        {visibleItems.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <div key={`${item.question}-${index}`} className="border-b border-stone-200">
              <button
                type="button"
                onClick={() => setOpenIndex((current) => (current === index ? null : index))}
                className="flex w-full items-start justify-between gap-6 py-5 text-left"
                aria-expanded={isOpen}
              >
                <span className="pr-4 text-base font-medium text-stone-950">{item.question}</span>
                <span className="mt-0.5 text-2xl leading-none text-stone-400">{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen ? <p className="marketing-body-sm pb-5 pr-10 text-stone-600">{item.answer}</p> : null}
            </div>
          );
        })}
      </div>

      {canToggleCount ? (
        <button
          type="button"
          onClick={() => setExpandedAll((value) => !value)}
          className="mt-6 inline-flex items-center text-sm font-medium text-stone-900 transition hover:text-stone-600"
        >
          {expandedAll ? lessLabel : moreLabel}
        </button>
      ) : null}
    </div>
  );
}
