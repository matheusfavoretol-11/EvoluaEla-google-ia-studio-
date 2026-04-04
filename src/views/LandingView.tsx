import React from 'react';
import { motion } from 'motion/react';
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
      desc: 'Acompanhamento direto com nutricionistas e terapeutas para sua saúde física e mental.',
      tag: 'Diferencial'
    },
    { 
      icon: Bot, 
      title: 'Coach IA 24/7', 
      desc: 'Sua mentora pessoal disponível a qualquer momento para guiar sua evolução.',
      tag: 'Tecnologia'
    },
    { 
      icon: Users, 
      title: 'Comunidade Exclusiva', 
      desc: 'Conecte-se com mulheres que compartilham seus objetivos e ambições.',
      tag: 'Networking'
    },
    { 
      icon: Trophy, 
      title: 'Gamificação', 
      desc: 'Transforme sua rotina em um jogo e conquiste medalhas por cada meta batida.',
      tag: 'Motivação'
    },
  ];

  const episodes = [
    { id: '01', title: 'Mentalidade de Alta Performance', duration: '15 min', type: 'Mindset' },
    { id: '02', title: 'Nutrição Estratégica para Mulheres', duration: '22 min', type: 'Biohacking' },
    { id: '03', title: 'Rotina Matinal das 5AM', duration: '10 min', type: 'Hábito' },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] font-sans text-white overflow-y-auto hide-scrollbar selection:bg-[#E8B4BC] selection:text-black">
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6 glass-nav">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/logo-v2.png?v=2" alt="EvoluaEla Logo" className="w-10 h-10 rounded-lg object-contain" />
            <span className="font-bold text-sm tracking-tight">EVOLUAELA</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
            <a href="#features" className="hover:text-white transition-colors">Funcionalidades</a>
            <a href="#episodes" className="hover:text-white transition-colors">Programas</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Comunidade</a>
          </nav>
          <div className="flex items-center gap-4">
            <button 
              onClick={onStart} 
              className="text-sm font-medium hover:text-[#E8B4BC] transition-colors hidden sm:block"
            >
              Entrar
            </button>
            <button 
              onClick={onStart} 
              className="px-6 py-2.5 rounded-full bg-white text-black text-sm font-bold hover:bg-[#E8B4BC] transition-all duration-300 active:scale-95"
            >
              Começar Agora
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 min-h-screen flex items-center overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#E8B4BC]/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-[#D4B996]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
              <Sparkles size={14} className="text-[#E8B4BC]" />
              <span className="text-xs font-bold tracking-wider uppercase text-white/80">A Nova Era da Evolução Feminina</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold leading-[1.05] mb-8 tracking-tighter">
              Sua melhor <br />
              <span className="gradient-text">versão</span> começa <br />
              aqui.
            </h1>
            <p className="text-lg md:text-xl text-white/60 mb-10 max-w-lg leading-relaxed">
              Uma plataforma completa de biohacking, mindset e performance desenhada exclusivamente para a mulher moderna.
            </p>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button 
                onClick={onStart}
                className="group px-8 py-4 bg-[#E8B4BC] text-black font-bold text-lg rounded-full hover:bg-white transition-all duration-300 flex items-center justify-center gap-3 active:scale-95"
              >
                Iniciar Jornada <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold text-lg rounded-full hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                <Play size={18} fill="currentColor" /> Ver Demo
              </button>
            </div>

            <div className="mt-12 flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0A0A0A] bg-neutral-800 overflow-hidden">
                    <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="User" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-[#D4B996]">
                  {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <p className="text-xs text-white/40 mt-1 font-medium">+10k mulheres evoluindo diariamente</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative z-10 rounded-[2.5rem] overflow-hidden border border-white/10 bento-card p-0 aspect-[4/5]">
              <img 
                src="https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=800" 
                alt="App Preview" 
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
              <div className="absolute bottom-10 left-10 right-10">
                <div className="glass-card p-6 rounded-2xl border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Treino do Dia</span>
                    <span className="px-2 py-1 rounded bg-[#E8B4BC]/20 text-[#E8B4BC] text-[10px] font-bold">LIVE</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Yoga & Mindfulness Flow</h3>
                  <div className="flex items-center gap-4 text-sm text-white/60">
                    <span className="flex items-center gap-1"><CalendarCheck size={14} /> 45 min</span>
                    <span className="flex items-center gap-1"><Flame size={14} /> 320 kcal</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative circles */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#E8B4BC]/30 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#D4B996]/20 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </section>

      {/* Bento Features Section */}
      <section id="features" className="py-32 px-6 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Tudo o que você precisa <br /> para sua <span className="gradient-text">evolução</span>.</h2>
            <p className="text-white/40 max-w-2xl mx-auto text-lg">Ferramentas integradas para transformar seu corpo, mente e rotina.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={`feature-${feature.title}-${i}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bento-card group"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-[#E8B4BC] group-hover:text-black transition-all">
                  <feature.icon size={24} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#E8B4BC] mb-2 block">{feature.tag}</span>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Episodes/Programs Section */}
      <section id="episodes" className="py-32 px-6 bg-[#0F0F0F]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Programas em Destaque</h2>
              <p className="text-white/40 text-lg">Conteúdo exclusivo atualizado semanalmente.</p>
            </div>
            <button className="text-[#E8B4BC] font-bold flex items-center gap-2 hover:gap-3 transition-all">
              Ver todos os programas <ChevronRight size={20} />
            </button>
          </div>

          <div className="space-y-4">
            {episodes.map((ep, i) => (
              <motion.div
                key={ep.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-8">
                  <span className="text-2xl font-bold text-white/10 group-hover:text-[#E8B4BC]/40 transition-colors">{ep.id}</span>
                  <div>
                    <h4 className="text-xl font-bold mb-1">{ep.title}</h4>
                    <div className="flex items-center gap-4 text-xs text-white/40 font-medium">
                      <span className="px-2 py-0.5 rounded bg-white/5 text-white/60">{ep.type}</span>
                      <span>{ep.duration}</span>
                    </div>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#E8B4BC] group-hover:text-black transition-all">
                  <Play size={20} fill="currentColor" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-6 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Escolha seu <span className="gradient-text">plano</span>.</h2>
            <p className="text-white/40 max-w-2xl mx-auto text-lg">Invista em você e comece sua transformação hoje mesmo.</p>
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Single Premium Plan */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-10 rounded-[3rem] bg-gradient-to-br from-[#E8B4BC] to-[#D4B996] flex flex-col h-full shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute top-6 right-6 px-4 py-1.5 rounded-full bg-black text-white text-[10px] font-bold uppercase tracking-widest">
                Plano Único & Completo
              </div>
              <div className="mb-8">
                <h3 className="text-3xl font-bold text-black mb-2 tracking-tight">Acesso Total</h3>
                <p className="text-black/60 text-sm font-medium">Tudo o que você precisa para sua transformação definitiva.</p>
              </div>
              <div className="mb-10">
                <span className="text-6xl font-bold text-black tracking-tighter">R$ 109,90</span>
                <span className="text-black/60 text-lg font-medium">/mês</span>
                <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest mt-2">Acompanhamento Profissional Incluso</p>
              </div>
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <ul className="space-y-4">
                  {[
                    'Acompanhamento com Nutricionista',
                    'Acompanhamento com Psicóloga',
                    'Treinos 100% Personalizados',
                    'Coach IA 24/7 Ilimitado'
                  ].map((item, i) => (
                    <li key={`benefit-primary-${i}`} className="flex items-center gap-3 text-black font-bold text-sm">
                      <CheckCircle2 size={18} className="text-black" />
                      {item}
                    </li>
                  ))}
                </ul>
                <ul className="space-y-4">
                  {[
                    'Comunidade Exclusiva',
                    'Diário de Evolução IA',
                    'Biohacking & Mindset',
                    'Acesso a todos os Programas'
                  ].map((item, i) => (
                    <li key={`benefit-secondary-${i}`} className="flex items-center gap-3 text-black/80 text-sm font-medium">
                      <CheckCircle2 size={18} className="text-black/40" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <button 
                onClick={onStart}
                className="w-full py-6 rounded-full bg-black text-white font-bold hover:scale-[1.02] transition-all duration-300 uppercase tracking-widest text-sm shadow-2xl"
              >
                Começar minha evolução agora
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-[#E8B4BC] to-[#D4B996] p-12 md:p-24 text-center">
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-7xl font-bold text-black mb-8 tracking-tighter">Pronta para sua <br /> transformação?</h2>
              <p className="text-black/60 text-lg md:text-xl mb-12 max-w-xl mx-auto font-medium">
                Junte-se ao movimento que está redefinindo o potencial feminino. Comece seu teste gratuito hoje.
              </p>
              <button 
                onClick={onStart}
                className="px-12 py-6 bg-black text-white font-bold text-xl rounded-full hover:scale-105 active:scale-95 transition-all shadow-2xl"
              >
                Garantir meu Acesso
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <img src="/logo-v2.png?v=2" alt="EvoluaEla Logo" className="w-10 h-10 rounded-lg object-contain" />
                <span className="font-bold text-xl tracking-tight">EVOLUAELA</span>
              </div>
              <p className="text-white/40 max-w-xs leading-relaxed">
                A plataforma definitiva para a mulher que busca excelência em todas as áreas da vida.
              </p>
            </div>
            <div>
              <h5 className="font-bold mb-6">Plataforma</h5>
              <ul className="space-y-4 text-white/40 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Treinos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Nutrição</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mindset</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Coach IA</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-6">Empresa</h5>
              <ul className="space-y-4 text-white/40 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Sobre Nós</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carreiras</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-white/5 gap-6">
            <p className="text-white/20 text-xs">© 2026 EvoluaEla. Todos os direitos reservados.</p>
            <div className="flex gap-8 text-white/20 text-xs font-bold uppercase tracking-widest">
              <a href="#" className="hover:text-white transition-colors">Instagram</a>
              <a href="#" className="hover:text-white transition-colors">YouTube</a>
              <a href="#" className="hover:text-white transition-colors">TikTok</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
