import fs from 'node:fs';
import path from 'node:path';
import { AppItem, BannerItem, UserSubscription, SupportTicket, InvoiceItem, SystemSettings, AuditLog, AnalyticsSummary } from '../types';
import { initialApps, initialBanners, initialSubscriptions, initialTickets, initialInvoices, initialSystemSettings, initialAuditLogs } from '../data/seedData';

const DATA_FILE = path.join(process.cwd(), 'data.json');

interface LocalStoreData {
  apps: AppItem[];
  banners: BannerItem[];
  subscriptions: UserSubscription[];
  invoices: InvoiceItem[];
  tickets: SupportTicket[];
  settings: SystemSettings;
  auditLogs: AuditLog[];
  downloadLogs: { id: string; appId: string; timestamp: string; ip: string }[];
}

let store: LocalStoreData = {
  apps: [...initialApps],
  banners: [...initialBanners],
  subscriptions: [...initialSubscriptions],
  invoices: [...initialInvoices],
  tickets: [...initialTickets],
  settings: { ...initialSystemSettings },
  auditLogs: [...initialAuditLogs],
  downloadLogs: [],
};

// Load data on startup
function loadStore() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(fileContent);
      store = {
        apps: parsed.apps || [...initialApps],
        banners: parsed.banners || [...initialBanners],
        subscriptions: parsed.subscriptions || [...initialSubscriptions],
        invoices: parsed.invoices || [...initialInvoices],
        tickets: parsed.tickets || [...initialTickets],
        settings: parsed.settings || { ...initialSystemSettings },
        auditLogs: parsed.auditLogs || [...initialAuditLogs],
        downloadLogs: parsed.downloadLogs || [],
      };
    } else {
      saveStore();
    }
  } catch (err) {
    console.error('Failed to load store, using defaults:', err);
  }
}

function saveStore() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save store:', err);
  }
}

// Initialize
loadStore();

