import React, { useState } from 'react';
import { AnalyticsSummary, AppItem, UserSubscription, BannerItem, SupportTicket, InvoiceItem, SystemSettings, AuditLog, AdminCredentials } from '../../types';
import { AnalyticsView } from './AnalyticsView';
import { AppManagementView } from './AppManagementView';
import { MembersManagementView } from './MembersManagementView';
import { InvoicesManagementView } from './InvoicesManagementView';
import { BannerManagementView } from './BannerManagementView';
import { SupportTicketsView } from './SupportTicketsView';
import { SystemSettingsView } from './SystemSettingsView';
import { AuditLogsView } from './AuditLogsView';
import {
  LayoutDashboard,
  Smartphone,
  Users,
  FileText,
  Megaphone,
  MessageSquare,
  Settings,
  ShieldAlert,
  LogOut,
  RefreshCw,
  ArrowLeft,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface AdminLayoutProps {
  admin: AdminCredentials;
  apps: AppItem[];
  members: UserSubscription[];
  invoices: InvoiceItem[];
  banners: BannerItem[];
  tickets: SupportTicket[];
  settings: SystemSettings | null;
  auditLogs: AuditLog[];
  analytics: AnalyticsSummary | null;
  onRefreshData: () => void;
  onLogout: () => void;
  onReturnToPortal: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  admin,
  apps,
  members,
  invoices,
  banners,
  tickets,
  settings,
  auditLogs,
  analytics,
  onRefreshData,
  onLogout,
  onReturnToPortal,
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<
    'analytics' | 'apps' | 'members' | 'invoices' | 'banners' | 'tickets' | 'settings' | 'auditLogs'
  >('analytics');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const sidebarLinks = [
    { id: 'analytics' as const, label: t('ecosystemOverview'), icon: LayoutDashboard },
    { id: 'apps' as const, label: t('appManagementTitle'), icon: Smartphone, badge: apps.length },
    { id: 'members' as const, label: t('navMembers'), icon: Users, badge: members.length },
    { id: 'invoices' as const, label: t('navInvoices'), icon: FileText, badge: invoices.length },
    { id: 'banners' as const, label: t('bannerManagementTitle'), icon: Megaphone, badge: banners.length },
    { id: 'tickets' as const, label: t('supportTicketsTitle'), icon: MessageSquare, badge: tickets.filter(t => t.status !== 'Resolved').length },
    { id: 'settings' as const, label: t('navSettings'), icon: Settings },
    { id: 'auditLogs' as const, label: t('navAuditLogs'), icon: ShieldAlert, badge: auditLogs.length },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col md:flex-row transition-colors duration-200">
      
      {/* Sidebar Desktop & Mobile Drawer */}
      <aside className={`fixed md:sticky top-0 z-40 h-screen w-64 bg-slate-900 text-slate-300 flex flex-col justify-between p-5 border-r border-slate-800 transition-transform duration-300 ${
        mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        
        <div className="space-y-6 overflow-y-auto">
          
          {/* Admin Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-md">
                <ShieldCheck size={22} />
              </div>
              <div>
                <span className="font-bold text-white text-sm block">Roi groupes Admin</span>
                <span className="text-[10px] text-cyan-400 font-mono">{admin.role || 'Super Admin'}</span>
              </div>
            </div>

            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="md:hidden text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-medium">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;

              return (
                <button
                  key={link.id}
                  onClick={() => {
                    setActiveTab(link.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon size={16} className="shrink-0" />
                    <span className="truncate">{link.label}</span>
                  </div>
                  {link.badge !== undefined && link.badge > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold shrink-0 ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-slate-800 space-y-2 text-xs shrink-0">
          <button
            onClick={onReturnToPortal}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-300 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>{t('returnToPortal')}</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-950/40 border border-rose-900/60 text-rose-300 hover:bg-rose-900/60 transition-colors"
          >
            <LogOut size={14} />
            <span>{t('signOut')}</span>
          </button>
        </div>

      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
            >
              <Menu size={18} />
            </button>
            <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
              Logged in as <span className="text-blue-600 dark:text-cyan-400 font-mono">{admin.email}</span>
            </span>
          </div>

          <button
            onClick={onRefreshData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <RefreshCw size={14} />
            <span className="hidden sm:inline">{t('syncData')}</span>
          </button>
        </header>

        {/* View Content Body */}
        <main className="p-6 sm:p-8 space-y-8 flex-1">
          {activeTab === 'analytics' && <AnalyticsView analytics={analytics} />}
          {activeTab === 'apps' && <AppManagementView apps={apps} onRefresh={onRefreshData} />}
          {activeTab === 'members' && <MembersManagementView members={members} onRefresh={onRefreshData} />}
          {activeTab === 'invoices' && <InvoicesManagementView invoices={invoices} onRefresh={onRefreshData} />}
          {activeTab === 'banners' && <BannerManagementView banners={banners} onRefresh={onRefreshData} />}
          {activeTab === 'tickets' && <SupportTicketsView tickets={tickets} onRefresh={onRefreshData} />}
          {activeTab === 'settings' && <SystemSettingsView settings={settings} onRefresh={onRefreshData} />}
          {activeTab === 'auditLogs' && <AuditLogsView logs={auditLogs} />}
        </main>

      </div>

    </div>
  );
};
