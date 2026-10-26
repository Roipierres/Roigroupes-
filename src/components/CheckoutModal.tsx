import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface CheckoutModalProps {
  planTier: 'Free' | 'Pro' | 'Family/Enterprise' | null;
  billingCycle: 'Monthly' | 'Annual';
  price: number;
  onClose: () => void;
  onSuccess: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  planTier,
  billingCycle,
  price,
  onClose,
  onSuccess,
}) => {
  const { lang, t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'gpay'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!planTier) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: name,
          userEmail: email,
          planTier,
          status: 'Active',
          billingCycle,
          amountPaid: price,
          expiresAt: billingCycle === 'Annual'
            ? new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0]
            : new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsSuccess(true);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1800);
      }
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl text-slate-900 dark:text-white space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-full"
        >
          <X size={20} />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t('subscriptionActive')}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {t('subscriptionActiveDesc', { plan: planTier })}
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck size={16} />
                <span>{t('secureCheckout')}</span>
              </div>
              <h3 className="text-xl font-bold">{t('subscribeToPlan', { plan: planTier })}</h3>
            </div>

            {/* Price Summary Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  {t('licenseSummary', { plan: planTier })}
                </span>
                <span className="text-[11px] text-slate-500">
                  {t('billingCycleLabel', { cycle: billingCycle })}
                </span>
              </div>
              <div className="text-end">
                <span className="text-2xl font-extrabold font-mono text-blue-600 dark:text-cyan-400">
                  ${price.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">{t('fullNameLabel')}</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Marcus Vance"
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
                  placeholder="marcus@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Payment Selector */}
              {price > 0 && (
                <div className="space-y-2">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">{t('paymentMethodLabel')}</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        paymentMethod === 'card'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 font-bold'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {t('creditCard')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('paypal')}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        paymentMethod === 'paypal'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 font-bold'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {t('payPal')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('gpay')}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        paymentMethod === 'gpay'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 font-bold'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {t('googlePay')}
                    </button>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="pt-1">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4242 ···· ···· 4242"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white font-bold text-sm shadow-md shadow-blue-500/20 hover:from-blue-500 hover:to-cyan-500 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? t('subscribingText') : t('completeCheckout', { price: price.toFixed(2) })}
                </button>
              </div>

            </form>
          </>
        )}

      </div>
    </div>
  );
};
