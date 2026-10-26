import React, { useState } from 'react';
import { AppItem } from '../types';
import { AppIcon } from './AppIcon';
import { Download, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { appTranslations } from '../i18n/translations';

interface HeroProps {
  apps: AppItem[];
  totalDownloads: number;
  onSelectApp: (app: AppItem) => void;
  onQuickDownload: (app: AppItem) => void;
}

export const Hero: React.FC<HeroProps> = ({ apps, totalDownloads, onSelectApp, onQuickDownload }) => {
  const { lang, t } = useLanguage();
  const activeHeroApp = apps[0] || null;
  const [selectedPreviewIndex, setSelectedPreviewIndex] = useState(0);
  const currentPreviewApp = apps[selectedPreviewIndex] || activeHeroApp;

  // Helper to translate app strings if in Arabic
  const getLocalizedApp = (app: AppItem | null) => {
    if (!app) return null;
    if (lang === 'ar' && appTranslations[app.id]) {
      const tr = appTranslations[app.id];
      return {
        ...app,
        title: tr.title,
        category: tr.category,
        tagline: tr.tagline,
        description: tr.description,
      };
    }
    return app;
  };

  const localizedPreviewApp = getLocalizedApp(currentPreviewApp);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white pt-12 pb-16 lg:pt-20 lg:pb-28">
      {/* Background ambient lighting glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Column 1: Headline & Action */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-start">
            
            {/* Ecosystem Verified Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1.5 text-xs font-medium text-blue-300 backdrop-blur-sm shadow-inner">
              <ShieldCheck size={16} className="text-blue-400" />
              <span>{t('officialPortalBadge')}</span>
              <span className="text-blue-400/50">·</span>
              <span className="font-bold text-cyan-300">
                {totalDownloads.toLocaleString()} {t('verifiedDownloads')}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.2]">
              {t('heroHeadline')} <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                {t('heroSubhead')}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="max-w-2xl text-base sm:text-lg text-slate-300 font-normal leading-relaxed mx-auto lg:mx-0">
              {t('heroDesc')}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#apps"
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5"
              >
                <span>{t('exploreApps')}</span>
                <ArrowRight size={18} className={lang === 'ar' ? 'rotate-180' : ''} />
              </a>

              {localizedPreviewApp && (
                <button
                  onClick={() => onQuickDownload(currentPreviewApp)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 px-5 py-3.5 text-sm font-medium text-slate-200 transition-colors"
                >
                  <Download size={18} className="text-cyan-400" />
                  <span>{t('downloadApk', { appName: localizedPreviewApp.title.split(' ')[0] })}</span>
                </button>
              )}
            </div>

            {/* Key Assurance Checks */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-xs text-slate-400 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span>{t('virusScanned')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span>{t('zeroTrackers')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span>{t('signedBuild')}</span>
              </div>
            </div>

          </div>

          {/* Column 2: Interactive Device Mockup */}
          <div className="lg:col-span-5 flex flex-col items-center">
            
            {/* Phone Shell */}
            <div className="relative w-full max-w-[320px] sm:max-w-[340px] rounded-[40px] border-4 border-slate-700/80 bg-slate-900 p-3 shadow-2xl shadow-blue-900/40 ring-1 ring-white/10 backdrop-blur-xl">
              
              {/* Camera notch */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-950 rounded-full z-20 flex items-center justify-center">
                <div className="w-3 h-3 bg-slate-900 rounded-full border border-slate-800" />
              </div>

              {/* Screen Content */}
              <div className="relative rounded-[30px] bg-slate-950 overflow-hidden pt-8 pb-5 px-4 space-y-4 border border-slate-800/80">
                
                {/* Header in Phone */}
                <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800/60">
                  <span className="font-semibold text-slate-200">RG OS v4.0</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] text-emerald-400 font-mono">ENCRYPTED</span>
                  </div>
                </div>

                {/* Active App Card in Phone */}
                {localizedPreviewApp && (
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <AppIcon
                        iconType={localizedPreviewApp.iconType}
                        gradient={localizedPreviewApp.gradient}
                        className="w-12 h-12 shrink-0"
                        size={22}
                      />
                      <div>
                        <h2 className="text-sm font-bold text-white leading-tight">{localizedPreviewApp.title}</h2>
                        <span className="text-[11px] text-blue-400 font-medium">{localizedPreviewApp.category}</span>
                        <div className="text-[10px] text-slate-400 mt-0.5">v{localizedPreviewApp.version} · {localizedPreviewApp.fileSize}</div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-snug bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/50">
                      {localizedPreviewApp.tagline}
                    </p>

                    {/* App Counter in Phone */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-950/40 border border-blue-800/40">
                      <div className="text-[11px]">
                        <span className="text-slate-400 block text-[10px]">{t('realTimeDownloads')}</span>
                        <span className="text-sm font-extrabold text-cyan-300 font-mono">
                          {localizedPreviewApp.downloads.toLocaleString()}
                        </span>
                      </div>
                      <button
                        onClick={() => onQuickDownload(currentPreviewApp)}
                        className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-colors"
                      >
                        <Download size={12} />
                        <span>{t('getApk')}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* App Selector Tabs inside phone */}
                <div className="pt-2">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">{t('switchPreview')}</div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {apps.slice(0, 3).map((app, idx) => {
                      const locApp = getLocalizedApp(app);
                      return (
                        <button
                          key={app.id}
                          onClick={() => setSelectedPreviewIndex(idx)}
                          className={`p-2 rounded-xl text-start border transition-all ${
                            selectedPreviewIndex === idx
                              ? 'bg-blue-600/30 border-blue-500 text-white'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <div className="text-[10px] font-bold truncate">{locApp?.title.split(' ')[0]}</div>
                          <div className="text-[9px] text-slate-400 font-mono">{app.downloads.toLocaleString()}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Global Metric Summary Strip below hero */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md">
          <div className="text-center md:text-start border-e border-slate-800/80 last:border-0 pe-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {totalDownloads.toLocaleString()}+
            </div>
            <div className="text-xs text-slate-400 font-medium mt-1">{t('ecosystemApkDownloads')}</div>
          </div>

          <div className="text-center md:text-start border-e border-slate-800/80 last:border-0 pe-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">
              {apps.length} {t('verifiedAppsCount')}
            </div>
            <div className="text-xs text-slate-400 font-medium mt-1">{t('activeMobileApps')}</div>
          </div>

          <div className="text-center md:text-start border-e border-slate-800/80 last:border-0 pe-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
              99.99%
            </div>
            <div className="text-xs text-slate-400 font-medium mt-1">{t('infrastructureUptime')}</div>
          </div>

          <div className="text-center md:text-start">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
              4.9 / 5.0
            </div>
            <div className="text-xs text-slate-400 font-medium mt-1">{t('averageRating')}</div>
          </div>
        </div>

      </div>
    </section>
  );
};
