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
    <div className="p-6 pb-32 bg-[#FAF9F6] min-h-full">
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-light text-[#3F2A2F] mb-2 italic">Equilíbrio Emocional</h2>
        <p className="text-[#3F2A2F]/40 font-light">Trate a ansiedade, autoestima, disciplina e bloqueios emocionais com especialistas.</p>
      </div>

      <div className="space-y-6">
        {/* Therapist Profile */}
        <div className="bg-white p-6 rounded-[2rem] border border-[#3F2A2F]/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif font-light text-xl text-[#3F2A2F] italic">Sua Terapeuta</h3>
            <span className="px-3 py-1 bg-[#E8B4BC]/10 text-[#E8B4BC] rounded-full text-[9px] font-medium uppercase tracking-[0.2em]">Online</span>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-white overflow-hidden border border-[#3F2A2F]/5">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200" alt="Terapeuta" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div>
              <p className="font-serif font-light text-[#3F2A2F] italic">Dra. Camila Costa</p>
              <p className="text-[9px] text-[#3F2A2F]/30 font-medium uppercase tracking-[0.2em]">Psicóloga Clínica</p>
              <button className="text-[9px] font-medium uppercase tracking-[0.2em] mt-1 hover:underline text-[#E8B4BC]">Ver Perfil</button>
            </div>
          </div>
          <button className="w-full py-4 rounded-full bg-[#3F2A2F] text-white font-light uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 hover:bg-[#3F2A2F]/90 transition-colors">
            <MessageSquare size={16} />
            Chat com Terapeuta
          </button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-white p-6 rounded-[1.5rem] border border-[#3F2A2F]/5 flex flex-col items-center justify-center gap-3 hover:bg-[#FAF9F6] transition-colors group">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E8B4BC]/10 text-[#E8B4BC] group-hover:scale-110 transition-transform">
              <BookHeart size={24} />
            </div>
            <span className="font-medium text-[#3F2A2F]/40 text-[9px] uppercase tracking-[0.2em] group-hover:text-[#3F2A2F]">Diário Emocional</span>
          </button>
          <button className="bg-white p-6 rounded-[1.5rem] border border-[#3F2A2F]/5 flex flex-col items-center justify-center gap-3 hover:bg-[#FAF9F6] transition-colors group">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#D4B996]/10 text-[#D4B996] group-hover:scale-110 transition-transform">
              <Activity size={24} />
            </div>
            <span className="font-medium text-[#3F2A2F]/40 text-[9px] uppercase tracking-[0.2em] group-hover:text-[#3F2A2F]">Evolução Mental</span>
          </button>
        </div>

        {/* Guided Sessions */}
        <div>
          <h3 className="font-serif font-light text-xl text-[#3F2A2F] mb-4 italic">Sessões Guiadas</h3>
          <div className="space-y-4">
            {[
              { title: 'Lidando com a Ansiedade', duration: '15 min', icon: Brain, color: 'text-[#3F2A2F]', bg: 'bg-[#3F2A2F]/5' },
              { title: 'Construindo Autoestima', duration: '20 min', icon: HeartHandshake, color: 'text-[#E8B4BC]', bg: 'bg-[#E8B4BC]/5' },
              { title: 'Desbloqueios Emocionais', duration: '30 min', icon: Activity, color: 'text-[#D4B996]', bg: 'bg-[#D4B996]/5' },
            ].map((session, idx) => (
              <div key={`${session.title}-${idx}`} className="p-5 rounded-[1.5rem] bg-white border border-[#3F2A2F]/5 flex items-center gap-4 hover:bg-[#FAF9F6] transition-all cursor-pointer group">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${session.bg} ${session.color} group-hover:scale-110 transition-transform`}>
                  <session.icon size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-serif font-light text-[#3F2A2F] italic mb-1">{session.title}</h4>
                  <p className="text-[9px] text-[#3F2A2F]/30 font-medium uppercase tracking-[0.2em]">{session.duration} • Áudio guiado</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
