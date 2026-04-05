import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Play, FileText, Sparkles, Headphones, X, Pause, SkipForward, SkipBack } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';

interface ContentViewProps {
  onUpgrade: () => void;
}

export default function ContentView({ onUpgrade }: ContentViewProps) {
  const { theme } = useTheme();
  const { isPremium, level } = useUser();
  const [activeCategory, setActiveCategory] = useState<'audios' | 'guides'>('audios');
  const [selectedContent, setSelectedContent] = useState<any | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const audios = [
    { id: 'audio-1', title: 'Meditação para Ansiedade', duration: '10 min', premium: false, levelRequired: 'Despertando', desc: 'Uma prática guiada para acalmar a mente e reduzir o estresse diário.' },
    { id: 'audio-2', title: 'Afirmações de Amor Próprio', duration: '5 min', premium: true, levelRequired: 'Em Evolução', desc: 'Reprograme sua mente com afirmações poderosas para fortalecer sua autoestima.' },
    { id: 'audio-3', title: 'Visualização de Sucesso', duration: '15 min', premium: true, levelRequired: 'Confiante', desc: 'Exercício mental para visualizar e atrair seus maiores objetivos.' },
    { id: 'audio-4', title: 'Sono Profundo e Reparador', duration: '20 min', premium: true, levelRequired: 'Inabalável', desc: 'Frequências relaxantes para uma noite de sono verdadeiramente restauradora.' },
  ];

  const guides = [
    { id: 'guide-1', title: 'Guia de Alimentação Intuitiva', pages: '12 págs', premium: false, levelRequired: 'Despertando', desc: 'Aprenda a ouvir seu corpo e fazer as pazes com a comida.' },
    { id: 'guide-2', title: 'Rotina Matinal de Sucesso', pages: '8 págs', premium: true, levelRequired: 'Em Evolução', desc: 'Passo a passo para criar manhãs produtivas e cheias de energia.' },
    { id: 'guide-3', title: 'Manual da Autoconfiança', pages: '15 págs', premium: true, levelRequired: 'Confiante', desc: 'Exercícios práticos para construir uma confiança inabalável.' },
  ];

  const content = activeCategory === 'audios' ? audios : guides;

  const getLevelIndex = (lvl: string) => {
    const levels = ['Despertando', 'Em Evolução', 'Confiante', 'Inabalável'];
    return levels.indexOf(lvl);
  };

  const currentLevelIndex = getLevelIndex(level);

  const handleContentClick = (item: any, isLockedByPremium: boolean, isLockedByLevel: boolean) => {
    if (isLockedByPremium) {
      onUpgrade();
    } else if (isLockedByLevel) {
      // Could show a toast here instead of alert
      alert(`Continue evoluindo para desbloquear no nível ${item.levelRequired}!`);
    } else {
      setSelectedContent(item);
      setIsPlaying(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto pb-24 bg-[var(--color-bg)] relative min-h-full text-[var(--color-text)] font-sans">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="px-4 sm:px-6 pt-12 pb-10 relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-3xl bg-[var(--color-text)]/5 border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary)] shadow-2xl backdrop-blur-xl">
            <Sparkles size={32} />
          </div>
          <h1 className="text-5xl font-bold text-[var(--color-text)] tracking-tighter">Conteúdos que <span className="gradient-text">Transformam</span></h1>
        </div>
        <p className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-widest max-w-md">Uma curadoria especial para nutrir sua mente e alma.</p>
      </div>

      <div className="px-4 sm:px-6 relative z-10">
        {/* Tabs */}
        <div className="flex p-1.5 rounded-2xl bg-[var(--color-text)]/5 border border-[var(--color-border)] mb-10 backdrop-blur-md">
          <button
            onClick={() => setActiveCategory('audios')}
            className={`flex-1 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-3 ${
              activeCategory === 'audios' ? 'bg-[var(--color-text)] text-[var(--color-bg)] shadow-2xl scale-[1.02]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            <Headphones size={18} />
            Áudios
          </button>
          <button
            onClick={() => setActiveCategory('guides')}
            className={`flex-1 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-3 ${
              activeCategory === 'guides' ? 'bg-[var(--color-text)] text-[var(--color-bg)] shadow-2xl scale-[1.02]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            <FileText size={18} />
            Guias
          </button>
        </div>

        {/* Content List */}
        <div className="space-y-5">
          {content.map((item, index) => {
            const isLockedByPremium = item.premium && !isPremium;
            const isLockedByLevel = getLevelIndex(item.levelRequired) > currentLevelIndex;
            const isLocked = isLockedByPremium || isLockedByLevel;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`glass-card p-6 rounded-[2rem] border transition-all flex items-center gap-5 group shadow-2xl ${
                  isLocked ? 'opacity-40 border-[var(--color-border)]' : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/30 cursor-pointer'
                }`}
                onClick={() => handleContentClick(item, isLockedByPremium, isLockedByLevel)}
              >
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all border border-[var(--color-border)] bg-[var(--color-text)]/5 group-hover:bg-[var(--color-text)] group-hover:text-[var(--color-bg)]"
                  style={{ 
                    color: isLocked ? 'rgba(var(--color-text-rgb), 0.2)' : 'var(--color-text)'
                  }}
                >
                  {isLocked ? <Lock size={24} /> : (activeCategory === 'audios' ? <Play size={24} className="ml-1" /> : <FileText size={24} />)}
                </div>
                
                <div className="flex-1">
                  <h3 className={`font-bold text-xl tracking-tight transition-all ${isLocked ? 'text-[var(--color-text-muted)]' : 'text-[var(--color-text)] group-hover:text-[var(--color-primary)]'}`}>
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
                      {activeCategory === 'audios' ? (item as any).duration : (item as any).pages}
                    </span>
                    {item.premium && (
                      <span className="text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20">
                        Premium
                      </span>
                    )}
                    {isLockedByLevel && !isLockedByPremium && (
                      <span className="text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-lg bg-[var(--color-text)]/5 text-[var(--color-text-muted)] border border-[var(--color-border)]">
                        Nível: {item.levelRequired}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Content Viewer Modal */}
      <AnimatePresence>
        {selectedContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/90 backdrop-blur-xl sm:items-center p-4"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="w-full max-w-md bg-[var(--color-surface)] rounded-t-[3rem] sm:rounded-[3rem] overflow-hidden flex flex-col max-h-[90vh] border border-[var(--color-border)] shadow-2xl"
            >
              <div className="p-8 border-b border-[var(--color-border)] flex justify-between items-center bg-[var(--color-surface)]/80">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[var(--color-text)]/5 border border-[var(--color-border)] text-[var(--color-primary)]">
                    {activeCategory === 'audios' ? <Headphones size={24} /> : <FileText size={24} />}
                  </div>
                  <h3 className="font-bold uppercase tracking-widest text-[10px] text-[var(--color-text-muted)]">
                    {activeCategory === 'audios' ? 'Sua Jornada Sonora' : 'Sua Leitura de Hoje'}
                  </h3>
                </div>
                <button 
                  onClick={() => setSelectedContent(null)}
                  className="w-10 h-10 rounded-full bg-[var(--color-text)]/5 border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-10 flex-1 overflow-y-auto flex flex-col items-center text-center relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[var(--color-primary)]/5 rounded-full blur-[100px] pointer-events-none"></div>
                
                {activeCategory === 'audios' ? (
                  <>
                    <div className="w-56 h-56 rounded-[3rem] mb-10 relative flex items-center justify-center shadow-2xl bg-[var(--color-text)]/5 border border-[var(--color-border)] overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/20 to-transparent transition-opacity duration-1000 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}></div>
                      <div className={`absolute inset-0 border-4 border-[var(--color-primary)]/30 rounded-[3rem] ${isPlaying ? 'animate-pulse' : ''}`}></div>
                      <div className="w-36 h-36 rounded-[2.5rem] flex items-center justify-center shadow-2xl bg-[var(--color-text)] text-[var(--color-bg)] relative z-10">
                        <Headphones size={56} />
                      </div>
                    </div>
                    
                    <h2 className="text-3xl font-bold text-[var(--color-text)] mb-3 tracking-tight">{selectedContent.title}</h2>
                    <p className="text-[var(--color-text-muted)] text-sm mb-10 font-bold uppercase tracking-widest leading-relaxed">{selectedContent.desc}</p>
                    
                    {/* Audio Controls */}
                    <div className="w-full space-y-8">
                      <div className="w-full bg-[var(--color-text)]/5 h-2 rounded-full overflow-hidden border border-[var(--color-border)]">
                        <motion.div 
                          initial={{ width: '0%' }}
                          animate={{ width: isPlaying ? '33%' : '33%' }}
                          className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded-full"
                        ></motion.div>
                      </div>
                      <div className="flex justify-between text-[10px] text-[var(--color-text-muted)] font-bold uppercase tracking-widest">
                        <span>03:14</span>
                        <span>{selectedContent.duration}</span>
                      </div>
                      
                      <div className="flex items-center justify-center gap-10">
                        <button className="p-4 text-[var(--color-text-muted)]/40 hover:text-[var(--color-text)] transition-colors">
                          <SkipBack size={32} />
                        </button>
                        <button 
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="w-20 h-20 rounded-3xl flex items-center justify-center text-[var(--color-bg)] shadow-2xl hover:scale-105 transition-all bg-[var(--color-text)]"
                        >
                          {isPlaying ? <Pause size={36} fill="currentColor" /> : <Play size={36} fill="currentColor" className="ml-1" />}
                        </button>
                        <button className="p-4 text-[var(--color-text-muted)]/40 hover:text-[var(--color-text)] transition-colors">
                          <SkipForward size={32} />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-full aspect-[3/4] bg-[var(--color-text)]/5 rounded-[2.5rem] mb-8 border border-[var(--color-border)] flex items-center justify-center relative overflow-hidden shadow-2xl group">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                      <FileText size={80} className="text-[var(--color-text-muted)]/10 group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent text-white text-left backdrop-blur-sm">
                        <p className="font-bold text-2xl tracking-tight mb-1">{selectedContent.title}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">{selectedContent.pages}</p>
                      </div>
                    </div>
                    
                    <h2 className="text-3xl font-bold text-[var(--color-text)] mb-4 tracking-tight">{selectedContent.title}</h2>
                    <p className="text-[var(--color-text-muted)] text-sm mb-10 font-bold uppercase tracking-widest leading-relaxed">{selectedContent.desc}</p>
                    
                    <button 
                      className="w-full py-6 rounded-2xl font-bold uppercase tracking-widest text-black shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-xs"
                    >
                      <FileText size={20} />
                      Quero ler agora
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
