import { useState } from 'react';
import { Check, Star, AlertCircle, X, CreditCard } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';

export default function SubscriptionView({ onClose }: { onClose: () => void }) {
  const { theme } = useTheme();
  const { setSubscriptionStatus, setTrialEndDate } = useUser();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubscribe = async () => {
    setIsProcessing(true);
    
    try {
      const { supabase } = await import('../lib/supabase');
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('User not authenticated');
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
        console.error('Failed to create checkout session:', data.error);
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Error initiating checkout:', error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white overflow-y-auto">
      <div className="relative h-64 shrink-0">
        <img 
          src="https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800&h=600" 
          alt="EvoluaEla Premium" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="absolute bottom-6 left-6 right-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Star className="text-amber-400" size={20} fill="currentColor" />
            <span className="font-bold tracking-widest uppercase text-sm text-amber-400">Plano Completo</span>
          </div>
          <h2 className="text-4xl font-serif font-bold leading-tight">Sua evolução guiada por especialistas.</h2>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="space-y-6 flex-1">
          <div className="text-center">
            <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 font-bold text-xs rounded-full mb-3 uppercase tracking-widest">
              7 Dias Grátis
            </div>
            <div className="text-5xl font-serif font-bold text-stone-800 mb-1">R$ 97,90<span className="text-xl text-stone-500 font-medium font-sans">/mês</span></div>
            <p className="text-stone-500 text-sm font-medium">Após o período de teste. Cancele quando quiser.</p>
          </div>

          <div className="space-y-4">
            <h3 className="font-serif font-bold text-stone-800 text-xl">O que está incluído:</h3>
            
            <ul className="space-y-3">
              {[
                'Plano Alimentar Personalizado com Nutricionista',
                'Equilíbrio Emocional com Terapeuta',
                'Treinos 100% personalizados',
                'Acesso ilimitado ao Coach IA',
                'Ajustes semanais e chat direto com especialistas'
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 gradient-bg-light" style={{ color: theme.primary }}>
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span className="text-stone-700 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-emerald-50 p-4 rounded-[1.5rem] border border-emerald-100 flex flex-col items-center text-center">
            <p className="text-emerald-800 font-bold mb-1">Não é só sobre dieta ou treino</p>
            <p className="text-emerald-600 text-sm font-medium">É sobre transformação completa. Agora você tem um time cuidando de você.</p>
          </div>

          <div className="bg-stone-50 p-4 rounded-[1.5rem] border border-stone-100 flex gap-3 items-start">
            <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={20} />
            <p className="text-[10px] text-stone-500 leading-relaxed font-medium">
              <strong>Aviso Legal:</strong> O acompanhamento profissional é realizado por especialistas parceiros. Em casos graves de saúde física ou mental, procure atendimento presencial de emergência.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-stone-100">
          <div className="flex items-center justify-center gap-2 mb-4 text-stone-500 text-xs font-medium">
            <CreditCard size={14} />
            <span>Cobrança apenas após 7 dias</span>
          </div>
          <button 
            onClick={handleSubscribe}
            disabled={isProcessing}
            className="w-full py-4 rounded-[1.5rem] font-bold text-white text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 gradient-bg hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 disabled:hover:translate-y-0 flex items-center justify-center"
          >
            {isProcessing ? 'Processando...' : 'Começar Teste Grátis'}
          </button>
          <p className="text-center text-[10px] text-stone-400 mt-4 font-medium leading-relaxed">
            Você não será cobrada hoje. Após 7 dias, a assinatura de R$ 97,90/mês será renovada automaticamente. Cancele a qualquer momento nas configurações.
          </p>
        </div>
      </div>
    </div>
  );
}
