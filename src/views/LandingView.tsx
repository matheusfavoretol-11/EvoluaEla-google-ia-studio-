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
    { icon: Heart, title: 'Plano Alimentar', desc: 'Acompanhamento nutricional personalizado.' },
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
    <div className="min-h-screen bg-stone-50 font-sans text-stone-800 overflow-y-auto hide-scrollbar selection:bg-rose-200 selection:text-rose-900">
      
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 px-6 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white font-serif font-bold text-xl shadow-md overflow-hidden">
              <img 
                src="/logo.png" 
                alt="EvoluaEla Logo" 
                className="w-full h-full object-cover" 
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  if (e.currentTarget.nextElementSibling) {
                    (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'block';
                  }
                }} 
              />
              <span className="hidden">E</span>
            </div>
            <span className="font-serif font-bold text-2xl text-stone-800 tracking-tight">EvoluaEla</span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={onStart} className="text-sm font-bold text-stone-500 hover:text-stone-900 transition-colors hidden md:block">Entrar</button>
            <button onClick={onStart} className="text-sm font-bold px-5 py-2 rounded-xl gradient-bg text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
              Começar Grátis
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 px-6 overflow-hidden min-h-[90vh] flex items-center">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-rose-100/50 rounded-full blur-3xl opacity-50 -mr-40 -mt-40 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-100/50 rounded-full blur-3xl opacity-50 -ml-40 -mb-40 pointer-events-none"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left: Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-white shadow-sm border border-stone-100 text-xs font-bold uppercase tracking-widest text-stone-500 mb-8">
              O seu novo estilo de vida
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold leading-[1.1] mb-6 text-stone-800 tracking-tight">
              Sua evolução <span className="text-transparent bg-clip-text gradient-bg">guiada por especialistas</span>.
            </h1>
            <p className="text-stone-500 text-lg md:text-xl mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Transformação completa: corpo, mente e emocional. Pare de tentar sozinha e tenha um time de profissionais acompanhando cada passo da sua jornada.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
              <button 
                onClick={onStart}
                className="w-full sm:w-auto px-10 py-5 rounded-[1.5rem] font-bold text-white shadow-xl hover:shadow-2xl transition-all gradient-bg flex items-center justify-center gap-3 text-lg hover:-translate-y-1"
              >
                Começar agora <ArrowRight size={22} />
              </button>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-bold text-stone-700">7 dias grátis</p>
                <p className="text-xs text-stone-500">Cancele quando quiser</p>
              </div>
            </div>
          </motion.div>

          {/* Right: Abstract UI Composition */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block h-[600px] w-full"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-gradient-to-tr from-rose-200 to-purple-200 rounded-full blur-3xl opacity-40"></div>
            
            {/* Floating Card 1: Daily Goal */}
            <motion.div 
              animate={{ y: [-10, 10, -10] }} 
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-10 right-10 bg-white p-6 rounded-3xl shadow-xl border border-stone-100 w-72 z-20"
            >
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-2xl gradient-bg-light flex items-center justify-center text-rose-500"><Target size={24}/></div>
                <div>
                  <p className="text-sm font-bold text-stone-800">Meta Diária</p>
                  <p className="text-xs text-stone-500">Concluída!</p>
                </div>
              </div>
              <div className="h-2.5 w-full bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full w-full gradient-bg rounded-full"></div>
              </div>
            </motion.div>

            {/* Floating Card 2: AI Coach */}
            <motion.div 
              animate={{ y: [10, -10, 10] }} 
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-20 left-0 bg-white p-6 rounded-3xl shadow-xl border border-stone-100 w-80 z-20"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-white shrink-0 shadow-md"><Bot size={24}/></div>
                <div>
                  <p className="text-sm font-bold text-stone-800 mb-1">Coach IA</p>
                  <p className="text-sm text-stone-600 leading-relaxed">Você está indo super bem esta semana! Que tal focar em hidratação hoje? 💧</p>
                </div>
              </div>
            </motion.div>

            {/* Floating Card 3: Streak */}
            <motion.div 
              animate={{ y: [-5, 5, -5] }} 
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-[2.5rem] shadow-2xl border border-stone-100 w-64 z-30"
            >
              <div className="text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-orange-50 flex items-center justify-center text-orange-500 mb-4">
                  <Flame size={40}/>
                </div>
                <p className="text-4xl font-serif font-bold text-stone-800 mb-1">12 Dias</p>
                <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Ofensiva</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 md:py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-6 text-stone-800 leading-tight">
              Você sente que poderia ser muito mais, mas não sabe por onde começar?
            </h2>
            <p className="text-lg text-stone-500">Muitas mulheres enfrentam os mesmos obstáculos diariamente. Você não está sozinha.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              { title: 'Falta de disciplina', desc: 'Começa animada na segunda-feira, mas desiste na quarta por falta de um método claro.' },
              { title: 'Baixa autoestima', desc: 'Evita se olhar no espelho e sente que não tem controle sobre o próprio corpo e rotina.' },
              { title: 'Excesso de informação', desc: 'Fica perdida com tantas dicas na internet e acaba paralisada sem saber o que fazer.' }
            ].map((item, i) => (
              <motion.div 
                key={item.title} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-[2rem] bg-rose-50/30 border border-rose-100/50 hover:bg-rose-50/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center mb-6">
                  <AlertTriangle size={24} className="text-rose-500" />
                </div>
                <h3 className="text-xl font-bold text-stone-800 mb-3">{item.title}</h3>
                <p className="text-stone-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-24 md:py-32 px-6 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24">
            <span className="inline-block py-1 px-3 rounded-full bg-stone-200/50 text-xs font-bold uppercase tracking-widest text-stone-500 mb-4">
              A Solução
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-6 text-stone-800">Apresentamos o EvoluaEla</h2>
            <p className="text-stone-500 text-lg">O método passo a passo para construir a disciplina que você sempre quis, sem extremismos.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              { title: 'Nutricionista', icon: Heart, desc: 'Plano alimentar individual e ajustes semanais.' },
              { title: 'Terapeuta', icon: Target, desc: 'Sessões guiadas e exercícios emocionais.' },
              { title: 'Treinos', icon: TrendingUp, desc: 'Rotinas 100% personalizadas para você.' },
              { title: 'Acompanhamento', icon: Sparkles, desc: 'Um time de especialistas cuidando de você.' }
            ].map((item, i) => (
              <motion.div 
                key={item.title}
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100 hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-14 rounded-2xl gradient-bg-light flex items-center justify-center mb-6" style={{ color: theme.primary }}>
                  <item.icon size={28} />
                </div>
                <h3 className="text-lg font-bold text-stone-800 mb-2">{item.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Transformation Section */}
      <section className="py-24 md:py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-center mb-16 md:mb-24 text-stone-800">A sua transformação</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center max-w-5xl mx-auto relative">
            {/* Desktop Arrow Connector */}
            <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-16 h-16 rounded-full bg-white shadow-xl border border-stone-100 flex items-center justify-center text-stone-400">
                <ArrowRight size={32} />
              </div>
            </div>

            {/* Antes */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }}
              className="bg-stone-50 p-10 rounded-[2.5rem] border border-stone-200 relative"
            >
              <span className="absolute top-6 right-8 text-6xl opacity-10">😟</span>
              <h4 className="font-bold text-stone-400 text-lg mb-4 uppercase tracking-widest">Antes</h4>
              <ul className="space-y-4">
                {['Perdida e sem direção clara', 'Desiste na primeira dificuldade', 'Autoestima baixa', 'Rotina desorganizada'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-stone-600">
                    <div className="w-6 h-6 rounded-full bg-stone-200 flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-stone-400"></div>
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
              className="p-10 rounded-[2.5rem] premium-shadow relative overflow-hidden gradient-bg text-white"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
              <span className="absolute top-6 right-8 text-6xl opacity-20">✨</span>
              <h4 className="font-bold text-white/90 text-lg mb-4 uppercase tracking-widest">Depois</h4>
              <ul className="space-y-4 relative z-10">
                {['Focada e com plano de ação', 'Constância inabalável', 'Confiante e segura de si', 'Hábitos saudáveis automáticos'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 size={16} className="text-white" />
                    </div>
                    <span className="text-lg font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 md:py-32 px-6 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-6 text-stone-800">Tudo que você precisa em um só lugar</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feat, i) => (
              <motion.div 
                key={feat.title} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 bg-white rounded-[2rem] shadow-sm border border-stone-100 hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-14 rounded-2xl gradient-bg-light flex items-center justify-center mb-6" style={{ color: theme.primary }}>
                  <feat.icon size={28} />
                </div>
                <h3 className="font-bold text-stone-800 text-xl mb-3">{feat.title}</h3>
                <p className="text-stone-500 leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 md:py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-center mb-16 md:mb-24 text-stone-800">Elas já estão evoluindo</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test, i) => (
              <motion.div 
                key={test.name} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 bg-stone-50 rounded-[2rem] border border-stone-100 flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, j) => <Star key={`star-${j}`} size={18} className="fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-lg text-stone-700 italic mb-8 leading-relaxed">"{test.text}"</p>
                </div>
                <div className="flex items-center gap-4 pt-6 border-t border-stone-200">
                  <img src={test.img} alt={test.name} className="w-14 h-14 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-stone-800">{test.name}</h4>
                    <p className="text-sm text-stone-500">{test.age} anos</p>
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
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight">
              Menos que um café por dia para mudar sua vida.
            </h2>
            <p className="text-lg text-white/70 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Invista em você mesma. O EvoluaEla fornece todas as ferramentas necessárias para você construir a disciplina e o corpo que sempre sonhou.
            </p>
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex -space-x-4">
                {testimonials.map((t) => (
                  <img key={t.name} src={t.img} className="w-12 h-12 rounded-full border-2 border-stone-900 object-cover" alt="User" />
                ))}
              </div>
              <p className="text-sm text-white/80 font-medium">Junte-se a centenas de mulheres.</p>
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            whileInView={{ opacity: 1, scale: 1 }} 
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-8 md:p-10 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold">Plano Premium</h3>
              <span className="px-3 py-1.5 rounded-xl bg-white text-stone-900 text-xs font-bold uppercase tracking-widest">7 Dias Grátis</span>
            </div>
            <ul className="space-y-5 mb-10">
              {[
                'Acesso completo a todas as rotinas',
                'Coach IA Ilimitado 24/7',
                'Gráficos de evolução detalhados',
                'Sem anúncios ou interrupções',
                'Acesso à comunidade exclusiva'
              ].map((item) => (
                <li key={item} className="flex items-center gap-4 text-base text-white/90">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={16} className="text-emerald-400" />
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <button 
              onClick={onStart}
              className="w-full py-5 rounded-2xl font-bold text-stone-900 bg-white shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 text-lg hover:-translate-y-1"
            >
              Começar meu teste grátis
            </button>
            <p className="text-xs text-white/50 text-center mt-6">Plano Free limitado a 3 mensagens por semana no Coach IA.</p>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 md:py-40 px-6 bg-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-8 text-stone-800 leading-tight">
            Criado especialmente para mulheres que querem evoluir de verdade
          </h2>
          <p className="text-lg md:text-xl text-stone-500 mb-12 max-w-2xl mx-auto leading-relaxed">
            Comece hoje e veja resultados já nos primeiros dias. Quanto mais você adia, mais distante fica da sua melhor versão.
          </p>
          
          <button 
            onClick={onStart}
            className="w-full sm:w-auto px-12 py-5 mx-auto rounded-[1.5rem] font-bold text-white shadow-xl hover:shadow-2xl transition-all gradient-bg flex items-center justify-center gap-3 text-lg mb-6 hover:-translate-y-1"
          >
            Começar minha transformação agora <ChevronRight size={24} />
          </button>
          <p className="text-base font-medium text-stone-400 flex items-center justify-center gap-2">
            <Heart size={18} className="text-rose-400" /> Você não precisa fazer isso sozinha
          </p>
        </div>
      </section>

    </div>
  );
}
