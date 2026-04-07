import React from 'react';
import { motion } from 'motion/react';
import { Logo } from '../components/Logo';
import { ArrowRight, CheckCircle2, Star, Sparkles, Target, Heart, Shield, Zap, Bot, CalendarCheck, TrendingUp, AlertTriangle, ChevronRight, Flame, Play, Users, Trophy, Activity, HeartHandshake, Quote, Crown } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-[#0F0A1F] font-sans text-white overflow-y-auto hide-scrollbar selection:bg-[#D81BFF] selection:text-white relative">
      
      {/* Fixed Background for Infinite Feel */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#0F0A1F]">
        {/* Top Glow */}
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.25, 0.15],
            x: ['-50%', '-48%', '-50%']
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-1/2 w-[140%] h-[70%] bg-gradient-to-b from-[#D81BFF]/20 via-[#D81BFF]/5 to-transparent rounded-full blur-[140px]" 
        />
        
        {/* Bottom Glow */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.15, 0.05]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-15%] right-[-10%] w-[70%] h-[60%] bg-[#F8C1FF]/10 rounded-full blur-[120px]" 
        />
        
        {/* Overall Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F0A1F]/60 to-[#0F0A1F]" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-8 pt-[calc(2rem+env(safe-area-inset-top))] pb-8 bg-[#0F0A1F]/40 backdrop-blur-3xl border-none">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Logo size="sm" />
          </div>
          <nav className="hidden md:flex items-center gap-12 text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">
            <a href="#features" className="hover:text-[#D81BFF] transition-colors">O Método</a>
            <a href="#testimonials" className="hover:text-[#D81BFF] transition-colors">Depoimentos</a>
            <a href="#pricing" className="hover:text-[#D81BFF] transition-colors">Investimento</a>
          </nav>
          <div className="flex items-center gap-8">
            <button 
              onClick={onStart} 
              className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 hover:text-[#D81BFF] transition-colors hidden sm:block"
            >
              Entrar
            </button>
            <button 
              onClick={onStart} 
              className="luxury-button px-10 py-4 rounded-full text-white text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-500 active:scale-95 shadow-2xl"
            >
              Começar Agora
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-[calc(8rem+env(safe-area-inset-top))] md:pt-[calc(12rem+env(safe-area-inset-top))] pb-20 md:pb-32 px-6 md:px-8 min-h-screen-dynamic flex items-center overflow-hidden z-10">
        <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-white/5 border border-white/5 mb-12">
              <Sparkles size={16} className="text-[#D81BFF]" />
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/40">A Referência Premium em Evolução Feminina</span>
            </div>
            <h1 className="text-5xl md:text-9xl font-sans font-bold leading-[0.95] mb-12 tracking-tighter text-white">
              Desperte a <br />
              <span className="text-[#D81BFF]">Mulher</span> que o <br />
              Mundo espera.
            </h1>
            <p className="text-xl md:text-2xl text-white/40 mb-16 max-w-xl leading-relaxed font-light">
              A plataforma definitiva de biohacking, nutrição e mindset desenhada para a mulher que não aceita nada menos que a excelência.
            </p>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-8">
              <button 
                onClick={onStart}
                className="luxury-button group px-12 py-6 text-white font-bold text-sm uppercase tracking-[0.3em] rounded-full transition-all duration-500 flex items-center justify-center gap-6 active:scale-95 shadow-2xl"
              >
                Começar Minha Evolução <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </button>
              <div className="flex items-center gap-6 px-8 py-5 rounded-full border border-white/5 bg-white/5 backdrop-blur-xl">
                <div className="flex -space-x-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0F0A1F] bg-neutral-800 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?u=${i+20}`} alt="User" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">+10k Mulheres</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative z-10 rounded-[4rem] overflow-hidden border border-white/5 aspect-[4/5] bg-[#1F1638] shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?auto=format&fit=crop&q=80&w=800" 
                alt="Lifestyle Premium" 
                className="w-full h-full object-cover opacity-60"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F0A1F] via-transparent to-transparent" />
              <div className="absolute bottom-16 left-16 right-16">
                <div className="luxury-card p-10 backdrop-blur-3xl border border-white/10">
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-[10px] font-bold text-[#D81BFF] uppercase tracking-[0.4em]">Status da Evolução</span>
                    <div className="flex gap-1.5">
                      {[1,2,3,4,5].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#D81BFF]" />)}
                    </div>
                  </div>
                  <h3 className="text-3xl font-sans font-bold mb-6 leading-tight">"A disciplina é a forma mais alta de amor próprio."</h3>
                  <div className="flex items-center gap-6">
                    <div className="h-1.5 flex-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full w-[85%] bg-[#D81BFF] rounded-full" />
                    </div>
                    <span className="text-[10px] font-bold text-white/40">85%</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-48 px-8 z-10 bg-[#0F0A1F]/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-32">
            <h2 className="text-6xl md:text-8xl font-sans font-bold mb-10 tracking-tight text-white">O Método <span className="text-[#D81BFF]">EvoluaEla</span>.</h2>
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
                className="luxury-card group p-12 hover:bg-white/[0.03] transition-all duration-700"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-10 group-hover:bg-[#D81BFF] group-hover:text-white transition-all duration-700">
                  <feature.icon size={32} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#D81BFF] mb-6 block">{feature.tag}</span>
                <h3 className="text-2xl font-bold mb-6 tracking-tight">{feature.title}</h3>
                <p className="text-[#B8B0C8] text-lg leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-32 md:py-48 px-6 md:px-8 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 md:mb-32">
            <h2 className="text-5xl md:text-8xl font-sans font-bold mb-8 md:mb-10 tracking-tight text-white">Seu <span className="text-[#D81BFF]">Investimento</span>.</h2>
            <p className="text-white/40 max-w-2xl mx-auto text-xl md:text-2xl font-light">O valor de uma nova vida é incalculável. O acesso a ela é exclusivo.</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="p-10 md:p-20 rounded-[3rem] md:rounded-[5rem] bg-gradient-to-br from-[#1F1638] to-[#0F0A1F] border border-white/5 flex flex-col h-full shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none hidden md:block">
                <Crown size={120} className="text-[#D81BFF] rotate-12" />
              </div>
              
              <div className="flex flex-col items-center text-center mb-12 md:mb-16 gap-6">
                <div className="inline-flex px-6 py-2 rounded-full bg-[#D81BFF] text-white text-[10px] font-bold uppercase tracking-[0.3em]">
                  Plano Mensal
                </div>
                <h3 className="text-4xl md:text-6xl font-bold text-white tracking-tight">Círculo Premium</h3>
                <p className="text-white/40 text-lg md:text-xl font-light max-w-md">Tudo o que você precisa para sua transformação definitiva, com flexibilidade total.</p>
              </div>

              <div className="flex flex-col items-center text-center mb-12">
                <div className="text-6xl md:text-8xl font-sans font-bold text-white tracking-tighter mb-2">R$ 109,90<span className="text-xl md:text-2xl text-white/40 font-sans font-light tracking-normal ml-2">/mês</span></div>
                <div className="text-[10px] md:text-xs font-bold text-[#D81BFF] uppercase tracking-[0.3em]">Cobrado mensalmente • Cancele quando quiser</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-12 md:mb-16">
                <ul className="space-y-6">
                  {[
                    'Treinos Personalizados',
                    'Suporte da Mentora IA',
                    'Protocolos de Biohacking',
                    'Comunidade Exclusiva'
                  ].map((item, i) => (
                    <li key={`benefit-primary-${i}`} className="flex items-center gap-4 text-white font-medium text-base md:text-lg">
                      <CheckCircle2 size={20} className="text-[#D81BFF] shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <ul className="space-y-6">
                  {[
                    'Networking de Alto Valor',
                    'Aulas de Etiqueta & Estilo',
                    'Mindset de Performance',
                    'Acesso Ilimitado'
                  ].map((item, i) => (
                    <li key={`benefit-secondary-${i}`} className="flex items-center gap-4 text-white/40 text-base md:text-lg font-light">
                      <CheckCircle2 size={20} className="text-[#D81BFF]/30 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-8">
                <button 
                  onClick={onStart}
                  className="luxury-button w-full py-6 md:py-8 rounded-full text-white font-bold text-xs md:text-sm uppercase tracking-[0.4em] transition-all duration-700 shadow-2xl active:scale-95"
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

      {/* Footer */}
      <footer className="relative py-40 px-8 border-t border-white/5 z-10 bg-[#0F0A1F]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center pt-20 border-t border-white/5 gap-12">
            <div className="flex flex-col items-center md:items-start gap-6">
              <Logo size="sm" />
              <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.4em]">© 2026 EvoluaEla. Todos os direitos reservados.</p>
            </div>
            <div className="flex items-center gap-12">
              <div className="flex items-center gap-4 px-6 py-3 rounded-xl border border-white/5 bg-white/[0.01]">
                <Shield size={20} className="text-[#D81BFF]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">Site Seguro & Criptografado</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
