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
    <div className="flex-1 overflow-y-auto pb-24 bg-[#FAF9F6] relative min-h-full">
      <div className="px-6 pt-12 pb-8 bg-[#FAF9F6] border-b border-[#3F2A2F]/5 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white border border-[#3F2A2F]/5 text-[#E8B4BC]">
            <Sparkles size={24} />
          </div>
          <h1 className="text-3xl font-serif font-light text-[#3F2A2F] italic">Conteúdos que Transformam</h1>
        </div>
        <p className="text-[#3F2A2F]/40 font-light">Uma curadoria especial para nutrir sua mente e alma.</p>
      </div>

      <div className="px-6">
        {/* Tabs */}
        <div className="flex p-1 rounded-full bg-white border border-[#3F2A2F]/5 mb-8">
          <button
            onClick={() => setActiveCategory('audios')}
            className={`flex-1 py-3 rounded-full font-medium uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-2 ${
              activeCategory === 'audios' ? 'bg-[#3F2A2F] text-white shadow-md' : 'text-[#3F2A2F]/30 hover:text-[#3F2A2F]/50'
            }`}
          >
            <Headphones size={16} />
            Áudios
          </button>
          <button
            onClick={() => setActiveCategory('guides')}
            className={`flex-1 py-3 rounded-full font-medium uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-2 ${
              activeCategory === 'guides' ? 'bg-[#3F2A2F] text-white shadow-md' : 'text-[#3F2A2F]/30 hover:text-[#3F2A2F]/50'
            }`}
          >
            <FileText size={16} />
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
                className={`bg-white p-5 rounded-[1.5rem] border transition-all flex items-center gap-4 group ${
                  isLocked ? 'opacity-50 border-[#3F2A2F]/5' : 'border-[#3F2A2F]/5 hover:border-[#3F2A2F]/10 hover:bg-[#FAF9F6] cursor-pointer'
                }`}
                onClick={() => handleContentClick(item, isLockedByPremium, isLockedByLevel)}
              >
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors"
                  style={{ 
                    backgroundColor: isLocked ? 'rgba(63,42,47,0.05)' : 'rgba(63,42,47,0.05)',
                    color: isLocked ? 'rgba(63,42,47,0.2)' : '#3F2A2F'
                  }}
                >
                  {isLocked ? <Lock size={18} /> : (activeCategory === 'audios' ? <Play size={18} className="ml-0.5" /> : <FileText size={18} />)}
                </div>
                
                <div className="flex-1">
                  <h3 className={`font-serif font-light text-lg transition-all ${isLocked ? 'text-[#3F2A2F]/30' : 'text-[#3F2A2F] group-hover:text-[#E8B4BC]'}`}>
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#3F2A2F]/20">
                      {activeCategory === 'audios' ? (item as any).duration : (item as any).pages}
                    </span>
                    {item.premium && (
                      <span className="text-[9px] uppercase tracking-[0.2em] font-medium px-2 py-0.5 rounded-full bg-[#E8B4BC]/10 text-[#E8B4BC]">
                        Premium
                      </span>
                    )}
                    {isLockedByLevel && !isLockedByPremium && (
                      <span className="text-[9px] uppercase tracking-[0.2em] font-medium px-2 py-0.5 rounded-full bg-[#3F2A2F]/5 text-[#3F2A2F]/30">
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
              className="w-full max-w-md bg-white rounded-t-[2rem] sm:rounded-[2rem] overflow-hidden flex flex-col max-h-[90vh] border border-[#3F2A2F]/5"
            >
              <div className="p-6 border-b border-[#3F2A2F]/5 flex justify-between items-center bg-[#FAF9F6]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-[#3F2A2F]/5 text-[#E8B4BC]">
                    {activeCategory === 'audios' ? <Headphones size={18} /> : <FileText size={18} />}
                  </div>
                  <h3 className="font-medium uppercase tracking-[0.2em] text-[10px] text-[#3F2A2F]/40">
                    {activeCategory === 'audios' ? 'Sua Jornada Sonora' : 'Sua Leitura de Hoje'}
                  </h3>
                </div>
                <button 
                  onClick={() => setSelectedContent(null)}
                  className="w-8 h-8 rounded-full bg-white border border-[#3F2A2F]/5 flex items-center justify-center text-[#3F2A2F]/20 hover:text-[#3F2A2F] transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-8 flex-1 overflow-y-auto flex flex-col items-center text-center">
                {activeCategory === 'audios' ? (
                  <>
                    <div className="w-48 h-48 rounded-full mb-8 relative flex items-center justify-center shadow-inner bg-[#FAF9F6]">
                      <div className={`absolute inset-0 rounded-full border-2 opacity-20 ${isPlaying ? 'animate-ping' : ''}`} style={{ borderColor: '#E8B4BC', animationDuration: '3s' }}></div>
                      <div className="w-32 h-32 rounded-full flex items-center justify-center shadow-lg bg-[#3F2A2F]">
                        <Headphones size={40} className="text-white" />
                      </div>
                    </div>
                    
                    <h2 className="text-2xl font-serif font-light text-[#3F2A2F] mb-2 italic">{selectedContent.title}</h2>
                    <p className="text-[#3F2A2F]/40 text-sm mb-8 font-light">{selectedContent.desc}</p>
                    
                    {/* Audio Controls */}
                    <div className="w-full space-y-6">
                      <div className="w-full bg-[#FAF9F6] h-1 rounded-full overflow-hidden">
                        <div className="h-full bg-[#E8B4BC] w-1/3 rounded-full"></div>
                      </div>
                      <div className="flex justify-between text-[9px] text-[#3F2A2F]/20 font-medium uppercase tracking-[0.2em]">
                        <span>03:14</span>
                        <span>{selectedContent.duration}</span>
                      </div>
                      
                      <div className="flex items-center justify-center gap-8">
                        <button className="p-3 text-[#3F2A2F]/20 hover:text-[#3F2A2F]/60 transition-colors">
                          <SkipBack size={24} />
                        </button>
                        <button 
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="w-16 h-16 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-105 transition-transform bg-[#3F2A2F]"
                        >
                          {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
                        </button>
                        <button className="p-3 text-[#3F2A2F]/20 hover:text-[#3F2A2F]/60 transition-colors">
                          <SkipForward size={24} />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-full aspect-[3/4] bg-[#FAF9F6] rounded-2xl mb-6 border border-[#3F2A2F]/5 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #3F2A2F 1px, transparent 0)', backgroundSize: '20px 20px' }}></div>
                      <FileText size={64} className="text-[#3F2A2F]/10" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#FAF9F6] to-transparent text-[#3F2A2F] text-left">
                        <p className="font-serif font-light italic text-xl">{selectedContent.title}</p>
                        <p className="text-[9px] font-medium uppercase tracking-[0.2em] opacity-40">{selectedContent.pages}</p>
                      </div>
                    </div>
                    
                    <h2 className="text-2xl font-serif font-light text-[#3F2A2F] mb-3 italic">{selectedContent.title}</h2>
                    <p className="text-[#3F2A2F]/40 text-sm mb-8 font-light">{selectedContent.desc}</p>
                    
                    <button 
                      className="w-full py-5 rounded-full font-light uppercase tracking-[0.2em] text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 bg-[#E8B4BC] hover:bg-[#3F2A2F] text-xs"
                    >
                      <FileText size={18} />
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
