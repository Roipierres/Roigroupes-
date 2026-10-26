import React from 'react';
import { ShieldCheck, Lock, Terminal } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface FooterProps {
  onNavigateAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateAdmin }) => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800/80 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white">
                <ShieldCheck size={18} />
              </div>
              <span>{t('brandName')} {t('ecosystemBadge')}</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              {t('footerDesc')}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <div className="text-white font-bold text-xs uppercase tracking-wider">{t('footerAppsTitle')}</div>
            <ul className="space-y-1.5 text-slate-400">
              <li><a href="#apps" className="hover:text-white transition-colors">GuardianShield Safety</a></li>
              <li><a href="#apps" className="hover:text-white transition-colors">CipherVault Messenger</a></li>
              <li><a href="#apps" className="hover:text-white transition-colors">AutoRescue Mechanic</a></li>
              <li><a href="#apps" className="hover:text-white transition-colors">CyberVault Passkey</a></li>
            </ul>
          </div>

          {/* Security & Legal */}
          <div className="space-y-2">
            <div className="text-white font-bold text-xs uppercase tracking-wider">{t('footerSecurityTitle')}</div>
            <ul className="space-y-1.5 text-slate-400">
              <li className="flex items-center gap-1.5 text-slate-300">
                <Lock size={12} className="text-emerald-400" />
                <span>Zero-Knowledge Policy</span>
              </li>
              <li><a href="#about" className="hover:text-white transition-colors">VirusTotal Inspection</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">30-Day Refund Guarantee</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">Security Disclosures</a></li>
            </ul>
          </div>

          {/* Portal Management */}
          <div className="space-y-3">
            <div className="text-white font-bold text-xs uppercase tracking-wider">{t('footerAdminTitle')}</div>
            <p className="text-slate-400 text-xs">
              {t('adminDesc')}
            </p>
            <button
              onClick={onNavigateAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 hover:text-white hover:border-blue-500 text-xs font-semibold transition-colors"
            >
              <Terminal size={14} className="text-cyan-400" />
              <span>{t('adminDashboardBtn')}</span>
            </button>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            ROI Groupes© 2023
          </div>
          <div className="flex items-center gap-4">
            <a href="#about" className="hover:text-slate-300">{t('privacyAssurance')}</a>
            <span>·</span>
            <a href="#about" className="hover:text-slate-300">{t('termsOfService')}</a>
            <span>·</span>
            <a href="#contact" className="hover:text-slate-300">{t('supportHotline')}</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
