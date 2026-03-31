import { Lock, ArrowRight, Star } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface PremiumLockProps {
  title: string;
  description: string;
  onUpgrade: () => void;
}

export default function PremiumLock({ title, description, onUpgrade }: PremiumLockProps) {
  const { theme } = useTheme();

  return (
    <div className="relative w-full h-full min-h-[450px] flex flex-col items-center justify-center p-8 text-center overflow-hidden rounded-[3rem] bg-[#141414] border border-white/5 shadow-2xl">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#E8B4BC]/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4B996]/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col items-center max-w-sm mx-auto">
        <div 
          className="w-24 h-24 rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl relative border border-white/10 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-xl"
        >
          <Lock size={40} className="text-[#D4B996]" />
          <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-r from-[#E8B4BC] to-[#D4B996] rounded-2xl flex items-center justify-center shadow-2xl border border-white/20">
            <Star size={18} className="text-black" fill="currentColor" />
          </div>
        </div>

        <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">
          {title}
        </h3>
        
        <p className="text-white/40 font-bold mb-10 leading-relaxed text-sm">
          {description}
        </p>

        <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 w-full mb-10 text-left space-y-4 backdrop-blur-md">
          {[
            "Resultados 3x mais rápidos com acompanhamento profissional",
            "Pare de tentar sozinha — tenha especialistas ao seu lado",
            "Seu corpo e sua mente evoluindo juntos"
          ].map((benefit, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-xl bg-[#E8B4BC]/10 flex items-center justify-center shrink-0 border border-[#E8B4BC]/20">
                <span className="text-[#E8B4BC] font-bold text-xs">{idx + 1}</span>
              </div>
              <p className="text-xs text-white/60 font-bold leading-tight">{benefit}</p>
            </div>
          ))}
        </div>

        <button
          onClick={onUpgrade}
          className="w-full py-5 rounded-2xl font-bold text-black shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3 bg-gradient-to-r from-[#E8B4BC] to-[#D4B996] text-xs uppercase tracking-widest"
        >
          Desbloquear Premium
          <ArrowRight size={20} />
        </button>
        
        <p className="text-[10px] text-white/10 mt-6 font-bold uppercase tracking-widest">
          Disponível apenas no Plano Premium
        </p>
      </div>
    </div>
  );
}
