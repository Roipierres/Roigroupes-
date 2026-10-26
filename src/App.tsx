import React, { useEffect, useState, useCallback } from 'react';
import { AppItem, BannerItem, UserSubscription, SupportTicket, InvoiceItem, SystemSettings, AuditLog, AnalyticsSummary, AdminCredentials } from './types';
import { Navbar } from './components/Navbar';
import { BannerAlert } from './components/BannerAlert';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { AppsShowcaseGrid } from './components/AppsShowcaseGrid';
import { DownloadModal } from './components/DownloadModal';
import { AppGalleryModal } from './components/AppGalleryModal';
import { PricingSection } from './components/PricingSection';
import { CheckoutModal } from './components/CheckoutModal';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AdminLogin } from './components/AdminDashboard/AdminLogin';
import { AdminLayout } from './components/AdminDashboard/AdminLayout';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [currentView, setCurrentView] = useState<'portal' | 'admin'>('portal');
  const [adminSession, setAdminSession] = useState<AdminCredentials | null>(null);

  // Data states
  const [apps, setApps] = useState<AppItem[]>([]);
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);

  // Modal states
  const [downloadModalApp, setDownloadModalApp] = useState<AppItem | null>(null);
  const [galleryModalApp, setGalleryModalApp] = useState<AppItem | null>(null);
  const [checkoutPlan, setCheckoutPlan] = useState<{
    tier: 'Free' | 'Pro' | 'Family/Enterprise';
    billingCycle: 'Monthly' | 'Annual';
    price: number;
  } | null>(null);

  // Sync theme with HTML class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Load admin session from storage
  useEffect(() => {
    const savedAdmin = localStorage.getItem('aetherops_admin_session');
    if (savedAdmin) {
      try {
        setAdminSession(JSON.parse(savedAdmin));
      } catch (err) {
        localStorage.removeItem('aetherops_admin_session');
      }
    }
  }, []);

  // Fetch all ecosystem data from Express API
  const fetchAllData = useCallback(async () => {
    try {
      const [appsRes, bannersRes, usersRes, invoicesRes, ticketsRes, settingsRes, logsRes, analyticsRes] = await Promise.all([
        fetch('/api/apps?admin=true'),
        fetch('/api/banners?all=true'),
        fetch('/api/users'),
        fetch('/api/invoices'),
        fetch('/api/contact'),
        fetch('/api/settings'),
        fetch('/api/audit-logs'),
        fetch('/api/analytics'),
      ]);

      const appsData = await appsRes.json();
      const bannersData = await bannersRes.json();
      const usersData = await usersRes.json();
      const invoicesData = await invoicesRes.json();
      const ticketsData = await ticketsRes.json();
      const settingsData = await settingsRes.json();
      const logsData = await logsRes.json();
      const analyticsData = await analyticsRes.json();

      if (appsData.success) setApps(appsData.apps);
      if (bannersData.success) setBanners(bannersData.banners);
      if (usersData.success) setSubscriptions(usersData.subscriptions);
      if (invoicesData.success) setInvoices(invoicesData.invoices);
      if (ticketsData.success) setTickets(ticketsData.tickets);
      if (settingsData.success) setSettings(settingsData.settings);
      if (logsData.success) setAuditLogs(logsData.auditLogs);
      if (analyticsData.success) setAnalytics(analyticsData.analytics);
    } catch (err) {
      console.error('Failed to fetch portal data:', err);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Total downloads sum
  const totalEcosystemDownloads = apps.reduce((sum, app) => sum + app.downloads, 0);

  // Handle download trigger & counter increment
  const handleDownloadApp = async (app: AppItem) => {
    setDownloadModalApp(app);
    try {
      const res = await fetch(`/api/apps/${app.id}/download`, { method: 'POST' });
      const data = await res.json();
      if (data.success && data.downloads) {
        setApps(prev => prev.map(a => a.id === app.id ? { ...a, downloads: data.downloads } : a));
        setDownloadModalApp(prev => prev ? { ...prev, downloads: data.downloads } : null);
      }
    } catch (err) {
      console.error('Download counter update failed:', err);
    }
  };

  const handleAdminLoginSuccess = (admin: AdminCredentials) => {
    setAdminSession(admin);
    localStorage.setItem('aetherops_admin_session', JSON.stringify(admin));
    setCurrentView('admin');
  };

  const handleAdminLogout = () => {
    setAdminSession(null);
    localStorage.removeItem('aetherops_admin_session');
    setCurrentView('portal');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-200 font-sans antialiased">
      
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode(!darkMode)}
        isAdminLoggedIn={!!adminSession}
      />

      {/* Main View Router */}
      {currentView === 'portal' ? (
        <main>
          {/* Top Announcement Banner */}
          <BannerAlert banners={banners} placement="top_bar" />

          {/* Hero Section */}
          <Hero
            apps={apps.filter(a => a.isVisible)}
            totalDownloads={totalEcosystemDownloads}
            onSelectApp={(app) => setGalleryModalApp(app)}
            onQuickDownload={handleDownloadApp}
          />

          {/* Inline Grid Banner */}
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
            <BannerAlert banners={banners} placement="inline_grid" />
          </div>

          {/* About & Mission Section */}
          <AboutSection />

          {/* Apps Showcase Grid */}
          <AppsShowcaseGrid
            apps={apps.filter(a => a.isVisible)}
            onDownloadApp={handleDownloadApp}
            onOpenGallery={(app) => setGalleryModalApp(app)}
          />

          {/* Pricing & Subscription Tiers */}
          <PricingSection
            onSubscribePlan={(tier, cycle, price) => {
              setCheckoutPlan({ tier, billingCycle: cycle, price });
            }}
          />

          {/* Support & Contact Form */}
          <ContactSection apps={apps.filter(a => a.isVisible)} />

          {/* Footer */}
          <Footer onNavigateAdmin={() => setCurrentView('admin')} />
        </main>
      ) : (
        /* Admin Environment */
        <div>
          {adminSession ? (
            <AdminLayout
              admin={adminSession}
              apps={apps}
              members={subscriptions}
              invoices={invoices}
              banners={banners}
              tickets={tickets}
              settings={settings}
              auditLogs={auditLogs}
              analytics={analytics}
              onRefreshData={fetchAllData}
              onLogout={handleAdminLogout}
              onReturnToPortal={() => setCurrentView('portal')}
            />
          ) : (
            <AdminLogin
              onLoginSuccess={handleAdminLoginSuccess}
              onBackToPortal={() => setCurrentView('portal')}
            />
          )}
        </div>
      )}

      {/* Modals */}
      <DownloadModal
        app={downloadModalApp}
        onClose={() => setDownloadModalApp(null)}
      />

      <AppGalleryModal
        app={galleryModalApp}
        onClose={() => setGalleryModalApp(null)}
        onDownload={handleDownloadApp}
      />

      {checkoutPlan && (
        <CheckoutModal
          planTier={checkoutPlan.tier}
          billingCycle={checkoutPlan.billingCycle}
          price={checkoutPlan.price}
          onClose={() => setCheckoutPlan(null)}
          onSuccess={() => fetchAllData()}
        />
      )}

    </div>
  );
}
