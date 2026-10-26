import React from 'react';
import { ShieldCheck, Lock, Cpu, Server, CheckCircle2, Award, FileCode2 } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export const AboutSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-16 lg:py-24 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-200 border-t border-slate-200 dark:border-slate-800/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 dark:bg-blue-950/80 px-3.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <Award size={14} />
            <span>{t('aboutBadge')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {t('aboutTitle')}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {t('aboutDesc')}
          </p>
        </div>

        {/* Core Pillars Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Lock size={20} />
            </div>
            <h3 className="text-base font-bold">{t('pillar1Title')}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('pillar1Desc')}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <h3 className="text-base font-bold">{t('pillar2Title')}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('pillar2Desc')}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Cpu size={20} />
            </div>
            <h3 className="text-base font-bold">{t('pillar3Title')}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('pillar3Desc')}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Server size={20} />
            </div>
            <h3 className="text-base font-bold">{t('pillar4Title')}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('pillar4Desc')}
            </p>
          </div>

        </div>

        {/* Security Assurances Banner */}
        <div className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-indigo-800/50">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-3">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase">
                <FileCode2 size={16} />
                <span>{t('secGuarantee')}</span>
              </div>
              <h3 className="text-2xl font-bold">{t('secTitle')}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {t('secDesc')}
              </p>
            </div>

            <div className="md:col-span-4 flex flex-col gap-2.5 bg-slate-900/80 p-5 rounded-2xl border border-slate-800/80 text-xs">
              <div className="flex items-center gap-2 text-emerald-300">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>{t('shaChecksum')}</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-300">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>{t('virustotalClean')}</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-300">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>{t('inAppIntegrity')}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
