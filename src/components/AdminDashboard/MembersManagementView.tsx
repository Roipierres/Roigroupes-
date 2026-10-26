import React, { useState } from 'react';
import { UserSubscription, UserRole, UserStatus } from '../../types';
import { Search, UserPlus, Shield, Filter, Edit, Trash2, Save, X, Ban, CheckCircle, Clock } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface MembersManagementViewProps {
  members: UserSubscription[];
  onRefresh: () => void;
}

export const MembersManagementView: React.FC<MembersManagementViewProps> = ({
  members,
  onRefresh,
}) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [editingMember, setEditingMember] = useState<Partial<UserSubscription> | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const roles: UserRole[] = ['Super Admin', 'Editor', 'Support Specialist', 'Member'];
  const statuses: UserStatus[] = ['Active', 'Pending', 'Suspended', 'Banned'];

  const filteredMembers = members.filter(m => {
    const matchesSearch = m.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'All' || m.role === filterRole;
    const matchesStatus = filterStatus === 'All' || m.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleOpenCreate = () => {
    setEditingMember({
      userName: '',
      userEmail: '',
      role: 'Member',
      planTier: 'Free',
      status: 'Active',
      billingCycle: 'Monthly',
      amountPaid: 0,
      expiresAt: '2099-12-31',
    });
    setIsCreating(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember || !editingMember.userName || !editingMember.userEmail) return;

    try {
      if (isCreating) {
        await fetch('/api/subscriptions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingMember),
        });
      } else if (editingMember.id) {
        await fetch(`/api/subscriptions/${editingMember.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingMember),
        });
      }
      setEditingMember(null);
      onRefresh();
    } catch (err) {
      console.error('Failed to save member:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this member from the system?')) return;
    try {
      await fetch(`/api/subscriptions/${id}`, { method: 'DELETE' });
      onRefresh();
    } catch (err) {
      console.error('Failed to delete member:', err);
    }
  };

  const handleQuickStatusChange = async (member: UserSubscription, newStatus: UserStatus) => {
    try {
      await fetch(`/api/subscriptions/${member.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      onRefresh();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('userManagementTitle')}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t('userManagementDesc')}
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shrink-0"
        >
          <UserPlus size={16} />
          <span>{t('addNewMember')}</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Filter size={14} className="text-slate-400 shrink-0" />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Roles</option>
            {roles.map(r => <option key={r} value={r}>{r}</option>)}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Statuses</option>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

      </div>

      {/* Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">{t('userCol')}</th>
                <th className="px-6 py-4">{t('roleCol')}</th>
                <th className="px-6 py-4">Plan Tier</th>
                <th className="px-6 py-4">{t('statusCol')}</th>
                <th className="px-6 py-4">{t('lastLoginCol')}</th>
                <th className="px-6 py-4 text-right">{t('actionsCol')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 dark:text-white text-sm">{member.userName}</div>
                    <span className="text-[11px] text-slate-400">{member.userEmail}</span>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${
                      member.role === 'Super Admin'
                        ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30'
                        : member.role === 'Editor'
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30'
                        : member.role === 'Support Specialist'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
                    }`}>
                      <Shield size={12} />
                      <span>{member.role || 'Member'}</span>
                    </span>
                  </td>

                  <td className="px-6 py-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                    {member.planTier} (${member.amountPaid.toFixed(2)})
                  </td>

                  <td className="px-6 py-4">
                    <select
                      value={member.status}
                      onChange={(e) => handleQuickStatusChange(member, e.target.value as UserStatus)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                        member.status === 'Active'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                          : member.status === 'Pending'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
                      }`}
                    >
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Suspended">Suspended</option>
                      <option value="Banned">Banned</option>
                    </select>
                  </td>

                  <td className="px-6 py-4 font-mono text-[11px] text-slate-400">
                    {member.lastLogin || '2026-10-25'}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingMember({ ...member });
                          setIsCreating(false);
                        }}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                        title="Edit Member"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400"
                        title="Delete Member"
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
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl text-slate-900 dark:text-white space-y-5">
            <button
              onClick={() => setEditingMember(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold">
              {isCreating ? t('addNewMember') : 'Edit Member Profile & Access'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">{t('fullNameLabel')}</label>
                <input
                  type="text"
                  required
                  value={editingMember.userName || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, userName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">{t('emailLabel')}</label>
                <input
                  type="email"
                  required
                  value={editingMember.userEmail || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, userEmail: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">{t('roleCol')}</label>
                  <select
                    value={editingMember.role || 'Member'}
                    onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value as UserRole })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white"
                  >
                    {roles.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Plan Tier</label>
                  <select
                    value={editingMember.planTier || 'Free'}
                    onChange={(e) => setEditingMember({ ...editingMember, planTier: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white"
                  >
                    <option value="Free">Free</option>
                    <option value="Pro">Pro</option>
                    <option value="Family/Enterprise">Family/Enterprise</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">{t('statusCol')}</label>
                  <select
                    value={editingMember.status || 'Active'}
                    onChange={(e) => setEditingMember({ ...editingMember, status: e.target.value as UserStatus })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white"
                  >
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Amount Paid ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingMember.amountPaid || 0}
                    onChange={(e) => setEditingMember({ ...editingMember, amountPaid: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center gap-2 shadow-md"
              >
                <Save size={16} />
                <span>Save Member Changes</span>
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
