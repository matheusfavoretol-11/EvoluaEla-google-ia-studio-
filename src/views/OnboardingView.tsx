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
  const [commitment, setCommitment] = useState('');

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

  const commitments = [
    { id: '2-3', label: '2 a 3 dias por semana', icon: Clock },
    { id: '4-5', label: '4 a 5 dias por semana', icon: Activity },
    { id: '6-7', label: 'Todos os dias', icon: Flame },
    { id: 'flexivel', label: 'O que for possível', icon: Sparkles },
  ];

  const selectObjective = (id: string) => {
    setObjective(id);
    setStep(2);
  };

  const selectFeeling = (id: string) => {
    setFeeling(id);
    setStep(3);
  };

  const selectChallenge = (id: string) => {
    setChallenge(id);
    setStep(4);
  };

  const selectCommitment = async (id: string) => {
    setCommitment(id);
    setIsSaving(true);
    try {
      const finalAnswers = { objective, feeling, challenge, commitment: id };
      setOnboardingAnswers(finalAnswers);
      
      if (userId) {
        await supabase
          .from('onboarding_answers')
          .upsert({
            user_id: userId,
            answers: finalAnswers,
            updated_at: new Date().toISOString()
          });
      }
      
      onComplete();
    } catch (error) {
      console.error("Error saving onboarding answers:", error);
      onComplete();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#0F0A1F] font-sans text-white relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#D81BFF]/10 rounded-full blur-[120px] animate-pulse-soft"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#F8C1FF]/5 rounded-full blur-[120px] animate-pulse-soft" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="flex-1 flex flex-col px-6 sm:px-12 py-12 sm:py-20 mx-auto w-full max-w-4xl relative z-10">
        
        {/* Progress Bar */}
        <div className="w-full h-1 bg-white/5 rounded-full mb-12 sm:mb-16 overflow-hidden border border-white/5">
          <motion.div 
            className="h-full rounded-full bg-gradient-to-r from-[#D81BFF] to-[#F8C1FF]"
            initial={{ width: '0%' }}
            animate={{ width: `${(step / 4) * 100}%` }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="flex-1 flex flex-col"
            >
              <h2 className="text-4xl sm:text-6xl font-sans font-bold text-white mb-4 leading-tight tracking-tight">Qual o seu <span className="text-[#D81BFF]">grande sonho</span> hoje?</h2>
              <p className="text-xs sm:text-sm text-[#B8B0C8] mb-10 font-bold leading-relaxed tracking-[0.3em] uppercase">Isso nos ajuda a criar uma jornada exclusiva para você.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                {objectives.map((obj) => {
                  const Icon = obj.icon;
                  return (
                    <button
                      key={obj.id}
                      onClick={() => selectObjective(obj.id)}
                      className="p-6 rounded-[2rem] border border-white/5 hover:border-[#D81BFF]/30 bg-white/5 backdrop-blur-xl flex flex-col items-start gap-6 transition-all duration-500 text-left group active:scale-95"
                    >
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 bg-white/5 text-[#B8B0C8] group-hover:text-[#D81BFF] group-hover:bg-[#D81BFF]/10">
                        <Icon size={24} />
                      </div>
                      <span className="text-base font-bold tracking-tight text-[#B8B0C8] group-hover:text-white">
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
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="flex-1 flex flex-col"
            >
              <h2 className="text-4xl sm:text-6xl font-sans font-bold text-white mb-4 leading-tight tracking-tight">Como está sua <span className="text-[#D81BFF]">relação</span> com seu corpo?</h2>
              <p className="text-xs sm:text-sm text-[#B8B0C8] mb-10 font-bold leading-relaxed tracking-[0.3em] uppercase">Este é o seu espaço seguro. Pode ser sincera.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                {feelings.map((feel) => {
                  const Icon = feel.icon;
                  return (
                    <button
                      key={feel.id}
                      onClick={() => selectFeeling(feel.id)}
                      className="p-6 rounded-[2rem] border border-white/5 hover:border-[#D81BFF]/30 bg-white/5 backdrop-blur-xl flex flex-col items-start gap-6 transition-all duration-500 text-left group active:scale-95"
                    >
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 bg-white/5 text-[#B8B0C8] group-hover:text-[#D81BFF] group-hover:bg-[#D81BFF]/10">
                        <Icon size={24} />
                      </div>
                      <span className="text-base font-bold tracking-tight text-[#B8B0C8] group-hover:text-white">
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
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="flex-1 flex flex-col"
            >
              <h2 className="text-4xl sm:text-6xl font-sans font-bold text-white mb-4 leading-tight tracking-tight">O que mais te <span className="text-[#D81BFF]">desafia</span> no dia a dia?</h2>
              <p className="text-xs sm:text-sm text-[#B8B0C8] mb-10 font-bold leading-relaxed tracking-[0.3em] uppercase">Vamos juntas encontrar o caminho para superar isso.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                {challenges.map((chal) => {
                  const Icon = chal.icon;
                  return (
                    <button
                      key={chal.id}
                      onClick={() => selectChallenge(chal.id)}
                      className="p-6 rounded-[2rem] border border-white/5 hover:border-[#D81BFF]/30 bg-white/5 backdrop-blur-xl flex flex-col items-start gap-6 transition-all duration-500 text-left group active:scale-95"
                    >
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 bg-white/5 text-[#B8B0C8] group-hover:text-[#D81BFF] group-hover:bg-[#D81BFF]/10">
                        <Icon size={24} />
                      </div>
                      <span className="text-base font-bold tracking-tight text-[#B8B0C8] group-hover:text-white">
                        {chal.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="flex-1 flex flex-col"
            >
              <h2 className="text-4xl sm:text-6xl font-sans font-bold text-white mb-4 leading-tight tracking-tight">Quanto tempo você <span className="text-[#D81BFF]">dedicará</span> a você?</h2>
              <p className="text-xs sm:text-sm text-[#B8B0C8] mb-10 font-bold leading-relaxed tracking-[0.3em] uppercase">Defina seu compromisso semanal com sua evolução.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                {commitments.map((com) => {
                  const Icon = com.icon;
                  return (
                    <button
                      key={com.id}
                      disabled={isSaving}
                      onClick={() => selectCommitment(com.id)}
                      className="p-6 rounded-[2rem] border border-white/5 hover:border-[#D81BFF]/30 bg-white/5 backdrop-blur-xl flex flex-col items-start gap-6 transition-all duration-500 text-left group disabled:opacity-50 active:scale-95"
                    >
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 bg-white/5 text-[#B8B0C8] group-hover:text-[#D81BFF] group-hover:bg-[#D81BFF]/10">
                        <Icon size={24} />
                      </div>
                      <span className="text-base font-bold tracking-tight text-[#B8B0C8] group-hover:text-white">
                        {com.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isSaving && (
          <div className="pt-12 sm:pt-16 mt-auto">
            <div className="w-full py-6 rounded-full font-bold text-white flex items-center justify-center gap-4 bg-white/5 border border-white/10 backdrop-blur-xl">
              <div className="w-5 h-5 border-2 border-[#D81BFF]/30 border-t-[#D81BFF] rounded-full animate-spin" />
              <span className="uppercase tracking-[0.3em] text-xs">Preparando sua jornada...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
