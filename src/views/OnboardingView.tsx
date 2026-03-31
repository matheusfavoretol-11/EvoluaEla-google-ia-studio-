import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, Activity, ArrowRight, Check, Heart, Clock, Brain, Flame, Sparkles, Smile, Frown, Meh } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import { supabase } from '../lib/supabase';

interface OnboardingViewProps {
  onComplete: () => void;
}

export default function OnboardingView({ onComplete }: OnboardingViewProps) {
  const { theme } = useTheme();
  const { setOnboardingAnswers, userId } = useUser();
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  
  const [objective, setObjective] = useState('');
  const [feeling, setFeeling] = useState('');
  const [challenge, setChallenge] = useState('');

  const objectives = [
    { id: 'emagrecer', label: 'Emagrecer com saúde', icon: Target },
    { id: 'tonificar', label: 'Ganhar tônus muscular', icon: Activity },
    { id: 'disciplina', label: 'Criar disciplina diária', icon: Check },
    { id: 'amor_proprio', label: 'Desenvolver amor próprio', icon: Heart },
  ];

  const feelings = [
    { id: 'insegura', label: 'Insegura', icon: Frown },
    { id: 'aceitando', label: 'Em processo de aceitação', icon: Meh },
    { id: 'confiante', label: 'Confiante', icon: Smile },
    { id: 'transformacao', label: 'Pronta para mudar', icon: Sparkles },
  ];

  const challenges = [
    { id: 'tempo', label: 'Falta de tempo', icon: Clock },
    { id: 'procrastinacao', label: 'Procrastinação', icon: Brain },
    { id: 'ansiedade', label: 'Ansiedade e estresse', icon: Activity },
    { id: 'motivacao', label: 'Falta de motivação', icon: Flame },
  ];

  const handleNext = async () => {
    if (step === 1 && objective) setStep(2);
    else if (step === 2 && feeling) setStep(3);
    else if (step === 3 && challenge) {
      setIsSaving(true);
      try {
        const answers = { objective, feeling, challenge };
        setOnboardingAnswers(answers);
        
        if (userId) {
          await supabase
            .from('onboarding_answers')
            .upsert({
              user_id: userId,
              answers: answers,
              updated_at: new Date().toISOString()
            });
        }
        
        onComplete();
      } catch (error) {
        console.error("Error saving onboarding answers:", error);
        // Still complete onboarding even if save fails to not block user
        onComplete();
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-white font-sans text-[#3F2A2F]">
      <div className="flex-1 flex flex-col px-6 sm:px-8 py-10 sm:py-16 max-w-md mx-auto w-full">
        
        {/* Progress Bar */}
        <div className="w-full h-1 bg-[#FAF9F6] rounded-full mb-10 sm:mb-16 overflow-hidden">
          <motion.div 
            className="h-full rounded-full bg-[#E8B4BC]"
            initial={{ width: '0%' }}
            animate={{ width: `${(step / 3) * 100}%` }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light text-[#3F2A2F] mb-3 sm:mb-4 leading-tight">Qual o seu grande sonho hoje?</h2>
              <p className="text-sm sm:text-base text-[#3F2A2F]/40 mb-8 sm:mb-10 font-light leading-relaxed">Isso nos ajuda a criar uma jornada que realmente faça sentido para você.</p>

              <div className="space-y-3 sm:space-y-4 flex-1">
                {objectives.map((obj, idx) => {
                  const Icon = obj.icon;
                  const isSelected = objective === obj.id;
                  return (
                    <button
                      key={obj.id}
                      onClick={() => setObjective(obj.id)}
                      className={`w-full p-4 sm:p-5 rounded-[1.5rem] sm:rounded-[2rem] border flex items-center gap-4 sm:gap-5 transition-all ${
                        isSelected 
                          ? 'border-[#E8B4BC] bg-[#E8B4BC]/5 soft-shadow' 
                          : 'border-[#3F2A2F]/5 hover:border-[#E8B4BC]/20 bg-white'
                      }`}
                    >
                      <div 
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all ${
                          isSelected ? 'bg-[#E8B4BC] text-white' : 'bg-[#FAF9F6] text-[#3F2A2F]/20'
                        }`}
                      >
                        <Icon size={20} className="sm:w-6 sm:h-6" />
                      </div>
                      <span className={`text-sm sm:text-base font-light ${isSelected ? 'text-[#3F2A2F]' : 'text-[#3F2A2F]/60'}`}>
                        {obj.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light text-[#3F2A2F] mb-3 sm:mb-4 leading-tight">Como está sua relação com seu corpo?</h2>
              <p className="text-sm sm:text-base text-[#3F2A2F]/40 mb-8 sm:mb-10 font-light leading-relaxed">Este é o seu espaço seguro. Pode ser sincera com seu coração.</p>

              <div className="space-y-3 sm:space-y-4 flex-1">
                {feelings.map((feel, idx) => {
                  const Icon = feel.icon;
                  const isSelected = feeling === feel.id;
                  return (
                    <button
                      key={feel.id}
                      onClick={() => setFeeling(feel.id)}
                      className={`w-full p-4 sm:p-5 rounded-[1.5rem] sm:rounded-[2rem] border flex items-center gap-4 sm:gap-5 transition-all ${
                        isSelected 
                          ? 'border-[#A8C4B8] bg-[#A8C4B8]/5 soft-shadow' 
                          : 'border-[#3F2A2F]/5 hover:border-[#A8C4B8]/20 bg-white'
                      }`}
                    >
                      <div 
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all ${
                          isSelected ? 'bg-[#A8C4B8] text-white' : 'bg-[#FAF9F6] text-[#3F2A2F]/20'
                        }`}
                      >
                        <Icon size={20} className="sm:w-6 sm:h-6" />
                      </div>
                      <span className={`text-sm sm:text-base font-light ${isSelected ? 'text-[#3F2A2F]' : 'text-[#3F2A2F]/60'}`}>
                        {feel.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light text-[#3F2A2F] mb-3 sm:mb-4 leading-tight">O que mais te desafia no dia a dia?</h2>
              <p className="text-sm sm:text-base text-[#3F2A2F]/40 mb-8 sm:mb-10 font-light leading-relaxed">Vamos juntas encontrar o caminho para superar isso.</p>

              <div className="space-y-3 sm:space-y-4 flex-1">
                {challenges.map((chal, idx) => {
                  const Icon = chal.icon;
                  const isSelected = challenge === chal.id;
                  return (
                    <button
                      key={chal.id}
                      onClick={() => setChallenge(chal.id)}
                      className={`w-full p-4 sm:p-5 rounded-[1.5rem] sm:rounded-[2rem] border flex items-center gap-4 sm:gap-5 transition-all ${
                        isSelected 
                          ? 'border-[#E8B4BC] bg-[#E8B4BC]/5 soft-shadow' 
                          : 'border-[#3F2A2F]/5 hover:border-[#E8B4BC]/20 bg-white'
                      }`}
                    >
                      <div 
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all ${
                          isSelected ? 'bg-[#E8B4BC] text-white' : 'bg-[#FAF9F6] text-[#3F2A2F]/20'
                        }`}
                      >
                        <Icon size={20} className="sm:w-6 sm:h-6" />
                      </div>
                      <span className={`text-sm sm:text-base font-light ${isSelected ? 'text-[#3F2A2F]' : 'text-[#3F2A2F]/60'}`}>
                        {chal.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pt-8 sm:pt-12 mt-auto">
          <button
            onClick={handleNext}
            disabled={isSaving || (step === 1 && !objective) || (step === 2 && !feeling) || (step === 3 && !challenge)}
            className="w-full py-4 sm:py-5 rounded-full font-light text-white shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:shadow-xl bg-[#E8B4BC] hover:bg-[#3F2A2F] hover:scale-[1.02] active:scale-95 uppercase tracking-[0.2em] text-[10px] sm:text-xs"
          >
            {isSaving ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Preparando sua jornada...</span>
              </div>
            ) : (
              <>
                {step === 3 ? 'Quero começar minha evolução!' : 'Continuar'}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
