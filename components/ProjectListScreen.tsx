'use client';

export default function ProjectListScreen() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="glass-card rounded-2xl p-8 shadow-2xl shadow-black/30 border border-slate-800/80">
        <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">Project List</h2>
        <p className="text-slate-400 mb-6">View and manage all your projects</p>

        {/* TODO: Implement project list with search, filtering, and pagination */}
        <div className="text-center py-12">
          <p className="text-slate-500">Project list functionality coming soon...</p>
        </div>
      </div>
    </div>
  );
}
