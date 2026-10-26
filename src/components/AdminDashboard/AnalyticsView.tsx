import React from 'react';
import { AnalyticsSummary } from '../../types';
import { Download, Users, DollarSign, Smartphone, MessageSquare, TrendingUp, ShieldAlert } from 'lucide-react';

interface AnalyticsViewProps {
  analytics: AnalyticsSummary | null;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ analytics }) => {
  if (!analytics) {
    return (
      <div className="p-8 text-center text-slate-400">
        Loading analytics metrics...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Ecosystem Overview & Metrics</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Real-time analytics across all 4 mobile apps, active user subscriptions, and download conversion trends.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Downloads</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-cyan-400 flex items-center justify-center">
              <Download size={18} />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
            {analytics.totalDownloads.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
            <TrendingUp size={12} />
            <span>+14.2% from last week</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Subscriptions</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Users size={18} />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
            {analytics.activeSubscriptions.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400">
            Across Pro & Family Tiers
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Monthly Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
            ${analytics.monthlyRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
            <TrendingUp size={12} />
            <span>+8.6% M-o-M growth</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Open Tickets</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <MessageSquare size={18} />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
            {analytics.openSupportTickets}
          </div>
          <div className="text-[11px] text-slate-400">
            Support queue active
          </div>
        </div>

      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* App Popularity Download Share */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Application Popularity & Download Share</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Breakdown of total downloads by mobile application.</p>
          </div>

          <div className="space-y-4">
            {analytics.appPopularity.map((item) => (
              <div key={item.appTitle} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-800 dark:text-slate-200 truncate">{item.appTitle}</span>
                  <div className="font-mono text-blue-600 dark:text-cyan-400 shrink-0">
                    {item.downloads.toLocaleString()} ({item.percentage}%)
                  </div>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 h-full rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Plan Distribution */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Subscription Tier Revenue</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Active subscribers and estimated revenue by plan.</p>
          </div>

          <div className="space-y-3">
            {analytics.revenueByPlan.map((plan) => (
              <div
                key={plan.plan}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">{plan.plan} Tier</span>
                  <span className="text-slate-400 text-[11px]">{plan.count} subscribers</span>
                </div>
                <div className="text-right">
                  <span className="font-extrabold font-mono text-blue-600 dark:text-cyan-300 block text-sm">
                    ${plan.revenue}
                  </span>
                  <span className="text-[10px] text-slate-400">Total volume</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
