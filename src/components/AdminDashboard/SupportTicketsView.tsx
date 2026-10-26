import React from 'react';
import { SupportTicket } from '../../types';
import { MessageSquare, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface SupportTicketsViewProps {
  tickets: SupportTicket[];
  onRefresh: () => void;
}

export const SupportTicketsView: React.FC<SupportTicketsViewProps> = ({ tickets, onRefresh }) => {
  const handleUpdateStatus = async (id: string, newStatus: 'Open' | 'In Progress' | 'Resolved') => {
    try {
      await fetch(`/api/contact/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      onRefresh();
    } catch (err) {
      console.error('Failed to update ticket status:', err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Support & Feedback Tickets</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          User inquiries, bug reports, and hardware support tickets submitted via the public contact form.
        </p>
      </div>

      <div className="space-y-4">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
                  ticket.severity === 'Critical'
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                    : ticket.severity === 'High'
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                    : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                }`}>
                  {ticket.severity} Severity
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">{ticket.subject}</h3>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] text-slate-400 font-mono">{ticket.createdAt}</span>
                
                <select
                  value={ticket.status}
                  onChange={(e) => handleUpdateStatus(ticket.id, e.target.value as any)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold border ${
                    ticket.status === 'Resolved'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                      : ticket.status === 'In Progress'
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                      : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30'
                  }`}
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
              {ticket.message}
            </p>

            <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
              <div>
                Submitted by <strong className="text-slate-800 dark:text-slate-200">{ticket.userName}</strong> ({ticket.userEmail})
              </div>
              {ticket.appName && (
                <div className="font-semibold text-blue-600 dark:text-blue-400">
                  App: {ticket.appName}
                </div>
              )}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
