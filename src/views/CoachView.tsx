import { MessageCircle, Sparkles, Lock, ChevronRight } from 'lucide-react';

export default function CoachView() {
  const articles = [
    { id: 1, title: 'Como manter a disciplina nos finais de semana', readTime: '3 min' },
    { id: 2, title: 'A importância do sono para o emagrecimento', readTime: '4 min' },
    { id: 3, title: 'Vencendo a autossabotagem', readTime: '5 min' },
  ];

  return (
    <div className="p-6 space-y-10 bg-[#0A0A0A] min-h-full text-white font-sans relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#E8B4BC]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <header className="relative z-10">
        <h2 className="text-5xl font-bold text-white mb-3 tracking-tighter">Mentalidade & <span className="gradient-text">Coach</span></h2>
        <p className="text-sm font-bold text-white/30 uppercase tracking-widest">O corpo alcança o que a mente acredita.</p>
      </header>

      {/* Direct Support / Coach */}
      <section className="bg-gradient-to-br from-[#141414] to-[#0A0A0A] rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="relative z-10">
          <h3 className="text-3xl font-bold mb-4 tracking-tight">Fale com seu <span className="text-[#D4B996]">Coach</span></h3>
          <p className="text-white/40 text-base mb-10 leading-relaxed font-bold max-w-md">
            Precisa de ajustes no plano ou está sem motivação? Estamos aqui para te ajudar em cada passo.
          </p>
          <button className="bg-white text-black font-bold py-5 px-10 rounded-2xl flex items-center gap-3 hover:scale-105 transition-all shadow-2xl text-xs uppercase tracking-widest">
            <MessageCircle size={20} />
            Iniciar Chat
          </button>
        </div>
        <div className="absolute -right-10 -bottom-10 text-white/5 rotate-12">
          <MessageCircle size={200} />
        </div>
        
        {/* Premium Overlay for Essential Plan */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center z-20 p-8 text-center border border-white/10 rounded-[2.5rem]">
          <div className="w-20 h-20 rounded-3xl bg-[#D4B996]/10 flex items-center justify-center mb-6 border border-[#D4B996]/20">
            <Lock className="text-[#D4B996]" size={32} />
          </div>
          <h4 className="font-bold text-3xl mb-3 tracking-tight">Acesso <span className="text-[#D4B996]">Exclusivo</span></h4>
          <p className="text-sm text-white/40 mb-8 font-bold max-w-xs leading-relaxed">O chat direto com o coach está disponível apenas no Plano Premium.</p>
          <button className="bg-gradient-to-r from-[#E8B4BC] to-[#D4B996] text-black font-bold py-4 px-10 rounded-2xl text-[10px] shadow-2xl hover:scale-105 transition-all uppercase tracking-widest">
            Conhecer os Planos
          </button>
        </div>
      </section>

      {/* Mindset Content */}
      <section className="relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#D4B996]/10 flex items-center justify-center border border-[#D4B996]/20">
            <Sparkles className="text-[#D4B996]" size={20} />
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight">Doses de Motivação</h3>
        </div>
        
        <div className="grid gap-5">
          {articles.map(article => (
            <div key={article.id} className="glass-card p-6 rounded-[2rem] border border-white/5 flex justify-between items-center cursor-pointer hover:border-[#E8B4BC]/30 transition-all group shadow-2xl">
              <div className="flex-1">
                <h4 className="font-bold text-white mb-2 text-lg group-hover:text-[#E8B4BC] transition-colors tracking-tight">{article.title}</h4>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest block">Leitura: {article.readTime}</span>
                  <div className="w-1 h-1 rounded-full bg-white/10"></div>
                  <span className="text-[10px] text-[#D4B996] font-bold uppercase tracking-widest block">Mindset</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 group-hover:bg-[#E8B4BC] group-hover:text-black transition-all shrink-0 border border-white/5">
                <ChevronRight size={24} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
