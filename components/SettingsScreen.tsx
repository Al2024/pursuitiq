'use client';

export default function SettingsScreen() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2>
        <p className="text-gray-600 mb-6">Configure your application preferences</p>

        {/* TODO: Implement settings for Go/No-Go criteria, user roles, taxonomy management */}
        <div className="text-center py-12">
          <p className="text-gray-500">Settings functionality coming soon...</p>
        </div>
      </div>
    </div>
  );
}
