import React from 'react';
import { Crown, Lock, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface PremiumBannerProps {
  onUpgrade: () => void;
}

export default function PremiumBanner({ onUpgrade }: PremiumBannerProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="luxury-card p-8 border-[#D81BFF]/30 bg-gradient-to-br from-[#D81BFF]/10 to-transparent relative overflow-hidden shadow-2xl"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#D81BFF]/5 rounded-full blur-[60px] -mr-10 -mt-10"></div>
      
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-[#D81BFF] flex items-center justify-center text-white shadow-lg">
          <Crown size={24} fill="currentColor" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">Você está no Plano <span className="text-[#D81BFF]">FREE</span></h3>
          <p className="text-[10px] font-bold text-[#B8B0C8] uppercase tracking-widest">Aproveite os treinos básicos liberados</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="space-y-3">
          <p className="text-[10px] font-bold text-green-400 uppercase tracking-widest flex items-center gap-2">
            <CheckCircle2 size={12} /> Liberado
          </p>
          <ul className="space-y-2">
            <li className="text-xs font-medium text-white/60 tracking-tight">• Treinos Básicos de Adaptação</li>
            <li className="text-xs font-medium text-white/60 tracking-tight">• Cronômetro de Descanso</li>
          </ul>
        </div>
        
        <div className="space-y-3">
          <p className="text-[10px] font-bold text-[#D81BFF] uppercase tracking-widest flex items-center gap-2">
            <Lock size={12} /> Bloqueado no FREE
          </p>
          <ul className="space-y-2">
            <li className="text-xs font-medium text-white/40 tracking-tight">• Treinos de Hipertrofia Avançados</li>
            <li className="text-xs font-medium text-white/40 tracking-tight">• Treinos Funcionais Personalizados</li>
            <li className="text-xs font-medium text-white/40 tracking-tight">• Integração com Plano Alimentar</li>
            <li className="text-xs font-medium text-white/40 tracking-tight">• Vídeos Explicativos Completos</li>
          </ul>
        </div>
      </div>

      <div className="h-px bg-white/5 w-full mb-8" />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <p className="text-sm font-bold text-white tracking-tight mb-1">Desbloqueie TUDO agora</p>
          <p className="text-2xl font-bold text-[#D81BFF] tracking-tight">R$ 109,90<span className="text-xs text-[#B8B0C8] font-medium">/mês</span></p>
        </div>
        <button 
          onClick={onUpgrade}
          className="luxury-button px-10 py-4 rounded-full font-bold uppercase tracking-widest text-xs text-white shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
        >
          <Crown size={16} fill="currentColor" />
          Fazer Upgrade para Premium
        </button>
      </div>
    </motion.div>
  );
}
