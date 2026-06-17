import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="text-center">
        <p className="text-rust font-semibold text-sm tracking-widest uppercase mb-4">404</p>
        <h1 className="text-4xl font-bold text-ink mb-3">Page not found</h1>
        <p className="text-ink/50 mb-8">This page does not exist, or has been moved.</p>
        <Link
          href="/"
          className="inline-block bg-rust text-cream px-6 py-3 rounded-lg font-medium hover:bg-rust/90 transition-colors"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}
