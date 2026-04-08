import { motion } from 'motion/react';
import { 
  Headphones, 
  Instagram, 
  Mail, 
  ChevronDown, 
  ChevronUp, 
  Users, 
  Target, 
  ShieldCheck, 
  Stethoscope,
  Clock,
  MessageCircle,
  Crown
} from 'lucide-react';
import { useState } from 'react';

function FAQItem({ question, answer }: any) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/10 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left group transition-all"
      >
        <span className={`text-sm font-bold tracking-tight transition-colors ${isOpen ? 'text-[#D81BFF]' : 'text-[#B8B0C8] group-hover:text-white'}`}>
          {question}
        </span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isOpen ? 'bg-[#D81BFF] text-white rotate-180' : 'bg-white/5 text-[#B8B0C8]'}`}>
          <ChevronDown size={16} />
        </div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <p className="pb-6 text-sm text-[#B8B0C8] leading-relaxed font-medium">
          {answer}
        </p>
      </motion.div>
    </div>
  );
}

export default function SupportView() {
  const faqs = [
    {
      question: 'Como funciona o período de teste grátis?',
      answer: 'Você tem 7 dias para experimentar todos os recursos premium sem pagar nada. Após esse período, a assinatura de R$109,90/mês é ativada automaticamente.'
    },
    {
      question: 'O que está incluso no plano premium?',
      answer: 'O plano premium inclui acesso ilimitado à nossa Coach IA, planos alimentares personalizados com nutricionistas, treinos exclusivos, sessões de terapia em grupo e ferramentas avançadas de evolução pessoal.'
    },
    {
      question: 'Como falo com a nutricionista ou psicóloga?',
      answer: 'Dentro das abas de Nutrição e Mente, você encontrará botões para iniciar chats diretos ou agendar participações em sessões de grupo com nossos especialistas.'
    },
    {
      question: 'Como cancelo minha assinatura?',
      answer: 'Você pode cancelar a qualquer momento pelo menu Configurações > Gerenciar Assinatura, sem multas ou taxas.'
    },
    {
      question: 'Meus dados estão seguros?',
      answer: 'Sim. Utilizamos criptografia de ponta a ponta e seguimos rigorosos padrões de segurança para garantir que sua jornada seja privada e segura.'
    },
    {
      question: 'O app substitui acompanhamento médico?',
      answer: 'Não. O EvoluaEla é uma ferramenta de apoio e desenvolvimento. Sempre recomendamos consultar seu médico antes de iniciar novas rotinas de exercícios ou dietas restritivas.'
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto hide-scrollbar bg-transparent">
      <div className="mx-auto px-6 py-10 sm:px-10 space-y-16">
        
        {/* Hero Section */}
        <section className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D81BFF]/10 border border-[#D81BFF]/20 text-[#D81BFF] text-[10px] font-bold uppercase tracking-widest mb-4"
          >
            <Headphones size={14} />
            Central de Suporte
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-white tracking-tighter"
          >
            Estamos aqui para <span className="text-[#D81BFF]">você</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[#B8B0C8] text-lg mx-auto leading-relaxed font-medium"
          >
            Tire suas dúvidas, conheça nossa história e entre em contato com nosso time de especialistas.
          </motion.p>
        </section>

        {/* About Us & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.section 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 luxury-card space-y-6"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#D81BFF]/10 flex items-center justify-center text-[#D81BFF]">
              <Users size={24} />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white tracking-tight">Sobre a EvoluaEla</h2>
              <p className="text-[#B8B0C8] text-sm leading-relaxed font-medium">
                A EvoluaEla nasceu com um propósito claro: ser o espaço onde mulheres encontram suporte real para evoluir em todas as dimensões da vida. Acreditamos que saúde, mente, corpo e emoções são inseparáveis — e é por isso que reunimos treinos personalizados, nutrição inteligente, saúde mental e comunidade em um único lugar. Somos mais do que um app. Somos um time que caminha ao seu lado em cada passo da sua jornada de evolução.
              </p>
            </div>
          </motion.section>

          <motion.section 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-[2.5rem] bg-gradient-to-br from-[#D81BFF]/10 to-transparent border border-[#D81BFF]/20 space-y-6"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#F8C1FF]/10 flex items-center justify-center text-[#F8C1FF]">
              <Target size={24} />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white tracking-tight">Nossa Missão</h2>
              <p className="text-[#B8B0C8] text-sm leading-relaxed font-medium">
                Empoderar mulheres através de ferramentas práticas, conteúdo de qualidade e uma comunidade acolhedora, ajudando cada uma a se tornar a melhor versão de si mesma.
              </p>
            </div>
          </motion.section>
        </div>

        {/* Support Channels */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-white/5" />
            <h2 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">Canais de Atendimento</h2>
            <div className="h-px flex-1 bg-white/5" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <a 
              href="https://instagram.com/evoluaela_" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group p-6 luxury-card hover:border-[#D81BFF]/50 transition-all flex items-center gap-6"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D81BFF] to-[#F8C1FF] flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <Instagram size={28} />
              </div>
              <div>
                <span className="block text-xs font-bold text-[#B8B0C8] uppercase tracking-widest mb-1">Instagram</span>
                <span className="text-lg font-bold text-white group-hover:text-[#D81BFF] transition-colors">evoluaela_</span>
              </div>
            </a>

            <a 
              href="mailto:evoluaela@gmail.com"
              className="group p-6 luxury-card hover:border-[#F8C1FF]/50 transition-all flex items-center gap-6"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#F8C1FF] flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <Mail size={28} />
              </div>
              <div>
                <span className="block text-xs font-bold text-[#B8B0C8] uppercase tracking-widest mb-1">E-mail</span>
                <span className="text-lg font-bold text-white group-hover:text-[#F8C1FF] transition-colors">evoluaela@gmail.com</span>
              </div>
            </a>
          </div>

          <div className="flex items-center justify-center gap-2 text-white/20 text-xs font-medium">
            <Clock size={14} />
            Nossa equipe responde em até 24 horas úteis
          </div>
        </section>

        {/* FAQ Section */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-white/5" />
            <h2 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">Perguntas Frequentes</h2>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          <div className="luxury-card px-8 py-4">
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="p-12 luxury-button text-center space-y-6 relative overflow-hidden rounded-[3rem]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white tracking-tighter mb-2">Ainda tem dúvidas?</h2>
            <p className="text-white/80 text-sm font-medium mb-8">Nossa Coach IA está disponível 24/7 para te ajudar.</p>
            <button 
              className="px-8 py-4 rounded-full bg-white text-black text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform active:scale-95 shadow-2xl"
              onClick={() => window.dispatchEvent(new CustomEvent('open-coach'))}
            >
              Falar com a Coach
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
