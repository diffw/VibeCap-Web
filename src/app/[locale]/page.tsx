import { Header, Footer } from '@/components';
import { Hero, Problems, Solution, Features, Pricing, FAQ, Closing } from '@/sections';
import { SchemaOrg } from '@/components/SchemaOrg';

export default function Home() {
  return (
    <>
      <SchemaOrg />
      <Header />
      <main>
        <Hero />
        <Problems />
        <Solution />
        <Features />
        <Pricing />
        <FAQ />
        <Closing />
      </main>
      <Footer />
    </>
  );
}
