import React from 'react';
import { BannerItem } from '../types';
import { Sparkles, Megaphone, AlertTriangle, ArrowRight, X } from 'lucide-react';

interface BannerAlertProps {
  banners: BannerItem[];
  placement?: 'top_bar' | 'inline_grid' | 'hero_bottom';
  onClose?: (id: string) => void;
}

export const BannerAlert: React.FC<BannerAlertProps> = ({ banners, placement = 'top_bar', onClose }) => {
  const filteredBanners = banners.filter(b => b.placement === placement && b.isActive);

  if (filteredBanners.length === 0) return null;

  return (
    <div className="w-full space-y-2">
      {filteredBanners.map((banner) => {
        const getBannerIcon = () => {
          switch (banner.type) {
            case 'promo':
              return <Sparkles size={16} className="text-amber-400 shrink-0" />;
            case 'announcement':
              return <Megaphone size={16} className="text-blue-400 shrink-0" />;
            case 'warning':
              return <AlertTriangle size={16} className="text-rose-400 shrink-0" />;
            default:
              return <Sparkles size={16} className="text-cyan-400 shrink-0" />;
          }
        };

        return (
          <div
            key={banner.id}
            className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 dark:from-slate-950 dark:via-indigo-950/80 dark:to-slate-950 text-white px-4 py-2.5 shadow-sm border-b border-indigo-800/40"
          >
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 text-xs sm:text-sm font-medium">
              <div className="flex items-center gap-2.5 truncate">
                {getBannerIcon()}
                <span className="font-bold text-cyan-300 uppercase tracking-wider text-[11px] shrink-0">
                  {banner.title}
                </span>
                <span className="hidden sm:inline text-slate-300 text-xs">·</span>
                <span className="text-slate-200 truncate">{banner.message}</span>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {banner.ctaText && (
                  <a
                    href={banner.ctaLink || '#pricing'}
                    className="flex items-center gap-1 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 px-3 py-1 text-xs font-semibold border border-cyan-400/30 transition-colors whitespace-nowrap"
                  >
                    <span>{banner.ctaText}</span>
                    <ArrowRight size={12} />
                  </a>
                )}
                {onClose && (
                  <button
                    onClick={() => onClose(banner.id)}
                    aria-label="Dismiss banner"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
