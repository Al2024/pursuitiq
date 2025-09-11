import Link from 'next/link';

export const metadata = {
  title: 'PursuitIQ – AI RFP Triage',
  description: 'Instantly extract disciplines, dates, risks, and bid/no-bid guidance from complex RFPs.'
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-6">
          Accelerate Bid Decisions with <span className="text-blue-600">AI Triage</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-8">
          Upload an RFP and get structured insights in seconds: required disciplines, critical dates,
          surfaced risks, and a transparent go / no-go recommendation with rationale.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/analyze"
            className="px-8 py-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition"
          >
            Launch Analyzer
          </Link>
          <a
            href="https://github.com/Al2024/pursuitiq"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-lg bg-gray-900 hover:bg-black text-white font-medium shadow-sm transition"
          >
            View Code
          </a>
        </div>
        <p className="mt-6 text-sm text-gray-500">
          No signup required during MVP. Documents stored securely in Firebase Storage.
        </p>
      </section>
      {/* Feature highlights */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-6 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Structured Extraction','Disciplines, key dates, risks, recommendation'],
            ['PDF & DOCX Support','Inline PDF handling for reliability'],
            ['Deterministic Roadmap','Planned confidence formula + hashing cache'],
            ['Secure Storage','Firebase Storage with server-only processing']
          ].map(([title, desc]) => (
            <div key={title} className="rounded-lg border border-gray-200 p-5 bg-gray-50">
              <h3 className="font-semibold text-gray-900 mb-2 text-sm tracking-wide uppercase">{title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
      <footer className="py-8 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} PursuitIQ. Internal MVP.
      </footer>
    </main>
  );
}