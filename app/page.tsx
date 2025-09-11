import Link from 'next/link';

export const metadata = {
  title: 'PursuitIQ – AI RFP Triage',
  description: 'Instantly extract disciplines, dates, risks, and bid/no-bid guidance from complex RFPs.'
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col">
      <section className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-5xl mx-auto w-full">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-6">
          InfrabuildAI Product Suite
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-10 max-w-3xl mx-auto">
          Lightweight AI tools for infrastructure & construction pursuit teams. Accelerate strategic clarity,
          reduce manual triage time, and improve bid discipline.
        </p>
        <div className="grid gap-6 w-full sm:grid-cols-2">
          <div className="group relative bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition flex flex-col">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">PursuitIQ</h2>
            <p className="text-sm text-gray-600 mb-4 flex-1">Upload RFPs → extract disciplines, dates, risks & get a structured go / no-go recommendation.</p>
            <Link href="/analyze" className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition">
              Launch Analyzer
            </Link>
          </div>
          <div className="group relative bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition flex flex-col">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Personality Fit Explorer</h2>
            <p className="text-sm text-gray-600 mb-4 flex-1">Quick self-assessment to understand dominant collaboration & risk tendencies on pursuit teams.</p>
            <Link href="/personality" className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition">
              Open Tool
            </Link>
          </div>
        </div>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://github.com/Al2024/pursuitiq"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-lg bg-gray-900 hover:bg-black text-white font-medium shadow-sm transition text-sm"
          >
            View Code (PursuitIQ)
          </a>
        </div>
        <p className="mt-6 text-sm text-gray-500 max-w-md mx-auto">
          MVP only—no authentication, documents stored securely server-side. Additional governance & auditing planned.
        </p>
      </section>
      <footer className="py-8 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} InfrabuildAI. Internal MVP.
      </footer>
    </main>
  );
}