import { useState, useEffect, useRef } from 'react';
import { Send, Bot, AlertTriangle, Crown, Lock } from 'lucide-react';
import { motion } from 'motion/react';
import { getGeminiAI, hasGeminiKey } from '../lib/gemini';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';

export default function AICoachView({ onUpgrade }: { onUpgrade?: () => void }) {
  const { theme } = useTheme();
  const { userName, isPremium, subscriptionStatus, coachMessagesCount, setCoachMessagesCount } = useUser();
  
  const hasUnlimitedCoach = isPremium || subscriptionStatus === 'trial';
  const MAX_FREE_MESSAGES = 3;
  const messagesRemaining = Math.max(0, MAX_FREE_MESSAGES - coachMessagesCount);
  const isBlocked = !hasUnlimitedCoach && messagesRemaining === 0;

  const [messages, setMessages] = useState<{ id: string; role: 'user' | 'model'; text: string }[]>([
    { id: 'msg-init', role: 'model', text: `Oii, ${userName}! Sou sua Coach EvoluaEla. Estou aqui para te apoiar, motivar e ajudar a manter a constância. Como posso te apoiar e deixar seu dia mais leve hoje? 💕` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat session
  const chatRef = useRef<any>(null);

  useEffect(() => {
    if (hasGeminiKey()) {
      const ai = getGeminiAI();
      chatRef.current = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: `Você é uma Coach virtual do app EvoluaEla, uma plataforma digital por assinatura mensal voltada exclusivamente para mulheres que desejam emagrecer, melhorar sua saúde, desenvolver disciplina e evoluir de forma estruturada e consistente.
O nome da usuária com quem você está falando é ${userName}. Use o nome dela para criar uma conexão mais pessoal e próxima, por exemplo: "Você consegue, ${userName}. Vamos continuar hoje."
Seu tom de voz é de uma amiga acolhedora e motivadora. Você usa linguagem simples, direta e emocional. Você incentiva a disciplina sem ser agressiva, dá conselhos práticos e ajuda em momentos de desânimo.
IMPORTANTE: Você deve sempre deixar claro que não substitui profissionais de saúde (médicos, nutricionistas, educadores físicos, psicólogos), não oferece diagnóstico médico e é apenas uma ferramenta de apoio.
Frase base do app: 'Evoluir não é sobre motivação. É sobre constância.'
Seja concisa nas respostas, use emojis, e foque em ação e acolhimento.`,
        }
      });
    }
  }, [userName]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || isBlocked) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { id: `msg-${Date.now()}-user`, role: 'user', text: userMsg }]);
    setIsLoading(true);

    if (!hasUnlimitedCoach) {
      setCoachMessagesCount(coachMessagesCount + 1);
    }

    try {
      if (!hasGeminiKey()) {
        throw new Error("API Key missing");
      }
      const response = await chatRef.current.sendMessage({ message: userMsg });
      setMessages(prev => [...prev, { id: `msg-${Date.now()}-model`, role: 'model', text: response.text }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, { id: `msg-${Date.now()}-error`, role: 'model', text: 'Ops, parece que meu sinal falhou um pouquinho. Vamos tentar conversar de novo? 🥺' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      <header className="px-6 pt-6 pb-4 flex flex-col gap-2 shrink-0 bg-white border-b border-stone-100 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-[1.5rem] flex items-center justify-center shadow-md gradient-bg text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-10 h-10 bg-white/20 rounded-full blur-xl -mr-4 -mt-4 animate-pulse-soft"></div>
            <Bot size={28} className="relative z-10" />
          </div>
          <div>
            <h2 className="text-2xl font-serif font-bold text-stone-800">Sua Mentora</h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mt-0.5">Sempre aqui para te apoiar</p>
          </div>
        </div>
        
        {/* Disclaimer and Status */}
        <div className="mt-4 space-y-2">
          {hasUnlimitedCoach ? (
            <div className="flex items-center gap-2 p-3 rounded-xl text-[10px] font-bold uppercase tracking-widest gradient-bg-light shadow-sm" style={{ color: theme.primary }}>
              <Crown size={14} className="shrink-0" />
              <span>Pode falar comigo sempre que precisar, estou aqui! 💖</span>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 rounded-xl text-[10px] font-bold uppercase tracking-widest bg-stone-100 text-stone-600 shadow-sm">
              <span>Mensagens para hoje:</span>
              <span className={`px-2 py-0.5 rounded-md ${messagesRemaining === 0 ? 'bg-rose-100 text-rose-600' : 'bg-stone-200 text-stone-700'}`}>
                {messagesRemaining} / {MAX_FREE_MESSAGES}
              </span>
            </div>
          )}
          
          <div className="flex items-start gap-2 p-3 rounded-xl text-[10px] leading-relaxed bg-stone-50 border border-stone-100 text-stone-500 font-medium">
            <AlertTriangle size={14} className="shrink-0 mt-0.5 text-amber-500" />
            <p>Lembrete carinhoso: estou aqui para te motivar, mas não substituo o acompanhamento de médicos ou especialistas, tá?</p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 hide-scrollbar bg-stone-50/50">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] p-4 rounded-2xl ${
                msg.role === 'user' 
                  ? 'rounded-tr-sm text-white shadow-md gradient-bg' 
                  : 'bg-white border border-stone-100 rounded-tl-sm text-stone-800 soft-shadow-sm'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{msg.text}</p>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="max-w-[85%] p-4 rounded-2xl rounded-tl-sm soft-shadow-sm flex gap-1.5 items-center bg-white border border-stone-100">
              <div className="w-2 h-2 rounded-full bg-stone-300 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 rounded-full bg-stone-300 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 rounded-full bg-stone-300 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 shrink-0 bg-white border-t border-stone-100">
        {isBlocked ? (
          <div className="bg-stone-50 border border-stone-200 rounded-[1.5rem] p-6 text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-3">
              <Lock size={20} className="text-rose-500" />
            </div>
            <h3 className="text-sm font-bold text-stone-800 mb-2">Nossa conversa por aqui hoje chegou ao fim, mas amanhã tem mais! 💖</h3>
            <p className="text-xs text-stone-500 mb-4 font-medium">Quer conversar comigo sem limites e ter apoio total? Venha para o Premium!</p>
            <button 
              onClick={onUpgrade}
              className="w-full py-3 rounded-2xl font-bold text-white shadow-md hover:shadow-lg transition-all gradient-bg flex items-center justify-center gap-2"
            >
              <Crown size={16} />
              Quero acesso ilimitado
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-stone-50 border border-stone-100 rounded-[1.5rem] p-1.5 pr-2 focus-within:ring-2 focus-within:ring-stone-200 focus-within:bg-white transition-all soft-shadow-sm">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="O que está no seu coração agora?"
              className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-3 text-sm outline-none text-stone-800 placeholder:text-stone-400 font-medium"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="w-12 h-12 rounded-[1.25rem] flex items-center justify-center transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 text-white shadow-md gradient-bg"
            >
              <Send size={18} className="ml-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
