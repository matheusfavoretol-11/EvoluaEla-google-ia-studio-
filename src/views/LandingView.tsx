import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Logo } from '../components/Logo';
import { 
  ArrowRight, 
  CheckCircle2, 
  Star, 
  Sparkles, 
  Target, 
  Heart, 
  Shield, 
  Zap, 
  Bot, 
  Users, 
  Trophy, 
  HeartHandshake, 
  Crown,
  TrendingUp,
  Activity,
  Play,
  MessageCircle
} from 'lucide-react';

// --- Componente de Contador Animado ---
const AnimatedCounter = ({ value, label }: { value: number, label: string }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !hasAnimated) {
        setHasAnimated(true);
        let start = 0;
        const duration = 2000;
        const increment = value / (duration / 16);
        
        const timer = setInterval(() => {
          start += increment;
          if (start >= value) {
            setCount(value);
            clearInterval(timer);
          } else {
            setCount(Math.floor(start));
          }
        }, 16);
      }
    }, { threshold: 0.5 });

    if (countRef.current) observer.observe(countRef.current);
    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return (
    <div ref={countRef} className="text-center">
      <div className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-2">
        {count.toLocaleString()}+
      </div>
      <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#B8B0C8]">{label}</div>
    </div>
  );
};

// --- Componente de Cartão 3D com Tilt ---
const TiltCard = ({ children }: { children: React.ReactNode }) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div className="relative perspective-1000 group">
      <div 
        className="animate-float-3d transition-transform duration-200 ease-out preserve-3d"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ 
          transform: `perspective(800px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)` 
        }}
      >
        {children}
      </div>
      {/* Sombra Projetada */}
      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-4/5 h-8 bg-black/40 rounded-[100%] animate-shadow-pulse -z-10"></div>
    </div>
  );
};

