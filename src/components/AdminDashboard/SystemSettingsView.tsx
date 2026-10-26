import React, { useState } from 'react';
import { SystemSettings } from '../../types';
import { Save, ShieldAlert, Key, Globe, Lock, Bell, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface SystemSettingsViewProps {
  settings: SystemSettings | null;
  onRefresh: () => void;
}

export const SystemSettingsView: React.FC<SystemSettingsViewProps> = ({ settings, onRefresh }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<SystemSettings>(settings || {
    portalName: 'AetherOps Mobile Ecosystem Portal',
    maintenanceMode: false,
    allowPublicDownloads: true,
    forceTwoFactorAuth: true,
    requireEmailVerification: true,
    defaultPlanOnSignup: 'Free',
    maxDownloadRateLimit: 100,
    supportEmail: 'support@aetherops.io',
    autoKeyRotationDays: 30,
  });

  const [isSaved, setIsSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
        onRefresh();
      }
    } catch (err) {
      console.error('Failed to update system settings:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('settingsTitle')}</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {t('settingsDesc')}
        </p>
      </div>

      {isSaved && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-3 font-semibold">
          <CheckCircle2 size={18} className="text-emerald-500" />
          <span>Platform settings updated successfully! All security policies and maintenance rules are active.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* General Portal Settings */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold flex items-center gap-2">
            <Globe size={18} className="text-blue-600 dark:text-cyan-400" />
            <span>General Portal Configurations</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Portal Platform Title</label>
              <input
                type="text"
                value={formData.portalName}
                onChange={(e) => setFormData({ ...formData, portalName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Support Desk Contact Email</label>
              <input
                type="email"
                value={formData.supportEmail}
                onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Security & Access Policies */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold flex items-center gap-2">
            <Lock size={18} className="text-purple-600 dark:text-purple-400" />
            <span>Security & Maintenance Policies</span>
          </h3>

          <div className="space-y-3 text-xs">
            
            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">System Maintenance Mode</span>
                <span className="text-slate-500 text-[11px]">Temporarily lock public downloads and display maintenance banner.</span>
              </div>
              <input
                type="checkbox"
                checked={formData.maintenanceMode}
                onChange={(e) => setFormData({ ...formData, maintenanceMode: e.target.checked })}
                className="w-5 h-5 rounded accent-blue-600 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Enforce Two-Factor Authentication (2FA)</span>
                <span className="text-slate-500 text-[11px]">Require mandatory 2FA OTP verification for all admin logins.</span>
              </div>
              <input
                type="checkbox"
                checked={formData.forceTwoFactorAuth}
                onChange={(e) => setFormData({ ...formData, forceTwoFactorAuth: e.target.checked })}
                className="w-5 h-5 rounded accent-blue-600 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Public Unregistered APK Downloads</span>
                <span className="text-slate-500 text-[11px]">Allow visitors to download APK releases without logging in.</span>
              </div>
              <input
                type="checkbox"
                checked={formData.allowPublicDownloads}
                onChange={(e) => setFormData({ ...formData, allowPublicDownloads: e.target.checked })}
                className="w-5 h-5 rounded accent-blue-600 cursor-pointer"
              />
            </label>

          </div>
        </div>

        {/* Key Rotation & Rate Limits */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold flex items-center gap-2">
            <Key size={18} className="text-emerald-600 dark:text-emerald-400" />
            <span>Cryptographic Key Rotation & Rate Limits</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Auto Master Key Rotation Schedule (Days)</label>
              <input
                type="number"
                value={formData.autoKeyRotationDays}
                onChange={(e) => setFormData({ ...formData, autoKeyRotationDays: parseInt(e.target.value) || 30 })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Max Download API Rate Limit (Req/Min/IP)</label>
              <input
                type="number"
                value={formData.maxDownloadRateLimit}
                onChange={(e) => setFormData({ ...formData, maxDownloadRateLimit: parseInt(e.target.value) || 100 })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-2"
        >
          <Save size={16} />
          <span>{isSubmitting ? 'Saving Configurations...' : t('saveSettingsBtn')}</span>
        </button>

      </form>

    </div>
  );
};
