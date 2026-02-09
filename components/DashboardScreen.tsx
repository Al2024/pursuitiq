'use client';

export default function DashboardScreen() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="glass-card rounded-2xl p-8 shadow-2xl shadow-black/30 border border-slate-800/80">
        <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">Dashboard</h2>
        <p className="text-slate-400 mb-6">Overview of your bid triage activities</p>

        {/* TODO: Implement dashboard with metrics, charts, and recent activity */}
        <div className="text-center py-12">
          <p className="text-slate-500">Dashboard functionality coming soon...</p>
        </div>
      </div>
    </div>
  );
}
