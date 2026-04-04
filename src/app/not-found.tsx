import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-stone-50">
          <Image src="/logo.svg" alt="VibeCap logo" width={155} height={40} className="mb-8 opacity-60" />
          <h1 className="text-3xl font-semibold text-stone-800 mb-3">Page Not Found</h1>
          <p className="text-base text-stone-500 mb-8 text-center max-w-md">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link
            href="/en/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FF8D76] text-white font-medium text-base hover:bg-[#FF7A60] transition-colors duration-300"
          >
            Back to Home
          </Link>
        </div>
      </body>
    </html>
  );
}
