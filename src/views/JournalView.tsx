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
    <div className="p-4 sm:p-6 space-y-10 relative min-h-full flex flex-col bg-[var(--color-bg)] text-[var(--color-text)] font-sans overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <header className="space-y-3 relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-3xl bg-[var(--color-text)]/5 border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary)] shadow-2xl backdrop-blur-xl">
            <BookHeart size={32} />
          </div>
          <h2 className="text-5xl font-bold text-[var(--color-text)] tracking-tighter">Meu <span className="gradient-text">Diário</span></h2>
        </div>
        <p className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-widest leading-relaxed max-w-md">
          Este é o seu refúgio seguro. Pode soltar tudo o que sente, refletir e se reencontrar.
        </p>
      </header>

      {!showAIResponse ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col space-y-8 relative z-10"
        >
          {/* Prompts */}
          <div className="space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Sobre o que seu coração quer falar?</span>
            <div className="flex flex-wrap gap-3">
              {prompts.map((prompt, idx) => (
                <button
                  key={`${prompt}-${idx}`}
                  onClick={() => {
                    setSelectedPrompt(prompt);
                    setEntry(prompt + "\n\n");
                  }}
                  className={`text-[10px] font-bold uppercase tracking-widest px-6 py-3 rounded-2xl border transition-all shadow-2xl ${
                    selectedPrompt === prompt 
                      ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-black border-transparent scale-105' 
                      : 'bg-[var(--color-text)]/5 text-[var(--color-text-muted)] border-[var(--color-border)] hover:border-[var(--color-text)]/20 hover:text-[var(--color-text)]'
                  }`}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Text Area */}
          <div className="flex-1 flex flex-col relative group">
            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder="Pode soltar tudo aqui..."
              className="flex-1 w-full p-10 rounded-[2.5rem] bg-[var(--color-text)]/5 border border-[var(--color-border)] resize-none focus:border-[var(--color-primary)]/30 outline-none text-[var(--color-text)] leading-relaxed font-bold text-xl placeholder:text-[var(--color-text-muted)]/20 shadow-2xl transition-all backdrop-blur-md"
            />
            
            <button
              onClick={handleSubmit}
              disabled={!entry.trim() || isSubmitting}
              className="absolute bottom-8 right-8 px-10 py-5 rounded-2xl font-bold uppercase tracking-widest text-xs text-black shadow-2xl hover:scale-105 transition-all disabled:opacity-30 disabled:hover:scale-100 flex items-center gap-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]"
            >
              <MessageCircleHeart size={20} />
              Quero desabafar
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col relative z-10"
        >
          <div className="glass-card p-10 rounded-[3rem] border border-[var(--color-border)] relative overflow-hidden flex-1 shadow-2xl flex flex-col">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)]/5 rounded-full blur-[100px] -mr-20 -mt-20"></div>
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-5 mb-10">
                <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-black shadow-2xl">
                  <Sparkles size={36} />
                </div>
                <div>
                  <h3 className="font-bold text-3xl text-[var(--color-text)] tracking-tight">Sua Mentora</h3>
                  <p className="text-[10px] text-[var(--color-text-muted)] font-bold uppercase tracking-widest mt-1">Acolhendo suas palavras...</p>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto hide-scrollbar pr-4">
                {isSubmitting ? (
                  <div className="flex gap-3 items-center justify-center h-full opacity-20">
                    <div className="w-3 h-3 rounded-full bg-[var(--color-text)] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-3 h-3 rounded-full bg-[var(--color-text)] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-3 h-3 rounded-full bg-[var(--color-text)] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                ) : (
                  <p className="text-[var(--color-text)]/80 leading-relaxed whitespace-pre-wrap font-bold text-2xl italic tracking-tight">
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
                  className="mt-10 w-full py-6 rounded-2xl font-bold uppercase tracking-widest text-[10px] text-[var(--color-text-muted)] bg-[var(--color-text)]/5 hover:bg-[var(--color-text)]/10 hover:text-[var(--color-text)] transition-all border border-[var(--color-border)] shadow-2xl"
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
