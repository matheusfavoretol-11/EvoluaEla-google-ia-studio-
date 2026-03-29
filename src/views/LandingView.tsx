import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Star, Sparkles, Target, Heart, Shield, Zap, Bot, CalendarCheck, TrendingUp, AlertTriangle, ChevronRight, Flame } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface LandingViewProps {
  onStart: () => void;
}

export default function LandingView({ onStart }: LandingViewProps) {
  const { theme } = useTheme();

  const benefits = [
    { 
      icon: Heart, 
      title: 'Autocuidado Real', 
      desc: 'Uma jornada gentil focada na sua saúde mental e física, sem pressões externas.',
      color: '#E8B4BC'
    },
    { 
      icon: Target, 
      title: 'Metas com Propósito', 
      desc: 'Defina objetivos que ressoam com seus valores e acompanhe sua evolução diária.',
      color: '#A8C4B8'
    },
    { 
      icon: Sparkles, 
      title: 'Brilho Interior', 
      desc: 'Ferramentas exclusivas para despertar a confiança que já existe dentro de você.',
      color: '#E8B4BC'
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-[#3F2A2F] overflow-y-auto hide-scrollbar selection:bg-[#E8B4BC] selection:text-white">
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-10 py-12 bg-white/80 backdrop-blur-xl border-b border-[#3F2A2F]/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="font-poppins font-extrabold text-3xl tracking-tight text-[#3F2A2F]">EVOLUAELA</span>
          </div>
          <div className="flex items-center gap-12">
            <button 
              onClick={onStart} 
              className="text-xs font-bold uppercase tracking-[0.2em] text-[#3F2A2F]/40 hover:text-[#3F2A2F] transition-all hidden md:block"
            >
              Entrar
            </button>
            <button 
              onClick={onStart} 
              className="text-xs font-bold uppercase tracking-[0.2em] px-10 py-5 rounded-2xl bg-[#3F2A2F] text-white hover:bg-[#E8B4BC] transition-all duration-500 soft-shadow hover:scale-[1.05] active:scale-95"
            >
              Começar Agora
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-64 pb-40 px-10 min-h-screen flex items-center overflow-hidden bg-[#FAF7F5]">
        {/* Decorative Elements - More subtle and artistic */}
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-[#E8B4BC]/10 rounded-full blur-[150px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#A8C4B8]/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="text-[10rem] md:text-[14rem] lg:text-[18rem] font-poppins font-extrabold mb-10 leading-[0.8] tracking-[-0.06em] text-[#3F2A2F]">
                EVOLUA<br />ELA
              </h1>
              <p className="text-2xl md:text-4xl font-medium mb-16 text-[#3F2A2F]/40 max-w-3xl leading-relaxed">
                Desperte a mulher poderosa que você nasceu para ser através de uma jornada de transformação pessoal e alta performance.
              </p>
              
              <div className="flex flex-col sm:flex-row items-start gap-8">
                <button 
                  onClick={onStart}
                  className="group relative px-16 py-8 bg-[#E8B4BC] text-white font-poppins font-bold text-2xl rounded-[2.5rem] hover:bg-[#3F2A2F] transition-all duration-700 soft-shadow flex items-center gap-6 hover:scale-[1.02] active:scale-95"
                >
                  Quero começar minha evolução <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-48 px-10 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
            {benefits.map((benefit, i) => (
              <motion.div
                key={`benefit-${i}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.8 }}
                className="flex flex-col items-start group"
              >
                <div 
                  className="w-20 h-20 rounded-[2rem] flex items-center justify-center mb-10 soft-shadow-sm transition-all group-hover:scale-110 group-hover:rotate-3"
                  style={{ backgroundColor: `${benefit.color}15`, color: benefit.color }}
                >
                  <benefit.icon size={36} />
                </div>
                <h3 className="text-3xl font-poppins font-extrabold mb-6 text-[#3F2A2F]">{benefit.title}</h3>
                <p className="text-xl text-[#3F2A2F]/40 leading-relaxed font-medium">
                  {benefit.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Minimalist Quote Section */}
      <section className="py-56 px-10 bg-[#FAF7F5]">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <Sparkles className="mx-auto mb-12 text-[#E8B4BC]" size={64} />
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-poppins font-extrabold text-[#3F2A2F] leading-[1.1] mb-16 tracking-tight">
              "A evolução não é sobre ser perfeita, é sobre ser fiel a quem você realmente é."
            </h2>
            <div className="w-32 h-1.5 bg-[#E8B4BC] mx-auto rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-48 px-10 bg-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-6xl md:text-8xl font-poppins font-extrabold mb-12 text-[#3F2A2F] leading-tight">Pronta para o próximo nível?</h2>
          <p className="text-2xl text-[#3F2A2F]/40 mb-16 leading-relaxed font-medium max-w-2xl mx-auto">
            Junte-se a milhares de mulheres que escolheram priorizar sua evolução e bem-estar todos os dias.
          </p>
          <button 
            onClick={onStart}
            className="px-20 py-8 bg-[#3F2A2F] text-white font-poppins font-bold text-2xl rounded-[2.5rem] hover:bg-[#E8B4BC] transition-all duration-700 premium-shadow hover:scale-[1.05] active:scale-95"
          >
            Começar Agora
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-10 bg-white border-t border-[#3F2A2F]/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <span className="font-poppins font-extrabold text-2xl text-[#3F2A2F]">EVOLUAELA</span>
          <div className="flex gap-12 text-xs font-bold uppercase tracking-[0.2em] text-[#3F2A2F]/30">
            <a href="#" className="hover:text-[#E8B4BC] transition-all">Termos</a>
            <a href="#" className="hover:text-[#E8B4BC] transition-all">Privacidade</a>
            <a href="#" className="hover:text-[#E8B4BC] transition-all">Suporte</a>
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#3F2A2F]/20">© 2026 EvoluaEla. Todos os direitos reservados.</p>
        </div>
      </footer>

    </div>
  );
}
