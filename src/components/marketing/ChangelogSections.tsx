import type { ChangelogPageContent } from '@/lib/changelog-content';

const bodyLargeClass = 'marketing-body-lg text-stone-600';
const bodyBaseClass = 'marketing-body-base text-stone-600';

export function ChangelogSections({ page }: { page: ChangelogPageContent }) {
  return (
    <>
      <section className="px-6 pt-28 pb-12 md:px-8 md:pt-36">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-tight text-stone-950 md:text-5xl">{page.title}</h1>
          <p className={`mt-5 ${bodyLargeClass}`}>{page.description}</p>
        </div>
      </section>

      <section className="px-6 pb-20 md:px-8 md:pb-24">
        <div className="mx-auto max-w-3xl">
          <div className="divide-y divide-stone-200 border-t border-stone-200">
            {page.versions.map((release) => (
              <article key={release.version} className="py-10 first:pt-8">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <h2 className="text-xl font-semibold text-stone-950 md:text-2xl">v{release.version}</h2>
                  <span className="text-sm font-medium text-stone-500 tabular-nums">{release.dateLabel}</span>
                </div>

                {release.entries.filter((e) => e.kind === 'feature').length > 0 ? (
                  <div className="mt-8 space-y-8">
                    {release.entries.map((entry, index) =>
                      entry.kind === 'feature' ? (
                        <div key={`${entry.title}-${index}`}>
                          <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-950">
                            {entry.title}
                          </h3>
                          <p className={`mt-2 ${bodyBaseClass}`}>{entry.description}</p>
                        </div>
                      ) : null,
                    )}
                  </div>
                ) : null}

                {release.entries.some((e) => e.kind === 'item') ? (
                  <ol className="mt-8 list-decimal space-y-4 pl-5 marker:text-stone-400">
                    {release.entries
                      .filter((e): e is Extract<typeof e, { kind: 'item' }> => e.kind === 'item')
                      .map((entry, index) => (
                        <li key={index} className={bodyBaseClass}>
                          {entry.text}
                        </li>
                      ))}
                  </ol>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
