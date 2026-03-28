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
    <div className="p-6 space-y-8 relative min-h-full flex flex-col">
      <header className="space-y-2">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
            <BookHeart size={20} />
          </div>
          <h2 className="text-3xl font-serif text-stone-800">Meu Cantinho de Reflexão</h2>
        </div>
        <p className="text-sm text-stone-500 font-medium">
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
            <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Sobre o que seu coração quer falar?</span>
            <div className="flex flex-wrap gap-2">
              {prompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedPrompt(prompt);
                    setEntry(prompt + "\n\n");
                  }}
                  className={`text-xs font-medium px-4 py-2 rounded-full border transition-colors ${
                    selectedPrompt === prompt 
                      ? 'bg-stone-800 text-white border-stone-800' 
                      : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
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
              className="flex-1 w-full p-6 rounded-[2rem] bg-white border border-stone-100 soft-shadow-sm resize-none focus:ring-2 focus:ring-stone-100 outline-none text-stone-700 leading-relaxed"
            />
            
            <button
              onClick={handleSubmit}
              disabled={!entry.trim() || isSubmitting}
              className="absolute bottom-4 right-4 px-6 py-3 rounded-2xl font-bold text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
              style={{ backgroundColor: theme.primary }}
            >
              <MessageCircleHeart size={18} />
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
          <div className="bg-white p-8 rounded-[2rem] soft-shadow-sm border border-stone-100 relative overflow-hidden flex-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full blur-3xl -mr-10 -mt-10"></div>
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-white shadow-md">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-stone-800">Sua Mentora</h3>
                  <p className="text-xs text-stone-400 font-medium">Acolhendo suas palavras...</p>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto hide-scrollbar">
                {isSubmitting ? (
                  <div className="flex gap-1.5 items-center justify-center h-full opacity-50">
                    <div className="w-2 h-2 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                ) : (
                  <p className="text-stone-700 leading-relaxed whitespace-pre-wrap font-medium text-lg">
                    {aiResponse}
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
                  className="mt-6 w-full py-4 rounded-2xl font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors"
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
