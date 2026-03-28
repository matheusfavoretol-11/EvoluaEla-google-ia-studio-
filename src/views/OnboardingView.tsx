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
    <div className="min-h-screen w-full flex flex-col bg-white">
      <div className="flex-1 flex flex-col px-6 py-12 max-w-md mx-auto w-full">
        
        {/* Progress Bar */}
        <div className="w-full h-2 bg-stone-100 rounded-full mb-12 overflow-hidden">
          <motion.div 
            className="h-full rounded-full"
            style={{ backgroundColor: theme.primary }}
            initial={{ width: '0%' }}
            animate={{ width: `${(step / 3) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col"
            >
              <h2 className="text-3xl font-serif font-bold text-stone-800 mb-2">Qual o seu principal objetivo?</h2>
              <p className="text-stone-500 mb-8 font-medium">Isso nos ajuda a personalizar sua jornada de evolução.</p>

              <div className="space-y-4 flex-1">
                {objectives.map((obj) => {
                  const Icon = obj.icon;
                  const isSelected = objective === obj.id;
                  return (
                    <button
                      key={obj.id}
                      onClick={() => setObjective(obj.id)}
                      className={`w-full p-6 rounded-[1.5rem] border-2 flex items-center gap-4 transition-all ${
                        isSelected ? 'soft-shadow-sm' : 'hover:border-stone-200'
                      }`}
                      style={{ 
                        borderColor: isSelected ? theme.primary : '#f5f5f4',
                        backgroundColor: isSelected ? theme.accent : '#fff'
                      }}
                    >
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ 
                          backgroundColor: isSelected ? theme.primary : '#f5f5f4',
                          color: isSelected ? '#fff' : '#a8a29e'
                        }}
                      >
                        <Icon size={24} />
                      </div>
                      <span className={`text-lg font-semibold ${isSelected ? 'text-stone-900' : 'text-stone-600'}`}>
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
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col"
            >
              <h2 className="text-3xl font-serif font-bold text-stone-800 mb-2">Como você se sente com seu corpo hoje?</h2>
              <p className="text-stone-500 mb-8 font-medium">Este é um espaço seguro. Seja sincera com você mesma.</p>

              <div className="space-y-4 flex-1">
                {feelings.map((feel) => {
                  const Icon = feel.icon;
                  const isSelected = feeling === feel.id;
                  return (
                    <button
                      key={feel.id}
                      onClick={() => setFeeling(feel.id)}
                      className={`w-full p-6 rounded-[1.5rem] border-2 flex items-center gap-4 transition-all ${
                        isSelected ? 'soft-shadow-sm' : 'hover:border-stone-200'
                      }`}
                      style={{ 
                        borderColor: isSelected ? theme.primary : '#f5f5f4',
                        backgroundColor: isSelected ? theme.accent : '#fff'
                      }}
                    >
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ 
                          backgroundColor: isSelected ? theme.primary : '#f5f5f4',
                          color: isSelected ? '#fff' : '#a8a29e'
                        }}
                      >
                        <Icon size={24} />
                      </div>
                      <span className={`text-lg font-semibold ${isSelected ? 'text-stone-900' : 'text-stone-600'}`}>
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
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col"
            >
              <h2 className="text-3xl font-serif font-bold text-stone-800 mb-2">Qual o seu maior desafio diário?</h2>
              <p className="text-stone-500 mb-8 font-medium">Vamos trabalhar juntas para superar isso.</p>

              <div className="space-y-4 flex-1">
                {challenges.map((chal) => {
                  const Icon = chal.icon;
                  const isSelected = challenge === chal.id;
                  return (
                    <button
                      key={chal.id}
                      onClick={() => setChallenge(chal.id)}
                      className={`w-full p-6 rounded-[1.5rem] border-2 flex items-center gap-4 transition-all ${
                        isSelected ? 'soft-shadow-sm' : 'hover:border-stone-200'
                      }`}
                      style={{ 
                        borderColor: isSelected ? theme.primary : '#f5f5f4',
                        backgroundColor: isSelected ? theme.accent : '#fff'
                      }}
                    >
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ 
                          backgroundColor: isSelected ? theme.primary : '#f5f5f4',
                          color: isSelected ? '#fff' : '#a8a29e'
                        }}
                      >
                        <Icon size={24} />
                      </div>
                      <span className={`text-lg font-semibold ${isSelected ? 'text-stone-900' : 'text-stone-600'}`}>
                        {chal.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pt-8 mt-auto">
          <button
            onClick={handleNext}
            disabled={isSaving || (step === 1 && !objective) || (step === 2 && !feeling) || (step === 3 && !challenge)}
            className="w-full py-4 rounded-[1.5rem] font-bold text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:shadow-lg gradient-bg hover:scale-[1.02]"
          >
            {isSaving ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Guardando suas respostas...</span>
              </div>
            ) : (
              <>
                {step === 3 ? 'Vamos começar!' : 'Próximo passo'}
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
