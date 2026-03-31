import { Brain, MessageSquare, BookHeart, Activity, HeartHandshake } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';
import PremiumLock from '../components/PremiumLock';

export default function MindView({ onUpgrade }: { onUpgrade: () => void }) {
  const { isPremium } = useUser();
  const { theme } = useTheme();

  if (!isPremium) {
    return (
      <div className="p-6 h-full flex flex-col bg-[#FAF9F6]">
        <div className="mb-6">
          <h2 className="text-3xl font-serif font-light text-[#3F2A2F] mb-2 italic">Equilíbrio Emocional</h2>
          <p className="text-[#3F2A2F]/40 font-light">Trate a ansiedade, autoestima, disciplina e bloqueios emocionais com especialistas.</p>
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
    <div className="p-6 pb-32 bg-[#0A0A0A] min-h-full text-white font-sans relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#E8B4BC]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="mb-10 relative z-10">
        <h2 className="text-5xl font-bold text-white mb-3 tracking-tighter">Equilíbrio <span className="gradient-text">Emocional</span></h2>
        <p className="text-sm font-bold text-white/30 uppercase tracking-widest">Trate a ansiedade, autoestima, disciplina e bloqueios emocionais com especialistas.</p>
      </div>

      <div className="space-y-8 relative z-10">
        {/* Therapist Profile */}
        <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4B996]/5 rounded-full blur-[60px] -mr-10 -mt-10"></div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-2xl text-white tracking-tight">Sua Terapeuta</h3>
            <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-500 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20">Online</span>
          </div>
          <div className="flex items-center gap-5 mb-8">
            <div className="w-20 h-20 rounded-3xl bg-white/5 overflow-hidden border border-white/10 shadow-2xl p-1">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200" alt="Terapeuta" className="w-full h-full object-cover rounded-2xl" referrerPolicy="no-referrer" />
            </div>
            <div>
              <p className="font-bold text-white text-xl tracking-tight">Dra. Camila Costa</p>
              <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest mt-1">Psicóloga Clínica</p>
              <button className="text-[10px] font-bold uppercase tracking-widest mt-2 text-[#E8B4BC] hover:text-white transition-colors">Ver Perfil</button>
            </div>
          </div>
          <button className="w-full py-5 rounded-2xl bg-white text-black font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-2xl">
            <MessageSquare size={20} />
            Chat com Terapeuta
          </button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-5">
          <button className="glass-card p-8 rounded-[2.5rem] border border-white/5 flex flex-col items-center justify-center gap-4 hover:border-[#E8B4BC]/30 transition-all group shadow-2xl">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-[#E8B4BC]/10 text-[#E8B4BC] group-hover:bg-[#E8B4BC] group-hover:text-black transition-all border border-[#E8B4BC]/20">
              <BookHeart size={28} />
            </div>
            <span className="font-bold text-white/20 text-[10px] uppercase tracking-widest group-hover:text-white transition-colors">Diário Emocional</span>
          </button>
          <button className="glass-card p-8 rounded-[2.5rem] border border-white/5 flex flex-col items-center justify-center gap-4 hover:border-[#D4B996]/30 transition-all group shadow-2xl">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-[#D4B996]/10 text-[#D4B996] group-hover:bg-[#D4B996] group-hover:text-black transition-all border border-[#D4B996]/20">
              <Activity size={28} />
            </div>
            <span className="font-bold text-white/20 text-[10px] uppercase tracking-widest group-hover:text-white transition-colors">Evolução Mental</span>
          </button>
        </div>

        {/* Guided Sessions */}
        <div>
          <h3 className="font-bold text-2xl text-white mb-6 tracking-tight">Sessões Guiadas</h3>
          <div className="space-y-5">
            {[
              { title: 'Lidando com a Ansiedade', duration: '15 min', icon: Brain, color: 'text-white', bg: 'bg-white/5' },
              { title: 'Construindo Autoestima', duration: '20 min', icon: HeartHandshake, color: 'text-[#E8B4BC]', bg: 'bg-[#E8B4BC]/10' },
              { title: 'Desbloqueios Emocionais', duration: '30 min', icon: Activity, color: 'text-[#D4B996]', bg: 'bg-[#D4B996]/10' },
            ].map((session, idx) => (
              <div key={`${session.title}-${idx}`} className="glass-card p-6 rounded-[2rem] border border-white/5 flex items-center gap-5 hover:border-white/20 transition-all cursor-pointer group shadow-2xl">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${session.bg} ${session.color} group-hover:scale-110 transition-transform border border-white/5`}>
                  <session.icon size={28} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white text-lg tracking-tight mb-1 group-hover:text-[#E8B4BC] transition-colors">{session.title}</h4>
                  <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">{session.duration} • Áudio guiado</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
