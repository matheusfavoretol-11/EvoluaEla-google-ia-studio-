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
    <div className="min-h-screen w-full flex flex-col bg-[var(--color-bg)] font-sans text-[var(--color-text)] relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--color-primary)]/20 rounded-full blur-[120px] animate-pulse-soft"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--color-accent)]/20 rounded-full blur-[120px] animate-pulse-soft" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="flex-1 flex flex-col px-4 sm:px-8 py-12 sm:py-20 max-w-xl mx-auto w-full relative z-10">
        
        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-[var(--color-text)]/10 rounded-full mb-12 sm:mb-20 overflow-hidden border border-[var(--color-border)]">
          <motion.div 
            className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]"
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
              <h2 className="text-4xl sm:text-5xl font-bold text-[var(--color-text)] mb-4 leading-tight tracking-tighter">Qual o seu <span className="gradient-text">grande sonho</span> hoje?</h2>
              <p className="text-sm sm:text-base text-[var(--color-text-muted)] mb-10 sm:mb-12 font-bold leading-relaxed tracking-wide uppercase tracking-[0.2em]">Isso nos ajuda a criar uma jornada que realmente faça sentido para você.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                {objectives.map((obj, idx) => {
                  const Icon = obj.icon;
                  const isSelected = objective === obj.id;
                  return (
                    <button
                      key={obj.id}
                      onClick={() => setObjective(obj.id)}
                      className={`p-6 rounded-3xl border flex flex-col items-start gap-6 transition-all text-left group ${
                        isSelected 
                          ? 'border-[var(--color-primary)] bg-[var(--color-surface)] shadow-2xl' 
                          : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/20 bg-[var(--color-surface)]/50'
                      }`}
                    >
                      <div 
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                          isSelected ? 'bg-[var(--color-primary)] text-black' : 'bg-[var(--color-text)]/10 text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)]'
                        }`}
                      >
                        <Icon size={28} />
                      </div>
                      <span className={`text-base font-bold uppercase tracking-widest ${isSelected ? 'text-[var(--color-text)]' : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-text)]'}`}>
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
              <h2 className="text-4xl sm:text-5xl font-bold text-[var(--color-text)] mb-4 leading-tight tracking-tighter">Como está sua <span className="gradient-text">relação</span> com seu corpo?</h2>
              <p className="text-sm sm:text-base text-[var(--color-text-muted)] mb-10 sm:mb-12 font-bold leading-relaxed tracking-wide uppercase tracking-[0.2em]">Este é o seu espaço seguro. Pode ser sincera com seu coração.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                {feelings.map((feel, idx) => {
                  const Icon = feel.icon;
                  const isSelected = feeling === feel.id;
                  return (
                    <button
                      key={feel.id}
                      onClick={() => setFeeling(feel.id)}
                      className={`p-6 rounded-3xl border flex flex-col items-start gap-6 transition-all text-left group ${
                        isSelected 
                          ? 'border-[var(--color-accent)] bg-[var(--color-surface)] shadow-2xl' 
                          : 'border-[var(--color-border)] hover:border-[var(--color-accent)]/20 bg-[var(--color-surface)]/50'
                      }`}
                    >
                      <div 
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                          isSelected ? 'bg-[var(--color-accent)] text-black' : 'bg-[var(--color-text)]/10 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)]'
                        }`}
                      >
                        <Icon size={28} />
                      </div>
                      <span className={`text-base font-bold uppercase tracking-widest ${isSelected ? 'text-[var(--color-text)]' : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-text)]'}`}>
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
              <h2 className="text-4xl sm:text-5xl font-bold text-[var(--color-text)] mb-4 leading-tight tracking-tighter">O que mais te <span className="gradient-text">desafia</span> no dia a dia?</h2>
              <p className="text-sm sm:text-base text-[var(--color-text-muted)] mb-10 sm:mb-12 font-bold leading-relaxed tracking-wide uppercase tracking-[0.2em]">Vamos juntas encontrar o caminho para superar isso.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                {challenges.map((chal, idx) => {
                  const Icon = chal.icon;
                  const isSelected = challenge === chal.id;
                  return (
                    <button
                      key={chal.id}
                      onClick={() => setChallenge(chal.id)}
                      className={`p-6 rounded-3xl border flex flex-col items-start gap-6 transition-all text-left group ${
                        isSelected 
                          ? 'border-[var(--color-primary)] bg-[var(--color-surface)] shadow-2xl' 
                          : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/20 bg-[var(--color-surface)]/50'
                      }`}
                    >
                      <div 
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                          isSelected ? 'bg-[var(--color-primary)] text-black' : 'bg-[var(--color-text)]/10 text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)]'
                        }`}
                      >
                        <Icon size={28} />
                      </div>
                      <span className={`text-base font-bold uppercase tracking-widest ${isSelected ? 'text-[var(--color-text)]' : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-text)]'}`}>
                        {chal.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pt-12 sm:pt-16 mt-auto">
          <button
            onClick={handleNext}
            disabled={isSaving || (step === 1 && !objective) || (step === 2 && !feeling) || (step === 3 && !challenge)}
            className="w-full py-6 sm:py-7 rounded-full font-bold text-black shadow-2xl hover:shadow-3xl transition-all flex items-center justify-center gap-4 disabled:opacity-50 disabled:hover:shadow-2xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] hover:scale-[1.02] active:scale-95 uppercase tracking-widest text-xs sm:text-sm"
          >
            {isSaving ? (
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 border-3 border-black/30 border-t-black rounded-full animate-spin" />
                <span>Preparando sua jornada...</span>
              </div>
            ) : (
              <>
                {step === 3 ? 'Quero começar minha evolução!' : 'Continuar'}
                <ArrowRight size={22} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
