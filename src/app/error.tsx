"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="min-h-screen bg-cream flex items-center justify-center px-6 font-sans">
        <div className="text-center">
          <p className="text-rust font-semibold text-sm tracking-widest uppercase mb-4">Error</p>
          <h1 className="text-4xl font-bold text-ink mb-3">Something went wrong</h1>
          <p className="text-ink/50 mb-8">An unexpected error occurred. We have been notified.</p>
          <button
            onClick={reset}
            className="inline-block bg-rust text-cream px-6 py-3 rounded-lg font-medium hover:bg-rust/90 transition-colors"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
