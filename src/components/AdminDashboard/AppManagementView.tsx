import React, { useState } from 'react';
import { AppItem, AppCategory } from '../../types';
import { AppIcon } from '../AppIcon';
import { Plus, Edit, Trash2, Eye, EyeOff, Download, Save, X, RefreshCw } from 'lucide-react';

interface AppManagementViewProps {
  apps: AppItem[];
  onRefresh: () => void;
}

export const AppManagementView: React.FC<AppManagementViewProps> = ({ apps, onRefresh }) => {
  const [editingApp, setEditingApp] = useState<Partial<AppItem> | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories: AppCategory[] = [
    'Parental & Safety',
    'Encrypted Communications',
    'Automotive & Roadside',
    'Cyber Security & Vault',
    'Utility & Hardware',
  ];

  const handleOpenCreate = () => {
    setEditingApp({
      title: '',
      category: 'Parental & Safety',
      tagline: '',
      description: '',
      version: '1.0.0',
      fileSize: '25.0 MB',
      minOs: 'Android 8.0+',
      apkUrl: '/downloads/NewApp_v1.0.0.apk',
      downloads: 100,
      rating: 4.8,
      reviewsCount: 10,
      badges: ['Verified APK', 'Privacy First'],
      iconType: 'shield',
      gradient: 'from-blue-600 via-indigo-600 to-cyan-500',
      isVisible: true,
      featured: false,
      screenshots: [
        { id: 's1', title: 'Main Dashboard', description: 'Primary overview screen.', type: 'stats' }
      ],
      features: [
        { id: 'f1', title: 'High Performance', detail: 'Optimized battery and network usage.', icon: 'zap' }
      ],
    });
    setIsCreating(true);
  };

  const handleOpenEdit = (app: AppItem) => {
    setEditingApp({ ...app });
    setIsCreating(false);
  };

  const handleToggleVisibility = async (app: AppItem) => {
    try {
      await fetch(`/api/apps/${app.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVisible: !app.isVisible }),
      });
      onRefresh();
    } catch (err) {
      console.error('Failed to toggle app visibility:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this application from the ecosystem?')) return;
    try {
      await fetch(`/api/apps/${id}`, { method: 'DELETE' });
      onRefresh();
    } catch (err) {
      console.error('Failed to delete app:', err);
    }
  };

  const handleSaveApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApp || !editingApp.title) return;

    setIsSubmitting(true);

    try {
      if (isCreating) {
        await fetch('/api/apps', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingApp),
        });
      } else if (editingApp.id) {
        await fetch(`/api/apps/${editingApp.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingApp),
        });
      }
      setEditingApp(null);
      onRefresh();
    } catch (err) {
      console.error('Save app error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Application Management</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Create, edit, link APK binaries, adjust download counts, and control portal visibility.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all shrink-0"
        >
          <Plus size={16} />
          <span>Add New Application</span>
        </button>
      </div>

      {/* Apps Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">App Title & Category</th>
                <th className="px-6 py-4">Version & Size</th>
                <th className="px-6 py-4">Download Counter</th>
                <th className="px-6 py-4">Visibility</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {apps.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  
                  {/* App Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <AppIcon iconType={app.iconType} gradient={app.gradient} className="w-10 h-10 shrink-0" size={20} />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm">{app.title}</div>
                        <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">{app.category}</span>
                      </div>
                    </div>
                  </td>

                  {/* Version */}
                  <td className="px-6 py-4 font-mono">
                    <div className="font-bold text-slate-800 dark:text-slate-200">v{app.version}</div>
                    <div className="text-[11px] text-slate-400">{app.fileSize}</div>
                  </td>

                  {/* Download Count */}
                  <td className="px-6 py-4 font-mono">
                    <div className="font-extrabold text-blue-600 dark:text-cyan-400 text-sm">
                      {app.downloads.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-400">Total verified</div>
                  </td>

                  {/* Visibility status */}
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleVisibility(app)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        app.isVisible
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-500 border border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      {app.isVisible ? <Eye size={12} /> : <EyeOff size={12} />}
                      <span>{app.isVisible ? 'Visible' : 'Hidden'}</span>
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(app)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                        title="Edit App"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(app.id)}
                        className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400"
                        title="Delete App"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Create Modal */}
      {editingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl my-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl text-slate-900 dark:text-white space-y-6">
            
            <button
              onClick={() => setEditingApp(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold">
              {isCreating ? 'Add New Ecosystem Application' : `Edit ${editingApp.title}`}
            </h3>

            <form onSubmit={handleSaveApp} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">App Title</label>
                  <input
                    type="text"
                    required
                    value={editingApp.title || ''}
                    onChange={(e) => setEditingApp({ ...editingApp, title: e.target.value })}
                    placeholder="e.g. GuardianShield Safety"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Category</label>
                  <select
                    value={editingApp.category || 'Parental & Safety'}
                    onChange={(e) => setEditingApp({ ...editingApp, category: e.target.value as AppCategory })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Tagline / Short Summary</label>
                <input
                  type="text"
                  required
                  value={editingApp.tagline || ''}
                  onChange={(e) => setEditingApp({ ...editingApp, tagline: e.target.value })}
                  placeholder="Real-time AI geofencing, panic alerts & screen safety..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Full Description</label>
                <textarea
                  rows={3}
                  required
                  value={editingApp.description || ''}
                  onChange={(e) => setEditingApp({ ...editingApp, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Version</label>
                  <input
                    type="text"
                    required
                    value={editingApp.version || '1.0.0'}
                    onChange={(e) => setEditingApp({ ...editingApp, version: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">File Size</label>
                  <input
                    type="text"
                    required
                    value={editingApp.fileSize || '25 MB'}
                    onChange={(e) => setEditingApp({ ...editingApp, fileSize: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Download Counter</label>
                  <input
                    type="number"
                    required
                    value={editingApp.downloads || 0}
                    onChange={(e) => setEditingApp({ ...editingApp, downloads: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">APK File Download Link</label>
                <input
                  type="text"
                  required
                  value={editingApp.apkUrl || ''}
                  onChange={(e) => setEditingApp({ ...editingApp, apkUrl: e.target.value })}
                  placeholder="/downloads/AppName_v1.0.0.apk"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingApp.isVisible ?? true}
                    onChange={(e) => setEditingApp({ ...editingApp, isVisible: e.target.checked })}
                    className="rounded border-slate-700"
                  />
                  <span>Visible on Public Portal</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingApp.featured ?? false}
                    onChange={(e) => setEditingApp({ ...editingApp, featured: e.target.checked })}
                    className="rounded border-slate-700"
                  />
                  <span>Featured Badge</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingApp(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-2 shadow-md"
                >
                  <Save size={16} />
                  <span>{isSubmitting ? 'Saving...' : 'Save App Details'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
