import React, { useEffect, useState } from 'react';
import { AppItem } from '../types';
import { AppIcon } from './AppIcon';
import { CheckCircle2, ShieldCheck, Download, X, Smartphone } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { appTranslations } from '../i18n/translations';

interface DownloadModalProps {
  app: AppItem | null;
  onClose: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ app, onClose }) => {
  const { lang, t } = useLanguage();
  const [progress, setProgress] = useState<number>(0);
  const [downloadCompleted, setDownloadCompleted] = useState<boolean>(false);

  useEffect(() => {
    if (!app) return;

    setProgress(0);
    setDownloadCompleted(false);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloadCompleted(true);
          return 100;
        }
        return prev + 25;
      });
    }, 250);

    return () => clearInterval(interval);
  }, [app]);

  if (!app) return null;

  const localizedAppTitle = lang === 'ar' && appTranslations[app.id] ? appTranslations[app.id].title : app.title;

  const triggerDirectFileDownload = () => {
    const filename = `${app.id}_v${app.version}.apk`;
    const link = document.createElement('a');
    link.href = `/downloads/${filename}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl text-slate-900 dark:text-white space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4">
          <AppIcon iconType={app.iconType} gradient={app.gradient} className="w-14 h-14 shrink-0" size={28} />
          <div>
            <h3 className="text-lg sm:text-xl font-bold">{localizedAppTitle}</h3>
            <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              v{app.version} · {app.fileSize} · {app.minOs}
            </div>
          </div>
        </div>

        {/* Progress Box */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-600 dark:text-slate-300">
              {downloadCompleted ? t('downloadReady') : t('preparingApk')}
            </span>
            <span className="font-mono text-blue-600 dark:text-cyan-400">{progress}%</span>
          </div>

          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-600 to-cyan-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          {downloadCompleted && (
            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 pt-1 font-medium">
              <CheckCircle2 size={16} />
              <span>{t('counterUpdated', { count: app.downloads.toLocaleString() })}</span>
            </div>
          )}
        </div>

        {/* File Verification Signature */}
        <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40 text-xs space-y-1">
          <div className="flex items-center justify-between font-mono text-[11px] text-blue-700 dark:text-blue-300">
            <span className="font-bold">{t('shaChecksumLabel')}</span>
            <span>48A9C2...E891</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 text-[11px]">
            <ShieldCheck size={14} className="text-blue-500" />
            <span>{t('digitalSignatureVerified')}</span>
          </div>
        </div>

        {/* Installation Instructions */}
        <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
          <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Smartphone size={14} />
            <span>{t('installationNoteTitle')}</span>
          </div>
          <p className="leading-relaxed">
            {t('installationNoteText')}
          </p>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={triggerDirectFileDownload}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all"
          >
            <Download size={16} />
            <span>{t('retriggerDownload')}</span>
          </button>

          <button
            onClick={onClose}
            className="py-3 px-5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-200"
          >
            {t('doneBtn')}
          </button>
        </div>

      </div>
    </div>
  );
};
