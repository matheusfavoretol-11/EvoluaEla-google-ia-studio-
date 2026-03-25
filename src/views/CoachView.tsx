import { MessageCircle, Sparkles, Lock, ChevronRight } from 'lucide-react';

export default function CoachView() {
  const articles = [
    { id: 1, title: 'Como manter a disciplina nos finais de semana', readTime: '3 min' },
    { id: 2, title: 'A importância do sono para o emagrecimento', readTime: '4 min' },
    { id: 3, title: 'Vencendo a autossabotagem', readTime: '5 min' },
  ];

  return (
    <div className="p-6 space-y-8">
      <header>
        <h2 className="text-3xl font-serif font-bold text-stone-800 mb-2">Mentalidade & Coach</h2>
        <p className="text-stone-500 text-sm font-medium uppercase tracking-widest">O corpo alcança o que a mente acredita.</p>
      </header>

      {/* Direct Support / Coach */}
      <section className="bg-gradient-to-br from-stone-800 to-stone-900 rounded-[2rem] p-8 text-white relative overflow-hidden premium-shadow">
        <div className="relative z-10">
          <h3 className="text-2xl font-serif font-bold mb-3">Fale com seu Coach</h3>
          <p className="text-stone-300 text-sm mb-8 leading-relaxed font-medium">
            Precisa de ajustes no plano ou está sem motivação? Estamos aqui para te ajudar.
          </p>
          <button className="bg-white text-stone-900 font-bold py-4 px-8 rounded-[1.5rem] flex items-center gap-2 hover:bg-stone-100 transition-colors shadow-md">
            <MessageCircle size={20} />
            Iniciar Chat
          </button>
        </div>
        <div className="absolute -right-6 -bottom-6 text-stone-700/50">
          <MessageCircle size={140} />
        </div>
        
        {/* Premium Overlay for Essential Plan */}
        <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-20 p-6 text-center">
          <Lock className="text-amber-400 mb-4" size={32} />
          <h4 className="font-serif font-bold text-2xl mb-2">Acesso Exclusivo</h4>
          <p className="text-sm text-stone-300 mb-6 font-medium">O chat direto com o coach está disponível no Plano Completo.</p>
          <button className="gradient-bg text-white font-bold py-3 px-8 rounded-[1.5rem] text-sm shadow-lg hover:shadow-xl transition-all">
            Ver Planos
          </button>
        </div>
      </section>

      {/* Mindset Content */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="text-amber-400" size={20} />
          <h3 className="text-xl font-serif font-bold text-stone-800">Doses de Motivação</h3>
        </div>
        
        <div className="space-y-4">
          {articles.map(article => (
            <div key={article.id} className="bg-white p-5 rounded-[1.5rem] soft-shadow-sm border border-stone-100 flex justify-between items-center cursor-pointer hover:border-stone-200 transition-colors">
              <div>
                <h4 className="font-bold text-stone-800 mb-1">{article.title}</h4>
                <span className="text-xs text-stone-400 font-medium uppercase tracking-wider block">Leitura: {article.readTime}</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 shrink-0">
                <ChevronRight size={18} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
