import { Apple, MessageCircle, Camera, Calendar, CheckCircle2 } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';
import PremiumLock from '../components/PremiumLock';

export default function NutritionView({ onUpgrade }: { onUpgrade: () => void }) {
  const { isPremium } = useUser();
  const { theme } = useTheme();

  if (!isPremium) {
    return (
      <div className="p-6 h-full flex flex-col bg-black">
        <div className="mb-6">
          <h2 className="text-4xl branding-title text-white mb-2">Sua Dieta Personalizada</h2>
          <p className="text-white/50 font-medium">Você não está mais sozinha — agora tem uma profissional acompanhando cada passo</p>
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
    <div className="p-6 pb-32 bg-black min-h-full">
      <div className="mb-8">
        <h2 className="text-4xl branding-title text-white mb-2">Sua Dieta Personalizada</h2>
        <p className="text-white/50 font-medium">Você não está mais sozinha — agora tem uma profissional acompanhando cada passo</p>
      </div>

      <div className="space-y-6">
        {/* Current Plan Summary */}
        <div className="bg-stone-900 p-6 rounded-[2rem] border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="branding-title text-xl text-white">Sua Dieta Atual</h3>
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-black uppercase tracking-widest">Ativo</span>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-white/5 overflow-hidden border border-white/10">
              <img src="https://images.unsplash.com/photo-1594824436951-7f12bc3ac92e?auto=format&fit=crop&q=80&w=200&h=200" alt="Nutricionista" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div>
              <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">Sua Nutricionista</p>
              <p className="font-black text-white uppercase tracking-tight">Dra. Marina Silva</p>
              <button className="text-[10px] font-black uppercase tracking-widest mt-1 hover:underline text-rose-400">Ver Perfil</button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black p-4 rounded-2xl border border-white/5">
              <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-1">Objetivo</p>
              <p className="font-black text-white uppercase tracking-tight">Emagrecimento</p>
            </div>
            <div className="bg-black p-4 rounded-2xl border border-white/5">
              <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-1">Calorias</p>
              <p className="font-black text-white uppercase tracking-tight">1.850 kcal</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-stone-900 p-6 rounded-[1.5rem] border border-white/5 flex flex-col items-center justify-center gap-3 hover:bg-stone-800 transition-colors group">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 text-white/60 group-hover:bg-white/10 group-hover:text-white transition-all">
              <MessageCircle size={24} />
            </div>
            <span className="font-black text-white/60 text-[10px] uppercase tracking-widest group-hover:text-white">Chat com a Nutri</span>
          </button>
          <button className="bg-stone-900 p-6 rounded-[1.5rem] border border-white/5 flex flex-col items-center justify-center gap-3 hover:bg-stone-800 transition-colors group">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 text-white/60 group-hover:bg-white/10 group-hover:text-white transition-all">
              <Camera size={24} />
            </div>
            <span className="font-black text-white/60 text-[10px] uppercase tracking-widest group-hover:text-white">Upload de Refeição</span>
          </button>
        </div>

        {/* Today's Meals */}
        <div>
          <h3 className="branding-title text-xl text-white mb-4">Refeições de Hoje</h3>
          <div className="space-y-4">
            {[
              { time: '08:00', name: 'Café da Manhã', desc: 'Ovos mexidos com mamão', done: true },
              { time: '12:30', name: 'Almoço', desc: 'Frango grelhado com batata doce', done: false },
              { time: '16:00', name: 'Lanche', desc: 'Iogurte com whey', done: false },
              { time: '20:00', name: 'Jantar', desc: 'Salada completa com atum', done: false },
            ].map((meal, idx) => (
              <div key={`${meal.name}-${idx}`} className={`p-5 rounded-[1.5rem] border transition-all ${meal.done ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-stone-900 border-white/5'} flex items-center gap-4`}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: meal.done ? '#10b981' : 'rgba(255,255,255,0.05)', color: meal.done ? 'white' : 'rgba(255,255,255,0.3)' }}>
                  {meal.done ? <CheckCircle2 size={24} /> : <Apple size={24} />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className={`font-black uppercase tracking-tight ${meal.done ? 'text-emerald-400' : 'text-white'}`}>{meal.name}</h4>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/20">{meal.time}</span>
                  </div>
                  <p className={`text-xs font-medium ${meal.done ? 'text-emerald-500/60' : 'text-white/40'}`}>{meal.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
