import { useState } from 'react';
import { Check, Star, AlertCircle, X, CreditCard, HeartHandshake, Crown, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';

export default function SubscriptionView({ onClose }: { onClose: () => void }) {
  const { theme } = useTheme();
  const { 
    setSubscriptionStatus, 
    setIsPremium, 
    setValorPago, 
    setSubscriptionEndDate,
    setTrialEndDate 
  } = useUser();
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

      if (!response.ok) {
        const text = await response.text();
        try {
          const data = JSON.parse(text);
          const detailedError = data.details ? `${data.error} (${data.details})` : data.error;
          setError(detailedError || 'Erro ao criar sessão de checkout.');
        } catch (e) {
          setError(`Erro no servidor (${response.status}): ${text.substring(0, 100)}...`);
        }
        setIsProcessing(false);
        return;
      }

      const data = await response.json();

      if (data.url) {
        try {
          window.top!.location.href = data.url;
        } catch (e) {
          window.location.assign(data.url);
        }
      } else {
        setError('URL de checkout não recebida do servidor.');
        setIsProcessing(false);
      }
    } catch (err: any) {
      console.error('Error initiating checkout:', err);
      setError(`Erro de conexão: ${err.message || 'Tente novamente.'}`);
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0F0A1F] overflow-y-auto font-sans text-white">
      <div className="relative h-80 sm:h-96 shrink-0">
        <img 
          src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=1200&h=800" 
          alt="EvoluaEla Premium" 
          className="w-full h-full object-cover opacity-60"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0A1F] via-[#0F0A1F]/40 to-transparent" />
        
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 w-14 h-14 bg-white/5 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white hover:bg-white/10 transition-all border border-white/10"
        >
          <X size={28} />
        </button>

        <div className="absolute bottom-12 left-8 right-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            <Crown className="text-[#D81BFF] w-7 h-7" fill="currentColor" />
            <span className="font-bold tracking-[0.4em] uppercase text-[10px] text-[#D81BFF]">Círculo Premium</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-sans font-bold leading-tight tracking-tighter">Sua jornada guiada por quem <span className="text-[#D81BFF]">entende de você</span>.</h2>
        </div>
      </div>

      <div className="p-6 sm:p-16 flex-1 flex flex-col bg-transparent relative">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#D81BFF]/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="space-y-12 flex-1 relative z-10 max-w-4xl mx-auto w-full">
          <div className="text-center">
            <div className="inline-block px-6 py-2 bg-[#D81BFF]/10 text-[#D81BFF] font-bold text-[10px] rounded-full mb-6 uppercase tracking-[0.2em] border border-[#D81BFF]/20">
              Assinatura Mensal Premium
            </div>
            <div className="text-6xl sm:text-8xl font-sans font-bold text-white mb-4 tracking-tighter">R$ 109,90<span className="text-2xl text-white/40 font-sans font-light tracking-normal opacity-90">/mês</span></div>
            <p className="text-[#B8B0C8] text-lg font-medium tracking-tight uppercase tracking-widest text-[10px]">Acesso total e ilimitado. Cancele quando quiser.</p>
          </div>

          <div className="space-y-10">
            <h3 className="font-bold text-white text-xl uppercase tracking-[0.3em] flex items-center gap-4">
              <div className="w-10 h-[1px] bg-[#D81BFF]"></div>
              O Nosso Diferencial
            </h3>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="luxury-card p-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#D81BFF]/10 rounded-full blur-[80px] -mr-10 -mt-10"></div>
                <div className="flex items-start gap-8 relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-[#D81BFF] text-white flex items-center justify-center shrink-0 shadow-2xl">
                    <HeartHandshake size={32} />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-white mb-3 tracking-tight">Acompanhamento Profissional Real</h4>
                    <p className="text-lg text-[#B8B0C8] leading-relaxed font-medium">
                      Diferente de outros apps, aqui você tem <span className="text-[#D81BFF] font-bold">Nutricionistas e Psicólogas</span> de verdade cuidando de você. Não é apenas um plano, é um time focado na sua evolução.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="font-bold text-white text-xl uppercase tracking-[0.3em] flex items-center gap-4 pt-8">
              <div className="w-10 h-[1px] bg-white/20"></div>
              O que preparamos para você
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                'Dieta Personalizada com Nutricionista',
                'Equilíbrio Emocional com Terapeuta',
                'Treinos 100% personalizados',
                'Acesso ilimitado ao Coach IA',
                'Ajustes semanais e chat direto',
                'Comunidade exclusiva de mulheres'
              ].map((item, idx) => (
                <div key={`benefit-${idx}`} className="flex items-center gap-6 p-6 rounded-[2rem] bg-white/5 border border-white/5 group hover:bg-white/10 transition-all duration-500">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-[#D81BFF]/10 text-[#D81BFF] group-hover:bg-[#D81BFF] group-hover:text-white transition-all duration-500">
                    <Check size={24} strokeWidth={3} />
                  </div>
                  <span className="text-lg font-medium text-white/60 group-hover:text-white transition-colors">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="luxury-card p-10 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#D81BFF] to-[#F8C1FF]"></div>
            <p className="text-white font-bold mb-3 text-3xl tracking-tight">Muito além de um app</p>
            <p className="text-[#B8B0C8] text-lg font-medium leading-relaxed">É sobre sua nova versão. Agora você tem um time segurando sua mão em cada passo do caminho.</p>
          </div>

          <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 flex gap-6 items-start">
            <AlertCircle className="text-[#D81BFF] shrink-0 mt-1" size={28} />
            <p className="text-[11px] text-white/40 leading-relaxed font-bold uppercase tracking-[0.2em]">
              <strong className="text-white/60">Lembrete importante:</strong> Nosso apoio é complementar e não substitui consultas médicas presenciais ou atendimentos de emergência, tá?
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 rounded-[2rem] bg-red-500/20 text-red-200 text-sm font-bold flex items-center gap-6 border border-red-500/30 shadow-2xl"
            >
              <AlertCircle size={24} />
              {error}
            </motion.div>
          )}

          </div>

        <div className="mt-20 pt-12 border-t border-white/5 relative z-10 max-w-4xl mx-auto w-full">
          <div className="flex items-center justify-center gap-4 mb-8 text-white/20 text-[10px] font-bold uppercase tracking-[0.3em]">
            <Shield size={20} />
            <span>Pagamento Seguro & Criptografado</span>
          </div>
          <button 
            onClick={handleSubscribe}
            disabled={isProcessing}
            className="luxury-button w-full py-7 rounded-full font-bold uppercase tracking-[0.3em] text-xs text-white shadow-3xl transition-all transform hover:-translate-y-1 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 disabled:hover:translate-y-0 flex items-center justify-center"
          >
            {isProcessing ? (
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Processando...</span>
              </div>
            ) : 'Assinar Agora'}
          </button>
          <p className="text-center text-[10px] text-white/20 mt-8 font-bold leading-relaxed uppercase tracking-[0.2em] max-w-2xl mx-auto">
            Assinatura recorrente de R$ 109,90/mês. Cobrado mensalmente no seu cartão. Você tem total liberdade para cancelar sua assinatura a qualquer momento diretamente nas configurações.
          </p>
        </div>
      </div>
    </div>
  );
}
