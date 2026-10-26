import React, { useState } from 'react';
import { ShieldCheck, Moon, Sun, LayoutDashboard, Menu, X, ArrowUpRight, Languages } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface NavbarProps {
  currentView: 'portal' | 'admin';
  onNavigate: (view: 'portal' | 'admin') => void;
  darkMode: boolean;
  onToggleTheme: () => void;
  isAdminLoggedIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  darkMode,
  onToggleTheme,
  isAdminLoggedIn,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();

  const navLinks = [
    { label: t('navApps'), href: '#apps' },
    { label: t('navGallery'), href: '#gallery' },
    { label: t('navPricing'), href: '#pricing' },
    { label: t('navAbout'), href: '#about' },
    { label: t('navSupport'), href: '#contact' },
  ];

  const toggleLanguage = () => {
    if (lang === 'ar') setLang('fr');
    else if (lang === 'fr') setLang('en');
    else setLang('ar');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8 py-3.5">
        
        {/* Zone 0: Language Switcher (Far Left) */}
        <div className="flex items-center shrink-0">
          <button
            onClick={toggleLanguage}
            aria-label="Toggle language"
            className="bg-white text-black hover:bg-slate-100 px-3 py-1.5 rounded-lg font-bold text-sm border border-slate-200 transition-colors shadow-sm"
          >
            {lang === 'ar' ? 'fr' : (lang === 'fr' ? 'en' : 'ar')}
          </button>
        </div>

        {/* Zone 1: Brand Wordmark */}
        <a 
          href="#top" 
          onClick={() => currentView === 'admin' && onNavigate('portal')}
          className="flex items-center gap-2.5 text-slate-900 dark:text-white font-bold text-lg sm:text-xl tracking-tight whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white shadow-md shadow-blue-500/20">
            <ShieldCheck size={22} />
          </div>
          <span className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 dark:from-white dark:via-slate-100 dark:to-cyan-200 bg-clip-text text-transparent">
            {t('brandName')}
          </span>
          <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50">
            {t('ecosystemBadge')}
          </span>
        </a>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => currentView === 'admin' && onNavigate('portal')}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap shrink-0"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Primary Actions & Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle light and dark theme"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Admin / Portal Toggle */}
          {currentView === 'portal' ? (
            <button
              onClick={() => onNavigate('admin')}
              className="flex items-center gap-2 rounded-lg bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all whitespace-nowrap shrink-0"
            >
              <LayoutDashboard size={16} />
              <span>{isAdminLoggedIn ? t('adminPanel') : t('adminLogin')}</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('portal')}
              className="flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 transition-all whitespace-nowrap shrink-0"
            >
              <span>{t('publicPortal')}</span>
              <ArrowUpRight size={16} />
            </button>
          )}

          {/* Mobile hamburger menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Open mobile menu"
            className="flex md:hidden h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => {
                setMobileMenuOpen(false);
                if (currentView === 'admin') onNavigate('portal');
              }}
              className="block text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 py-1.5"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};
