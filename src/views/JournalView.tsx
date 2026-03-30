import { useState, useRef, useEffect } from 'react';
import { Heart, Send, Sparkles, BookHeart, MessageCircleHeart } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import { getGeminiAI, hasGeminiKey } from '../lib/gemini';
import { supabase } from '../lib/supabase';

export default function JournalView() {
  const { theme } = useTheme();
  const { userName, userId } = useUser();
  const [entry, setEntry] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAIResponse, setShowAIResponse] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);

  const prompts = [
    "O que está no seu coração hoje?",
    "O que sua alma precisa ouvir agora?",
    "Pelo que seu coração transborda gratidão hoje?",
    "Como foi o seu primeiro pensamento ao acordar?"
  ];

  const handleSubmit = async () => {
    if (!entry.trim() || !userId) return;
    
    setIsSubmitting(true);
    setShowAIResponse(true);
    setAiResponse('');

    try {
      if (!hasGeminiKey()) {
        throw new Error("API Key missing");
      }
      const ai = getGeminiAI();
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: `Você é uma amiga e mentora empática, acolhedora e humana do app EvoluaEla. 
A usuária ${userName} está desabafando no diário emocional dela.
Seu objetivo é validar o sentimento dela, dar um direcionamento prático e firme, mas com muito amor.
Nunca pareça robótica. Use um tom de "amiga + mentora firme".
Exemplo de tom: "Eu entendo o que você está sentindo… mas você não pode se abandonar agora. Vamos juntas sair disso."
Seja concisa, use emojis e foque no acolhimento.`,
        }
      });

      const response = await chat.sendMessage({ message: `Meu desabafo: ${entry}` });
      const responseText = response.text || '';
      setAiResponse(responseText);

      // Save to Supabase
      const entryId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await supabase
        .from('journal_entries')
        .insert({
          id: entryId,
          user_id: userId,
          content: entry,
          ai_response: responseText,
          prompt_used: selectedPrompt || '',
          created_at: new Date().toISOString()
        });

    } catch (error) {
      console.error("Error getting AI response or saving to Supabase:", error);
      setAiResponse("Estou aqui segurando sua mão, mas meu sinal falhou. Respire fundo, sinta meu abraço. Você não está sozinha. 💖");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-8 relative min-h-full flex flex-col bg-[#FAF9F6]">
      <header className="space-y-2">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-full bg-white border border-[#3F2A2F]/5 flex items-center justify-center text-[#E8B4BC]">
            <BookHeart size={24} />
          </div>
          <h2 className="text-3xl font-serif font-light text-[#3F2A2F] italic">Meu Cantinho de Reflexão</h2>
        </div>
        <p className="text-[#3F2A2F]/40 font-light">
          Este é o seu refúgio seguro. Pode soltar tudo o que sente, refletir e se reencontrar.
        </p>
      </header>

      {!showAIResponse ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col space-y-6"
        >
          {/* Prompts */}
          <div className="space-y-3">
            <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#3F2A2F]/20">Sobre o que seu coração quer falar?</span>
            <div className="flex flex-wrap gap-2">
              {prompts.map((prompt, idx) => (
                <button
                  key={`${prompt}-${idx}`}
                  onClick={() => {
                    setSelectedPrompt(prompt);
                    setEntry(prompt + "\n\n");
                  }}
                  className={`text-[9px] font-medium uppercase tracking-[0.2em] px-4 py-2 rounded-full border transition-all ${
                    selectedPrompt === prompt 
                      ? 'bg-[#3F2A2F] text-white border-[#3F2A2F]' 
                      : 'bg-white text-[#3F2A2F]/40 border-[#3F2A2F]/5 hover:border-[#3F2A2F]/20 hover:text-[#3F2A2F]/60'
                  }`}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Text Area */}
          <div className="flex-1 flex flex-col relative">
            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder="Pode soltar tudo aqui..."
              className="flex-1 w-full p-8 rounded-[2rem] bg-white border border-[#3F2A2F]/5 resize-none focus:ring-1 focus:ring-[#E8B4BC]/20 outline-none text-[#3F2A2F] leading-relaxed font-light text-lg placeholder:text-[#3F2A2F]/10"
            />
            
            <button
              onClick={handleSubmit}
              disabled={!entry.trim() || isSubmitting}
              className="absolute bottom-6 right-6 px-8 py-4 rounded-full font-light uppercase tracking-[0.2em] text-[10px] text-white shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 flex items-center gap-2 bg-[#E8B4BC] hover:bg-[#3F2A2F]"
            >
              <MessageCircleHeart size={16} />
              Quero desabafar
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col"
        >
          <div className="bg-white p-8 rounded-[2rem] border border-[#3F2A2F]/5 relative overflow-hidden flex-1">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#E8B4BC]/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-full bg-[#3F2A2F] flex items-center justify-center text-white shadow-xl">
                  <Sparkles size={24} />
                </div>
                <div>
                  <h3 className="font-serif font-light italic text-xl text-[#3F2A2F]">Sua Mentora</h3>
                  <p className="text-[9px] text-[#3F2A2F]/30 font-medium uppercase tracking-[0.2em]">Acolhendo suas palavras...</p>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto hide-scrollbar">
                {isSubmitting ? (
                  <div className="flex gap-2 items-center justify-center h-full opacity-30">
                    <div className="w-2 h-2 rounded-full bg-[#3F2A2F] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-[#3F2A2F] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-[#3F2A2F] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                ) : (
                  <p className="text-[#3F2A2F]/80 leading-relaxed whitespace-pre-wrap font-light text-xl italic">
                    "{aiResponse}"
                  </p>
                )}
              </div>

              {!isSubmitting && (
                <button
                  onClick={() => {
                    setShowAIResponse(false);
                    setEntry('');
                    setSelectedPrompt(null);
                  }}
                  className="mt-8 w-full py-5 rounded-full font-medium uppercase tracking-[0.2em] text-[10px] text-[#3F2A2F]/40 bg-[#FAF9F6] hover:bg-[#3F2A2F]/5 hover:text-[#3F2A2F]/60 transition-all border border-[#3F2A2F]/5"
                >
                  Voltar para minhas reflexões
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
