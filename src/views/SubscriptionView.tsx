import { useState } from 'react';
import { Check, Star, AlertCircle, X, CreditCard, HeartHandshake } from 'lucide-react';
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
        // Use window.open with _top as a fallback if location.href is blocked
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
    <div className="fixed inset-0 z-50 flex flex-col bg-[var(--color-bg)] overflow-y-auto font-sans text-[var(--color-text)]">
      <div className="relative h-72 sm:h-80 shrink-0">
        <img 
          src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=1200&h=800" 
          alt="EvoluaEla Premium" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)]/40 to-transparent" />
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-12 h-12 bg-black/40 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white hover:bg-black/60 transition-all border border-white/10"
        >
          <X size={24} />
        </button>

        <div className="absolute bottom-8 left-8 right-8 text-white">
          <div className="flex items-center gap-3 mb-3">
            <Star className="text-[#D4B996] w-6 h-6" fill="currentColor" />
            <span className="font-bold tracking-widest uppercase text-xs text-[#D4B996]">Círculo Premium</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tighter">Sua jornada guiada por quem <span className="gradient-text">entende de você</span>.</h2>
        </div>
      </div>

      <div className="p-4 sm:p-10 flex-1 flex flex-col bg-[var(--color-bg)] relative">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#E8B4BC]/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="space-y-8 flex-1 relative z-10">
          <div className="text-center">
            <div className="inline-block px-5 py-2 bg-[#E8B4BC]/10 text-[#E8B4BC] font-bold text-[10px] rounded-full mb-4 uppercase tracking-widest border border-[#E8B4BC]/20">
              Experimente por 7 Dias Grátis
            </div>
            <div className="text-6xl sm:text-7xl font-bold text-[var(--color-text)] mb-2 tracking-tighter">R$ 109,90<span className="text-xl text-[var(--color-text-muted)]/20 font-bold tracking-normal">/mês</span></div>
            <p className="text-[var(--color-text-muted)] text-sm font-medium tracking-wide">Acompanhamento profissional completo. Cancele quando quiser.</p>
          </div>

          <div className="space-y-6">
            <h3 className="font-bold text-[var(--color-text)] text-xl uppercase tracking-widest flex items-center gap-3">
              <div className="w-8 h-1 bg-[#E8B4BC] rounded-full"></div>
              O Nosso Diferencial
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="p-6 rounded-[2.5rem] bg-gradient-to-br from-[#E8B4BC]/20 to-[#D4B996]/20 border border-[#E8B4BC]/30 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#E8B4BC]/10 rounded-full blur-[60px] -mr-10 -mt-10"></div>
                <div className="flex items-start gap-5 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-[#E8B4BC] text-black flex items-center justify-center shrink-0 shadow-2xl">
                    <HeartHandshake size={28} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2 tracking-tight">Acompanhamento Profissional Real</h4>
                    <p className="text-sm text-white/60 leading-relaxed font-medium">
                      Diferente de outros apps, aqui você tem <span className="text-[#E8B4BC] font-bold">Nutricionistas e Psicólogas</span> de verdade cuidando de você. Não é apenas um plano, é um time focado na sua evolução.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="font-bold text-[var(--color-text)] text-xl uppercase tracking-widest flex items-center gap-3 pt-4">
              <div className="w-8 h-1 bg-[var(--color-text)]/20 rounded-full"></div>
              O que preparamos para você
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                'Dieta Personalizada com Nutricionista',
                'Equilíbrio Emocional com Terapeuta',
                'Treinos 100% personalizados',
                'Acesso ilimitado ao Coach IA',
                'Ajustes semanais e chat direto',
                'Comunidade exclusiva de mulheres'
              ].map((item, idx) => (
                <div key={`benefit-${idx}`} className="flex items-center gap-4 p-5 rounded-3xl bg-[var(--color-text)]/5 border border-[var(--color-border)] group hover:bg-[var(--color-text)]/10 transition-all">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-[#E8B4BC]/10 text-[#E8B4BC] group-hover:bg-[#E8B4BC] group-hover:text-black transition-all">
                    <Check size={20} strokeWidth={3} />
                  </div>
                  <span className="text-sm font-bold text-[var(--color-text-muted)] group-hover:text-[var(--color-text)] transition-colors">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-8 border border-[var(--color-border)] shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#E8B4BC] to-[#D4B996]"></div>
            <p className="text-[var(--color-text)] font-bold mb-2 text-lg tracking-tight">Muito além de um app</p>
            <p className="text-[var(--color-text-muted)] text-sm font-medium leading-relaxed">É sobre sua nova versão. Agora você tem um time segurando sua mão em cada passo do caminho.</p>
          </div>

          <div className="bg-[var(--color-text)]/5 p-6 rounded-3xl border border-[var(--color-border)] flex gap-4 items-start">
            <AlertCircle className="text-[#D4B996] shrink-0 mt-0.5" size={24} />
            <p className="text-[11px] text-[var(--color-text-muted)]/30 leading-relaxed font-bold uppercase tracking-widest">
              <strong className="text-[var(--color-text-muted)]/60">Lembrete importante:</strong> Nosso apoio é complementar e não substitui consultas médicas presenciais ou atendimentos de emergência, tá?
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-3xl bg-rose-500/10 text-rose-500 text-sm font-bold flex items-center gap-4 border border-rose-500/20 shadow-2xl"
            >
              <AlertCircle size={20} />
              {error}
            </motion.div>
          )}
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--color-border)] relative z-10">
          <div className="flex items-center justify-center gap-3 mb-6 text-[var(--color-text-muted)]/20 text-[10px] font-bold uppercase tracking-widest">
            <CreditCard size={16} />
            <span>Cobrança segura apenas após 7 dias</span>
          </div>
          <button 
            onClick={handleSubscribe}
            disabled={isProcessing}
            className="w-full py-6 rounded-full font-bold uppercase tracking-widest text-xs text-black shadow-3xl hover:shadow-white/10 transition-all transform hover:-translate-y-1 bg-gradient-to-r from-[#E8B4BC] to-[#D4B996] hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 disabled:hover:translate-y-0 flex items-center justify-center"
          >
            {isProcessing ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                <span>Processando...</span>
              </div>
            ) : 'Quero começar meu teste grátis'}
          </button>
          <p className="text-center text-[9px] text-[var(--color-text-muted)]/10 mt-6 font-bold leading-relaxed uppercase tracking-widest max-w-md mx-auto">
            Fique tranquila, nada será cobrado hoje. Após os 7 dias, a assinatura de R$ 109,90/mês será renovada automaticamente. Você tem total liberdade para cancelar quando quiser.
          </p>
        </div>
      </div>
    </div>
  );
}
