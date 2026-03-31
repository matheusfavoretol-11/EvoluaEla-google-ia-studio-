import { useState } from 'react';
import { Check, Star, AlertCircle, X, CreditCard } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';

export default function SubscriptionView({ onClose }: { onClose: () => void }) {
  const { theme } = useTheme();
  const { setSubscriptionStatus, setTrialEndDate } = useUser();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const { supabase } = await import('../lib/supabase');
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('Você precisa estar logada para assinar.');
        setIsProcessing(false);
        return;
      }

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Não foi possível iniciar o checkout. Verifique se as chaves da Stripe estão configuradas.');
        setIsProcessing(false);
      }
    } catch (err: any) {
      console.error('Error initiating checkout:', err);
      setError('Ocorreu um erro ao processar sua solicitação. Tente novamente.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white overflow-y-auto">
      <div className="relative h-56 sm:h-64 shrink-0">
        <img 
          src="https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800&h=600" 
          alt="EvoluaEla Premium" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <button 
          onClick={onClose}
          className="absolute top-4 sm:top-6 right-4 sm:right-6 w-8 h-8 sm:w-10 sm:h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-colors"
        >
          <X size={18} className="sm:w-5 sm:h-5" />
        </button>

        <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 text-white">
          <div className="flex items-center gap-2 mb-1 sm:mb-2">
            <Star className="text-[#D4B996] sm:w-5 sm:h-5" size={16} fill="currentColor" />
            <span className="font-medium tracking-[0.2em] uppercase text-[8px] sm:text-[10px] text-[#D4B996]">Círculo Premium</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light leading-tight italic">Sua jornada guiada por quem entende de você.</h2>
        </div>
      </div>

      <div className="p-5 sm:p-6 flex-1 flex flex-col bg-[#FAF9F6]">
        <div className="space-y-5 sm:space-y-6 flex-1">
          <div className="text-center">
            <div className="inline-block px-3 py-1 bg-[#E8B4BC]/10 text-[#E8B4BC] font-medium text-[8px] sm:text-[9px] rounded-full mb-2 sm:mb-3 uppercase tracking-[0.2em]">
              Experimente por 7 Dias
            </div>
            <div className="text-4xl sm:text-5xl font-serif font-light text-[#3F2A2F] mb-1">R$ 97,90<span className="text-lg sm:text-xl text-[#3F2A2F]/40 font-light font-sans">/mês</span></div>
            <p className="text-[#3F2A2F]/40 text-xs sm:text-sm font-light">Sinta a transformação primeiro. Cancele quando quiser.</p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <h3 className="font-serif font-light text-[#3F2A2F] text-lg sm:text-xl italic">O que preparamos para você:</h3>
            
            <ul className="space-y-2 sm:space-y-3">
              {[
                'Dieta Personalizada com Nutricionista',
                'Equilíbrio Emocional com Terapeuta',
                'Treinos 100% personalizados',
                'Acesso ilimitado ao Coach IA',
                'Ajustes semanais e chat direto com especialistas'
              ].map((item, idx) => (
                <li key={`benefit-${idx}`} className="flex items-start gap-3">
                  <div className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-[#E8B4BC]/10" style={{ color: '#E8B4BC' }}>
                    <Check size={12} strokeWidth={2} />
                  </div>
                  <span className="text-sm sm:text-base text-[#3F2A2F]/60 font-light">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-4 rounded-[1.25rem] sm:rounded-[1.5rem] border border-[#3F2A2F]/5 flex flex-col items-center text-center">
            <p className="text-[#3F2A2F] font-serif font-light italic mb-1 text-sm sm:text-base">Muito além de um app</p>
            <p className="text-[#3F2A2F]/40 text-xs sm:text-sm font-light">É sobre sua nova versão. Agora você tem um time segurando sua mão.</p>
          </div>

          <div className="bg-white p-4 rounded-[1.25rem] sm:rounded-[1.5rem] border border-[#3F2A2F]/5 flex gap-3 items-start">
            <AlertCircle className="text-[#D4B996] shrink-0 mt-0.5 sm:w-5 sm:h-5" size={18} />
            <p className="text-[9px] sm:text-[10px] text-[#3F2A2F]/40 leading-relaxed font-light">
              <strong className="font-medium">Lembrete importante:</strong> Nosso apoio é complementar e não substitui consultas médicas presenciais ou atendimentos de emergência, tá?
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-red-50 text-red-600 text-xs font-medium flex items-center gap-3 border border-red-100"
            >
              <AlertCircle size={16} />
              {error}
            </motion.div>
          )}
        </div>

        <div className="mt-6 sm:mt-8 pt-4 border-t border-[#3F2A2F]/5">
          <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4 text-[#3F2A2F]/40 text-[8px] sm:text-[10px] font-medium uppercase tracking-[0.2em]">
            <CreditCard size={12} className="sm:w-3.5 sm:h-3.5" />
            <span>Cobrança apenas após 7 dias</span>
          </div>
          <button 
            onClick={handleSubscribe}
            disabled={isProcessing}
            className="w-full py-3.5 sm:py-4 rounded-full font-light uppercase tracking-[0.2em] text-[9px] sm:text-[10px] text-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 bg-[#3F2A2F] hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 disabled:hover:translate-y-0 flex items-center justify-center"
          >
            {isProcessing ? 'Preparando tudo para você...' : 'Quero começar meu teste grátis'}
          </button>
          <p className="text-center text-[8px] sm:text-[9px] text-[#3F2A2F]/20 mt-3 sm:mt-4 font-light leading-relaxed uppercase tracking-widest">
            Fique tranquila, nada será cobrado hoje. Após os 7 dias, a assinatura de R$ 97,90/mês será renovada automaticamente para manter sua evolução. Você tem total liberdade para cancelar quando quiser.
          </p>
        </div>
      </div>
    </div>
  );
}
