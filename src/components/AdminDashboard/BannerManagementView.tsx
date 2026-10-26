import React, { useState } from 'react';
import { BannerItem } from '../../types';
import { Plus, Edit, Trash2, Megaphone, Sparkles, CheckCircle2, Save, X } from 'lucide-react';

interface BannerManagementViewProps {
  banners: BannerItem[];
  onRefresh: () => void;
}

export const BannerManagementView: React.FC<BannerManagementViewProps> = ({ banners, onRefresh }) => {
  const [editingBanner, setEditingBanner] = useState<Partial<BannerItem> | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleOpenCreate = () => {
    setEditingBanner({
      title: 'New Announcement',
      message: 'Promotional announcement message displayed across the portal.',
      ctaText: 'Explore Offer',
      ctaLink: '#pricing',
      type: 'promo',
      placement: 'top_bar',
      isActive: true,
    });
    setIsCreating(true);
  };

  const handleOpenEdit = (banner: BannerItem) => {
    setEditingBanner({ ...banner });
    setIsCreating(false);
  };

  const handleToggleActive = async (banner: BannerItem) => {
    try {
      await fetch(`/api/banners/${banner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !banner.isActive }),
      });
      onRefresh();
    } catch (err) {
      console.error('Failed to toggle banner active state:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this promotional banner?')) return;
    try {
      await fetch(`/api/banners/${id}`, { method: 'DELETE' });
      onRefresh();
    } catch (err) {
      console.error('Failed to delete banner:', err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner || !editingBanner.title) return;

    try {
      if (isCreating) {
        await fetch('/api/banners', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingBanner),
        });
      } else if (editingBanner.id) {
        await fetch(`/api/banners/${editingBanner.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingBanner),
        });
      }
      setEditingBanner(null);
      onRefresh();
    } catch (err) {
      console.error('Failed to save banner:', err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Ad & Banner Management</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Control platform announcements, promotional discounts, and top-bar event highlights.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shrink-0"
        >
          <Plus size={16} />
          <span>Create New Banner</span>
        </button>
      </div>

      {/* Grid of Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <Megaphone size={18} className="text-cyan-500" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">{banner.title}</h3>
              </div>

              <button
                onClick={() => handleToggleActive(banner)}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                  banner.isActive
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-300 dark:border-slate-700'
                }`}
              >
                {banner.isActive ? 'Active' : 'Disabled'}
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              "{banner.message}"
            </p>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-200/80 dark:border-slate-800">
              <span className="font-mono text-[11px] uppercase">Placement: {banner.placement}</span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(banner)}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                >
                  <Edit size={14} />
                </button>
                <button
                  onClick={() => handleDelete(banner.id)}
                  className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Edit / Create Modal */}
      {editingBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl text-slate-900 dark:text-white space-y-5">
            
            <button
              onClick={() => setEditingBanner(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold">{isCreating ? 'Create Banner' : 'Edit Banner'}</h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Banner Title</label>
                <input
                  type="text"
                  required
                  value={editingBanner.title || ''}
                  onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Message</label>
                <textarea
                  rows={3}
                  required
                  value={editingBanner.message || ''}
                  onChange={(e) => setEditingBanner({ ...editingBanner, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">CTA Label</label>
                  <input
                    type="text"
                    value={editingBanner.ctaText || ''}
                    onChange={(e) => setEditingBanner({ ...editingBanner, ctaText: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">CTA Link Target</label>
                  <input
                    type="text"
                    value={editingBanner.ctaLink || '#pricing'}
                    onChange={(e) => setEditingBanner({ ...editingBanner, ctaLink: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Placement Zone</label>
                <select
                  value={editingBanner.placement || 'top_bar'}
                  onChange={(e) => setEditingBanner({ ...editingBanner, placement: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white"
                >
                  <option value="top_bar">Top Bar Banner</option>
                  <option value="inline_grid">Inline Catalog Banner</option>
                  <option value="hero_bottom">Hero Bottom Banner</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  checked={editingBanner.isActive ?? true}
                  onChange={(e) => setEditingBanner({ ...editingBanner, isActive: e.target.checked })}
                  className="rounded border-slate-700"
                />
                <span className="font-semibold text-slate-300">Active and visible to visitors</span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center gap-2 shadow-md"
              >
                <Save size={16} />
                <span>Save Banner Settings</span>
              </button>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
