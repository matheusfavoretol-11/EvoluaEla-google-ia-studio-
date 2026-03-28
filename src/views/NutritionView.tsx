import { Apple, MessageCircle, Camera, Calendar, CheckCircle2 } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';
import PremiumLock from '../components/PremiumLock';

export default function NutritionView({ onUpgrade }: { onUpgrade: () => void }) {
  const { isPremium } = useUser();
  const { theme } = useTheme();

  if (!isPremium) {
    return (
      <div className="p-6 h-full flex flex-col">
        <div className="mb-6">
          <h2 className="text-3xl font-serif font-bold text-stone-800 mb-2">Sua Dieta Personalizada</h2>
          <p className="text-stone-500 font-medium">Você não está mais sozinha — agora tem uma profissional acompanhando cada passo</p>
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
    <div className="p-6 pb-32">
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-bold text-stone-800 mb-2">Sua Dieta Personalizada</h2>
        <p className="text-stone-500 font-medium">Você não está mais sozinha — agora tem uma profissional acompanhando cada passo</p>
      </div>

      <div className="space-y-6">
        {/* Current Plan Summary */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-stone-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif font-bold text-xl text-stone-800">Sua Dieta Atual</h3>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-widest">Ativo</span>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-stone-100 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1594824436951-7f12bc3ac92e?auto=format&fit=crop&q=80&w=200&h=200" alt="Nutricionista" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-sm text-stone-500 font-medium">Sua Nutricionista</p>
              <p className="font-bold text-stone-800">Dra. Marina Silva</p>
              <button className="text-xs font-bold mt-1 hover:underline" style={{ color: theme.primary }}>Ver Perfil</button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-stone-50 p-4 rounded-2xl">
              <p className="text-xs text-stone-500 font-medium mb-1">Objetivo</p>
              <p className="font-bold text-stone-800">Emagrecimento</p>
            </div>
            <div className="bg-stone-50 p-4 rounded-2xl">
              <p className="text-xs text-stone-500 font-medium mb-1">Calorias</p>
              <p className="font-bold text-stone-800">1.850 kcal</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-white p-4 rounded-[1.5rem] shadow-sm border border-stone-100 flex flex-col items-center justify-center gap-3 hover:bg-stone-50 transition-colors">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${theme.primary}15`, color: theme.primary }}>
              <MessageCircle size={24} />
            </div>
            <span className="font-bold text-stone-800 text-sm">Chat com a Nutri</span>
          </button>
          <button className="bg-white p-4 rounded-[1.5rem] shadow-sm border border-stone-100 flex flex-col items-center justify-center gap-3 hover:bg-stone-50 transition-colors">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${theme.primary}15`, color: theme.primary }}>
              <Camera size={24} />
            </div>
            <span className="font-bold text-stone-800 text-sm">Upload de Refeição</span>
          </button>
        </div>

        {/* Today's Meals */}
        <div>
          <h3 className="font-serif font-bold text-xl text-stone-800 mb-4">Refeições de Hoje</h3>
          <div className="space-y-4">
            {[
              { time: '08:00', name: 'Café da Manhã', desc: 'Ovos mexidos com mamão', done: true },
              { time: '12:30', name: 'Almoço', desc: 'Frango grelhado com batata doce', done: false },
              { time: '16:00', name: 'Lanche', desc: 'Iogurte com whey', done: false },
              { time: '20:00', name: 'Jantar', desc: 'Salada completa com atum', done: false },
            ].map((meal) => (
              <div key={meal.name} className={`p-4 rounded-[1.5rem] border ${meal.done ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-stone-100'} flex items-center gap-4`}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: meal.done ? '#10b981' : '#f5f5f4', color: meal.done ? 'white' : '#a8a29e' }}>
                  {meal.done ? <CheckCircle2 size={24} /> : <Apple size={24} />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className={`font-bold ${meal.done ? 'text-emerald-800' : 'text-stone-800'}`}>{meal.name}</h4>
                    <span className="text-xs font-medium text-stone-400">{meal.time}</span>
                  </div>
                  <p className={`text-sm ${meal.done ? 'text-emerald-600' : 'text-stone-500'}`}>{meal.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
