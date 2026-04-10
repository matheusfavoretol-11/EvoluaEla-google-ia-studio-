import { Lock as LockIcon, Crown } from 'lucide-react';

interface PremiumLockProps {
  title: string;
  description: string;
  onUpgrade: () => void;
}

export default function PremiumLock({ title, description, onUpgrade }: PremiumLockProps) {
  return (
    <div className="luxury-card p-8 text-center shadow-2xl border border-white/10 w-full">
      <div className="w-14 h-14 rounded-2xl bg-[#D81BFF]/10 flex items-center justify-center mx-auto mb-4">
        <LockIcon size={24} className="text-[#D81BFF]" />
      </div>
      <h3 className="text-lg font-bold text-white mb-2 tracking-tight">Funcionalidade Premium 🌸</h3>
      <p className="text-sm text-[#B8B0C8] mb-6 font-medium leading-relaxed">
        {description}
      </p>
      <button 
        onClick={onUpgrade}
        className="luxury-button w-full py-5 rounded-full font-bold uppercase tracking-widest text-white shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 text-xs"
      >
        <Crown size={16} fill="currentColor" />
        Assinar Premium
      </button>
    </div>
  );
}
