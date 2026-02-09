'use client';

export default function SettingsScreen() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="glass-card rounded-2xl p-8 shadow-2xl shadow-black/30 border border-slate-800/80">
        <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">Settings</h2>
        <p className="text-slate-400 mb-6">Configure your application preferences</p>

        {/* TODO: Implement settings for Go/No-Go criteria, user roles, taxonomy management */}
        <div className="text-center py-12">
          <p className="text-slate-500">Settings functionality coming soon...</p>
        </div>
      </div>
    </div>
  );
}
