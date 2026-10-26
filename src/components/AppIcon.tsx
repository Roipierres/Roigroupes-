import React from 'react';
import { Shield, Lock, Wrench, ShieldAlert, Wifi, Zap, Smartphone, Key, MapPin, Truck } from 'lucide-react';

interface AppIconProps {
  iconType: 'shield' | 'lock' | 'wrench' | 'vault' | 'wifi' | 'zap' | string;
  gradient?: string;
  className?: string;
  size?: number;
}

export const AppIcon: React.FC<AppIconProps> = ({ iconType, gradient = 'from-blue-600 to-indigo-600', className = 'w-12 h-12', size = 24 }) => {
  const getIcon = () => {
    switch (iconType) {
      case 'shield':
        return <Shield size={size} className="text-white drop-shadow-sm" />;
      case 'lock':
        return <Lock size={size} className="text-white drop-shadow-sm" />;
      case 'wrench':
        return <Wrench size={size} className="text-white drop-shadow-sm" />;
      case 'vault':
        return <ShieldAlert size={size} className="text-white drop-shadow-sm" />;
      case 'wifi':
        return <Wifi size={size} className="text-white drop-shadow-sm" />;
      case 'zap':
        return <Zap size={size} className="text-white drop-shadow-sm" />;
      default:
        return <Smartphone size={size} className="text-white drop-shadow-sm" />;
    }
  };

  return (
    <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} p-3 shadow-lg shadow-blue-500/10 ring-1 ring-white/20 transition-all duration-300 group-hover:scale-105 ${className}`}>
      <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
      {getIcon()}
    </div>
  );
};