export const Storage = {
  // App operations
  getApps(includeHidden = false): AppItem[] {
    if (includeHidden) return store.apps;
    return store.apps.filter(app => app.isVisible);
  },

  getAppById(id: string): AppItem | undefined {
    return store.apps.find(app => app.id === id);
  },

  incrementDownload(id: string, ipAddress = '127.0.0.1'): { app: AppItem; newCount: number } {
    const app = store.apps.find(a => a.id === id);
    if (!app) {
      throw new Error(`App with ID ${id} not found`);
    }
    app.downloads += 1;
    app.updatedAt = new Date().toISOString().split('T')[0];
    
    store.downloadLogs.unshift({
      id: `dl-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      appId: id,
      timestamp: new Date().toISOString(),
      ip: ipAddress,
    });

    saveStore();
    return { app, newCount: app.downloads };
  },

  createApp(appData: Omit<AppItem, 'id' | 'updatedAt' | 'downloads'> & { id?: string; downloads?: number }): AppItem {
    const newId = appData.id || appData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newApp: AppItem = {
      ...appData,
      id: newId,
      downloads: appData.downloads || 0,
      updatedAt: new Date().toISOString().split('T')[0],
      screenshots: appData.screenshots || [],
      features: appData.features || [],
    };
    store.apps.push(newApp);
    this.addAuditLog('AetherOps Admin', 'APP_CREATE', `Created application: ${newApp.title}`);
    saveStore();
    return newApp;
  },

  updateApp(id: string, updates: Partial<AppItem>): AppItem {
    const index = store.apps.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error(`App with ID ${id} not found`);
    }
    store.apps[index] = {
      ...store.apps[index],
      ...updates,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    this.addAuditLog('AetherOps Admin', 'APP_UPDATE', `Updated application: ${store.apps[index].title}`);
    saveStore();
    return store.apps[index];
  },

  deleteApp(id: string): boolean {
    const app = store.apps.find(a => a.id === id);
    const initialLen = store.apps.length;
    store.apps = store.apps.filter(a => a.id !== id);
    if (store.apps.length !== initialLen) {
      this.addAuditLog('AetherOps Admin', 'APP_DELETE', `Deleted application: ${app?.title || id}`);
      saveStore();
      return true;
    }
    return false;
  },

  // Banner operations
  getBanners(activeOnly = true): BannerItem[] {
    if (activeOnly) return store.banners.filter(b => b.isActive);
    return store.banners;
  },

  createBanner(bannerData: Omit<BannerItem, 'id' | 'createdAt'>): BannerItem {
    const newBanner: BannerItem = {
      ...bannerData,
      id: `banner-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    store.banners.unshift(newBanner);
    this.addAuditLog('AetherOps Admin', 'BANNER_CREATE', `Created banner: ${newBanner.title}`);
    saveStore();
    return newBanner;
  },

  updateBanner(id: string, updates: Partial<BannerItem>): BannerItem {
    const index = store.banners.findIndex(b => b.id === id);
    if (index === -1) throw new Error(`Banner ${id} not found`);
    store.banners[index] = { ...store.banners[index], ...updates };
    this.addAuditLog('AetherOps Admin', 'BANNER_UPDATE', `Updated banner: ${store.banners[index].title}`);
    saveStore();
    return store.banners[index];
  },

  deleteBanner(id: string): boolean {
    const initialLen = store.banners.length;
    store.banners = store.banners.filter(b => b.id !== id);
    if (store.banners.length !== initialLen) {
      this.addAuditLog('AetherOps Admin', 'BANNER_DELETE', `Deleted banner ID: ${id}`);
      saveStore();
      return true;
    }
    return false;
  },

  // User & Subscription operations
  getSubscriptions(): UserSubscription[] {
    return store.subscriptions;
  },

  createSubscription(subData: Omit<UserSubscription, 'id' | 'joinedAt'> & { role?: any }): UserSubscription {
    const newSub: UserSubscription = {
      ...subData,
      role: subData.role || 'Member',
      id: `sub-${Date.now()}`,
      joinedAt: new Date().toISOString().split('T')[0],
    };
    store.subscriptions.unshift(newSub);

    // Automatically generate invoice if paid
    if (newSub.amountPaid > 0) {
      this.createInvoice({
        userId: newSub.id,
        userName: newSub.userName,
        userEmail: newSub.userEmail,
        planTier: newSub.planTier,
        amount: newSub.amountPaid,
        tax: Math.round(newSub.amountPaid * 0.1 * 100) / 100,
        total: Math.round(newSub.amountPaid * 1.1 * 100) / 100,
        paymentMethod: 'Credit Card',
        status: 'Paid',
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: new Date().toISOString().split('T')[0],
      });
    }

    this.addAuditLog('AetherOps Admin', 'MEMBER_CREATE', `Created member: ${newSub.userName} (${newSub.userEmail})`);
    saveStore();
    return newSub;
  },

  updateSubscription(id: string, updates: Partial<UserSubscription>): UserSubscription {
    const index = store.subscriptions.findIndex(s => s.id === id);
    if (index === -1) throw new Error(`Subscription ${id} not found`);
    store.subscriptions[index] = { ...store.subscriptions[index], ...updates };
    this.addAuditLog('AetherOps Admin', 'MEMBER_UPDATE', `Updated member: ${store.subscriptions[index].userName}`);
    saveStore();
    return store.subscriptions[index];
  },

  deleteSubscription(id: string): boolean {
    const sub = store.subscriptions.find(s => s.id === id);
    const initialLen = store.subscriptions.length;
    store.subscriptions = store.subscriptions.filter(s => s.id !== id);
    if (store.subscriptions.length !== initialLen) {
      this.addAuditLog('AetherOps Admin', 'MEMBER_DELETE', `Deleted member: ${sub?.userName || id}`);
      saveStore();
      return true;
    }
    return false;
  },

  // Invoice operations
  getInvoices(): InvoiceItem[] {
    return store.invoices;
  },

  createInvoice(invData: Omit<InvoiceItem, 'id' | 'invoiceNumber'> & { invoiceNumber?: string }): InvoiceItem {
    const newInvoice: InvoiceItem = {
      ...invData,
      id: `inv-${Date.now()}`,
      invoiceNumber: invData.invoiceNumber || `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    };
    store.invoices.unshift(newInvoice);
    this.addAuditLog('AetherOps Admin', 'INVOICE_CREATE', `Issued invoice ${newInvoice.invoiceNumber} for $${newInvoice.total}`);
    saveStore();
    return newInvoice;
  },

  updateInvoice(id: string, updates: Partial<InvoiceItem>): InvoiceItem {
    const index = store.invoices.findIndex(i => i.id === id);
    if (index === -1) throw new Error(`Invoice ${id} not found`);
    store.invoices[index] = { ...store.invoices[index], ...updates };
    this.addAuditLog('AetherOps Admin', 'INVOICE_UPDATE', `Updated invoice status: ${store.invoices[index].invoiceNumber}`);
    saveStore();
    return store.invoices[index];
  },

  deleteInvoice(id: string): boolean {
    const inv = store.invoices.find(i => i.id === id);
    const initialLen = store.invoices.length;
    store.invoices = store.invoices.filter(i => i.id !== id);
    if (store.invoices.length !== initialLen) {
      this.addAuditLog('AetherOps Admin', 'INVOICE_DELETE', `Deleted invoice: ${inv?.invoiceNumber || id}`);
      saveStore();
      return true;
    }
    return false;
  },

  // Support Ticket operations
  getTickets(): SupportTicket[] {
    return store.tickets;
  },

  createTicket(ticketData: Omit<SupportTicket, 'id' | 'createdAt' | 'status'>): SupportTicket {
    const newTicket: SupportTicket = {
      ...ticketData,
      id: `t-${Date.now().toString().slice(-4)}`,
      status: 'Open',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    store.tickets.unshift(newTicket);
    saveStore();
    return newTicket;
  },

  updateTicket(id: string, updates: Partial<SupportTicket>): SupportTicket {
    const index = store.tickets.findIndex(t => t.id === id);
    if (index === -1) throw new Error(`Ticket ${id} not found`);
    store.tickets[index] = { ...store.tickets[index], ...updates };
    this.addAuditLog('AetherOps Admin', 'TICKET_UPDATE', `Updated ticket status: ${id}`);
    saveStore();
    return store.tickets[index];
  },

  // System Settings operations
  getSettings(): SystemSettings {
    return store.settings;
  },

  updateSettings(updates: Partial<SystemSettings>): SystemSettings {
    store.settings = { ...store.settings, ...updates };
    this.addAuditLog('AetherOps Admin', 'SETTINGS_UPDATE', 'Updated system platform settings');
    saveStore();
    return store.settings;
  },

  // Audit Logs
  getAuditLogs(): AuditLog[] {
    return store.auditLogs;
  },

  addAuditLog(adminName: string, action: string, details: string, ipAddress = '127.0.0.1'): AuditLog {
    const log: AuditLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 100)}`,
      adminName,
      action,
      details,
      ipAddress,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };
    store.auditLogs.unshift(log);
    // Keep max 100 logs
    if (store.auditLogs.length > 100) store.auditLogs.pop();
    saveStore();
    return log;
  },

  // Analytics summary computation
  getAnalytics(): AnalyticsSummary {
    const totalDownloads = store.apps.reduce((sum, app) => sum + app.downloads, 0);
    const activeSubs = store.subscriptions.filter(s => s.status === 'Active');
    const monthlyRev = activeSubs.reduce((sum, s) => {
      if (s.billingCycle === 'Annual') return sum + (s.amountPaid / 12);
      return sum + s.amountPaid;
    }, 0);

    const paidInvoicesTotal = store.invoices
      .filter(i => i.status === 'Paid')
      .reduce((sum, i) => sum + i.total, 0);

    const planCounts: Record<string, { count: number; revenue: number }> = {
      Free: { count: 0, revenue: 0 },
      Pro: { count: 0, revenue: 0 },
      'Family/Enterprise': { count: 0, revenue: 0 },
    };

    store.subscriptions.forEach(s => {
      if (!planCounts[s.planTier]) planCounts[s.planTier] = { count: 0, revenue: 0 };
      planCounts[s.planTier].count += 1;
      planCounts[s.planTier].revenue += s.amountPaid;
    });

    const revenueByPlan = Object.entries(planCounts).map(([plan, data]) => ({
      plan,
      count: data.count,
      revenue: Math.round(data.revenue),
    }));

    const appPopularity = store.apps.map(app => ({
      appTitle: app.title,
      downloads: app.downloads,
      percentage: totalDownloads > 0 ? Math.round((app.downloads / totalDownloads) * 100) : 0,
    })).sort((a, b) => b.downloads - a.downloads);

    const dates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });

    const downloadsTrend = dates.map((date, idx) => ({
      date: date.slice(5),
      downloads: Math.floor(totalDownloads / 10 + (idx * 150) + Math.sin(idx) * 200),
    }));

    return {
      totalDownloads,
      totalAppsCount: store.apps.length,
      activeSubscriptions: activeSubs.length,
      monthlyRevenue: Math.round(monthlyRev),
      totalRegisteredUsers: store.subscriptions.length,
      openSupportTickets: store.tickets.filter(t => t.status !== 'Resolved').length,
      totalInvoicesCount: store.invoices.length,
      paidInvoicesTotal: Math.round(paidInvoicesTotal),
      downloadsTrend,
      revenueByPlan,
      appPopularity,
    };
  },
};
