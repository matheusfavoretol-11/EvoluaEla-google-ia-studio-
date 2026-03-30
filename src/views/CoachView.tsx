import { MessageCircle, Sparkles, Lock, ChevronRight } from 'lucide-react';

export default function CoachView() {
  const articles = [
    { id: 1, title: 'Como manter a disciplina nos finais de semana', readTime: '3 min' },
    { id: 2, title: 'A importância do sono para o emagrecimento', readTime: '4 min' },
    { id: 3, title: 'Vencendo a autossabotagem', readTime: '5 min' },
  ];

  return (
    <div className="p-6 space-y-8 bg-[#FAF9F6] min-h-full">
      <header>
        <h2 className="text-3xl font-serif font-light text-[#3F2A2F] mb-2">Mentalidade & Coach</h2>
        <p className="text-[#3F2A2F]/40 text-[10px] font-medium uppercase tracking-[0.2em]">O corpo alcança o que a mente acredita.</p>
      </header>

      {/* Direct Support / Coach */}
      <section className="bg-[#3F2A2F] rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10">
          <h3 className="text-2xl font-serif font-light mb-3 italic">Fale com seu Coach</h3>
          <p className="text-white/60 text-sm mb-8 leading-relaxed font-light">
            Precisa de ajustes no plano ou está sem motivação? Estamos aqui para te ajudar.
          </p>
          <button className="bg-white text-[#3F2A2F] font-light py-4 px-8 rounded-full flex items-center gap-2 hover:bg-[#FAF9F6] transition-colors shadow-md text-sm uppercase tracking-widest">
            <MessageCircle size={18} />
            Iniciar Chat
          </button>
        </div>
        <div className="absolute -right-6 -bottom-6 text-white/5">
          <MessageCircle size={140} />
        </div>
        
        {/* Premium Overlay for Essential Plan */}
        <div className="absolute inset-0 bg-[#3F2A2F]/90 backdrop-blur-sm flex flex-col items-center justify-center z-20 p-6 text-center">
          <Lock className="text-[#D4B996] mb-4" size={28} />
          <h4 className="font-serif font-light text-2xl mb-2 italic">Acesso Exclusivo</h4>
          <p className="text-sm text-white/60 mb-6 font-light">O chat direto com o coach está disponível no Plano Premium.</p>
          <button className="bg-[#E8B4BC] text-white font-light py-3 px-8 rounded-full text-[10px] shadow-lg hover:shadow-xl transition-all uppercase tracking-[0.2em]">
            Conhecer os Planos
          </button>
        </div>
      </section>

      {/* Mindset Content */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="text-[#D4B996]" size={18} />
          <h3 className="text-xl font-serif font-light text-[#3F2A2F]">Doses de Motivação</h3>
        </div>
        
        <div className="space-y-4">
          {articles.map(article => (
            <div key={article.id} className="bg-white p-5 rounded-[1.5rem] border border-[#3F2A2F]/5 flex justify-between items-center cursor-pointer hover:border-[#3F2A2F]/10 transition-colors">
              <div>
                <h4 className="font-light text-[#3F2A2F] mb-1 text-lg">{article.title}</h4>
                <span className="text-[9px] text-[#3F2A2F]/30 font-medium uppercase tracking-[0.2em] block">Leitura: {article.readTime}</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#FAF9F6] flex items-center justify-center text-[#3F2A2F]/20 shrink-0">
                <ChevronRight size={18} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
