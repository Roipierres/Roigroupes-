import React, { useState } from 'react';
import { AppItem } from '../types';
import { Send, CheckCircle2, MessageSquare, ChevronDown, HelpCircle, LifeBuoy } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { appTranslations } from '../i18n/translations';

interface ContactSectionProps {
  apps: AppItem[];
}

export const ContactSection: React.FC<ContactSectionProps> = ({ apps }) => {
  const { lang, t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [appId, setAppId] = useState('');
  const [severity, setSeverity] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) return;

    setIsSubmitting(true);
    const selectedApp = apps.find(a => a.id === appId);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: name,
          userEmail: email,
          appId: appId || undefined,
          appName: selectedApp ? selectedApp.title : t('generalInquiry'),
          severity,
          subject,
          message,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsSubmitted(true);
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
        setTimeout(() => setIsSubmitted(false), 5000);
      }
    } catch (err) {
      console.error('Contact submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = lang === 'ar' ? [
    {
      q: 'كيف يمكنني تثبيت ملف الـ APK على أجهزة أندرويد؟',
      a: 'بعد الضغط على زر تحميل الـ APK، افتح مدير الملفات أو مجلد التنزيلات على جهازك، وانقر على ملف الـ APK. إذا ظهرت لك شاشة تنبيه، قم بتفعيل خيار "السماح بالتثبيت من هذا المصدر" في إعدادات المتصفح.',
    },
    {
      q: 'هل ملفات الـ APK آمنة وخالية من الفيروسات؟',
      a: 'نعم 100%. يتم تجميع جميع النسخ من المصدر وتوقيعها رقمياً بمفتاح الأمان الخاص بنا، ويتم فحصها بواسطة أكثر من 70 مضاد فيروسات عبر VirusTotal.',
    },
    {
      q: 'هل يمكنني استخدام اشتراكي في أكثر من جهاز؟',
      a: 'نعم. بمجرد الاشتراك، سجل الدخول ببريدك الإلكتروني داخل أي تطبيق من تطبيقات إيثير أوبس ليتزامن ترخيصك تلقائياً عبر جميع أجهزتك المصرح لها.',
    },
    {
      q: 'ماذا أفعل إذا كانت خدمة الميكانيكي غير متاحة في منطقتي الجغرافية؟',
      a: 'تعمل خدمة AutoRescue عبر تغطية شاملة. إذا كنت في منطقة نائية، سيقوم خط الطوارئ بتوجيه أقرب شاحنة سحب شريكة لك في غضون 30 دقيقة.',
    },
  ] : [
    {
      q: 'How do I install the APK file on my Android device?',
      a: 'After clicking Download APK, open your Android File Manager or Downloads folder. Tap the .apk file. If prompted, toggle "Allow from this source" in your browser/file manager settings to grant installation permissions.',
    },
    {
      q: 'Are these APK downloads safe and free of malware?',
      a: 'Yes, 100%. All binaries on AetherOps Portal are compiled directly from clean source repositories, cryptographically signed with our CA key, and scanned against 70+ antiviruses via VirusTotal.',
    },
    {
      q: 'Can I transfer my Pro/Family subscription across multiple phones?',
      a: 'Yes. Once subscribed, log in with your email inside any AetherOps mobile app. Your license will automatically restore and synchronize across all your authorized devices.',
    },
    {
      q: 'What should I do if Roadside Mechanic Dispatch is unavailable in my area?',
      a: 'AutoRescue operates across North America and Europe. If you are in a remote region without live mechanic GPS radar, our 24/7 hotline dispatch will coordinate an emergency partner truck within 30 minutes.',
    },
  ];

  return (
    <section id="contact" className="py-16 lg:py-24 bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Title */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-50 dark:bg-cyan-950/80 px-3.5 py-1 text-xs font-semibold text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
            <LifeBuoy size={14} />
            <span>{t('supportBadge')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {t('supportTitle')}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            {t('supportDesc')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Contact Form Column */}
          <div className="lg:col-span-7 rounded-3xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <MessageSquare size={18} className="text-blue-600 dark:text-blue-400" />
              <span>{t('submitInquiryTitle')}</span>
            </h3>

            {isSubmitted && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-3">
                <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
                <span>{t('ticketSubmitted')}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">{t('yourName')}</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alexander Wright"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">{t('emailLabel')}</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">{t('targetApp')}</label>
                  <select
                    value={appId}
                    onChange={(e) => setAppId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">{t('generalInquiry')}</option>
                    {apps.map((app) => (
                      <option key={app.id} value={app.id}>
                        {lang === 'ar' && appTranslations[app.id] ? appTranslations[app.id].title : app.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">{t('severityLevel')}</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Low">{t('severityLow')}</option>
                    <option value="Medium">{t('severityMed')}</option>
                    <option value="High">{t('severityHigh')}</option>
                    <option value="Critical">{t('severityCritical')}</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">{t('subjectLabel')}</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Question regarding OBD-II Bluetooth adapter"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">{t('messageDetails')}</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Provide details about your query..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 hover:from-blue-500 hover:to-cyan-500 transition-all flex items-center justify-center gap-2"
              >
                <Send size={14} className={lang === 'ar' ? 'rotate-180' : ''} />
                <span>{isSubmitting ? t('submittingTicket') : t('sendInquiry')}</span>
              </button>

            </form>
          </div>

          {/* FAQ Column */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <HelpCircle size={18} className="text-cyan-500" />
              <span>{t('faqTitle')}</span>
            </h3>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                    className="w-full text-start p-4 text-xs font-bold flex items-center justify-between text-slate-900 dark:text-white"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${openFaqIndex === idx ? 'rotate-180 text-blue-500' : 'text-slate-400'}`}
                    />
                  </button>
                  {openFaqIndex === idx && (
                    <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-200/50 dark:border-slate-800/50 pt-2">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
