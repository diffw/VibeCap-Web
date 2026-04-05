import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Locale } from '@/i18n/config';
import { APP_STORE_URL, localizedPath } from '@/lib/site-config';
import { getAllFaqItems, type SiteContent } from '@/lib/site-content';
import { FAQAccordion } from './FAQAccordion';
import { RevealOnView } from './RevealOnView';

const bodyLargeClass = 'marketing-body-lg text-stone-600';
const bodyBaseClass = 'marketing-body-base text-stone-600';
const bodySmallMutedClass = 'marketing-body-sm text-stone-500';
const bodySmallClass = 'marketing-body-sm text-stone-600';

function Section({
  id,
  className = '',
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`px-6 py-16 md:px-8 md:py-20 ${className}`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

function PageTitle({
  eyebrow,
  title,
  description,
  centered = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  centered?: boolean;
}) {
  return (
    <div className={centered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      {eyebrow ? (
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">{eyebrow}</p>
      ) : null}
      <h1 className="text-4xl font-semibold tracking-tight text-stone-950 md:text-6xl">{title}</h1>
      {description ? <p className={`mt-5 ${bodyLargeClass}`}>{description}</p> : null}
    </div>
  );
}

function SectionTitle({
  eyebrow,
  title,
  description,
  centered = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  centered?: boolean;
}) {
  return (
    <div className={centered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      {eyebrow ? (
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">{eyebrow}</p>
      ) : null}
      <h2 className="text-3xl font-semibold tracking-tight text-stone-950 md:text-5xl">{title}</h2>
      {description ? <p className={`mt-4 ${bodyLargeClass}`}>{description}</p> : null}
    </div>
  );
}

function PrimaryCta({ label }: { label: string }) {
  return (
    <a
      href={APP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center rounded-full bg-stone-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-stone-800"
    >
      {label}
    </a>
  );
}

function SecondaryCta({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-full border border-stone-300 px-6 py-3 text-sm font-medium text-stone-900 transition hover:border-stone-400 hover:bg-stone-50"
    >
      {label}
    </Link>
  );
}

type MarketingIconKind = 'capture' | 'annotate' | 'paste' | 'terminal' | 'autoclean' | 'library';

function MarketingIcon({ kind, size = 24 }: { kind: MarketingIconKind; size?: number }) {
  const iconMap: Record<MarketingIconKind, string> = {
    capture: '/icons/icon_capture.svg',
    annotate: '/icons/icon_annotate.svg',
    paste: '/icons/icon_paste.svg',
    terminal: '/icons/icon_terminal.svg',
    autoclean: '/icons/icon_autoclean.svg',
    library: '/icons/icon_library.svg',
  };

  return <Image src={iconMap[kind]} alt="" width={size} height={size} aria-hidden="true" />;
}

function capabilityIconKind(index: number): MarketingIconKind {
  switch (index) {
    case 0:
      return 'capture';
    case 1:
      return 'annotate';
    case 2:
      return 'paste';
    default:
      return 'terminal';
  }
}

function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 space-y-3">
      {items.map((item) => (
        <li key={item} className={`flex items-start gap-3 ${bodySmallClass}`}>
          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-stone-400" aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

const worksWithMarks = [
  'chatgpt',
  'claude',
  'cursor',
  'vscode',
  'windsurf',
  'figma',
  'terminal',
  'iterm2',
  'ghostty',
  'imessage',
  'wechat',
  'telegram',
  'whatsapp',
  'signal',
  'line',
  'discord',
  'slack',
  'appleNotes',
  'notion',
  'obsidian',
  'vibe',
  'craft',
  'linear',
  'jira',
  'github',
] as const;

type WorksWithMark = (typeof worksWithMarks)[number];
type WorksWithEntry = { label: string; kind: WorksWithMark };

function WorksWithLogo({ kind }: { kind: WorksWithMark }) {
  const markClass = 'works-with-logo-mark h-8 w-8';
  const assetMap: Partial<Record<WorksWithMark, string>> = {
    iterm2: '/icons/workswith/iterm2.svg',
    ghostty: '/icons/workswith/ghostty.svg',
    imessage: '/icons/workswith/imessage.svg',
    wechat: '/icons/workswith/wechat.svg',
    telegram: '/icons/workswith/telegram.svg',
    whatsapp: '/icons/workswith/whatsapp.svg',
    signal: '/icons/workswith/signal.svg',
    line: '/icons/workswith/line.svg',
    discord: '/icons/workswith/discord.svg',
    appleNotes: '/icons/workswith/apple-notes.svg',
    notion: '/icons/workswith/notion.svg',
    obsidian: '/icons/workswith/obsidian.svg',
    vibe: '/icons/workswith/vibe.svg',
    craft: '/icons/workswith/craft.svg',
    linear: '/icons/workswith/linear.svg',
    jira: '/icons/workswith/jira.svg',
    github: '/icons/workswith/github.svg',
  };

  const assetPath = assetMap[kind];
  if (assetPath) {
    return <Image src={assetPath} alt="" width={32} height={32} aria-hidden="true" className={markClass} />;
  }

  switch (kind) {
    case 'chatgpt':
      return (
        <svg viewBox="0 0 320 320" className={`${markClass} fill-current`} aria-hidden="true">
          <path d="m297.06 130.97c7.26-21.79 4.76-45.66-6.85-65.48-17.46-30.4-52.56-46.04-86.84-38.68-15.25-17.18-37.16-26.95-60.13-26.81-35.04-.08-66.13 22.48-76.91 55.82-22.51 4.61-41.94 18.7-53.31 38.67-17.59 30.32-13.58 68.54 9.92 94.54-7.26 21.79-4.76 45.66 6.85 65.48 17.46 30.4 52.56 46.04 86.84 38.68 15.24 17.18 37.16 26.95 60.13 26.8 35.06.09 66.16-22.49 76.94-55.86 22.51-4.61 41.94-18.7 53.31-38.67 17.57-30.32 13.55-68.51-9.94-94.51zm-120.28 168.11c-14.03.02-27.62-4.89-38.39-13.88.49-.26 1.34-.73 1.89-1.07l63.72-36.8c3.26-1.85 5.26-5.32 5.24-9.07v-89.83l26.93 15.55c.29.14.48.42.52.74v74.39c-.04 33.08-26.83 59.9-59.91 59.97zm-128.84-55.03c-7.03-12.14-9.56-26.37-7.15-40.18.47.28 1.3.79 1.89 1.13l63.72 36.8c3.23 1.89 7.23 1.89 10.47 0l77.79-44.92v31.1c.02.32-.13.63-.38.83l-64.41 37.19c-28.69 16.52-65.33 6.7-81.92-21.95zm-16.77-139.09c7-12.16 18.05-21.46 31.21-26.29 0 .55-.03 1.52-.03 2.2v73.61c-.02 3.74 1.98 7.21 5.23 9.06l77.79 44.91-26.93 15.55c-.27.18-.61.21-.91.08l-64.42-37.22c-28.63-16.58-38.45-53.21-21.95-81.89zm221.26 51.49-77.79-44.92 26.93-15.54c.27-.18.61-.21.91-.08l64.42 37.19c28.68 16.57 38.51 53.26 21.94 81.94-7.01 12.14-18.05 21.44-31.2 26.28v-75.81c.03-3.74-1.96-7.2-5.2-9.06zm26.8-40.34c-.47-.29-1.3-.79-1.89-1.13l-63.72-36.8c-3.23-1.89-7.23-1.89-10.47 0l-77.79 44.92v-31.1c-.02-.32.13-.63.38-.83l64.41-37.16c28.69-16.55 65.37-6.7 81.91 22 6.99 12.12 9.52 26.31 7.15 40.1zm-168.51 55.43-26.94-15.55c-.29-.14-.48-.42-.52-.74v-74.39c.02-33.12 26.89-59.96 60.01-59.94 14.01 0 27.57 4.92 38.34 13.88-.49.26-1.33.73-1.89 1.07l-63.72 36.8c-3.26 1.85-5.26 5.31-5.24 9.06l-.04 89.79zm14.63-31.54 34.65-20.01 34.65 20v40.01l-34.65 20-34.65-20z" />
        </svg>
      );
    case 'claude':
      return (
        <svg viewBox="0 0 24 24" className={`${markClass} fill-current`} aria-hidden="true">
          <path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z" />
        </svg>
      );
    case 'cursor':
      return (
        <svg viewBox="0 0 24 24" className={`${markClass} fill-current`} aria-hidden="true">
          <path d="M11.503.131 1.891 5.678a.84.84 0 0 0-.42.726v11.188c0 .3.162.575.42.724l9.609 5.55a1 1 0 0 0 .998 0l9.61-5.55a.84.84 0 0 0 .42-.724V6.404a.84.84 0 0 0-.42-.726L12.497.131a1.01 1.01 0 0 0-.996 0M2.657 6.338h18.55c.263 0 .43.287.297.515L12.23 22.918c-.062.107-.229.064-.229-.06V12.335a.59.59 0 0 0-.295-.51l-9.11-5.257c-.109-.063-.064-.23.061-.23" />
        </svg>
      );
    case 'vscode':
      return (
        <svg viewBox="0 0 100 100" className={`${markClass} fill-current`} aria-hidden="true">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M70.9119 99.3171C72.4869 99.9307 74.2828 99.8914 75.8725 99.1264L96.4608 89.2197C98.6242 88.1787 100 85.9892 100 83.5872V16.4133C100 14.0113 98.6243 11.8218 96.4609 10.7808L75.8725 0.873756C73.7862 -0.130129 71.3446 0.11576 69.5135 1.44695C69.252 1.63711 69.0028 1.84943 68.769 2.08341L29.3551 38.0415L12.1872 25.0096C10.589 23.7965 8.35363 23.8959 6.86933 25.2461L1.36303 30.2549C-0.452552 31.9064 -0.454633 34.7627 1.35853 36.417L16.2471 50.0001L1.35853 63.5832C-0.454633 65.2374 -0.452552 68.0938 1.36303 69.7453L6.86933 74.7541C8.35363 76.1043 10.589 76.2037 12.1872 74.9905L29.3551 61.9587L68.769 97.9167C69.3925 98.5406 70.1246 99.0104 70.9119 99.3171ZM75.0152 27.2989L45.1091 50.0001L75.0152 72.7012V27.2989Z"
          />
        </svg>
      );
    case 'windsurf':
      return (
        <svg viewBox="0 0 24 24" className={`${markClass} fill-current`} aria-hidden="true">
          <path d="M23.55 5.067c-1.2038-.002-2.1806.973-2.1806 2.1765v4.8676c0 .972-.8035 1.7594-1.7597 1.7594-.568 0-1.1352-.286-1.4718-.7659l-4.9713-7.1003c-.4125-.5896-1.0837-.941-1.8103-.941-1.1334 0-2.1533.9635-2.1533 2.153v4.8957c0 .972-.7969 1.7594-1.7596 1.7594-.57 0-1.1363-.286-1.4728-.7658L.4076 5.1598C.2822 4.9798 0 5.0688 0 5.2882v4.2452c0 .2147.0656.4228.1884.599l5.4748 7.8183c.3234.462.8006.8052 1.3509.9298 1.3771.313 2.6446-.747 2.6446-2.0977v-4.893c0-.972.7875-1.7593 1.7596-1.7593h.003a1.798 1.798 0 0 1 1.4718.7658l4.9723 7.0994c.4135.5905 1.05.941 1.8093.941 1.1587 0 2.1515-.9645 2.1515-2.153v-4.8948c0-.972.7875-1.7594 1.7596-1.7594h.194a.22.22 0 0 0 .2204-.2202v-4.622a.22.22 0 0 0-.2203-.2203Z" />
        </svg>
      );
    case 'figma':
      return (
        <svg viewBox="0 0 24 24" className={`${markClass} fill-current`} aria-hidden="true">
          <path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.02 3.019 3.02h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V8.981H8.148zM8.172 24c-2.489 0-4.515-2.014-4.515-4.49s2.014-4.49 4.49-4.49h4.588v4.441c0 2.503-2.047 4.539-4.563 4.539zm-.024-7.51a3.023 3.023 0 0 0-3.019 3.019c0 1.665 1.365 3.019 3.044 3.019 1.705 0 3.093-1.376 3.093-3.068v-2.97H8.148zm7.704 0h-.098c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h.098c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.49-4.49 4.49zm-.097-7.509c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h.098c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-.098z" />
        </svg>
      );
    case 'terminal':
      return (
        <svg viewBox="0 0 24 24" className={markClass} fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
          <rect x="3.5" y="5" width="17" height="14" rx="2.5" />
          <path strokeLinecap="round" strokeLinejoin="round" d="m7.5 9 3 3-3 3" />
          <path strokeLinecap="round" d="M12.5 15h4" />
        </svg>
      );
    case 'slack':
      return (
        <svg viewBox="0 0 127 127" className={`${markClass} fill-current`} aria-hidden="true">
          <path d="M27.2 80c0 7.3-5.9 13.2-13.2 13.2C6.7 93.2.8 87.3.8 80c0-7.3 5.9-13.2 13.2-13.2h13.2V80Z" />
          <path d="M33.8 80c0-7.3 5.9-13.2 13.2-13.2 7.3 0 13.2 5.9 13.2 13.2v33c0 7.3-5.9 13.2-13.2 13.2-7.3 0-13.2-5.9-13.2-13.2V80Z" />
          <path d="M47 27c-7.3 0-13.2-5.9-13.2-13.2C33.8 6.5 39.7.6 47 .6c7.3 0 13.2 5.9 13.2 13.2V27H47Z" />
          <path d="M47 33.7c7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2H13.9C6.6 60.1.7 54.2.7 46.9c0-7.3 5.9-13.2 13.2-13.2H47Z" />
          <path d="M99.9 46.9c0-7.3 5.9-13.2 13.2-13.2 7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2H99.9V46.9Z" />
          <path d="M93.3 46.9c0 7.3-5.9 13.2-13.2 13.2-7.3 0-13.2-5.9-13.2-13.2V13.8C66.9 6.5 72.8.6 80.1.6c7.3 0 13.2 5.9 13.2 13.2v33.1Z" />
          <path d="M80.1 99.8c7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2-7.3 0-13.2-5.9-13.2-13.2v-13.2h13.2Z" />
          <path d="M80.1 93.2c-7.3 0-13.2-5.9-13.2-13.2 0-7.3 5.9-13.2 13.2-13.2h33.1c7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2H80.1Z" />
        </svg>
      );
  }
}

function WorksWithMarqueeRow({
  items,
  reverse = false,
}: {
  items: WorksWithEntry[];
  reverse?: boolean;
}) {
  const repeatedItems = [...items, ...items];

  return (
    <div className="works-with-marquee-row">
      <div className={`works-with-marquee-track ${reverse ? 'works-with-marquee-track-reverse' : ''}`}>
        {repeatedItems.map((item, index) => (
          <div
            key={`${item.label}-${index}`}
            className="works-with-marquee-item"
            aria-hidden={index >= items.length ? 'true' : undefined}
          >
            <span className="flex h-10 w-10 items-center justify-center text-stone-900">
              <WorksWithLogo kind={item.kind} />
            </span>
            <span className="text-sm font-medium text-stone-700">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HomeSections({ locale, content }: { locale: Locale; content: SiteContent }) {
  const faqItems = getAllFaqItems(locale);
  const worksWithItems: WorksWithEntry[] = content.home.worksWith.items.map((label, index) => ({
    label,
    kind: worksWithMarks[index] ?? 'github',
  }));
  const splitIndex = Math.ceil(worksWithItems.length / 2);
  const alternateWorksWithItems = [...worksWithItems.slice(splitIndex), ...worksWithItems.slice(0, splitIndex)];

  return (
    <>
      <Section className="pt-28 md:pt-36">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="max-w-2xl">
            <p className="inline-flex rounded-full border border-stone-200 bg-white px-4 py-2 text-xs font-medium text-stone-700">
              {content.home.hero.badge}
            </p>
            <h1 className="mt-6 text-5xl font-semibold tracking-tight text-stone-950 md:text-7xl">
              {content.home.hero.title}
            </h1>
            <p className={`mt-6 max-w-xl md:text-xl ${bodyLargeClass}`}>
              {content.home.hero.description}
            </p>
            <div className="mt-8">
              <PrimaryCta label={content.home.hero.cta} />
            </div>
            <p className={`mt-4 ${bodySmallMutedClass}`}>{content.home.hero.note}</p>
          </div>

          <div>
            <Image
              src="/hero-screenshot.png"
              alt="VibeCap hero preview"
              width={1288}
              height={1161}
              priority
              sizes="(max-width: 1024px) 100vw, 760px"
              className="h-auto w-full drop-shadow-[0_24px_40px_rgba(24,24,27,0.14)]"
            />
          </div>
        </div>
      </Section>

      <Section className="pt-4">
        <RevealOnView>
          <div className="text-center">
            <p className="text-base font-semibold uppercase tracking-[0.18em] text-stone-500 md:text-xl">
              {content.home.worksWith.eyebrow}
            </p>
            <div className="mx-auto mt-10 max-w-6xl overflow-hidden rounded-[34px] border border-stone-200 bg-[linear-gradient(180deg,rgba(247,247,245,0.92)_0%,rgba(241,239,234,0.88)_100%)] px-0 py-5 shadow-[0_18px_40px_-34px_rgba(24,24,27,0.18)]">
              <WorksWithMarqueeRow items={worksWithItems} />
              <div className="mt-4">
                <WorksWithMarqueeRow items={alternateWorksWithItems} reverse />
              </div>
            </div>
            <p className={`mt-6 ${bodySmallMutedClass}`}>{content.home.worksWith.note}</p>
          </div>
        </RevealOnView>
      </Section>

      <Section id="features" className="pt-10">
        <RevealOnView delay={30}>
          <SectionTitle title={content.home.capabilities.title} />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {content.home.capabilities.items.map((item, index) => (
              <div key={item.title} className="card-hover rounded-[30px] border border-stone-200 bg-white p-8">
                <div className="card-hover__icon flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100">
                  <MarketingIcon kind={capabilityIconKind(index)} />
                </div>
                <h3 className="mt-6 text-2xl font-semibold text-stone-950">{item.title}</h3>
                <p className={`mt-4 ${bodyBaseClass}`}>{item.description}</p>
              </div>
            ))}
          </div>
        </RevealOnView>
      </Section>

      <Section className="pt-4">
        <RevealOnView delay={40}>
          <SectionTitle
            title={
              locale === 'en' ? (
                <>
                  Keep your screenshots useful,
                  <br />
                  not messy.
                </>
              ) : (
                content.home.management.title
              )
            }
            description={content.home.management.description}
          />
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-stone-100">
                  <MarketingIcon kind="autoclean" size={20} />
                </div>
                <h3 className="text-xl font-semibold text-stone-950">{content.home.management.autoCleanupTitle}</h3>
              </div>
              <p className={`mt-3 ${bodyBaseClass}`}>{content.home.management.autoCleanupDescription}</p>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-stone-100">
                  <MarketingIcon kind="library" size={20} />
                </div>
                <h3 className="text-xl font-semibold text-stone-950">{content.home.management.libraryTitle}</h3>
              </div>
              <p className={`mt-3 ${bodyBaseClass}`}>{content.home.management.libraryDescription}</p>
            </div>
          </div>
          <div className="mt-10">
            <Image
              src="/auto-clean.png"
              alt="VibeCap screenshot library preview"
              width={1942}
              height={1328}
              sizes="(max-width: 1024px) 100vw, 980px"
              className="h-auto w-full drop-shadow-[0_18px_30px_rgba(24,24,27,0.12)]"
            />
          </div>
        </RevealOnView>
      </Section>

      <Section id="pricing" className="pt-4">
        <RevealOnView delay={50}>
          <div className="rounded-[40px] border border-stone-200 bg-white px-6 py-10 md:px-10 md:py-12">
          <SectionTitle
            title={content.home.pricingPreview.title}
            description={content.home.pricingPreview.description}
            centered
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <div className="rounded-[28px] border border-stone-200 bg-stone-50 p-6">
              <p className="text-base font-semibold text-stone-950">{content.home.pricingPreview.monthly.title}</p>
              <p className="mt-4 text-4xl font-semibold tracking-tight text-stone-950">
                {content.home.pricingPreview.monthly.price}
                <span className="ml-1 text-base font-medium text-stone-500">{content.home.pricingPreview.monthly.period}</span>
              </p>
              <p className={`mt-3 ${bodySmallMutedClass}`}>{content.home.pricingPreview.monthly.description}</p>
            </div>
            <div className="featured-pricing-card rounded-[28px] border p-6 text-stone-950">
              <div className="flex items-center justify-between gap-3">
                <p className="text-base font-semibold">{content.home.pricingPreview.annual.title}</p>
                <span className="featured-pricing-badge rounded-full px-3 py-1 text-xs font-medium">
                  {content.home.pricingPreview.annual.badge}
                </span>
              </div>
              <p className="mt-4 text-4xl font-semibold tracking-tight">
                {content.home.pricingPreview.annual.price}
                <span className="ml-1 text-base font-medium text-stone-500">{content.home.pricingPreview.annual.period}</span>
              </p>
              <p className={`mt-3 ${bodySmallMutedClass}`}>{content.home.pricingPreview.annual.description}</p>
            </div>
            <div className="rounded-[28px] border border-stone-200 bg-stone-50 p-6">
              <p className="text-base font-semibold text-stone-950">{content.home.pricingPreview.lifetime.title}</p>
              <p className="mt-4 text-4xl font-semibold tracking-tight text-stone-950">
                {content.home.pricingPreview.lifetime.price}
                {content.home.pricingPreview.lifetime.period ? (
                  <span className="ml-1 text-base font-medium text-stone-500">{content.home.pricingPreview.lifetime.period}</span>
                ) : null}
              </p>
              <p className={`mt-3 ${bodySmallMutedClass}`}>{content.home.pricingPreview.lifetime.description}</p>
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center gap-4 text-center">
            <PrimaryCta label={content.home.pricingPreview.cta} />
            <Link href={localizedPath(locale, 'pricing')} className="text-sm font-medium text-stone-900 transition hover:text-stone-600">
              {content.home.pricingPreview.detailLink}
            </Link>
            <p className={bodySmallMutedClass}>{content.home.pricingPreview.note}</p>
          </div>
          </div>
        </RevealOnView>
      </Section>

      <Section id="faq" className="pt-4">
        <RevealOnView delay={60}>
          <div className="rounded-[40px] border border-stone-200 bg-white px-6 py-10 md:px-10 md:py-12">
          <SectionTitle
            title={content.home.faq.title}
            description={content.home.faq.description}
            centered
          />
          <div className="mt-10">
            <FAQAccordion
              items={faqItems}
              visibleCount={10}
              moreLabel={content.home.faq.moreLabel}
              defaultOpenIndex={0}
            />
          </div>
          </div>
        </RevealOnView>
      </Section>

      <Section id="download" className="pt-4 pb-20 md:pb-24">
        <RevealOnView delay={70}>
          <div className="rounded-[40px] border border-stone-200 bg-[linear-gradient(180deg,#f7f4ef_0%,#f1ede6_100%)] px-6 py-12 text-center md:px-10">
          <SectionTitle title={content.home.finalCta.title} description={content.home.finalCta.description} centered />
          <p className={`mt-4 ${bodySmallMutedClass}`}>{content.home.finalCta.note}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <PrimaryCta label={content.home.finalCta.primaryCta} />
            <SecondaryCta href={localizedPath(locale, 'pricing')} label={content.home.finalCta.secondaryCta} />
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {content.home.finalCta.benefits.map((benefit) => (
              <span key={benefit} className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm text-stone-700">
                {benefit}
              </span>
            ))}
          </div>
          <p className={`mx-auto mt-6 max-w-3xl ${bodySmallMutedClass}`}>{content.home.finalCta.disclaimer}</p>
          </div>
        </RevealOnView>
      </Section>
    </>
  );
}

export function FeaturesPageSections({ content }: { content: SiteContent }) {
  return (
    <>
      <Section className="pt-28 md:pt-36">
        <PageTitle title={content.featuresPage.title} description={content.featuresPage.description} centered />
      </Section>

      <Section className="pt-0">
        <div className="grid gap-8 md:grid-cols-2">
          {content.featuresPage.features.map((feature, index) => {
            return (
              <div
                key={feature.title}
                className="rounded-[36px] border border-stone-200 bg-white px-6 py-8 md:px-8 md:py-10"
              >
                <div className="max-w-2xl">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100">
                    <MarketingIcon kind={capabilityIconKind(index)} />
                  </div>
                  <h2 className="mt-6 text-3xl font-semibold tracking-tight text-stone-950">{feature.title}</h2>
                  <p className={`mt-4 ${bodyBaseClass}`}>{feature.description}</p>
                  <FeatureList items={feature.details} />
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <Section className="pt-4 pb-20 md:pb-24">
        <div className="rounded-[40px] border border-stone-200 bg-[linear-gradient(180deg,#f7f4ef_0%,#f1ede6_100%)] px-6 py-12 text-center md:px-10">
          <SectionTitle title={content.featuresPage.ctaTitle} centered />
          <div className="mt-8">
            <PrimaryCta label={content.featuresPage.ctaButton} />
          </div>
        </div>
      </Section>
    </>
  );
}

export function PricingPageSections({ content }: { content: SiteContent }) {
  return (
    <>
      <Section className="pt-28 md:pt-36">
        <PageTitle title={content.pricingPage.heroTitle} description={content.pricingPage.heroDescription} centered />
      </Section>

      <Section className="pt-0">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[32px] border border-stone-200 bg-stone-50 p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-stone-500">{content.pricingPage.freeTitle}</p>
            <h2 className="mt-5 text-4xl font-semibold tracking-tight text-stone-950">{content.pricingPage.freePrice}</h2>
            <p className="mt-3 text-lg font-medium text-stone-900">{content.pricingPage.freeSubtitle}</p>
            <p className={`mt-3 ${bodySmallMutedClass}`}>{content.pricingPage.freeNote}</p>
            <FeatureList items={content.pricingPage.freeFeatures} />
            <div className="mt-8">
              <PrimaryCta label={content.pricingPage.freeCta} />
            </div>
          </div>

          <div className="rounded-[32px] border border-stone-950 bg-stone-950 p-8 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/60">{content.pricingPage.proTitle}</p>
            <h2 className="mt-5 text-4xl font-semibold tracking-tight">{content.pricingPage.proPrice}</h2>
            <p className="mt-3 text-lg font-medium">{content.pricingPage.proSubtitle}</p>
            <p className="mt-3 text-sm text-white/70">{content.pricingPage.proNote}</p>
            <ul className="mt-6 space-y-3">
              {content.pricingPage.proFeatures.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-6 text-white/80">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-white/60" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-white/70">{content.pricingPage.proHint}</p>
          </div>
        </div>
      </Section>

      <Section className="pt-4">
        <div className="rounded-[36px] border border-stone-200 bg-white px-6 py-10 md:px-8 md:py-12">
          <SectionTitle
            title={content.pricingPage.choosePlanTitle}
            description={content.pricingPage.choosePlanDescription}
            centered
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {content.pricingPage.plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-[28px] border p-6 ${
                  plan.popular ? 'featured-pricing-card text-stone-950' : 'border-stone-200 bg-stone-50 text-stone-950'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xl font-semibold">{plan.name}</p>
                    <p className="marketing-body-sm mt-2 text-stone-500">{plan.subtitle}</p>
                  </div>
                  {plan.popular ? (
                    <span className="featured-pricing-badge rounded-full px-3 py-1 text-xs font-medium">Popular</span>
                  ) : null}
                </div>
                <p className="mt-6 text-4xl font-semibold tracking-tight">
                  {plan.price}
                  {plan.period ? <span className="ml-1 text-base font-medium text-stone-500">{plan.period}</span> : null}
                </p>
                {plan.perMonth ? <p className="marketing-body-sm mt-3 text-stone-500">{plan.perMonth}</p> : null}
                {plan.paidOnce ? <p className="marketing-body-sm mt-3 text-stone-500">{plan.paidOnce}</p> : null}
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <PrimaryCta label={content.pricingPage.getProCta} />
          </div>
        </div>
      </Section>

      <Section className="pt-4">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[32px] border border-stone-200 bg-white p-8">
            <SectionTitle title={content.pricingPage.reasonsTitle} />
            <div className="mt-8 grid gap-5">
              {content.pricingPage.reasons.map((reason) => (
                <div key={reason.title} className="rounded-[24px] border border-stone-200 bg-stone-50 p-5">
                  <h3 className="text-lg font-semibold text-stone-950">{reason.title}</h3>
                  <p className={`mt-3 ${bodySmallClass}`}>{reason.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-stone-200 bg-white p-8">
            <SectionTitle title={content.pricingPage.purchaseFaqTitle} />
            <div className="mt-8 space-y-5">
              {content.pricingPage.purchaseFaqs.map((item) => (
                <div key={item.question} className="border-b border-stone-200 pb-5 last:border-b-0 last:pb-0">
                  <h3 className="text-base font-semibold text-stone-950">{item.question}</h3>
                  <p className={`mt-3 ${bodySmallClass}`}>{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section className="pt-4 pb-20 md:pb-24">
        <div className="rounded-[40px] border border-stone-200 bg-[linear-gradient(180deg,#f7f4ef_0%,#f1ede6_100%)] px-6 py-12 text-center md:px-10">
          <SectionTitle title={content.pricingPage.finalTitle} description={content.pricingPage.finalDescription} centered />
          <p className={`mt-4 ${bodySmallMutedClass}`}>{content.pricingPage.finalNote}</p>
          <div className="mt-8">
            <PrimaryCta label={content.pricingPage.finalCta} />
          </div>
        </div>
      </Section>
    </>
  );
}

export function FAQPageSections({ content }: { content: SiteContent }) {
  return (
    <>
      <Section className="pt-28 md:pt-36">
        <PageTitle title={content.faqPage.title} description={content.faqPage.description} centered />
      </Section>

      <Section className="pt-0">
        <div className="space-y-8">
          {content.faqPage.categories.map((category) => (
            <div key={category.title} className="rounded-[32px] border border-stone-200 bg-white px-6 py-8 md:px-8 md:py-10">
              <h2 className="text-2xl font-semibold tracking-tight text-stone-950">{category.title}</h2>
              <div className="mt-6">
                <FAQAccordion items={category.items} />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section className="pt-4 pb-20 md:pb-24">
        <div className="rounded-[40px] border border-stone-200 bg-[linear-gradient(180deg,#f7f4ef_0%,#f1ede6_100%)] px-6 py-12 text-center md:px-10">
          <SectionTitle title={content.faqPage.contactTitle} description={content.faqPage.contactDescription} centered />
          <div className="mt-8">
            <a
              href={`mailto:${content.faqPage.contactEmail}`}
              className="inline-flex items-center justify-center rounded-full bg-stone-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-stone-800"
            >
              {content.faqPage.contactCta}
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
