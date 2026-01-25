import { useTranslations } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Header, Footer } from '@/components';
import { locales } from '@/i18n/config';
import { renderMarkdown } from '@/lib/markdown';

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'privacy.meta' });

    return {
        title: t('title'),
        description: t('description'),
    };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'privacy' });

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
                <div className="max-w-4xl mx-auto px-6 py-16 sm:px-8 lg:px-12">
                    {/* Header */}
                    <div className="mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
                        <p className="text-sm text-gray-600">{t('effectiveDate')}</p>
                    </div>

                    {/* Content Sections */}
                    <div className="prose prose-lg max-w-none">
                        {/* Overview */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                1. {t('sections.overview.title')}
                            </h2>
                            <div className="space-y-4 text-gray-700">
                                {(t.raw('sections.overview.content') as string[]).map((paragraph: string, idx: number) => (
                                    <p key={idx} dangerouslySetInnerHTML={{ __html: renderMarkdown(paragraph) }} />
                                ))}
                            </div>
                        </section>

                        {/* Data Collection */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                2. {t('sections.dataCollection.title')}
                            </h2>
                            <p className="mb-4 text-gray-700" dangerouslySetInnerHTML={{ __html: renderMarkdown(t('sections.dataCollection.intro')) }} />
                            <p className="mb-2 text-gray-700">{t('sections.dataCollection.specifically')}</p>
                            <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                                {(t.raw('sections.dataCollection.items') as string[]).map((item: string, idx: number) => (
                                    <li key={idx} dangerouslySetInnerHTML={{ __html: renderMarkdown(item) }} />
                                ))}
                            </ul>
                            <p className="text-gray-700">{t('sections.dataCollection.footer')}</p>
                        </section>

                        {/* Screen Content */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                3. {t('sections.screenContent.title')}
                            </h2>
                            <p className="mb-2 text-gray-700">{t('sections.screenContent.intro')}</p>
                            <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                                {(t.raw('sections.screenContent.items') as string[]).map((item: string, idx: number) => (
                                    <li key={idx} dangerouslySetInnerHTML={{ __html: renderMarkdown(item) }} />
                                ))}
                            </ul>
                            <p className="text-gray-700">{t('sections.screenContent.footer')}</p>
                        </section>

                        {/* Permissions */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                4. {t('sections.permissions.title')}
                            </h2>
                            <p className="mb-4 text-gray-700">{t('sections.permissions.intro')}</p>

                            <div className="mb-4">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {t('sections.permissions.types.screenRecording.title')}
                                </h3>
                                <p className="text-gray-700">{t('sections.permissions.types.screenRecording.description')}</p>
                            </div>

                            <div className="mb-4">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {t('sections.permissions.types.accessibility.title')}
                                </h3>
                                <p className="text-gray-700">{t('sections.permissions.types.accessibility.description')}</p>
                            </div>

                            <p className="mb-2 text-gray-700">{t('sections.permissions.footer')}</p>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                {(t.raw('sections.permissions.notes') as string[]).map((note: string, idx: number) => (
                                    <li key={idx}>{note}</li>
                                ))}
                            </ul>
                        </section>

                        {/* Local Storage */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                5. {t('sections.localStorage.title')}
                            </h2>
                            <p className="mb-2 text-gray-700">{t('sections.localStorage.intro')}</p>
                            <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                                {(t.raw('sections.localStorage.items') as string[]).map((item: string, idx: number) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                            <p className="text-gray-700">{t('sections.localStorage.footer')}</p>
                        </section>

                        {/* Third-Party Services */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                6. {t('sections.thirdParty.title')}
                            </h2>
                            <p className="mb-4 text-gray-700">{t('sections.thirdParty.intro')}</p>
                            <p className="mb-2 text-gray-700">{t('sections.thirdParty.weDoNotUse')}</p>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                {(t.raw('sections.thirdParty.items') as string[]).map((item: string, idx: number) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        </section>

                        {/* Data Sharing */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                7. {t('sections.dataSharing.title')}
                            </h2>
                            <p className="text-gray-700" dangerouslySetInnerHTML={{ __html: renderMarkdown(t('sections.dataSharing.content')) }} />
                        </section>

                        {/* Children's Privacy */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                8. {t('sections.childrenPrivacy.title')}
                            </h2>
                            <p className="text-gray-700">{t('sections.childrenPrivacy.content')}</p>
                        </section>

                        {/* Changes to Policy */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                9. {t('sections.changes.title')}
                            </h2>
                            <p className="text-gray-700">{t('sections.changes.content')}</p>
                        </section>

                        {/* Contact */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                10. {t('sections.contact.title')}
                            </h2>
                            <p className="mb-2 text-gray-700">{t('sections.contact.intro')}</p>
                            <p className="text-gray-700 font-medium">{t('sections.contact.email')}</p>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
