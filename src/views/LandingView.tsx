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
      <header className="fixed top-0 left-0 right-0 z-50 px-8 pt-[calc(2rem+env(safe-area-inset-top))] pb-8 bg-[#0F0A1F]/40 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Logo size="sm" />
          <div className="flex items-center gap-8">
            <button onClick={onStart} className="luxury-button btn-3d-press animate-pulse-glow px-10 py-4 rounded-full text-white text-[10px] font-bold uppercase tracking-[0.3em] bg-gradient-to-r from-[#D4537E] to-[#7F77DD]">
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
              Sua Melhor <br />
              <span className="text-[#D4537E]">Versão</span> em <br />
              3 Dimensões.
            </h1>
            <p className="text-xl text-[#B8B0C8] mb-16 max-w-xl leading-relaxed font-medium">
              Não é apenas emagrecer. É sobre profundidade, mentalidade e a construção de um novo estilo de vida inabalável.
            </p>
            <button onClick={onStart} className="btn-3d-press px-12 py-6 bg-gradient-to-r from-[#D4537E] to-[#7F77DD] text-white font-bold text-sm uppercase tracking-[0.3em] rounded-full flex items-center gap-6 shadow-2xl">
              Quero Evoluir <ArrowRight size={20} />
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

      {/* IDENTIFICAÇÃO & VALIDAÇÃO */}
      <section className="py-32 px-8 z-10 relative">
        <div className="max-w-4xl mx-auto text-center space-y-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
              Você já fez tudo certo. E, mesmo assim, o espelho parece não colaborar.
            </h2>
            <div className="space-y-4 text-[#B8B0C8] text-lg leading-relaxed font-medium">
              <p>"Você acorda decidida, segue a dieta à risca e se esforça ao máximo, mas parece que o seu corpo está sempre jogando contra você."</p>
              <p>"A frustração de ver o peso voltar logo após tanto sacrifício não é um sinal de que você falhou, mas de que o método que te venderam nunca foi feito para a sua realidade."</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-12 rounded-[3rem] bg-white/5 border border-white/10 space-y-6"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-[#D4537E] tracking-tight">
              O problema nunca foi a sua falta de força de vontade.
            </h3>
            <div className="space-y-4 text-[#B8B0C8] text-base leading-relaxed font-medium">
              <p>"Não é culpa sua se as dietas restritivas ignoraram como a sua mente e seus hormônios funcionam. Você não é um robô de academia, você é uma mulher real."</p>
              <p>"Você não precisa de mais 'garra' ou punição; você precisa de um caminho que respeite o seu ritmo e entenda que a disciplina nasce do acolhimento, não do sofrimento."</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* O QUE É A EVOLUAELA */}
      <section className="py-32 px-8 z-10 relative bg-gradient-to-b from-transparent to-[#0F0A1F]/50">
        <div className="max-w-7xl mx-auto space-y-24">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex px-4 py-2 rounded-full bg-[#D4537E]/10 text-[#D4537E] text-[10px] font-bold uppercase tracking-[0.3em] mb-4"
            >
              A Nova Era do Emagrecimento
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white">
              Emagrecer com apoio real de quem entende você.
            </h2>
            <p className="text-xl text-[#B8B0C8] font-medium leading-relaxed">
              Imagine ter um time de especialistas cuidando de você pelo celular, sem dietas malucas e com suporte de verdade.
            </p>
          </div>

          {/* Como Funciona */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Acesso Imediato", desc: "Você entra na plataforma e já começa a sua jornada de transformação.", icon: Play },
              { title: "Conexão Direta", desc: "Nossa equipe de especialistas entende sua rotina, seus desafios e seus objetivos.", icon: MessageCircle },
              { title: "Evolução Guiada", desc: "Você recebe orientações personalizadas e apoio constante para nunca mais precisar parar.", icon: TrendingUp }
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="luxury-card p-10 text-center space-y-6 group hover:border-[#D4537E]/30 transition-all"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#D4537E]/10 flex items-center justify-center text-[#D4537E] mx-auto group-hover:scale-110 transition-transform">
                  <step.icon size={32} />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">{step.title}</h3>
                <p className="text-[#B8B0C8] text-sm leading-relaxed font-medium">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* O que você tem acesso */}
          <div className="luxury-card p-12 md:p-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <Logo size="lg" />
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <h3 className="text-3xl font-bold text-white tracking-tight">O que você ganha ao entrar:</h3>
                <ul className="space-y-6">
                  {[
                    "Nutricionistas que entendem sua fome e respeitam a sua rotina real.",
                    "Psicólogos prontos para te ajudar a vencer a ansiedade e os bloqueios.",
                    "Treinos inteligentes que se adaptam ao seu tempo e ao seu corpo.",
                    "Apoio real para aqueles momentos em que a vontade de desistir aparece.",
                    "A segurança de saber exatamente o que fazer em cada passo do caminho.",
                    "Uma comunidade de mulheres que vibram com cada pequena conquista sua."
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <CheckCircle2 size={20} className="text-[#D4537E] shrink-0 mt-1" />
                      <span className="text-[#B8B0C8] font-medium leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-center space-y-8">
                <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-[#D4537E]/20 to-[#7F77DD]/20 border border-white/10 backdrop-blur-xl">
                  <p className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight">
                    "Não é uma dieta, é um time de especialistas segurando a sua mão todos os dias."
                  </p>
                </div>
                <button onClick={onStart} className="btn-3d-press w-full py-6 bg-white text-black font-bold text-sm uppercase tracking-[0.4em] rounded-full shadow-2xl">
                  Garantir Meu Acesso
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Benefícios com Profundidade */}
      <section className="py-32 px-8 z-10 relative bg-[#0F0A1F]/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 perspective-1000">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ translateZ: 20, scale: 1.05, rotateX: 5 }}
                className="luxury-card p-12 transition-all duration-300 preserve-3d cursor-default border border-white/5 hover:border-[#D4537E]/50"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-10 text-[#D4537E] group-hover:bg-[#D4537E] group-hover:text-white transition-all">
                  <feature.icon size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-6 tracking-tight">{feature.title}</h3>
                <p className="text-[#B8B0C8] text-lg leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ESPERANÇA & AUTORIDADE */}
      <section className="py-32 px-8 z-10 relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white">
              E se esta fosse, finalmente, a sua última <span className="text-[#7F77DD]">'primeira vez'</span>?
            </h2>
            <div className="space-y-6 text-[#B8B0C8] text-lg leading-relaxed font-medium">
              <p>"Existe um caminho onde o emagrecimento não é uma batalha, mas uma consequência natural de um corpo nutrido e uma mente em paz."</p>
              <p>"Imagine a liberdade de não precisar mais de dietas milagrosas, porque agora você tem uma estratégia desenhada para durar a vida inteira."</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="luxury-card p-12 space-y-8 border-l-4 border-l-[#D4537E]"
          >
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Ciência, tecnologia e o olhar humano de quem entende de mulher.
            </h3>
            <div className="space-y-4 text-[#B8B0C8] text-base leading-relaxed font-medium">
              <p>"A EvoluaEla é diferente porque une a precisão da nossa Mentora IA com o acompanhamento de nutricionistas e psicólogas reais, focadas na sua evolução."</p>
              <p>"Nós não entregamos apenas um plano; entregamos um ecossistema de apoio 24/7 para garantir que você nunca mais se sinta desamparada no caminho para o seu objetivo."</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Prova Social com Contador Animado */}
      <section className="py-32 px-8 z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
          <AnimatedCounter value={2847} label="Mulheres Transformadas" />
          <AnimatedCounter value={150} label="Especialistas Ativos" />
          <AnimatedCounter value={98} label="Satisfação Garantida %" />
        </div>
      </section>

      {/* Linha do Tempo 3D Isométrica */}
      <section className="py-32 px-8 z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold text-center mb-24 tracking-tighter">Como sua <span className="text-[#7F77DD]">Jornada</span> Funciona</h2>
          
          <div className="flex flex-col md:flex-row justify-between gap-12 perspective-1000">
            {[
              { step: '01', title: 'Diagnóstico', desc: 'Análise hormonal e emocional profunda.' },
              { step: '02', title: 'Personalização', desc: 'Seu plano único de nutrição e treino.' },
              { step: '03', title: 'Evolução', desc: 'Acompanhamento diário com sua Coach IA.' },
              { step: '04', title: 'Liberdade', desc: 'O novo corpo e mente que você merece.' }
            ].map((item, i) => (
              <div 
                key={i}
                className="flex-1 p-8 rounded-[2rem] bg-gradient-to-br from-[#D4537E] to-[#7F77DD] shadow-2xl transition-all duration-500 hover:-translate-y-4"
                style={{ 
                  transform: `rotateX(15deg) rotateY(-15deg) translateZ(${i * 10}px)`,
                  opacity: 0.8 + (i * 0.05)
                }}
              >
                <div className="text-5xl font-black opacity-20 mb-4">{item.step}</div>
                <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                <p className="text-sm font-medium text-white/80">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROVA SOCIAL (Depoimentos) */}
      <section className="py-32 px-8 z-10 relative bg-[#0F0A1F]/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold text-center mb-24 tracking-tighter">Você não está <span className="text-[#D4537E]">sozinha</span> nesta jornada.</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              {
                name: "Mariana, 39 anos",
                role: "Mãe e Profissional",
                text: "Como mãe e profissional, eu achei que não teria tempo para nada. No EvoluaEla, descobri que o suporte real faz o impossível se tornar rotina.",
                img: "https://i.pravatar.cc/100?u=mariana"
              },
              {
                name: "Sandra, 46 anos",
                role: "Empresária",
                text: "Eu tinha vergonha de tentar de novo e falhar. Mas quando vi que outras mulheres como eu estavam conseguindo, percebi que o erro não era eu, era o que eu tentava antes.",
                img: "https://i.pravatar.cc/100?u=sandra"
              }
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="luxury-card p-12 flex flex-col md:flex-row gap-8 items-center md:items-start"
              >
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#D4537E] shrink-0">
                  <img src={testimonial.img} alt={testimonial.name} referrerPolicy="no-referrer" />
                </div>
                <div className="space-y-4 text-center md:text-left">
                  <p className="text-lg text-white font-medium italic leading-relaxed">"{testimonial.text}"</p>
                  <div>
                    <p className="font-bold text-white">{testimonial.name}</p>
                    <p className="text-[10px] font-bold text-[#D4537E] uppercase tracking-widest">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* URGÊNCIA EMOCIONAL */}
      <section className="py-32 px-8 z-10 relative">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white">
              Quanto tempo mais você vai deixar a sua melhor versão guardada na gaveta?
            </h2>
            <div className="space-y-6 text-[#B8B0C8] text-lg leading-relaxed font-medium">
              <p>"Não é apenas sobre estética; é sobre ter energia para brincar com seus filhos, confiança para aceitar convites e a saúde para viver cada momento com intensidade."</p>
              <p>"Cada dia que você adia o seu cuidado é um dia a menos vivendo com a leveza e o orgulho que você merece sentir ao se olhar no espelho."</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="py-32 px-8 z-10 text-center">
        <div className="max-w-3xl mx-auto space-y-12">
          <h2 className="text-5xl font-bold tracking-tighter">Pronta para o seu <br /> próximo nível?</h2>
          <button onClick={onStart} className="btn-3d-press animate-pulse-glow px-16 py-8 bg-white text-black font-bold text-lg uppercase tracking-[0.4em] rounded-full shadow-2xl hover:scale-105 transition-all">
            Começar Agora
          </button>
        </div>
      </footer>
    </div>
  );
}
