import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Star, Sparkles, Target, Heart, Shield, Zap, Bot, CalendarCheck, TrendingUp, AlertTriangle, ChevronRight, Flame } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface LandingViewProps {
  onStart: () => void;
}

export default function LandingView({ onStart }: LandingViewProps) {
  const { theme } = useTheme();

  const features = [
    { icon: Heart, title: 'Dieta Personalizada', desc: 'Acompanhamento nutricional feito pra você.' },
    { icon: TrendingUp, title: 'Equilíbrio Emocional', desc: 'Sessões guiadas com terapeuta.' },
    { icon: Target, title: 'Treinos Personalizados', desc: 'Rotinas adaptadas ao seu objetivo.' },
    { icon: Bot, title: 'Coach IA', desc: 'Apoio motivacional 24h (exclusivo premium).' },
  ];

  const testimonials = [
    { name: 'Ana', age: 27, text: 'Depois que comecei, minha rotina mudou completamente. Me sinto mais confiante e disciplinada.', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150' },
    { name: 'Juliana', age: 32, text: 'Finalmente encontrei algo que me guia de verdade. Não é só motivação, é método.', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150' },
    { name: 'Camila', age: 24, text: 'Nunca consegui manter consistência antes. Agora virou hábito.', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150' },
  ];

  return (
    <div className="min-h-screen bg-black font-sans text-white overflow-y-auto hide-scrollbar selection:bg-rose-500 selection:text-white">
      
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 px-6 py-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="branding-title text-3xl tracking-tighter">EvoluaEla</span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={onStart} className="text-sm font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors hidden md:block">Entrar</button>
            <button onClick={onStart} className="text-xs font-black uppercase tracking-widest px-8 py-3 rounded-full bg-white text-black hover:bg-rose-500 hover:text-white transition-all">
              Começar Agora
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 md:pt-56 md:pb-32 px-6 overflow-hidden min-h-screen flex items-center">
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <motion.div 
            initial={{ opacity: 0, y: 40 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <h1 className="text-7xl md:text-[12rem] lg:text-[16rem] branding-title mb-4 leading-[0.8] tracking-[-0.08em]">
              EVOLUAELA
            </h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl md:text-3xl branding-subtitle mb-16 text-white/40"
            >
              Desperte sua melhor versão
            </motion.p>
            
            <div className="flex flex-col items-center gap-8">
              <button 
                onClick={onStart}
                className="group relative px-16 py-8 bg-white text-black branding-cta text-2xl md:text-4xl hover:bg-rose-600 hover:text-white transition-all duration-500 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-4">
                  COMECE AGORA <ArrowRight size={40} strokeWidth={3} />
                </span>
              </button>
              <p className="branding-cta text-lg text-white/20">TRANSFORME SUA VIDA</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 md:py-32 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl branding-title mb-6 text-white leading-tight uppercase tracking-tighter">
              Você sente que poderia ser muito mais, mas não sabe por onde começar?
            </h2>
            <p className="text-lg text-white/50">Muitas mulheres enfrentam os mesmos obstáculos todos os dias. Fica tranquila, você não está sozinha nessa.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              { title: 'Falta de disciplina', desc: 'Começa animada na segunda-feira, mas desiste na quarta por falta de um método claro.' },
              { title: 'Baixa autoestima', desc: 'Evita se olhar no espelho e sente que não tem controle sobre o próprio corpo e rotina.' },
              { title: 'Excesso de informação', desc: 'Fica perdida com tantas dicas na internet e acaba paralisada sem saber o que fazer.' }
            ].map((item, i) => (
              <motion.div 
                key={`problem-${i}`} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-[2rem] bg-stone-900 border border-white/10 hover:bg-stone-800 transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-rose-500/20 flex items-center justify-center mb-6">
                  <AlertTriangle size={24} className="text-rose-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-tight">{item.title}</h3>
                <p className="text-white/60 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-24 md:py-32 px-6 bg-stone-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24">
            <span className="inline-block py-1 px-3 rounded-full bg-white/10 text-xs font-bold uppercase tracking-widest text-white/50 mb-4">
              A Solução
            </span>
            <h2 className="text-4xl md:text-6xl lg:text-7xl branding-title mb-8 text-white leading-[0.9]">
              Conheça o <br /> EvoluaEla
            </h2>
            <p className="text-white/50 text-lg">O método passo a passo para você construir a disciplina que sempre quis, no seu ritmo e sem extremismos.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              { title: 'Nutricionista', icon: Heart, desc: 'Dieta individual e ajustes semanais.' },
              { title: 'Terapeuta', icon: Target, desc: 'Sessões guiadas e exercícios emocionais.' },
              { title: 'Treinos', icon: TrendingUp, desc: 'Rotinas 100% personalizadas para você.' },
              { title: 'Acompanhamento', icon: Sparkles, desc: 'Um time de especialistas cuidando de você.' }
            ].map((item, i) => (
              <motion.div 
                key={`solution-${i}`}
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-black p-8 rounded-[2rem] shadow-sm border border-white/5 hover:border-white/20 transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6" style={{ color: theme.primary }}>
                  <item.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-tight">{item.title}</h3>
                <p className="text-white/40 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Transformation Section */}
      <section className="py-24 md:py-32 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl branding-title text-center mb-16 md:mb-24 text-white uppercase tracking-tighter">A sua transformação</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center max-w-5xl mx-auto relative">
            {/* Desktop Arrow Connector */}
            <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-16 h-16 rounded-full bg-stone-900 shadow-xl border border-white/10 flex items-center justify-center text-white/30">
                <ArrowRight size={32} />
              </div>
            </div>

            {/* Antes */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }}
              className="bg-stone-900 p-10 rounded-[2.5rem] border border-white/5 relative"
            >
              <span className="absolute top-6 right-8 text-6xl opacity-10">😟</span>
              <h4 className="font-bold text-white/30 text-lg mb-4 uppercase tracking-widest">Antes</h4>
              <ul className="space-y-4">
                {['Perdida e sem direção clara', 'Desiste na primeira dificuldade', 'Autoestima baixa', 'Rotina desorganizada'].map((item, i) => (
                  <li key={`antes-${i}`} className="flex items-center gap-3 text-white/50">
                    <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-white/20"></div>
                    </div>
                    <span className="text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Depois */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }}
              className="p-10 rounded-[2.5rem] relative overflow-hidden bg-stone-800 border border-white/10 text-white"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
              <span className="absolute top-6 right-8 text-6xl opacity-20">✨</span>
              <h4 className="font-bold text-white/90 text-lg mb-4 uppercase tracking-widest">Depois</h4>
              <ul className="space-y-4 relative z-10">
                {['Focada e com plano de ação', 'Constância inabalável', 'Confiante e segura de si', 'Hábitos saudáveis automáticos'].map((item, i) => (
                  <li key={`depois-${i}`} className="flex items-center gap-3 text-white">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 size={16} className="text-emerald-400" />
                    </div>
                    <span className="text-lg font-bold">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 md:py-32 px-6 bg-stone-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24">
            <h2 className="text-4xl md:text-6xl lg:text-7xl branding-title mb-8 text-white leading-[0.9]">
              Tudo o que você <br /> precisa em um <br /> só lugar
            </h2>
            <p className="text-white/50 text-lg">Esqueça a confusão de vários apps. Aqui você tem o ecossistema completo para sua evolução.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feat, i) => (
              <motion.div 
                key={`feature-${i}`} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 bg-black rounded-[2rem] border border-white/5 hover:border-white/20 transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6" style={{ color: theme.primary }}>
                  <feat.icon size={28} />
                </div>
                <h3 className="font-bold text-white text-xl mb-3 uppercase tracking-tight">{feat.title}</h3>
                <p className="text-white/40 leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl branding-title text-center mb-16 md:mb-24 text-white uppercase tracking-tighter">Elas já estão evoluindo com a gente</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test, i) => (
              <motion.div 
                key={`testimonial-${i}`} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 bg-stone-900 rounded-[2rem] border border-white/5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, j) => <Star key={`star-${i}-${j}`} size={18} className="fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-lg text-white/70 italic mb-8 leading-relaxed">"{test.text}"</p>
                </div>
                <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                  <img src={test.img} alt={test.name} className="w-14 h-14 rounded-full object-cover border border-white/10" />
                  <div>
                    <h4 className="font-bold text-white uppercase tracking-tight">{test.name}</h4>
                    <p className="text-sm text-white/40">{test.age} anos</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Offer Section */}
      <section className="py-24 md:py-32 px-6 bg-stone-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl -mr-40 -mt-40 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-rose-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="text-center lg:text-left">
            <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 text-xs font-bold uppercase tracking-widest text-white/90 mb-8 border border-white/20">
              Oferta Especial
            </span>
            <h2 className="text-4xl md:text-6xl lg:text-7xl branding-title mb-12 text-white leading-[0.9]">
              Menos que um café por dia para mudar a sua vida.
            </h2>
            <p className="text-lg text-white/70 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Invista em você mesma. O EvoluaEla te dá todas as ferramentas para você construir a disciplina e o corpo que sempre sonhou. Você merece isso.
            </p>
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex -space-x-4">
                {testimonials.map((t, i) => (
                  <img key={`avatar-${i}`} src={t.img} className="w-12 h-12 rounded-full border-2 border-stone-900 object-cover" alt="User" />
                ))}
              </div>
              <p className="text-sm text-white/80 font-medium">Junte-se a centenas de mulheres.</p>
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            whileInView={{ opacity: 1, scale: 1 }} 
            viewport={{ once: true }}
            className="bg-black border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold uppercase tracking-tighter">Acesso Premium</h3>
              <span className="px-3 py-1.5 rounded-xl bg-white text-stone-900 text-xs font-bold uppercase tracking-widest">7 Dias Grátis</span>
            </div>
            <ul className="space-y-5 mb-10">
              {[
                'Acesso completo a todas as rotinas',
                'Coach IA Ilimitado 24/7',
                'Gráficos de evolução detalhados',
                'Sem anúncios ou interrupções',
                'Acesso à comunidade exclusiva'
              ].map((item, i) => (
                <li key={`offer-benefit-${i}`} className="flex items-center gap-4 text-base text-white/90">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={16} className="text-emerald-400" />
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <button 
              onClick={onStart}
              className="w-full py-5 rounded-2xl font-bold text-stone-900 bg-white shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 text-lg hover:-translate-y-1 uppercase tracking-tighter"
            >
              Começar meu teste grátis
            </button>
            <p className="text-xs text-white/50 text-center mt-6">O Plano Gratuito tem um limite de 3 mensagens por semana no Coach IA.</p>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 md:py-40 px-6 bg-black text-center border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl lg:text-8xl branding-title mb-12 text-white leading-[0.85]">
            Criado para mulheres que querem evoluir
          </h2>
          <p className="text-lg md:text-xl text-white/50 mb-12 max-w-2xl mx-auto leading-relaxed">
            Comece hoje e sinta a diferença já nos primeiros dias. Quanto mais você adia, mais distante fica da sua melhor versão. Vamos juntas?
          </p>
          
          <button 
            onClick={onStart}
            className="w-full sm:w-auto px-12 py-5 mx-auto rounded-[1.5rem] font-bold text-stone-900 shadow-xl hover:shadow-2xl transition-all bg-white flex items-center justify-center gap-3 text-lg mb-6 hover:-translate-y-1 uppercase tracking-tighter"
          >
            Começar minha transformação agora <ChevronRight size={24} />
          </button>
          <p className="text-base font-medium text-white/30 flex items-center justify-center gap-2">
            <Heart size={18} className="text-rose-400" /> Fica tranquila, você não precisa fazer isso sozinha
          </p>
        </div>
      </section>

    </div>
  );
}
