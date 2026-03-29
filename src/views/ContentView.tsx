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
    <div className="flex-1 overflow-y-auto pb-24 bg-black relative min-h-full">
      <div className="px-6 pt-12 pb-8 bg-black border-b border-white/5 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 text-rose-400">
            <Sparkles size={24} />
          </div>
          <h1 className="text-4xl branding-title text-white">Conteúdos que Transformam</h1>
        </div>
        <p className="text-white/50 font-medium">Uma curadoria especial para nutrir sua mente e alma.</p>
      </div>

      <div className="px-6">
        {/* Tabs */}
        <div className="flex p-1 rounded-2xl bg-white/5 mb-8">
          <button
            onClick={() => setActiveCategory('audios')}
            className={`flex-1 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 ${
              activeCategory === 'audios' ? 'bg-white text-black shadow-md' : 'text-white/40 hover:text-white/60'
            }`}
          >
            <Headphones size={18} />
            Áudios
          </button>
          <button
            onClick={() => setActiveCategory('guides')}
            className={`flex-1 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 ${
              activeCategory === 'guides' ? 'bg-white text-black shadow-md' : 'text-white/40 hover:text-white/60'
            }`}
          >
            <FileText size={18} />
            Guias
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
                className={`bg-stone-900 p-5 rounded-[1.5rem] border transition-all flex items-center gap-4 group ${
                  isLocked ? 'opacity-50 border-white/5' : 'border-white/5 hover:border-white/20 hover:bg-stone-800 cursor-pointer'
                }`}
                onClick={() => handleContentClick(item, isLockedByPremium, isLockedByLevel)}
              >
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors"
                  style={{ 
                    backgroundColor: isLocked ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)',
                    color: isLocked ? 'rgba(255,255,255,0.2)' : 'white'
                  }}
                >
                  {isLocked ? <Lock size={20} /> : (activeCategory === 'audios' ? <Play size={20} className="ml-1" /> : <FileText size={20} />)}
                </div>
                
                <div className="flex-1">
                  <h3 className={`branding-title text-lg transition-all ${isLocked ? 'text-white/30' : 'text-white group-hover:text-rose-400'}`}>
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/20">
                      {activeCategory === 'audios' ? (item as any).duration : (item as any).pages}
                    </span>
                    {item.premium && (
                      <span className="text-[10px] uppercase tracking-wider font-black px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500">
                        Premium
                      </span>
                    )}
                    {isLockedByLevel && !isLockedByPremium && (
                      <span className="text-[10px] uppercase tracking-wider font-black px-2 py-0.5 rounded-full bg-white/5 text-white/30">
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
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center p-4"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-stone-900 rounded-t-[2rem] sm:rounded-[2rem] overflow-hidden flex flex-col max-h-[90vh] border border-white/10"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 text-rose-400">
                    {activeCategory === 'audios' ? <Headphones size={20} /> : <FileText size={20} />}
                  </div>
                  <h3 className="font-black uppercase tracking-widest text-xs text-white/60">
                    {activeCategory === 'audios' ? 'Sua Jornada Sonora' : 'Sua Leitura de Hoje'}
                  </h3>
                </div>
                <button 
                  onClick={() => setSelectedContent(null)}
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:bg-white/10 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-8 flex-1 overflow-y-auto flex flex-col items-center text-center">
                {activeCategory === 'audios' ? (
                  <>
                    <div className="w-48 h-48 rounded-full mb-8 relative flex items-center justify-center shadow-inner bg-white/5">
                      <div className={`absolute inset-0 rounded-full border-4 opacity-10 ${isPlaying ? 'animate-ping' : ''}`} style={{ borderColor: theme.primary, animationDuration: '3s' }}></div>
                      <div className="w-32 h-32 rounded-full flex items-center justify-center shadow-lg gradient-bg">
                        <Headphones size={48} className="text-white" />
                      </div>
                    </div>
                    
                    <h2 className="text-3xl branding-title text-white mb-2">{selectedContent.title}</h2>
                    <p className="text-white/40 text-sm mb-8 font-medium">{selectedContent.desc}</p>
                    
                    {/* Audio Controls */}
                    <div className="w-full space-y-6">
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-rose-500 w-1/3 rounded-full"></div>
                      </div>
                      <div className="flex justify-between text-[10px] text-white/20 font-black uppercase tracking-widest">
                        <span>03:14</span>
                        <span>{selectedContent.duration}</span>
                      </div>
                      
                      <div className="flex items-center justify-center gap-8">
                        <button className="p-3 text-white/20 hover:text-white/60 transition-colors">
                          <SkipBack size={28} />
                        </button>
                        <button 
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-105 transition-transform gradient-bg"
                        >
                          {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
                        </button>
                        <button className="p-3 text-white/20 hover:text-white/60 transition-colors">
                          <SkipForward size={28} />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-full aspect-[3/4] bg-black rounded-2xl mb-6 border border-white/5 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '20px 20px' }}></div>
                      <FileText size={64} className="text-white/10" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent text-white text-left">
                        <p className="font-black uppercase tracking-tight text-xl">{selectedContent.title}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">{selectedContent.pages}</p>
                      </div>
                    </div>
                    
                    <h2 className="text-2xl branding-title text-white mb-3">{selectedContent.title}</h2>
                    <p className="text-white/40 text-sm mb-8 font-medium">{selectedContent.desc}</p>
                    
                    <button 
                      className="w-full py-5 rounded-2xl font-black uppercase tracking-widest text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 gradient-bg"
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
