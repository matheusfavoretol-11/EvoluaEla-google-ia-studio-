import { Apple, MessageCircle, Camera, Calendar, CheckCircle2 } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';
import PremiumLock from '../components/PremiumLock';

export default function NutritionView({ onUpgrade }: { onUpgrade: () => void }) {
  const { isPremium } = useUser();
  const { theme } = useTheme();

  if (!isPremium) {
    return (
      <div className="p-6 h-full flex flex-col bg-[#FAF9F6]">
        <div className="mb-6">
          <h2 className="text-3xl font-serif font-light text-[#3F2A2F] mb-2 italic">Sua Dieta Personalizada</h2>
          <p className="text-[#3F2A2F]/40 font-light">Você não está mais sozinha — agora tem uma profissional acompanhando cada passo</p>
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
    <div className="p-6 pb-32 bg-[#FAF9F6] min-h-full">
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-light text-[#3F2A2F] mb-2 italic">Sua Dieta Personalizada</h2>
        <p className="text-[#3F2A2F]/40 font-light">Você não está mais sozinha — agora tem uma profissional acompanhando cada passo</p>
      </div>

      <div className="space-y-6">
        {/* Current Plan Summary */}
        <div className="bg-white p-6 rounded-[2rem] border border-[#3F2A2F]/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif font-light text-xl text-[#3F2A2F] italic">Sua Dieta Atual</h3>
            <span className="px-3 py-1 bg-[#E8B4BC]/10 text-[#E8B4BC] rounded-full text-[9px] font-medium uppercase tracking-[0.2em]">Ativo</span>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-white overflow-hidden border border-[#3F2A2F]/5">
              <img src="https://images.unsplash.com/photo-1594824436951-7f12bc3ac92e?auto=format&fit=crop&q=80&w=200&h=200" alt="Nutricionista" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div>
              <p className="text-[9px] text-[#3F2A2F]/30 font-medium uppercase tracking-[0.2em]">Sua Nutricionista</p>
              <p className="font-serif font-light text-[#3F2A2F] italic">Dra. Marina Silva</p>
              <button className="text-[9px] font-medium uppercase tracking-[0.2em] mt-1 hover:underline text-[#E8B4BC]">Ver Perfil</button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-[#3F2A2F]/5">
              <p className="text-[9px] text-[#3F2A2F]/30 font-medium uppercase tracking-[0.2em] mb-1">Objetivo</p>
              <p className="font-serif font-light text-[#3F2A2F] italic">Emagrecimento</p>
            </div>
            <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-[#3F2A2F]/5">
              <p className="text-[9px] text-[#3F2A2F]/30 font-medium uppercase tracking-[0.2em] mb-1">Calorias</p>
              <p className="font-serif font-light text-[#3F2A2F] italic">1.850 kcal</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-white p-6 rounded-[1.5rem] border border-[#3F2A2F]/5 flex flex-col items-center justify-center gap-3 hover:bg-[#FAF9F6] transition-colors group">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#FAF9F6] text-[#3F2A2F]/60 group-hover:bg-[#3F2A2F]/5 group-hover:text-[#3F2A2F] transition-all">
              <MessageCircle size={24} />
            </div>
            <span className="font-medium text-[#3F2A2F]/40 text-[9px] uppercase tracking-[0.2em] group-hover:text-[#3F2A2F]">Chat com a Nutri</span>
          </button>
          <button className="bg-white p-6 rounded-[1.5rem] border border-[#3F2A2F]/5 flex flex-col items-center justify-center gap-3 hover:bg-[#FAF9F6] transition-colors group">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#FAF9F6] text-[#3F2A2F]/60 group-hover:bg-[#3F2A2F]/5 group-hover:text-[#3F2A2F] transition-all">
              <Camera size={24} />
            </div>
            <span className="font-medium text-[#3F2A2F]/40 text-[9px] uppercase tracking-[0.2em] group-hover:text-[#3F2A2F]">Upload de Refeição</span>
          </button>
        </div>

        {/* Today's Meals */}
        <div>
          <h3 className="font-serif font-light text-xl text-[#3F2A2F] mb-4 italic">Refeições de Hoje</h3>
          <div className="space-y-4">
            {[
              { time: '08:00', name: 'Café da Manhã', desc: 'Ovos mexidos com mamão', done: true },
              { time: '12:30', name: 'Almoço', desc: 'Frango grelhado com batata doce', done: false },
              { time: '16:00', name: 'Lanche', desc: 'Iogurte com whey', done: false },
              { time: '20:00', name: 'Jantar', desc: 'Salada completa com atum', done: false },
            ].map((meal, idx) => (
              <div key={`${meal.name}-${idx}`} className={`p-5 rounded-[1.5rem] border transition-all ${meal.done ? 'bg-[#E8B4BC]/5 border-[#E8B4BC]/20' : 'bg-white border-[#3F2A2F]/5'} flex items-center gap-4`}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: meal.done ? '#E8B4BC' : 'rgba(63,42,47,0.05)', color: meal.done ? 'white' : 'rgba(63,42,47,0.3)' }}>
                  {meal.done ? <CheckCircle2 size={24} /> : <Apple size={24} />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className={`font-serif font-light italic ${meal.done ? 'text-[#E8B4BC]' : 'text-[#3F2A2F]'}`}>{meal.name}</h4>
                    <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#3F2A2F]/20">{meal.time}</span>
                  </div>
                  <p className={`text-xs font-light ${meal.done ? 'text-[#E8B4BC]/60' : 'text-[#3F2A2F]/40'}`}>{meal.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
