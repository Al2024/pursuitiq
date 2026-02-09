import Link from 'next/link';

export const metadata = {
  title: 'PursuitIQ – AI RFP Triage',
  description: 'Instantly extract disciplines, dates, risks, and bid/no-bid guidance from complex RFPs.'
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-dark-950 text-slate-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute -top-32 left-16 h-[520px] w-[520px] rounded-full bg-brand-500/20 blur-[180px]" />
      <div className="absolute -bottom-48 right-[-120px] h-[560px] w-[560px] rounded-full bg-pink-500/15 blur-[200px]" />

      <section className="relative flex min-h-screen items-center justify-center px-6 py-40 scanline-effect">
        <div className="absolute inset-0 opacity-60">
          {Array.from({ length: 18 }).map((_, index) => (
            <span
              key={index}
              className="absolute h-1 w-1 rounded-full bg-brand-400/70 blur-[1px]"
              style={{
                top: `${(index * 13) % 100}%`,
                left: `${(index * 19) % 100}%`,
              }}
            />
          ))}
        </div>

        <div className="relative w-full max-w-md">
          <div className="glass-card overlay-scan rounded-3xl p-8 text-center shadow-2xl shadow-black/40">
            <div className="animate-scanline" />
            <div className="relative space-y-6">
              <span className="inline-flex rounded-full border border-brand-500/40 bg-brand-500/10 px-4 py-1 text-[10px] font-mono uppercase tracking-[0.4em] text-brand-200">
                PursuitIQ
              </span>
              <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter">
                Precision <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-200 via-brand-400 to-pink-400 drop-shadow-[0_2px_10px_rgba(99,102,241,0.45)]">
                  Bid Intel
                </span>
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Upload RFPs, extract disciplines, dates, and risk signals, then generate a structured go / no-go briefing.
              </p>
              <Link
                href="/analyze"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-brand-600 text-white font-semibold uppercase tracking-[0.3em] text-xs hover:bg-brand-500 transition"
              >
                Launch Analyzer
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}