export default function LandingView({ onStart }: { onStart: () => void }) {
  const features = [
    { 
      icon: HeartHandshake, 
      title: 'Nutrição & Psicologia', 
      desc: 'Acompanhamento estratégico com especialistas para o seu equilíbrio hormonal e mental.',
      tag: 'Estratégia'
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
    <div className="min-h-screen bg-[#0F0A1F] font-sans text-white overflow-y-auto hide-scrollbar selection:bg-[#D4537E] selection:text-white relative">
      
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#0F0A1F]">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[140%] h-[70%] bg-gradient-to-b from-[#D4537E]/10 via-[#7F77DD]/5 to-transparent rounded-full blur-[140px]" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[70%] h-[60%] bg-[#7F77DD]/10 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-8 pt-[calc(1.5rem+env(safe-area-inset-top))] pb-6 bg-[#0F0A1F]/40 backdrop-blur-3xl border-b border-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Logo size="sm" />
          <div className="flex items-center gap-6">
            <button onClick={onStart} className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#B8B0C8] hover:text-white transition-colors">
              Entrar
            </button>
            <button onClick={onStart} className="luxury-button btn-3d-press animate-pulse-glow px-8 py-3 rounded-full text-white text-[10px] font-bold uppercase tracking-[0.3em] bg-gradient-to-r from-[#D4537E] to-[#7F77DD]">
              Começar Agora
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section com Cartão 3D */}
      <section className="relative pt-[calc(10rem+env(safe-area-inset-top))] pb-32 px-6 md:px-8 z-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }}>
            <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-white/5 border border-white/5 mb-12">
              <Sparkles size={16} className="text-[#D4537E]" />
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/40">O Poder da Evolução Feminina</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-bold leading-[0.95] mb-12 tracking-tighter">
              Sua plataforma de <br />
              <span className="text-[#D4537E]">evolução pessoal</span> <br />
              com apoio completo.
            </h1>
            <p className="text-xl text-[#B8B0C8] mb-16 max-w-xl leading-relaxed font-medium">
              Tenha acesso a psicólogos, nutricionistas e uma mentora com Inteligência Artificial para organizar sua mente, sua alimentação e sua rotina em um só lugar.
            </p>
            <button onClick={onStart} className="btn-3d-press px-12 py-6 bg-gradient-to-r from-[#D4537E] to-[#7F77DD] text-white font-bold text-sm uppercase tracking-[0.3em] rounded-full flex items-center gap-6 shadow-2xl">
              Começar Agora <ArrowRight size={20} />
            </button>
          </motion.div>

          {/* Cartão 3D Flutuante */}
          <div className="flex justify-center">
            <TiltCard>
              <div className="w-full max-w-[400px] aspect-[4/5] rounded-[4rem] overflow-hidden border border-white/10 bg-[#1F1638] shadow-2xl relative">
                <img 
                  src="https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?auto=format&fit=crop&q=80&w=800" 
                  alt="Evolução" 
                  className="w-full h-full object-cover opacity-60"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0A1F] via-transparent to-transparent" />
                <div className="absolute bottom-12 left-8 right-8 p-8 glass-morphism rounded-[2.5rem] border border-white/10 translate-z-20">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#D4537E] flex items-center justify-center">
                      <Zap size={20} fill="white" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Foco Total</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Resultados Reais</h3>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-[92%] bg-[#D4537E]" />
                  </div>
                </div>
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* PARA QUEM É */}
      <section className="py-32 px-8 z-10 relative border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-16 tracking-tighter">Para quem é o <span className="text-[#D4537E]">EvoluaEla</span>?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              "Mulheres que se sentem estagnadas e buscam mais clareza emocional.",
              "Quem precisa de ajuda profissional para organizar a alimentação e a saúde.",
              "Mulheres que buscam mais disciplina e foco nos seus objetivos pessoais.",
              "Quem deseja suporte psicológico e ferramentas práticas de desenvolvimento."
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-6 p-8 rounded-3xl bg-white/5 border border-white/5">
                <div className="w-12 h-12 rounded-full bg-[#D4537E]/20 flex items-center justify-center text-[#D4537E] shrink-0">
                  <CheckCircle2 size={24} />
                </div>
                <p className="text-lg text-[#B8B0C8] font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* O QUE VOCÊ ENCONTRA NA PLATAFORMA */}
      <section className="py-32 px-8 z-10 relative bg-[#0F0A1F]/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-16 tracking-tighter">O que você encontra na <span className="text-[#7F77DD]">plataforma</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 perspective-1000">
            {[
              { 
                title: "Acompanhamento Psicológico", 
                desc: "Suporte especializado para lidar com emoções, ansiedade e bloqueios.",
                icon: Heart
              },
              { 
                title: "Acompanhamento Nutricional", 
                desc: "Orientações e planos para uma alimentação equilibrada e saudável.",
                icon: Activity
              },
              { 
                title: "Coach com IA", 
                desc: "Uma mentora disponível 24h por dia para tirar dúvidas e motivar sua rotina.",
                icon: Bot
              },
              { 
                title: "Ferramentas de Evolução", 
                desc: "Conteúdos práticos e métodos para você aplicar no seu dia a dia.",
                icon: Target
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ translateZ: 20, scale: 1.05, rotateX: 5 }}
                className="luxury-card p-10 transition-all duration-300 preserve-3d border border-white/5 hover:border-[#D4537E]/50"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 text-[#D4537E]">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold mb-4 tracking-tight">{feature.title}</h3>
                <p className="text-[#B8B0C8] text-sm leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="py-32 px-8 z-10 relative">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-16 tracking-tighter text-center">Como funciona</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Assinatura", desc: "Você faz sua adesão ao plano mensal de R$ 109,90 (sem fidelidade)." },
              { step: "02", title: "Acesso", desc: "Você entra na plataforma imediatamente pelo seu celular ou computador." },
              { step: "03", title: "Conexão", desc: "Você é conectada aos profissionais e à nossa Inteligência Artificial." },
              { step: "04", title: "Prática", desc: "Você começa a usar as ferramentas e receber o acompanhamento necessário." }
            ].map((item, i) => (
              <div key={i} className="relative p-8 rounded-3xl bg-white/5 border border-white/5 space-y-4">
                <div className="text-4xl font-black text-[#D4537E]/20">{item.step}</div>
                <h4 className="text-xl font-bold text-white">{item.title}</h4>
                <p className="text-sm text-[#B8B0C8] font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* O QUE TORNA DIFERENTE & PREÇO */}
      <section className="py-32 px-8 z-10 relative bg-[#0F0A1F]/50">
        <div className="max-w-4xl mx-auto text-center space-y-16">
          <div className="space-y-8">
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white">
              O que torna o EvoluaEla diferente?
            </h2>
            <p className="text-xl text-[#B8B0C8] font-medium leading-relaxed">
              Diferente de cursos gravados ou aplicativos de dieta isolados, nós unimos especialistas humanos e Inteligência Artificial em um ecossistema completo focado exclusivamente no desenvolvimento feminino real.
            </p>
          </div>

          <div className="luxury-card p-12 md:p-16 space-y-8 border-2 border-[#D4537E]/30">
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#D4537E]">Plano Mensal</p>
              <div className="text-6xl md:text-7xl font-bold text-white tracking-tighter">R$ 109,90</div>
              <p className="text-[#B8B0C8] font-medium">Cancele quando quiser. Sem fidelidade.</p>
            </div>
            <button onClick={onStart} className="btn-3d-press w-full max-w-md py-6 bg-gradient-to-r from-[#D4537E] to-[#7F77DD] text-white font-bold text-sm uppercase tracking-[0.4em] rounded-full shadow-2xl">
              Assinar Agora
            </button>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="py-20 px-8 z-10 text-center border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <Logo size="sm" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">© 2026 EvoluaEla. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
