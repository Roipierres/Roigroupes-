import React, { useState } from 'react';
import { AppItem, AppCategory } from '../types';
import { AppIcon } from './AppIcon';
import { Download, Star, Eye, ShieldCheck, Filter, Smartphone } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { appTranslations } from '../i18n/translations';

interface AppsShowcaseGridProps {
  apps: AppItem[];
  onDownloadApp: (app: AppItem) => void;
  onOpenGallery: (app: AppItem) => void;
}

export const AppsShowcaseGrid: React.FC<AppsShowcaseGridProps> = ({
  apps,
  onDownloadApp,
  onOpenGallery,
}) => {
  const { lang, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [downloadingAppId, setDownloadingAppId] = useState<string | null>(null);

  const categories = [
    { id: 'All', label: t('allCategories') },
    { id: 'Parental & Safety', label: t('parentalCategory') },
    { id: 'Encrypted Communications', label: t('encryptedCategory') },
    { id: 'Automotive & Roadside', label: t('automotiveCategory') },
    { id: 'Cyber Security & Vault', label: t('cyberCategory') },
  ];

  const filteredApps = selectedCategory === 'All'
    ? apps
    : apps.filter(app => app.category === (selectedCategory as AppCategory));

  const handleDownloadClick = (app: AppItem) => {
    setDownloadingAppId(app.id);
    onDownloadApp(app);
    setTimeout(() => setDownloadingAppId(null), 1200);
  };

  const getLocalizedApp = (app: AppItem) => {
    if (lang === 'ar' && appTranslations[app.id]) {
      const tr = appTranslations[app.id];
      return {
        ...app,
        title: tr.title,
        category: tr.category,
        tagline: tr.tagline,
        description: tr.description,
        badges: tr.badges,
      };
    }
    return app;
  };

  return (
    <section id="apps" className="py-16 lg:py-24 bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-50 dark:bg-cyan-950/80 px-3 py-1 text-xs font-semibold text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
              <Smartphone size={14} />
              <span>{t('catalogBadge')}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {t('catalogTitle')}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl">
              {t('catalogDesc')}
            </p>
          </div>

          {/* Interactive Category Segmented Control */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0">
            <Filter size={14} className="mx-2 text-slate-400 hidden sm:inline shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid of Apps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {filteredApps.map((rawApp) => {
            const app = getLocalizedApp(rawApp);

            return (
              <div
                key={app.id}
                className="group relative flex flex-col justify-between rounded-3xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm hover:shadow-xl hover:border-blue-500/40 dark:hover:border-blue-500/40 transition-all duration-300"
              >
                
                <div className="space-y-5">
                  
                  {/* Header: App Icon + Title + Rating */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <AppIcon
                        iconType={app.iconType}
                        gradient={app.gradient}
                        className="w-14 h-14 shrink-0"
                        size={28}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {app.title}
                          </h3>
                        </div>
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 block mt-0.5">
                          {app.category}
                        </span>
                        
                        {/* Rating & Reviews */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
                          <div className="flex items-center text-amber-500">
                            <Star size={13} className="fill-amber-400 text-amber-400" />
                            <span className="mx-1 font-bold text-slate-800 dark:text-slate-200">{app.rating}</span>
                          </div>
                          <span>·</span>
                          <span>({app.reviewsCount.toLocaleString()} {t('reviewsLabel')})</span>
                          <span>·</span>
                          <span className="text-slate-400 font-mono">v{app.version}</span>
                        </div>
                      </div>
                    </div>

                    {app.featured && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 shrink-0">
                        {t('featuredBadge')}
                      </span>
                    )}
                  </div>

                  {/* Description & Tagline */}
                  <div className="space-y-2">
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                      {app.tagline}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                      {app.description}
                    </p>
                  </div>

                  {/* Badges List */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {app.badges.map((badge) => (
                      <span
                        key={badge}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-slate-200/60 dark:bg-slate-800/80 px-2.5 py-0.5 rounded-md border border-slate-300/50 dark:border-slate-700/50"
                      >
                        <ShieldCheck size={12} className="text-blue-500" />
                        <span>{badge}</span>
                      </span>
                    ))}
                  </div>

                  {/* Metadata Row */}
                  <div className="grid grid-cols-3 gap-2 py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">{t('fileSizeLabel')}</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">{app.fileSize}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">{t('requirementLabel')}</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{app.minOs}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">{t('updatedLabel')}</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{app.updatedAt}</span>
                    </div>
                  </div>

                </div>

                {/* Card Footer: Real-time Download Counter & Action Buttons */}
                <div className="mt-6 pt-5 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                  
                  {/* Dynamic Counter */}
                  <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-3 bg-blue-50/80 dark:bg-blue-950/40 px-3.5 py-2 rounded-xl border border-blue-200/60 dark:border-blue-900/50">
                    <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                      {t('downloadsLabel')}
                    </div>
                    <div className={`text-base font-extrabold font-mono text-blue-700 dark:text-cyan-300 transition-all duration-300 ${downloadingAppId === app.id ? 'scale-110 text-emerald-500' : ''}`}>
                      {app.downloads.toLocaleString()}
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="w-full sm:w-auto flex items-center gap-2">
                    <button
                      onClick={() => onOpenGallery(rawApp)}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-200/60 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors whitespace-nowrap"
                    >
                      <Eye size={15} />
                      <span>{t('previewAndFeatures')}</span>
                    </button>

                    <button
                      onClick={() => handleDownloadClick(rawApp)}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all transform active:scale-95 whitespace-nowrap"
                    >
                      <Download size={15} className={downloadingAppId === app.id ? 'animate-bounce' : ''} />
                      <span>{t('downloadApkBtn')}</span>
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
