import { Apple, MessageCircle, Camera, Calendar, CheckCircle2 } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';
import PremiumLock from '../components/PremiumLock';

export default function NutritionView({ onUpgrade }: { onUpgrade: () => void }) {
  const { isPremium } = useUser();
  const { theme } = useTheme();

  if (!isPremium) {
    return (
    <div className="px-6 py-10 sm:px-10 h-full flex flex-col bg-transparent text-white">
        <div className="mb-10">
          <p className="text-[10px] font-bold text-[#D81BFF] uppercase tracking-[0.4em] mb-2">Nutrição Estratégica</p>
          <h2 className="text-4xl font-sans font-bold text-white mb-3 tracking-tighter">Sua Dieta <span className="text-[#D81BFF]">Personalizada</span></h2>
          <p className="text-sm font-bold text-[#B8B0C8] uppercase tracking-widest">Você não está mais sozinha — agora tem uma profissional acompanhando cada passo</p>
        </div>
        <PremiumLock 
          title="Sua Nutricionista Particular"
          description="Tenha um plano alimentar individual, ajustes semanais e chat direto com uma nutricionista para garantir seus resultados."
          onUpgrade={onUpgrade}
        />
      </div>
    );
  }

  return (
    <div className="px-6 py-10 sm:px-10 pb-32 bg-transparent min-h-full text-white font-sans relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#D81BFF]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="mb-10 relative z-10">
        <p className="text-[10px] font-bold text-[#D81BFF] uppercase tracking-[0.4em] mb-2">Nutrição Estratégica</p>
        <h2 className="text-4xl font-sans font-bold text-white mb-3 tracking-tighter">Sua Dieta <span className="text-[#D81BFF]">Personalizada</span></h2>
        <p className="text-sm font-bold text-[#B8B0C8] uppercase tracking-widest">Você não está mais sozinha — agora tem uma profissional acompanhando cada passo</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
        <div className="space-y-8">
          {/* Current Plan Summary */}
          <div className="luxury-card relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D81BFF]/5 rounded-full blur-[60px] -mr-10 -mt-10"></div>
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-2xl text-white tracking-tight">Sua Dieta Atual</h3>
              <span className="px-4 py-1.5 bg-[#D81BFF]/10 text-[#D81BFF] rounded-xl text-[10px] font-bold uppercase tracking-widest border border-[#D81BFF]/20">Ativo</span>
            </div>
            <div className="flex items-center gap-5 mb-8">
              <div className="w-20 h-20 rounded-3xl bg-white/5 overflow-hidden border border-white/10 shadow-2xl p-1">
                <img src="https://images.unsplash.com/photo-1594824436951-7f12bc3ac92e?auto=format&fit=crop&q=80&w=200&h=200" alt="Nutricionista" className="w-full h-full object-cover rounded-2xl" referrerPolicy="no-referrer" />
              </div>
              <div>
                <p className="text-[10px] text-[#B8B0C8] font-bold uppercase tracking-widest mb-1">Sua Nutricionista</p>
                <p className="font-bold text-white text-xl tracking-tight">Dra. Marina Silva</p>
                <button className="text-[10px] font-bold uppercase tracking-widest mt-2 text-[#D81BFF] hover:text-white transition-colors">Ver Perfil</button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div className="bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-md">
                <p className="text-[10px] text-[#B8B0C8] font-bold uppercase tracking-widest mb-2">Objetivo</p>
                <p className="font-bold text-white text-lg tracking-tight">Emagrecimento</p>
              </div>
              <div className="bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-md">
                <p className="text-[10px] text-[#B8B0C8] font-bold uppercase tracking-widest mb-2">Calorias</p>
                <p className="font-bold text-white text-lg tracking-tight">1.850 kcal</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-5">
            <button className="luxury-card flex flex-col items-center justify-center gap-4 hover:border-[#D81BFF]/50 transition-all group shadow-2xl">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white/5 text-[#B8B0C8] group-hover:bg-[#D81BFF] group-hover:text-white transition-all border border-white/10">
                <MessageCircle size={28} />
              </div>
              <span className="font-bold text-[#B8B0C8] text-[10px] uppercase tracking-widest group-hover:text-white transition-colors">Chat com a Nutri</span>
            </button>
            <button className="luxury-card flex flex-col items-center justify-center gap-4 hover:border-[#D81BFF]/50 transition-all group shadow-2xl">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white/5 text-[#B8B0C8] group-hover:bg-[#D81BFF] group-hover:text-white transition-all border border-white/10">
                <Camera size={28} />
              </div>
              <span className="font-bold text-[#B8B0C8] text-[10px] uppercase tracking-widest group-hover:text-white transition-colors">Upload de Refeição</span>
            </button>
          </div>
        </div>

        {/* Today's Meals */}
        <div className="space-y-6">
          <h3 className="font-bold text-2xl text-white mb-6 tracking-tight px-2">Refeições de Hoje</h3>
          <div className="space-y-5">
            {[
              { time: '08:00', name: 'Café da Manhã', desc: 'Ovos mexidos com mamão', done: true },
              { time: '12:30', name: 'Almoço', desc: 'Frango grelhado com batata doce', done: false },
              { time: '16:00', name: 'Lanche', desc: 'Iogurte com whey', done: false },
              { time: '20:00', name: 'Jantar', desc: 'Salada completa com atum', done: false },
            ].map((meal, idx) => (
              <div key={`meal-${meal.name}-${idx}`} className={`p-6 rounded-[2rem] border transition-all shadow-2xl flex items-center gap-5 ${meal.done ? 'bg-[#D81BFF] border-transparent' : 'luxury-card border-white/10 hover:border-[#D81BFF]/30'}`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${meal.done ? 'bg-white/20 text-white border-transparent' : 'bg-white/5 text-[#B8B0C8] border-white/10'}`}>
                  {meal.done ? <CheckCircle2 size={28} /> : <Apple size={28} />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className={`font-bold text-lg tracking-tight ${meal.done ? 'text-white' : 'text-white'}`}>{meal.name}</h4>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${meal.done ? 'text-white/60' : 'text-[#B8B0C8]'}`}>{meal.time}</span>
                  </div>
                  <p className={`text-sm font-bold ${meal.done ? 'text-white/80' : 'text-[#B8B0C8]'}`}>{meal.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
