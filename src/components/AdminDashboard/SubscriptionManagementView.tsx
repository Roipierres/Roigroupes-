import React, { useState } from 'react';
import { UserSubscription } from '../../types';
import { Search, UserCheck, Shield, Filter, Calendar, Edit, Save, X } from 'lucide-react';

interface SubscriptionManagementViewProps {
  subscriptions: UserSubscription[];
  onRefresh: () => void;
}

export const SubscriptionManagementView: React.FC<SubscriptionManagementViewProps> = ({
  subscriptions,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState<string>('All');
  const [editingSub, setEditingSub] = useState<UserSubscription | null>(null);

  const filteredSubs = subscriptions.filter(s => {
    const matchesSearch = s.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = filterTier === 'All' || s.planTier === filterTier;
    return matchesSearch && matchesTier;
  });

  const handleUpdateStatus = async (sub: UserSubscription, newStatus: 'Active' | 'Pending' | 'Cancelled') => {
    try {
      await fetch(`/api/subscriptions/${sub.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      onRefresh();
    } catch (err) {
      console.error('Failed to update subscription status:', err);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSub) return;

    try {
      await fetch(`/api/subscriptions/${editingSub.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingSub),
      });
      setEditingSub(null);
      onRefresh();
    } catch (err) {
      console.error('Failed to save subscription:', err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">User & Subscription Management</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          View registered ecosystem accounts, manage license tiers, and adjust payment statuses.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or user email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Tier Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={14} className="text-slate-400 shrink-0" />
          <select
            value={filterTier}
            onChange={(e) => setFilterTier(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Tiers</option>
            <option value="Free">Free</option>
            <option value="Pro">Pro</option>
            <option value="Family/Enterprise">Family/Enterprise</option>
          </select>
        </div>

      </div>

      {/* Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Subscriber Name & Email</th>
                <th className="px-6 py-4">Plan Tier</th>
                <th className="px-6 py-4">Billing & Paid</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Expiration</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredSubs.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 dark:text-white text-sm">{sub.userName}</div>
                    <span className="text-[11px] text-slate-400">{sub.userEmail}</span>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${
                      sub.planTier === 'Family/Enterprise'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                        : sub.planTier === 'Pro'
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700'
                    }`}>
                      {sub.planTier}
                    </span>
                  </td>

                  <td className="px-6 py-4 font-mono">
                    <div className="font-bold text-slate-800 dark:text-slate-200">${sub.amountPaid.toFixed(2)}</div>
                    <div className="text-[10px] text-slate-400">{sub.billingCycle}</div>
                  </td>

                  <td className="px-6 py-4">
                    <select
                      value={sub.status}
                      onChange={(e) => handleUpdateStatus(sub, e.target.value as any)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                        sub.status === 'Active'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                          : sub.status === 'Pending'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
                      }`}
                    >
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>

                  <td className="px-6 py-4 font-mono text-[11px] text-slate-400">
                    {sub.expiresAt}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setEditingSub(sub)}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                    >
                      <Edit size={14} />
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl text-slate-900 dark:text-white space-y-5">
            <button
              onClick={() => setEditingSub(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold">Edit User Subscription</h3>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Name</label>
                <input
                  type="text"
                  value={editingSub.userName}
                  onChange={(e) => setEditingSub({ ...editingSub, userName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Email</label>
                <input
                  type="email"
                  value={editingSub.userEmail}
                  onChange={(e) => setEditingSub({ ...editingSub, userEmail: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Plan Tier</label>
                <select
                  value={editingSub.planTier}
                  onChange={(e) => setEditingSub({ ...editingSub, planTier: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white"
                >
                  <option value="Free">Free</option>
                  <option value="Pro">Pro</option>
                  <option value="Family/Enterprise">Family/Enterprise</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Expiration Date</label>
                <input
                  type="date"
                  value={editingSub.expiresAt}
                  onChange={(e) => setEditingSub({ ...editingSub, expiresAt: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center gap-2"
              >
                <Save size={16} />
                <span>Save Subscription Changes</span>
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
