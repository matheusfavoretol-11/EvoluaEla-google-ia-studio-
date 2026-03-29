import { Brain, MessageSquare, BookHeart, Activity, HeartHandshake } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';
import PremiumLock from '../components/PremiumLock';

export default function MindView({ onUpgrade }: { onUpgrade: () => void }) {
  const { isPremium } = useUser();
  const { theme } = useTheme();

  if (!isPremium) {
    return (
      <div className="p-6 h-full flex flex-col bg-black">
        <div className="mb-6">
          <h2 className="text-4xl branding-title text-white mb-2">Equilíbrio Emocional</h2>
          <p className="text-white/50 font-medium">Trate a ansiedade, autoestima, disciplina e bloqueios emocionais com especialistas.</p>
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
    <div className="p-6 pb-32 bg-black min-h-full">
      <div className="mb-8">
        <h2 className="text-4xl branding-title text-white mb-2">Equilíbrio Emocional</h2>
        <p className="text-white/50 font-medium">Trate a ansiedade, autoestima, disciplina e bloqueios emocionais com especialistas.</p>
      </div>

      <div className="space-y-6">
        {/* Therapist Profile */}
        <div className="bg-stone-900 p-6 rounded-[2rem] border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="branding-title text-xl text-white">Sua Terapeuta</h3>
            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest">Online</span>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-white/5 overflow-hidden border border-white/10">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200" alt="Terapeuta" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div>
              <p className="font-black text-white uppercase tracking-tight">Dra. Camila Costa</p>
              <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">Psicóloga Clínica</p>
              <button className="text-[10px] font-black uppercase tracking-widest mt-1 hover:underline text-indigo-400">Ver Perfil</button>
            </div>
          </div>
          <button className="w-full py-4 rounded-xl bg-white/5 text-white font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/10 transition-colors">
            <MessageSquare size={18} />
            Chat com Terapeuta
          </button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-stone-900 p-6 rounded-[1.5rem] border border-white/5 flex flex-col items-center justify-center gap-3 hover:bg-stone-800 transition-colors group">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-rose-500/10 text-rose-500 group-hover:scale-110 transition-transform">
              <BookHeart size={24} />
            </div>
            <span className="font-black text-white/60 text-[10px] uppercase tracking-widest group-hover:text-white">Diário Emocional</span>
          </button>
          <button className="bg-stone-900 p-6 rounded-[1.5rem] border border-white/5 flex flex-col items-center justify-center gap-3 hover:bg-stone-800 transition-colors group">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-sky-500/10 text-sky-500 group-hover:scale-110 transition-transform">
              <Activity size={24} />
            </div>
            <span className="font-black text-white/60 text-[10px] uppercase tracking-widest group-hover:text-white">Evolução Mental</span>
          </button>
        </div>

        {/* Guided Sessions */}
        <div>
          <h3 className="branding-title text-xl text-white mb-4">Sessões Guiadas</h3>
          <div className="space-y-4">
            {[
              { title: 'Lidando com a Ansiedade', duration: '15 min', icon: Brain, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
              { title: 'Construindo Autoestima', duration: '20 min', icon: HeartHandshake, color: 'text-rose-400', bg: 'bg-rose-500/10' },
              { title: 'Desbloqueios Emocionais', duration: '30 min', icon: Activity, color: 'text-amber-400', bg: 'bg-amber-500/10' },
            ].map((session) => (
              <div key={session.title} className="p-5 rounded-[1.5rem] bg-stone-900 border border-white/5 flex items-center gap-4 hover:bg-stone-800 transition-all cursor-pointer group">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${session.bg} ${session.color} group-hover:scale-110 transition-transform`}>
                  <session.icon size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-white uppercase tracking-tight mb-1">{session.title}</h4>
                  <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">{session.duration} • Áudio guiado</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
