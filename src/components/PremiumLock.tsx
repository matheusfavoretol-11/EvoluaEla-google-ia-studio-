import { Lock as LockIcon, Crown, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface PremiumLockProps {
  title: string;
  description: string;
  beneficios: string[];
  preco?: string;
  botaoText?: string;
  onUpgrade: () => void;
  aba?: 'coach' | 'nutricao' | 'mente' | 'treino';
}

export default function PremiumLock({ 
  title, 
  description, 
  beneficios, 
  preco = "R$ 109,90/mês", 
  botaoText = "Assinar Premium Agora",
  onUpgrade,
  aba
}: PremiumLockProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="luxury-card p-8 text-center shadow-2xl border border-white/10 w-full relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#D81BFF]/5 rounded-full blur-[60px] -mr-10 -mt-10"></div>
      
      <div className="w-16 h-16 rounded-2xl bg-[#D81BFF]/10 flex items-center justify-center mx-auto mb-6">
        <LockIcon size={28} className="text-[#D81BFF]" />
      </div>

      <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{title}</h3>
      <p className="text-sm text-[#B8B0C8] mb-8 font-medium leading-relaxed max-w-md mx-auto">
        {description}
      </p>

      <div className="space-y-3 mb-10 max-w-xs mx-auto text-left">
        {beneficios.map((beneficio, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <CheckCircle2 size={16} className="text-[#D81BFF] shrink-0" />
            <span className="text-xs font-bold text-white/70 tracking-tight">{beneficio}</span>
          </div>
        ))}
      </div>

      <div className="mb-8 p-4 rounded-2xl bg-white/5 border border-white/10 inline-block">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B8B0C8] mb-1">Investimento</p>
        <p className="text-2xl font-bold text-white tracking-tight">
          <span className="text-[#D81BFF]">💎</span> {preco}
        </p>
      </div>

      <button 
        onClick={onUpgrade}
        className="luxury-button w-full py-5 rounded-full font-bold uppercase tracking-widest text-white shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 text-xs"
      >
        <Crown size={18} fill="currentColor" />
        {botaoText}
      </button>

      <p className="mt-6 text-[10px] font-bold uppercase tracking-widest text-white/20">
        Pagamento seguro • Cancele quando quiser
      </p>
    </motion.div>
  );
}
