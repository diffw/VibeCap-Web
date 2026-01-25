import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Header, Footer } from '@/components';
import { locales } from '@/i18n/config';

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'terms.meta' });

    return {
        title: t('title'),
        description: t('description'),
    };
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'terms' });

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
                <div className="mx-auto w-[1024px] px-6 py-16 sm:px-8 lg:px-12">
                    {/* Header */}
                    <div className="mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('title')}</h1>
                        <p className="text-sm text-gray-600">{t('effectiveDate')}</p>
                    </div>

                    {/* Intro */}
                    <div className="mb-12 space-y-4">
                        {(t.raw('intro') as string[]).map((paragraph: string, idx: number) => (
                            <p key={idx} className="text-gray-700">{paragraph}</p>
                        ))}
                    </div>

                    <hr className="my-12 border-gray-200" />

                    {/* Content Sections */}
                    <div className="prose prose-lg max-w-none">
                        {/* The App */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                1. {t('sections.theApp.title')}
                            </h2>
                            <div className="space-y-4 text-gray-700">
                                {(t.raw('sections.theApp.content') as string[]).map((paragraph: string, idx: number) => (
                                    <p key={idx}>{paragraph}</p>
                                ))}
                            </div>
                        </section>

                        {/* License */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                2. {t('sections.license.title')}
                            </h2>
                            <p className="mb-4 text-gray-700">{t('sections.license.intro')}</p>
                            <p className="mb-2 text-gray-700">{t('sections.license.youMayNot')}</p>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                {(t.raw('sections.license.restrictions') as string[]).map((item: string, idx: number) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        </section>

                        {/* User Content */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                3. {t('sections.userContent.title')}
                            </h2>
                            <p className="mb-4 text-gray-700">{t('sections.userContent.intro')}</p>
                            <p className="mb-2 text-gray-700">{t('sections.userContent.vibeCapDoes')}</p>
                            <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                                {(t.raw('sections.userContent.policies') as string[]).map((item: string, idx: number) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                            <p className="text-gray-700">{t('sections.userContent.footer')}</p>
                        </section>

                        {/* Permissions */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                4. {t('sections.permissions.title')}
                            </h2>
                            <p className="mb-4 text-gray-700">{t('sections.permissions.intro')}</p>
                            <p className="mb-2 text-gray-700">{t('sections.permissions.acknowledgment')}</p>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                {(t.raw('sections.permissions.items') as string[]).map((item: string, idx: number) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        </section>

                        {/* Availability */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                5. {t('sections.availability.title')}
                            </h2>
                            <div className="space-y-4 text-gray-700">
                                {(t.raw('sections.availability.content') as string[]).map((paragraph: string, idx: number) => (
                                    <p key={idx}>{paragraph}</p>
                                ))}
                            </div>
                        </section>

                        {/* Disclaimer */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                6. {t('sections.disclaimer.title')}
                            </h2>
                            <div className="space-y-4 text-gray-700">
                                {(t.raw('sections.disclaimer.content') as string[]).map((paragraph: string, idx: number) => (
                                    <p key={idx}>{paragraph}</p>
                                ))}
                            </div>
                        </section>

                        {/* Limitation of Liability */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                7. {t('sections.liability.title')}
                            </h2>
                            <div className="space-y-4 text-gray-700">
                                {(t.raw('sections.liability.content') as string[]).map((paragraph: string, idx: number) => (
                                    <p key={idx}>{paragraph}</p>
                                ))}
                            </div>
                        </section>

                        {/* Termination */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                8. {t('sections.termination.title')}
                            </h2>
                            <div className="space-y-4 text-gray-700">
                                {(t.raw('sections.termination.content') as string[]).map((paragraph: string, idx: number) => (
                                    <p key={idx}>{paragraph}</p>
                                ))}
                            </div>
                        </section>

                        {/* Governing Law */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                9. {t('sections.governingLaw.title')}
                            </h2>
                            <p className="text-gray-700">{t('sections.governingLaw.content')}</p>
                        </section>

                        {/* Changes to Terms */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                10. {t('sections.changes.title')}
                            </h2>
                            <div className="space-y-4 text-gray-700">
                                {(t.raw('sections.changes.content') as string[]).map((paragraph: string, idx: number) => (
                                    <p key={idx}>{paragraph}</p>
                                ))}
                            </div>
                        </section>

                        {/* Contact */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                11. {t('sections.contact.title')}
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
