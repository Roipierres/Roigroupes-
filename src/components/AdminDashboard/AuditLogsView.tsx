import React, { useState } from 'react';
import { AuditLog } from '../../types';
import { Search, ShieldAlert, Clock, Terminal, Activity } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface AuditLogsViewProps {
  logs: AuditLog[];
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ logs }) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = logs.filter(l =>
    l.adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.ipAddress.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('auditLogsTitle')}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t('auditLogsDesc')}
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search action or details..."
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Admin Name</th>
                <th className="px-6 py-4">Action Type</th>
                <th className="px-6 py-4">Operation Details</th>
                <th className="px-6 py-4">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  
                  <td className="px-6 py-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} className="text-slate-500" />
                      <span>{log.timestamp}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                    {log.adminName}
                  </td>

                  <td className="px-6 py-4 font-mono">
                    <span className="bg-blue-500/10 text-blue-600 dark:text-cyan-400 border border-blue-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                      {log.action}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-slate-800 dark:text-slate-200 font-medium">
                    {log.details}
                  </td>

                  <td className="px-6 py-4 font-mono text-[11px] text-slate-400">
                    {log.ipAddress}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
