import React, { useState } from 'react';
import { AppItem, AppScreenshot } from '../types';
import { AppIcon } from './AppIcon';
import { X, MapPin, Send, ShieldCheck, CheckCircle2, Lock, Activity } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { appTranslations } from '../i18n/translations';

interface AppGalleryModalProps {
  app: AppItem | null;
  onClose: () => void;
  onDownload: (app: AppItem) => void;
}

export const AppGalleryModal: React.FC<AppGalleryModalProps> = ({ app, onClose, onDownload }) => {
  const { lang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'screenshots' | 'features'>('screenshots');
  const [selectedScreenshotIndex, setSelectedScreenshotIndex] = useState(0);

  // Chat interactive state for CipherVault simulation
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'peer'; text: string; time: string }>>([
    { sender: 'peer', text: lang === 'ar' ? 'تم الفحص والتحقق من التشفير. الجلسة نشطة.' : 'Quantum key exchange verified. Session active.', time: '02:14' },
    { sender: 'user', text: lang === 'ar' ? 'جاري إرسال إحداثيات الموقع المشفرة.' : 'Transmitting encrypted location coordinates.', time: '02:15' },
  ]);
  const [inputText, setInputText] = useState('');

  if (!app) return null;

  const localizedAppTitle = lang === 'ar' && appTranslations[app.id] ? appTranslations[app.id].title : app.title;
  const localizedAppCategory = lang === 'ar' && appTranslations[app.id] ? appTranslations[app.id].category : app.category;

  const currentScreenshot: AppScreenshot | undefined = app.screenshots[selectedScreenshotIndex] || app.screenshots[0];

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    setChatMessages(prev => [
      ...prev,
      { sender: 'user', text: inputText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    setInputText('');
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        { sender: 'peer', text: lang === 'ar' ? 'تم استلام الرسالة وتشفيرها بمفتاح Double-Ratchet.' : 'Message received and encrypted with Double-Ratchet key.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-4xl my-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl text-slate-900 dark:text-white space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-full transition-colors"
        >
          <X size={22} />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5 pr-8">
          <div className="flex items-center gap-4">
            <AppIcon iconType={app.iconType} gradient={app.gradient} className="w-14 h-14 shrink-0" size={28} />
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">{localizedAppTitle}</h2>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">{localizedAppCategory} · {t('interactivePreview')}</p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0">
            <button
              onClick={() => setActiveTab('screenshots')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'screenshots'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {t('screenshotsTab')} ({app.screenshots.length})
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'features'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {t('coreFeaturesTab')} ({app.features.length})
            </button>
          </div>
        </div>

        {/* Content Area */}
        {activeTab === 'screenshots' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Phone Screen Interactive Representation */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-[280px] rounded-[36px] border-4 border-slate-800 bg-slate-950 p-2.5 shadow-xl ring-1 ring-white/10">
                <div className="rounded-[28px] bg-slate-900 border border-slate-800 overflow-hidden min-h-[380px] p-3 flex flex-col justify-between text-xs">
                  
                  {/* Phone Status Bar */}
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pb-2 border-b border-slate-800">
                    <span className="font-semibold text-slate-200">{app.title.split(' ')[0]} HUD</span>
                    <span className="text-emerald-400 font-mono">SECURE</span>
                  </div>

                  {/* Interactive Screen Content based on app type */}
                  <div className="my-auto py-2 space-y-3">
                    
                    {currentScreenshot?.type === 'map' && (
                      <div className="space-y-2">
                        <div className="h-36 rounded-xl bg-slate-950 border border-blue-900/50 p-3 relative flex flex-col justify-between overflow-hidden">
                          <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:12px_12px] opacity-40" />
                          <div className="relative z-10 flex justify-between items-center text-[10px]">
                            <span className="bg-blue-600 text-white px-2 py-0.5 rounded font-bold">GEOFENCE ACTIVE</span>
                            <span className="text-cyan-300 font-mono">GPS 37.7749, -122.4194</span>
                          </div>
                          <div className="relative z-10 mx-auto w-10 h-10 rounded-full border-2 border-cyan-400/80 bg-blue-500/20 flex items-center justify-center animate-ping">
                            <MapPin size={18} className="text-cyan-300" />
                          </div>
                          <div className="relative z-10 text-[10px] text-slate-300 font-medium text-center bg-slate-900/90 py-1 rounded border border-slate-800">
                            {lang === 'ar' ? 'منطقة آمنة: مدرسة اللينكولن الثانوية' : 'Safe Zone: Lincoln High School'}
                          </div>
                        </div>
                      </div>
                    )}

                    {currentScreenshot?.type === 'chat' && (
                      <div className="space-y-2 max-h-[220px] overflow-y-auto">
                        <div className="text-[10px] text-center text-slate-500 font-mono">DOUBLE RATCHET E2EE SESSION</div>
                        {chatMessages.map((msg, idx) => (
                          <div
                            key={idx}
                            className={`p-2 rounded-xl text-[11px] max-w-[85%] ${
                              msg.sender === 'user'
                                ? 'bg-blue-600 text-white ms-auto rounded-br-none'
                                : 'bg-slate-800 text-slate-200 me-auto rounded-bl-none'
                            }`}
                          >
                            <div className="break-words">{msg.text}</div>
                            <div className="text-[8px] opacity-70 text-end mt-0.5">{msg.time}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {currentScreenshot?.type === 'dispatch' && (
                      <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/50 space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-amber-300 font-bold">
                          <span>{lang === 'ar' ? 'طوارئ الطريق' : 'EMERGENCY DISPATCH'}</span>
                          <span className="text-emerald-400">ETA 8 MINS</span>
                        </div>
                        <div className="text-[10px] text-slate-300">
                          {lang === 'ar' ? 'الميكانيكي المعتمد: ماركوس ف. (شاحنة سحب #102)' : 'Certified Tow Operator: Marcus V. (Flatbed Truck #102)'}
                        </div>
                        <div className="w-full bg-amber-500/20 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-amber-400 h-full w-3/4 rounded-full" />
                        </div>
                      </div>
                    )}

                    {currentScreenshot?.type === 'vault' && (
                      <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-800/50 text-center space-y-2">
                        <div className="w-10 h-10 mx-auto rounded-full bg-purple-600/30 text-purple-300 flex items-center justify-center">
                          <Lock size={20} />
                        </div>
                        <div className="text-[11px] font-bold text-purple-200">Biometric Passkey Vault</div>
                        <div className="text-[10px] text-slate-400">Zero-Knowledge Hardware Key Authenticated</div>
                      </div>
                    )}

                    {currentScreenshot?.type === 'stats' && (
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                        <div className="text-[11px] font-bold text-slate-200 flex items-center justify-between">
                          <span>System Telemetry</span>
                          <Activity size={12} className="text-emerald-400" />
                        </div>
                        <div className="grid grid-cols-2 gap-1 text-[10px]">
                          <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                            <span className="text-slate-400 block">Encrypted Memory</span>
                            <span className="font-mono text-cyan-300 font-bold">14.2 MB</span>
                          </div>
                          <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                            <span className="text-slate-400 block">Battery Drain</span>
                            <span className="font-mono text-emerald-400 font-bold">&lt; 0.5%/hr</span>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Interactive controls inside chat phone */}
                  {currentScreenshot?.type === 'chat' && (
                    <div className="flex gap-1 pt-2 border-t border-slate-800">
                      <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder={t('typeMessagePlaceholder')}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-[10px] text-white focus:outline-none focus:border-blue-500"
                      />
                      <button
                        onClick={handleSendMessage}
                        className="bg-blue-600 text-white p-1 rounded-lg shrink-0"
                      >
                        <Send size={12} className={lang === 'ar' ? 'rotate-180' : ''} />
                      </button>
                    </div>
                  )}

                  <div className="text-[9px] text-slate-500 text-center font-mono">
                    {t('touchScreenInteractive')}
                  </div>

                </div>
              </div>
            </div>

            {/* Right Column: Screenshot Selector List */}
            <div className="lg:col-span-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t('selectScreenView')}
              </h3>

              <div className="space-y-2.5">
                {app.screenshots.map((screen, idx) => (
                  <button
                    key={screen.id}
                    onClick={() => setSelectedScreenshotIndex(idx)}
                    className={`w-full text-start p-4 rounded-2xl border transition-all ${
                      selectedScreenshotIndex === idx
                        ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 dark:border-blue-500 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{screen.title}</h4>
                      {selectedScreenshotIndex === idx && (
                        <CheckCircle2 size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      {screen.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

          </div>
        ) : (
          /* Features Breakdown List */
          <div className="space-y-4">
            <h3 className="text-base font-bold">{t('engineeredFeatures')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {app.features.map((feat) => (
                <div
                  key={feat.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400">
                    <ShieldCheck size={16} />
                    <span>{feat.title}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feat.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            {t('directDownloadAvailable')}
          </div>
          <button
            onClick={() => {
              onClose();
              onDownload(app);
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all"
          >
            {t('downloadApkBtn')}
          </button>
        </div>

      </div>
    </div>
  );
};
