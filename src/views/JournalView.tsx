import { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Clock, 
  Dumbbell, 
  Heart,
  Sparkles,
  BookHeart,
  MessageCircleHeart,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import { getGeminiAI, hasGeminiKey } from '../lib/gemini';
import { supabase } from '../lib/supabase';

export default function JournalView() {
  const { theme } = useTheme();
  const { userName, userId } = useUser();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showJournal, setShowJournal] = useState(false);
  const [entry, setEntry] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [showAIResponse, setShowAIResponse] = useState(false);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const days = daysInMonth(year, month);
    const firstDay = firstDayOfMonth(year, month);
    const calendarDays = [];

    // Empty slots for previous month
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="h-14 w-full" />);
    }

    // Days of the month
    for (let day = 1; day <= days; day++) {
      const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
      const isSelected = selectedDate.toDateString() === new Date(year, month, day).toDateString();
      
      // Mock data for completed workouts
      const hasWorkout = day % 3 === 0;

      calendarDays.push(
        <motion.button
          key={day}
          whileTap={{ scale: 0.9 }}
          onClick={() => setSelectedDate(new Date(year, month, day))}
          className={`h-14 w-full rounded-2xl flex flex-col items-center justify-center relative transition-all ${
            isSelected 
              ? 'bg-[#D81BFF] text-white shadow-lg' 
              : isToday 
                ? 'bg-white/10 text-white border border-[#D81BFF]/30' 
                : 'text-white/40 hover:bg-white/5'
          }`}
        >
          <span className="text-sm font-bold">{day}</span>
          {hasWorkout && !isSelected && (
            <div className="absolute bottom-2 w-1 h-1 rounded-full bg-[#D81BFF]" />
          )}
        </motion.button>
      );
    }

    return calendarDays;
  };

  const handleSubmitJournal = async () => {
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
          systemInstruction: `Você é uma mentora empática do app EvoluaEla. A usuária ${userName} está escrevendo no diário. Valide os sentimentos dela com elegância e sofisticação. Seja breve, use emojis e foque no acolhimento de luxo.`,
        }
      });

      const response = await chat.sendMessage({ message: entry });
      setAiResponse(response.text || '');

      // Save to Supabase (mocked for now)
      console.log("Saving journal entry...");

    } catch (error) {
      setAiResponse("Estou aqui com você. Respire fundo. Você é maravilhosa. 💖");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-6 sm:px-10 py-8 space-y-10 flex flex-col h-full overflow-y-auto pb-32">
      <header className="space-y-2">
        <p className="text-[10px] font-bold text-[#D81BFF] uppercase tracking-[0.4em]">Sua Jornada</p>
        <h2 className="text-4xl font-sans font-bold text-white tracking-tight">Calendário</h2>
      </header>

      {/* Calendar Card */}
      <div className="luxury-card p-6 space-y-8">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-white tracking-tight">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <div className="flex gap-2">
            <button onClick={handlePrevMonth} className="p-2 bg-white/5 rounded-xl text-white/40 hover:text-white transition-colors">
              <ChevronLeft size={20} />
            </button>
            <button onClick={handleNextMonth} className="p-2 bg-white/5 rounded-xl text-white/40 hover:text-white transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {["D", "S", "T", "Q", "Q", "S", "S"].map((day, idx) => (
            <div key={`${day}-${idx}`} className="text-center text-[10px] font-bold text-[#B8B0C8] uppercase tracking-widest py-2">
              {day}
            </div>
          ))}
          {renderCalendar()}
        </div>
      </div>

      {/* Selected Day Info */}
      <div className="space-y-6">
        <div className="flex justify-between items-end">
          <h3 className="text-xl font-bold text-white tracking-tight">
            {selectedDate.getDate()} de {monthNames[selectedDate.getMonth()]}
          </h3>
          <button 
            onClick={() => setShowJournal(true)}
            className="text-[10px] font-bold text-[#D81BFF] uppercase tracking-widest flex items-center gap-2"
          >
            <BookHeart size={14} /> Escrever no Diário
          </button>
        </div>

        <div className="space-y-4">
          <div className="luxury-card p-5 flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#D81BFF]/10 flex items-center justify-center text-[#D81BFF]">
                <Dumbbell size={20} />
              </div>
              <div>
                <p className="font-bold text-white">Treino de Superiores</p>
                <p className="text-[10px] font-bold text-[#B8B0C8] uppercase tracking-widest">Concluído • 25 min</p>
              </div>
            </div>
            <CheckCircle2 size={20} className="text-[#D81BFF]" />
          </div>

          <div className="luxury-card p-5 flex items-center justify-between group opacity-50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20">
                <Heart size={20} />
              </div>
              <div>
                <p className="font-bold text-white">Meditação Guiada</p>
                <p className="text-[10px] font-bold text-[#B8B0C8] uppercase tracking-widest">Não realizado</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Journal Modal */}
      <AnimatePresence>
        {showJournal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl p-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="luxury-card w-full max-w-lg p-8 space-y-8 relative overflow-hidden"
            >
              <button 
                onClick={() => {
                  setShowJournal(false);
                  setShowAIResponse(false);
                  setEntry('');
                }} 
                className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#D81BFF]/10 flex items-center justify-center text-[#D81BFF]">
                  <BookHeart size={24} />
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight">Diário de Emoções</h3>
              </div>

              {!showAIResponse ? (
                <div className="space-y-6">
                  <p className="text-sm text-[#B8B0C8] leading-relaxed">
                    Como você está se sentindo hoje? Este espaço é só seu.
                  </p>
                  <textarea
                    value={entry}
                    onChange={(e) => setEntry(e.target.value)}
                    placeholder="Escreva aqui seu desabafo..."
                    className="w-full h-40 p-6 rounded-3xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#D81BFF]/50 transition-all resize-none font-medium"
                  />
                  <button 
                    onClick={handleSubmitJournal}
                    disabled={!entry.trim() || isSubmitting}
                    className="luxury-button w-full py-5 rounded-full font-bold text-white uppercase tracking-widest text-xs flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? "Processando..." : "Enviar para Mentora"}
                    <MessageCircleHeart size={18} />
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Sparkles size={20} className="text-[#D81BFF]" />
                    <p className="text-[10px] font-bold text-[#D81BFF] uppercase tracking-widest">Resposta da Mentora</p>
                  </div>
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10 italic text-white/80 leading-relaxed">
                    {isSubmitting ? "..." : aiResponse}
                  </div>
                  <button 
                    onClick={() => setShowJournal(false)}
                    className="w-full py-5 rounded-full bg-white/5 text-white/40 font-bold uppercase tracking-widest text-[10px] border border-white/10"
                  >
                    Fechar
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
