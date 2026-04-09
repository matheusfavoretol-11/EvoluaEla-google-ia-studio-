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
  const isBlocked = !hasUnlimitedCoach;

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
    <div className="flex flex-col h-full relative bg-transparent text-white font-sans">
      <header className="px-6 sm:px-10 pt-10 pb-6 flex flex-col gap-4 shrink-0 backdrop-blur-xl border-b border-white/5 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl bg-gradient-to-br from-[#D81BFF] to-[#F8C1FF] text-white relative overflow-hidden group">
            <Bot size={28} className="relative z-10" />
          </div>
          <div>
            <h2 className="font-bold text-2xl text-white tracking-tighter">Sua Mentora <span className="text-[#D81BFF] italic">IA</span></h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#B8B0C8] mt-0.5">Sempre aqui para te apoiar</p>
          </div>
        </div>
        
        {/* Status & Limits */}
        <div className="flex flex-wrap gap-3">
          {hasUnlimitedCoach ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#D81BFF]/10 border border-[#D81BFF]/20 text-[#D81BFF]">
              <Crown size={12} fill="currentColor" />
              <span>Acesso Ilimitado Premium</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/5 border border-white/10 text-white/40">
              <Lock size={12} className="text-[#D81BFF]" />
              <span>Conteúdo Bloqueado</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/5 border border-white/10 text-white/20">
            <AlertTriangle size={12} className="text-[#D81BFF]" />
            <span>Apoio Motivacional</span>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-10 sm:px-10 space-y-6 hide-scrollbar bg-transparent">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`p-5 rounded-3xl ${
                msg.role === 'user' 
                  ? 'rounded-tr-sm text-white font-bold shadow-2xl bg-[#D81BFF]' 
                  : 'luxury-card rounded-tl-sm text-white/90 shadow-xl border border-white/10'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium tracking-tight">{msg.text}</p>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="luxury-card p-4 rounded-2xl rounded-tl-sm shadow-xl flex gap-2 items-center border border-white/10">
              <div className="w-2 h-2 rounded-full bg-[#D81BFF] animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 rounded-full bg-[#D81BFF] animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 rounded-full bg-[#D81BFF] animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="px-6 py-10 sm:px-10 shrink-0 backdrop-blur-xl border-t border-white/5">
        {isBlocked ? (
          <div className="luxury-card p-8 text-center shadow-2xl border border-white/10">
            <div className="w-14 h-14 rounded-2xl bg-[#D81BFF]/10 flex items-center justify-center mx-auto mb-4">
              <Lock size={24} className="text-[#D81BFF]" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 tracking-tight">Limite diário atingido 🌸</h3>
            <p className="text-sm text-[#B8B0C8] mb-6 font-medium">Quer conversar comigo sem limites e ter apoio total? Venha para o Premium!</p>
            <button 
              onClick={onUpgrade}
              className="luxury-button w-full py-5 rounded-full font-bold uppercase tracking-widest text-white shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 text-xs"
            >
              <Crown size={16} fill="currentColor" />
              Quero acesso ilimitado
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 luxury-card rounded-full p-2 pr-3 focus-within:ring-2 focus-within:ring-[#D81BFF]/50 transition-all shadow-2xl border border-white/10">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="O que está no seu coração agora?"
              className="flex-1 bg-transparent border-none focus:ring-0 px-5 py-3 text-sm outline-none text-white placeholder:text-white/20 font-medium"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 disabled:opacity-90 disabled:hover:scale-100 text-white shadow-2xl bg-[#D81BFF]"
            >
              <Send size={20} className="ml-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
