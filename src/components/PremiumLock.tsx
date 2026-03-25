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
    <div className="relative w-full h-full min-h-[400px] flex flex-col items-center justify-center p-6 text-center overflow-hidden rounded-[2rem] bg-stone-50 border border-stone-100">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '24px 24px' }} />
      
      <div className="relative z-10 flex flex-col items-center max-w-sm mx-auto">
        <div 
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-lg relative"
          style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})` }}
        >
          <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
            <Lock size={32} style={{ color: theme.primary }} />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center shadow-md border-2 border-white">
            <Star size={14} className="text-white" fill="currentColor" />
          </div>
        </div>

        <h3 className="text-2xl font-serif font-bold text-stone-800 mb-3">
          {title}
        </h3>
        
        <p className="text-stone-500 font-medium mb-8 leading-relaxed">
          {description}
        </p>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100 w-full mb-8 text-left space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <span className="text-emerald-600 font-bold text-xs">1</span>
            </div>
            <p className="text-sm text-stone-600 font-medium">Resultados 3x mais rápidos com acompanhamento profissional</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <span className="text-emerald-600 font-bold text-xs">2</span>
            </div>
            <p className="text-sm text-stone-600 font-medium">Pare de tentar sozinha — tenha especialistas ao seu lado</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <span className="text-emerald-600 font-bold text-xs">3</span>
            </div>
            <p className="text-sm text-stone-600 font-medium">Seu corpo e sua mente evoluindo juntos</p>
          </div>
        </div>

        <button
          onClick={onUpgrade}
          className="w-full py-4 rounded-[1.5rem] font-bold text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 gradient-bg hover:scale-[1.02]"
        >
          Desbloquear Premium
          <ArrowRight size={18} />
        </button>
        
        <p className="text-[10px] text-stone-400 mt-4 font-medium uppercase tracking-widest">
          Disponível apenas no Premium com acompanhamento profissional
        </p>
      </div>
    </div>
  );
}
