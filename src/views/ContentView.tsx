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
    <div className="flex-1 overflow-y-auto pb-24 bg-stone-50 relative">
      <div className="px-6 pt-12 pb-6 bg-white rounded-b-[2rem] soft-shadow-sm mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.accent, color: theme.primary }}>
            <Sparkles size={20} />
          </div>
          <h1 className="text-3xl font-serif font-bold text-stone-800">Conteúdos que Transformam</h1>
        </div>
        <p className="text-stone-500 font-medium">Uma curadoria especial para nutrir sua mente e alma.</p>
      </div>

      <div className="px-6">
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveCategory('audios')}
            className={`flex-1 py-3 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
              activeCategory === 'audios' ? 'text-white shadow-md' : 'bg-white text-stone-500 hover:bg-stone-100'
            }`}
            style={{ backgroundColor: activeCategory === 'audios' ? theme.primary : undefined }}
          >
            <Headphones size={18} />
            Áudios que Inspiram
          </button>
          <button
            onClick={() => setActiveCategory('guides')}
            className={`flex-1 py-3 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
              activeCategory === 'guides' ? 'text-white shadow-md' : 'bg-white text-stone-500 hover:bg-stone-100'
            }`}
            style={{ backgroundColor: activeCategory === 'guides' ? theme.primary : undefined }}
          >
            <FileText size={18} />
            Guias para Evoluir
          </button>
        </div>

        {/* Content List */}
        <div className="space-y-4">
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
                className={`bg-white p-5 rounded-[1.5rem] border-2 transition-all flex items-center gap-4 ${
                  isLocked ? 'opacity-75 border-stone-100' : 'border-transparent soft-shadow-sm hover:shadow-md cursor-pointer'
                }`}
                onClick={() => handleContentClick(item, isLockedByPremium, isLockedByLevel)}
              >
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                  style={{ 
                    backgroundColor: isLocked ? '#f5f5f4' : theme.accent,
                    color: isLocked ? '#a8a29e' : theme.primary
                  }}
                >
                  {isLocked ? <Lock size={20} /> : (activeCategory === 'audios' ? <Play size={20} className="ml-1" /> : <FileText size={20} />)}
                </div>
                
                <div className="flex-1">
                  <h3 className={`font-bold ${isLocked ? 'text-stone-500' : 'text-stone-800'}`}>
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-medium text-stone-400">
                      {activeCategory === 'audios' ? (item as any).duration : (item as any).pages}
                    </span>
                    {item.premium && (
                      <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">
                        Premium
                      </span>
                    )}
                    {isLockedByLevel && !isLockedByPremium && (
                      <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">
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
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center p-4"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-white rounded-t-[2rem] sm:rounded-[2rem] overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.accent, color: theme.primary }}>
                    {activeCategory === 'audios' ? <Headphones size={20} /> : <FileText size={20} />}
                  </div>
                  <h3 className="font-bold text-stone-800">
                    {activeCategory === 'audios' ? 'Sua Jornada Sonora' : 'Sua Leitura de Hoje'}
                  </h3>
                </div>
                <button 
                  onClick={() => setSelectedContent(null)}
                  className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-300 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-8 flex-1 overflow-y-auto flex flex-col items-center text-center">
                {activeCategory === 'audios' ? (
                  <>
                    <div className="w-48 h-48 rounded-full mb-8 relative flex items-center justify-center shadow-inner" style={{ backgroundColor: theme.accent }}>
                      <div className={`absolute inset-0 rounded-full border-4 opacity-30 ${isPlaying ? 'animate-ping' : ''}`} style={{ borderColor: theme.primary, animationDuration: '3s' }}></div>
                      <div className="w-32 h-32 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: theme.primary }}>
                        <Headphones size={48} className="text-white" />
                      </div>
                    </div>
                    
                    <h2 className="text-2xl font-serif font-bold text-stone-800 mb-2">{selectedContent.title}</h2>
                    <p className="text-stone-500 mb-8">{selectedContent.desc}</p>
                    
                    {/* Audio Controls */}
                    <div className="w-full space-y-6">
                      <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-stone-400 w-1/3 rounded-full" style={{ backgroundColor: theme.primary }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-stone-400 font-medium">
                        <span>03:14</span>
                        <span>{selectedContent.duration}</span>
                      </div>
                      
                      <div className="flex items-center justify-center gap-6">
                        <button className="p-3 text-stone-400 hover:text-stone-600 transition-colors">
                          <SkipBack size={24} />
                        </button>
                        <button 
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform"
                          style={{ backgroundColor: theme.primary }}
                        >
                          {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
                        </button>
                        <button className="p-3 text-stone-400 hover:text-stone-600 transition-colors">
                          <SkipForward size={24} />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-full aspect-[3/4] bg-stone-100 rounded-2xl mb-6 border border-stone-200 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '20px 20px' }}></div>
                      <FileText size={64} className="text-stone-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent text-white text-left">
                        <p className="font-bold text-lg">{selectedContent.title}</p>
                        <p className="text-xs opacity-80">{selectedContent.pages}</p>
                      </div>
                    </div>
                    
                    <h2 className="text-xl font-bold text-stone-800 mb-2">{selectedContent.title}</h2>
                    <p className="text-stone-500 mb-6">{selectedContent.desc}</p>
                    
                    <button 
                      className="w-full py-4 rounded-2xl font-bold text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                      style={{ backgroundColor: theme.primary }}
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
