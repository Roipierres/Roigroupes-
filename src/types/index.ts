export type AppCategory = 
  | 'Parental & Safety' 
  | 'Encrypted Communications' 
  | 'Automotive & Roadside' 
  | 'Cyber Security & Vault'
  | 'Utility & Hardware';

export interface AppScreenshot {
  id: string;
  title: string;
  description: string;
  type: 'map' | 'chat' | 'dispatch' | 'vault' | 'stats';
}

export interface AppFeature {
  id: string;
  title: string;
  detail: string;
  icon: string;
}

export interface AppItem {
  id: string;
  title: string;
  category: AppCategory;
  tagline: string;
  description: string;
  version: string;
  fileSize: string;
  minOs: string;
  apkUrl: string;
  downloads: number;
  rating: number;
  reviewsCount: number;
  badges: string[];
  iconType: 'shield' | 'lock' | 'wrench' | 'vault' | 'wifi' | 'zap';
  gradient: string;
  screenshots: AppScreenshot[];
  features: AppFeature[];
  isVisible: boolean;
  featured: boolean;
  updatedAt: string;
}

export interface BannerItem {
  id: string;
  title: string;
  message: string;
  ctaText?: string;
  ctaLink?: string;
  type: 'promo' | 'announcement' | 'warning' | 'feature';
  placement: 'top_bar' | 'inline_grid' | 'hero_bottom';
  isActive: boolean;
  appId?: string;
  createdAt: string;
}

export type UserRole = 'Super Admin' | 'Editor' | 'Support Specialist' | 'Member';
export type UserStatus = 'Active' | 'Pending' | 'Suspended' | 'Banned';

export interface UserSubscription {
  id: string;
  userName: string;
  userEmail: string;
  role: UserRole;
  planTier: 'Free' | 'Pro' | 'Family/Enterprise';
  status: UserStatus;
  billingCycle: 'Monthly' | 'Annual';
  amountPaid: number;
  joinedAt: string;
  expiresAt: string;
  lastLogin?: string;
}

export interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  planTier: string;
  amount: number;
  tax: number;
  total: number;
  paymentMethod: 'Credit Card' | 'PayPal' | 'Google Pay' | 'Bank Wire';
  status: 'Paid' | 'Pending' | 'Refunded' | 'Overdue';
  issueDate: string;
  dueDate: string;
}

export interface SupportTicket {
  id: string;
  userName: string;
  userEmail: string;
  subject: string;
  appId?: string;
  appName?: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  message: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  assignedTo?: string;
  responseNote?: string;
  createdAt: string;
}

export interface SystemSettings {
  portalName: string;
  maintenanceMode: boolean;
  allowPublicDownloads: boolean;
  forceTwoFactorAuth: boolean;
  requireEmailVerification: boolean;
  defaultPlanOnSignup: 'Free' | 'Pro' | 'Family/Enterprise';
  maxDownloadRateLimit: number;
  supportEmail: string;
  autoKeyRotationDays: number;
}

export interface AuditLog {
  id: string;
  adminName: string;
  action: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface AnalyticsSummary {
  totalDownloads: number;
  totalAppsCount: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  totalRegisteredUsers: number;
  openSupportTickets: number;
  totalInvoicesCount: number;
  paidInvoicesTotal: number;
  downloadsTrend: { date: string; downloads: number }[];
  revenueByPlan: { plan: string; count: number; revenue: number }[];
  appPopularity: { appTitle: string; downloads: number; percentage: number }[];
}

export interface AdminCredentials {
  email: string;
  token: string;
  name: string;
  role: UserRole;
}
