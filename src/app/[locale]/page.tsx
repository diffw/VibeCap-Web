import { Header, Footer } from '@/components';
import { Hero, Problems, Solution, Workflow, Features, Pricing, Closing } from '@/sections';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Problems />
        <Solution />
        <Workflow />
        <Features />
        <Pricing />
        <Closing />
      </main>
      <Footer />
    </>
  );
}
