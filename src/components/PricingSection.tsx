import React, { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface PricingSectionProps {
  onSubscribePlan: (planTier: 'Free' | 'Pro' | 'Family/Enterprise', billingCycle: 'Monthly' | 'Annual', price: number) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSubscribePlan }) => {
  const { lang, t } = useLanguage();
  const [billingCycle, setBillingCycle] = useState<'Monthly' | 'Annual'>('Annual');

  const isAnnual = billingCycle === 'Annual';

  const plans = [
    {
      tier: 'Free' as const,
      name: t('freePlanName'),
      badge: t('essentialBadge'),
      monthlyPrice: 0,
      annualPrice: 0,
      description: lang === 'ar' ? 'مثالية للأفراد لتجربة GuardianShield و CipherVault على جهاز واحد.' : 'Ideal for individuals trying out GuardianShield and CipherVault with single-device safety.',
      features: lang === 'ar' ? [
        'تحميل مباشر للـ APK لجميع التطبيقات',
        'تنبيهات النطاق الجغرافي (منطقة آمنة واحدة)',
        'رسائل مشفرة E2EE (حتى 100 رسالة/يوم)',
        'فحص أعطال المحرك الأساسي OBD-II',
        'دعم المجتمع الافتراضي',
      ] : [
        'Direct APK downloads for all apps',
        'Standard geofence alerts (1 safe zone)',
        'E2EE messaging (up to 100 msgs/day)',
        'Basic OBD-II diagnostic fault code scanner',
        'Standard community support',
      ],
      popular: false,
      ctaText: t('getStartedFree'),
    },
    {
      tier: 'Pro' as const,
      name: t('proPlanName'),
      badge: t('popularBadge'),
      monthlyPrice: 9.99,
      annualPrice: 89.99,
      description: lang === 'ar' ? 'وصول كامل بدون قيود لجميع التطبيقات الأربعة مع أولوية الاتصال بالطوارئ.' : 'Full unrestricted power across all 4 mobile apps with zero limits and priority network relay.',
      features: lang === 'ar' ? [
        'تحديثات تنزيل لا محدودة وأولوية التحميل',
        'مناطق آمنة وتنبيهات SOS غير محدودة',
        'رسائل مشفرة غير محدودة بترديد مزدوج',
        'أولوية إرسال الميكانيكي المتنقل والطوارئ',
        'خزنة كلمات المرور البيومترية الشاملة',
        'سياسة عدم حفظ أية بيانات وصفية',
      ] : [
        'Unlimited APK updates & priority downloads',
        'Unlimited GuardianShield safe zones & SOS',
        'Unlimited Double-Ratchet E2EE messaging',
        'Sub-15 min priority roadside mechanic dispatch',
        'Complete CyberVault Passkey & Breach Scanner',
        'Zero metadata retention assurance',
      ],
      popular: true,
      ctaText: t('upgradePro'),
    },
    {
      tier: 'Family/Enterprise' as const,
      name: t('familyPlanName'),
      badge: t('maxValueBadge'),
      monthlyPrice: 19.99,
      annualPrice: 149.99,
      description: lang === 'ar' ? 'حماية حتى 10 أفراد أو أسطول سائقين مع إدارة مركزية وخط طوارئ 24/7.' : 'Protect up to 10 family members or fleet drivers with central management & dedicated 24/7 hotline.',
      features: lang === 'ar' ? [
        'يتضمن جميع ميزات الباقة الاحترافية Pro',
        'تراخيص حتى 10 أفراد / أجهزة عائلية',
        'لوحة تحكم عائلية مركزية في GuardianShield',
        'خط ساخن طارئ للخدمات على الطريق 24/7',
        'تدوير مفاتيح التشفير للمؤسسات مع سجلات تدقيق',
        'مهندس دعم فني مخصص للرد المباشر',
      ] : [
        'Everything in Pro Tier included',
        'Up to 10 family member / device licenses',
        'Centralized GuardianShield parental dashboard',
        '24/7 VIP Emergency Roadside Hotline',
        'Enterprise key rotation & audit logs',
        'Dedicated 1-on-1 technical support engineer',
      ],
      popular: false,
      ctaText: t('subscribeFamily'),
    },
  ];

  return (
    <section id="pricing" className="py-16 lg:py-24 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-200 border-t border-slate-200 dark:border-slate-800/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 dark:bg-blue-950/80 px-3.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <Sparkles size={14} />
            <span>{t('plansBadge')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {t('plansTitle')}
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300">
            {t('plansDesc')}
          </p>

          {/* Billing Toggle */}
          <div className="pt-2 flex items-center justify-center gap-3">
            <div className="inline-flex items-center p-1.5 rounded-2xl bg-slate-200/80 dark:bg-slate-900 border border-slate-300/80 dark:border-slate-800 text-xs font-semibold">
              <button
                onClick={() => setBillingCycle('Monthly')}
                className={`px-4 py-2 rounded-xl transition-all ${
                  !isAnnual
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t('monthlyBilling')}
              </button>
              <button
                onClick={() => setBillingCycle('Annual')}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  isAnnual
                    ? 'bg-blue-600 text-white shadow-sm font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{t('annualBilling')}</span>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
                  {t('saveDiscount')}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => {
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;

            return (
              <div
                key={plan.tier}
                className={`relative flex flex-col justify-between rounded-3xl p-6 sm:p-8 transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white border-2 border-blue-500 shadow-xl shadow-blue-500/10 scale-102'
                    : 'bg-white dark:bg-slate-900/90 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md'
                }`}
              >
                
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-[10px] font-extrabold uppercase tracking-widest px-3.5 py-1 rounded-full shadow-md whitespace-nowrap">
                    {t('recommendedChoice')}
                  </div>
                )}

                <div className="space-y-6">
                  
                  {/* Header */}
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold">{plan.name}</h3>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${
                        plan.popular
                          ? 'bg-blue-500/20 text-blue-300 border-blue-400/40'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                      }`}>
                        {plan.badge}
                      </span>
                    </div>
                    <p className={`text-xs mt-2 leading-relaxed ${plan.popular ? 'text-slate-300' : 'text-slate-600 dark:text-slate-400'}`}>
                      {plan.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="border-y border-slate-200/60 dark:border-slate-800/80 py-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl sm:text-5xl font-extrabold font-mono tracking-tight">
                        ${price === 0 ? '0' : price.toFixed(2)}
                      </span>
                      <span className={`text-xs font-medium ${plan.popular ? 'text-slate-300' : 'text-slate-500'}`}>
                        {price === 0 ? t('forever') : isAnnual ? t('perYear') : t('perMonth')}
                      </span>
                    </div>
                    {isAnnual && price > 0 && (
                      <span className="text-[11px] text-emerald-500 font-semibold mt-1 block">
                        {t('billedAnnually', { price: (price / 12).toFixed(2) })}
                      </span>
                    )}
                  </div>

                  {/* Features list */}
                  <div className="space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">{t('includedFeatures')}</div>
                    <ul className="space-y-2 text-xs">
                      {plan.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2">
                          <Check size={16} className={`shrink-0 mt-0.5 ${plan.popular ? 'text-cyan-400' : 'text-emerald-500'}`} />
                          <span className={plan.popular ? 'text-slate-200' : 'text-slate-700 dark:text-slate-300'}>
                            {feat}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* CTA Button */}
                <div className="mt-8 pt-4">
                  <button
                    onClick={() => onSubscribePlan(plan.tier, billingCycle, price)}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-md ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white shadow-blue-500/20'
                        : 'bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white'
                    }`}
                  >
                    {plan.ctaText}
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
