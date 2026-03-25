import { Brain, MessageSquare, BookHeart, Activity, HeartHandshake } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';
import PremiumLock from '../components/PremiumLock';

export default function MindView({ onUpgrade }: { onUpgrade: () => void }) {
  const { isPremium } = useUser();
  const { theme } = useTheme();

  if (!isPremium) {
    return (
      <div className="p-6 h-full flex flex-col">
        <div className="mb-6">
          <h2 className="text-3xl font-serif font-bold text-stone-800 mb-2">Equilíbrio Emocional</h2>
          <p className="text-stone-500 font-medium">Trate a ansiedade, autoestima, disciplina e bloqueios emocionais com especialistas.</p>
        </div>
        <PremiumLock 
          title="Sua Terapeuta Particular"
          description="Sessões guiadas, exercícios emocionais, diário e chat direto com uma terapeuta para cuidar da sua mente."
          onUpgrade={onUpgrade}
        />
      </div>
    );
  }

  return (
    <div className="p-6 pb-32">
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-bold text-stone-800 mb-2">Equilíbrio Emocional</h2>
        <p className="text-stone-500 font-medium">Trate a ansiedade, autoestima, disciplina e bloqueios emocionais com especialistas.</p>
      </div>

      <div className="space-y-6">
        {/* Therapist Profile */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-stone-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif font-bold text-xl text-stone-800">Sua Terapeuta</h3>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-widest">Online</span>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-stone-100 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200" alt="Terapeuta" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-bold text-stone-800">Dra. Camila Costa</p>
              <p className="text-sm text-stone-500 font-medium">Psicóloga Clínica</p>
              <button className="text-xs font-bold mt-1 hover:underline text-indigo-600">Ver Perfil</button>
            </div>
          </div>
          <button className="w-full py-3 rounded-xl bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center gap-2 hover:bg-indigo-100 transition-colors">
            <MessageSquare size={18} />
            Chat com Terapeuta
          </button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-white p-4 rounded-[1.5rem] shadow-sm border border-stone-100 flex flex-col items-center justify-center gap-3 hover:bg-stone-50 transition-colors">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-rose-50 text-rose-500">
              <BookHeart size={24} />
            </div>
            <span className="font-bold text-stone-800 text-sm">Diário Emocional</span>
          </button>
          <button className="bg-white p-4 rounded-[1.5rem] shadow-sm border border-stone-100 flex flex-col items-center justify-center gap-3 hover:bg-stone-50 transition-colors">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-sky-50 text-sky-500">
              <Activity size={24} />
            </div>
            <span className="font-bold text-stone-800 text-sm">Evolução Mental</span>
          </button>
        </div>

        {/* Guided Sessions */}
        <div>
          <h3 className="font-serif font-bold text-xl text-stone-800 mb-4">Sessões Guiadas</h3>
          <div className="space-y-4">
            {[
              { title: 'Lidando com a Ansiedade', duration: '15 min', icon: Brain, color: 'text-indigo-500', bg: 'bg-indigo-50' },
              { title: 'Construindo Autoestima', duration: '20 min', icon: HeartHandshake, color: 'text-rose-500', bg: 'bg-rose-50' },
              { title: 'Desbloqueios Emocionais', duration: '30 min', icon: Activity, color: 'text-amber-500', bg: 'bg-amber-50' },
            ].map((session) => (
              <div key={session.title} className="p-4 rounded-[1.5rem] bg-white border border-stone-100 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${session.bg} ${session.color}`}>
                  <session.icon size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-stone-800 mb-1">{session.title}</h4>
                  <p className="text-sm text-stone-500 font-medium">{session.duration} • Áudio guiado</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
