import React from 'react';
import { motion } from 'motion/react';
import { Logo } from '../components/Logo';
import { ArrowRight, CheckCircle2, Star, Sparkles, Target, Heart, Shield, Zap, Bot, CalendarCheck, TrendingUp, AlertTriangle, ChevronRight, Flame, Play, Users, Trophy, Activity, HeartHandshake } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface LandingViewProps {
  onStart: () => void;
}

export default function LandingView({ onStart }: LandingViewProps) {
  const { theme } = useTheme();

  const features = [
    { 
      icon: HeartHandshake, 
      title: 'Nutrição & Psicologia', 
      desc: 'Acompanhamento estratégico com especialistas para o seu equilíbrio hormonal e mental.',
      tag: 'Exclusivo'
    },
    { 
      icon: Bot, 
      title: 'Coach IA 24/7', 
      desc: 'Sua mentora pessoal disponível em tempo real para guiar cada passo da sua jornada.',
      tag: 'Tecnologia'
    },
    { 
      icon: Users, 
      title: 'Networking Feminino', 
      desc: 'Conecte-se com um ecossistema de mulheres ambiciosas e de alto valor.',
      tag: 'Comunidade'
    },
    { 
      icon: Trophy, 
      title: 'Metas & Conquistas', 
      desc: 'Um sistema de gamificação luxuoso que recompensa sua disciplina e evolução.',
      tag: 'Performance'
    },
  ];

  const episodes = [
    { id: '01', title: 'A Psicologia da Mulher de Sucesso', duration: '18 min', type: 'Mindset' },
    { id: '02', title: 'Biohacking: Otimização Hormonal', duration: '25 min', type: 'Saúde' },
    { id: '03', title: 'Elegância e Postura de Alto Valor', duration: '12 min', type: 'Estilo' },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] font-sans text-white overflow-y-auto hide-scrollbar selection:bg-[#8B4357] selection:text-white relative">
      
      {/* Fixed Background for Infinite Feel */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#0A0A0A]">
        {/* Top Glow */}
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.25, 0.15],
            x: ['-50%', '-48%', '-50%']
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-1/2 w-[140%] h-[70%] bg-gradient-to-b from-[#8B4357]/20 via-[#8B4357]/5 to-transparent rounded-full blur-[140px]" 
        />
        
        {/* Bottom Glow */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.15, 0.05]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-15%] right-[-10%] w-[70%] h-[60%] bg-[#C5A059]/10 rounded-full blur-[120px]" 
        />
        
        {/* Overall Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0A]/60 to-[#0A0A0A]" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-8 pt-[calc(2rem+env(safe-area-inset-top))] pb-8 bg-[#0A0A0A]/40 backdrop-blur-3xl border-none">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Logo size="sm" />
          </div>
          <nav className="hidden md:flex items-center gap-12 text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">
            <a href="#features" className="hover:text-[var(--color-accent)] transition-colors">O Método</a>
            <a href="#episodes" className="hover:text-[var(--color-accent)] transition-colors">Programas</a>
            <a href="#testimonials" className="hover:text-[var(--color-accent)] transition-colors">Depoimentos</a>
            <a href="#pricing" className="hover:text-[var(--color-accent)] transition-colors">Investimento</a>
          </nav>
          <div className="flex items-center gap-8">
            <button 
              onClick={onStart} 
              className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 hover:text-[var(--color-accent)] transition-colors hidden sm:block"
            >
              Entrar
            </button>
            <button 
              onClick={onStart} 
              className="px-10 py-4 rounded-full bg-[var(--color-accent)] text-black text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-white transition-all duration-500 active:scale-95 shadow-2xl"
            >
              Começar Agora
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section - AIDA: ATTENTION */}
      <section className="relative pt-[calc(8rem+env(safe-area-inset-top))] md:pt-[calc(12rem+env(safe-area-inset-top))] pb-20 md:pb-32 px-6 md:px-8 min-h-screen-dynamic flex items-center overflow-hidden z-10">
        <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-white/5 border border-white/5 mb-12">
              <Sparkles size={16} className="text-[var(--color-accent)]" />
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/40">A Referência Premium em Evolução Feminina</span>
            </div>
            <h1 className="text-5xl md:text-9xl font-serif italic font-light leading-[0.95] mb-12 tracking-tighter text-white">
              Desperte a <br />
              <span className="gradient-text">Mulher</span> que o <br />
              Mundo espera.
            </h1>
            <p className="text-xl md:text-2xl text-white/40 mb-16 max-w-xl leading-relaxed font-light">
              A plataforma definitiva de biohacking, nutrição e mindset desenhada para a mulher que não aceita nada menos que a excelência.
            </p>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-8">
              <button 
                onClick={onStart}
                className="group px-12 py-6 bg-[var(--color-accent)] text-black font-bold text-sm uppercase tracking-[0.3em] rounded-full hover:bg-white transition-all duration-500 flex items-center justify-center gap-6 active:scale-95 shadow-2xl"
              >
                Começar Minha Evolução <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </button>
              <div className="flex items-center gap-6 px-8 py-5 rounded-full border border-white/5 glass-morphism">
                <div className="flex -space-x-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0A0A0A] bg-neutral-800 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?u=${i+20}`} alt="User" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">+10k Mulheres</span>
              </div>
            </div>

            <div className="mt-24 flex items-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="flex items-center gap-3">
                <Shield size={18} className="text-[var(--color-accent)]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Ambiente Seguro</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-[var(--color-accent)]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Garantia de 7 Dias</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative z-10 rounded-[4rem] overflow-hidden border border-white/5 p-0 aspect-[4/5] bg-[#121212] shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?auto=format&fit=crop&q=80&w=800" 
                alt="Lifestyle Premium" 
                className="w-full h-full object-cover opacity-60"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
              <div className="absolute bottom-16 left-16 right-16">
                <div className="glass-morphism p-10 rounded-[2.5rem] border border-white/5">
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-[10px] font-bold text-[var(--color-accent)] uppercase tracking-[0.4em]">Status da Evolução</span>
                    <div className="flex gap-1.5">
                      {[1,2,3,4,5].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />)}
                    </div>
                  </div>
                  <h3 className="text-3xl font-serif italic mb-6 leading-tight">"A disciplina é a forma mais alta de amor próprio."</h3>
                  <div className="flex items-center gap-6">
                    <div className="h-1.5 flex-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full w-[85%] bg-[var(--color-accent)] rounded-full" />
                    </div>
                    <span className="text-[10px] font-bold text-white/40">85%</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#8B4357]/10 rounded-full blur-[120px]" />
            <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-[#C5A059]/10 rounded-full blur-[140px]" />
          </motion.div>
        </div>
      </section>

      {/* Bento Features Section - AIDA: INTEREST */}
      <section id="features" className="relative py-48 px-8 z-10 bg-[#0A0A0A]/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-32">
            <h2 className="text-6xl md:text-8xl font-serif italic mb-10 tracking-tight text-white">O Método <span className="gradient-text">EvoluaEla</span>.</h2>
            <p className="text-white/40 max-w-2xl mx-auto text-2xl font-light leading-relaxed">Uma abordagem holística e científica para a mulher que busca o topo.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {features.map((feature, i) => (
              <motion.div
                key={`feature-${feature.title}-${i}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="glass-morphism group bg-white/[0.01] border border-white/5 p-12 rounded-[3.5rem] hover:bg-white/[0.03] transition-all duration-700"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-10 group-hover:bg-[var(--color-accent)] group-hover:text-black transition-all duration-700">
                  <feature.icon size={32} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--color-accent)] mb-6 block">{feature.tag}</span>
                <h3 className="text-2xl font-bold mb-6 tracking-tight">{feature.title}</h3>
                <p className="text-white/40 text-lg leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Episodes/Programs Section - AIDA: DESIRE */}
      <section id="episodes" className="relative py-48 px-8 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
            <div className="max-w-2xl">
              <h2 className="text-6xl md:text-7xl font-serif italic mb-8 tracking-tight text-white">Conteúdo de <span className="gradient-text">Elite</span>.</h2>
              <p className="text-white/40 text-2xl font-light leading-relaxed">Aulas cinematográficas e protocolos práticos para sua transformação diária.</p>
            </div>
            <button className="text-[var(--color-accent)] text-[10px] font-bold uppercase tracking-[0.4em] flex items-center gap-4 hover:gap-8 transition-all duration-500">
              Explorar Catálogo Completo <ChevronRight size={20} />
            </button>
          </div>

          <div className="grid gap-8">
            {episodes.map((ep, i) => (
              <motion.div
                key={ep.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="group flex items-center justify-between p-10 rounded-[2.5rem] bg-white/[0.01] border border-white/5 hover:bg-white/[0.03] hover:border-[var(--color-accent)]/30 transition-all duration-700 cursor-pointer"
              >
                <div className="flex items-center gap-12">
                  <span className="text-4xl font-serif italic text-white/10 group-hover:text-[var(--color-accent)] transition-colors duration-700">{ep.id}</span>
                  <div>
                    <h4 className="text-3xl font-bold mb-3 tracking-tight">{ep.title}</h4>
                    <div className="flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
                      <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/5">{ep.type}</span>
                      <span className="flex items-center gap-3"><CalendarCheck size={16} /> {ep.duration}</span>
                    </div>
                  </div>
                </div>
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[var(--color-accent)] group-hover:text-black transition-all duration-700 shadow-2xl">
                  <Play size={28} fill="currentColor" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - SOCIAL PROOF */}
      <section id="testimonials" className="relative py-48 px-8 z-10 bg-[#0A0A0A]/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-32">
            <h2 className="text-6xl md:text-8xl font-serif italic mb-10 tracking-tight text-white">Vidas <span className="gradient-text">Transformadas</span>.</h2>
            <p className="text-white/40 max-w-2xl mx-auto text-2xl font-light">Histórias reais de mulheres que decidiram ser protagonistas.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                name: "Alessandra Martins",
                role: "CEO & Mentora",
                text: "O EvoluaEla não é apenas um app, é um estilo de vida. A clareza mental que conquistei com os protocolos de mindset me permitiu dobrar o faturamento da minha empresa.",
                image: "https://i.pravatar.cc/150?u=alessandra"
              },
              {
                name: "Carolina Valente",
                role: "Médica",
                text: "Como profissional da saúde, sou exigente. O biohacking feminino proposto aqui é sério, científico e extremamente eficaz para o nosso equilíbrio hormonal.",
                image: "https://i.pravatar.cc/150?u=carolina"
              },
              {
                name: "Isabela Rocha",
                role: "Arquiteta",
                text: "A comunidade é o maior diferencial. Estar cercada de mulheres que buscam o mesmo nível de excelência é o combustível que eu precisava para não parar.",
                image: "https://i.pravatar.cc/150?u=isabela"
              }
            ].map((testimonial, i) => (
              <motion.div
                key={`testimonial-${i}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="glass-morphism bg-white/[0.01] border border-white/5 p-12 rounded-[3.5rem] relative"
              >
                <div className="flex items-center gap-6 mb-10">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[var(--color-accent)] shadow-2xl">
                    <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl">{testimonial.name}</h4>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[var(--color-accent)] mb-8">
                  {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p className="text-white/60 text-xl leading-relaxed font-light italic">"{testimonial.text}"</p>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-32 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/20 mb-12">Resultados Reais • +10.000 Alunas</p>
            <div className="flex justify-center gap-16 opacity-10">
              {/* Placeholder for logos or trust badges */}
              <div className="h-10 w-32 bg-white rounded-lg" />
              <div className="h-10 w-32 bg-white rounded-lg" />
              <div className="h-10 w-32 bg-white rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - AIDA: ACTION */}
      <section id="pricing" className="relative py-32 md:py-48 px-6 md:px-8 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 md:mb-32">
            <h2 className="text-5xl md:text-8xl font-serif italic mb-8 md:mb-10 tracking-tight text-white">Seu <span className="gradient-text">Investimento</span>.</h2>
            <p className="text-white/40 max-w-2xl mx-auto text-xl md:text-2xl font-light">O valor de uma nova vida é incalculável. O acesso a ela é exclusivo.</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="p-10 md:p-20 rounded-[3rem] md:rounded-[5rem] bg-gradient-to-br from-[#121212] to-[#0A0A0A] border border-white/5 flex flex-col h-full shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none hidden md:block">
                <Logo size="lg" className="scale-[4] rotate-12" />
              </div>
              
              <div className="flex flex-col items-center text-center mb-12 md:mb-16 gap-6">
                <div className="inline-flex px-6 py-2 rounded-full bg-[var(--color-accent)] text-black text-[10px] font-bold uppercase tracking-[0.3em]">
                  Plano Mensal
                </div>
                <h3 className="text-4xl md:text-6xl font-bold text-white tracking-tight">Círculo Premium</h3>
                <p className="text-white/40 text-lg md:text-xl font-light max-w-md">Tudo o que você precisa para sua transformação definitiva, com flexibilidade total.</p>
              </div>

              <div className="flex flex-col items-center text-center mb-12">
                <div className="text-6xl md:text-8xl font-serif italic text-white tracking-tighter mb-2">R$ 109,90<span className="text-xl md:text-2xl text-white/40 font-sans font-light tracking-normal ml-2">/mês</span></div>
                <div className="text-[10px] md:text-xs font-bold text-[var(--color-accent)] uppercase tracking-[0.3em]">Cobrado mensalmente • Cancele quando quiser</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-12 md:mb-16">
                <ul className="space-y-6">
                  {[
                    'Acompanhamento com Nutricionista',
                    'Suporte Terapêutico Mensal',
                    'Protocolos de Biohacking',
                    'Coach IA 24/7 Ilimitado'
                  ].map((item, i) => (
                    <li key={`benefit-primary-${i}`} className="flex items-center gap-4 text-white font-medium text-base md:text-lg">
                      <CheckCircle2 size={20} className="text-[var(--color-accent)] shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <ul className="space-y-6">
                  {[
                    'Networking de Alto Valor',
                    'Aulas de Etiqueta & Estilo',
                    'Mindset de Performance',
                    'Comunidade Exclusiva'
                  ].map((item, i) => (
                    <li key={`benefit-secondary-${i}`} className="flex items-center gap-4 text-white/40 text-base md:text-lg font-light">
                      <CheckCircle2 size={20} className="text-[var(--color-accent)]/30 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-8">
                <button 
                  onClick={onStart}
                  className="w-full py-6 md:py-8 rounded-full bg-[var(--color-accent)] text-black font-bold text-xs md:text-sm uppercase tracking-[0.4em] hover:bg-white transition-all duration-700 shadow-[0_0_50px_rgba(197,160,89,0.15)] active:scale-95"
                >
                  Garantir Minha Vaga Premium
                </button>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-8 md:gap-12 opacity-30">
                  <div className="flex items-center gap-3">
                    <Shield size={16} />
                    <span className="text-[9px] font-bold uppercase tracking-[0.3em]">Pagamento 100% Seguro</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Star size={16} />
                    <span className="text-[9px] font-bold uppercase tracking-[0.3em]">Satisfação Garantida</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="relative py-48 px-8 z-10 bg-[#0A0A0A]/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-6xl font-serif italic mb-8 tracking-tight text-white">Esclarecimentos.</h2>
            <p className="text-white/40 text-2xl font-light">Sua jornada deve começar com clareza absoluta.</p>
          </div>
          <div className="grid gap-8">
            {[
              { q: "O EvoluaEla é para quem está começando do zero?", a: "Sim. Nossa metodologia foi desenhada para guiar desde a mulher que está iniciando sua jornada de autoconhecimento até aquela que já busca alta performance e quer refinar seus protocolos." },
              { q: "Como funciona o suporte das especialistas?", a: "Dentro da plataforma, você tem canais diretos de comunicação com nossa equipe de nutrição e psicologia para tirar dúvidas pontuais sobre os protocolos e aulas." },
              { q: "O acesso é imediato?", a: "Imediato. Assim que sua inscrição for confirmada, você receberá os dados de acesso no seu e-mail e poderá começar sua primeira aula em menos de 2 minutos." },
              { q: "Existe algum tipo de fidelidade?", a: "Não. Acreditamos tanto no valor da nossa entrega que você é livre para cancelar sua renovação a qualquer momento, sem burocracias." }
            ].map((item, i) => (
              <div key={`faq-${i}`} className="p-12 rounded-[3.5rem] bg-white/[0.01] border border-white/5 hover:border-white/10 transition-all duration-500">
                <h4 className="text-2xl font-bold mb-6 tracking-tight text-white">{item.q}</h4>
                <p className="text-xl text-white/40 leading-relaxed font-light">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-48 px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="relative rounded-[5rem] overflow-hidden bg-gradient-to-br from-[var(--color-accent)] to-[#8B4357] p-20 md:p-40 text-center shadow-2xl">
            <div className="absolute inset-0 bg-black/95" />
            <div className="relative z-10">
              <h2 className="text-6xl md:text-9xl font-serif italic text-white mb-12 tracking-tighter leading-[0.9]">Sua nova vida <br /> não pode esperar.</h2>
              <p className="text-white/40 text-2xl md:text-3xl mb-20 max-w-2xl mx-auto font-light leading-relaxed">
                O convite foi feito. A decisão de cruzar o portal da excelência é exclusivamente sua.
              </p>
              <button 
                onClick={onStart}
                className="px-20 py-8 bg-[var(--color-accent)] text-black font-bold text-sm uppercase tracking-[0.4em] rounded-full hover:bg-white hover:scale-105 active:scale-95 transition-all duration-700 shadow-2xl"
              >
                Começar Agora
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-40 px-8 border-t border-white/5 z-10 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-24 mb-40">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-12">
                <Logo size="md" />
              </div>
              <p className="text-white/40 max-w-sm text-xl font-light leading-relaxed mb-12">
                A plataforma definitiva para a mulher que busca excelência em todas as áreas da vida. Ciência, sofisticação e resultados.
              </p>
              <div className="flex gap-8">
                {/* Social Icons Placeholder */}
                {[1,2,3].map(i => <div key={i} className="w-12 h-12 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:bg-[var(--color-accent)] hover:text-black transition-all duration-500 cursor-pointer" />)}
              </div>
            </div>
            <div>
              <h5 className="text-[10px] font-bold uppercase tracking-[0.4em] text-white mb-12">Ecossistema</h5>
              <ul className="space-y-8 text-white/40 text-sm font-medium">
                <li><a href="#" className="hover:text-[var(--color-accent)] transition-colors">O Método</a></li>
                <li><a href="#" className="hover:text-[var(--color-accent)] transition-colors">Biohacking</a></li>
                <li><a href="#" className="hover:text-[var(--color-accent)] transition-colors">Mindset</a></li>
                <li><a href="#" className="hover:text-[var(--color-accent)] transition-colors">Networking</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-[10px] font-bold uppercase tracking-[0.4em] text-white mb-12">Suporte & Legal</h5>
              <ul className="space-y-8 text-white/40 text-sm font-medium">
                <li><a href="#" className="hover:text-[var(--color-accent)] transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-[var(--color-accent)] transition-colors">Privacidade</a></li>
                <li><a href="#" className="hover:text-[var(--color-accent)] transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-[var(--color-accent)] transition-colors">Fale Conosco</a></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center pt-20 border-t border-white/5 gap-12">
            <div className="flex flex-col items-center md:items-start gap-6">
              <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.4em]">© 2026 EvoluaEla. Todos os direitos reservados.</p>
              <div className="flex gap-6 opacity-10 grayscale">
                {/* Payment Icons Placeholder */}
                <div className="h-8 w-14 bg-white rounded-lg" />
                <div className="h-8 w-14 bg-white rounded-lg" />
                <div className="h-8 w-14 bg-white rounded-lg" />
              </div>
            </div>
            <div className="flex items-center gap-12">
              <div className="flex items-center gap-4 px-6 py-3 rounded-xl border border-white/5 bg-white/[0.01]">
                <Shield size={20} className="text-[var(--color-accent)]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">Site Seguro & Criptografado</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
