import { useState, ChangeEvent } from 'react';
import { X, Check, User, Crown, Sun, Moon } from 'lucide-react';
import { useTheme, predefinedThemes } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';

export default function ThemeSettingsModal({ onClose, isFullView }: { onClose: () => void, isFullView?: boolean }) {
  const { theme, setTheme, setCustomColor, toggleTheme, isDark } = useTheme();
  const { userName, setUserName, isPremium, subscriptionStatus, logout, actualPlan } = useUser();
  const [customPrimary, setCustomPrimary] = useState(theme.primary);
  const [tempName, setTempName] = useState(userName);

  const handleCustomColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setCustomPrimary(color);
    setCustomColor('primary', color);
  };

  const handleSave = () => {
    setUserName(tempName);
    onClose();
  };

  const containerClasses = isFullView 
    ? "h-full w-full p-6 pt-12 overflow-y-auto pb-32" 
    : "glass-morphism w-full rounded-t-[3rem] p-8 shadow-2xl animate-in slide-in-from-bottom-full duration-500 max-h-[90vh] overflow-y-auto border-t border-white/10";

  return (
    <div className={isFullView ? "h-full w-full" : "fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-xl"}>
      <div className={containerClasses}>
        <div className="flex justify-between items-center mb-10 sticky top-0 bg-transparent z-10 py-2">
          <h2 className="text-3xl font-sans font-bold text-white tracking-tight">
            {isFullView ? 'Seu Perfil' : 'Configurações'}
          </h2>
          {!isFullView && (
            <button onClick={onClose} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white/40 hover:bg-white/10 transition-colors border border-white/10">
              <X size={18} />
            </button>
          )}
        </div>

        <div className="space-y-10">
          {/* Profile Header (only in full view) */}
          {isFullView && (
            <div className="flex flex-col items-center text-center mb-12">
              <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-[#D81BFF] to-[#F8C1FF] p-1 mb-4 shadow-2xl">
                <div className="w-full h-full rounded-[1.8rem] bg-[#1F1638] flex items-center justify-center text-white">
                  <User size={40} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{userName}</h3>
              <p className={`text-[9px] font-black uppercase tracking-[0.4em] px-4 py-1.5 rounded-full inline-block ${
                actualPlan.isLuxury 
                  ? 'bg-gradient-to-r from-amber-400/20 to-amber-600/20 text-amber-400 border border-amber-400/30 shadow-[0_0_20px_rgba(251,191,36,0.2)]' 
                  : actualPlan.isPremium 
                    ? 'bg-[#D81BFF]/20 text-[#D81BFF] border border-[#D81BFF]/30' 
                    : 'bg-white/5 text-white/40 border border-white/10'
              }`}>
                {actualPlan.label}
              </p>
            </div>
          )}

          {/* Profile Settings */}
          <div>
            <h3 className="text-[10px] font-bold text-[#B8B0C8] uppercase tracking-[0.3em] mb-6">Informações da Conta</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-white/40 mb-2 uppercase tracking-widest ml-4">Nome de Exibição</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-white/20">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-[#D81BFF]/50 focus:outline-none transition-all text-white font-bold"
                  />
                </div>
              </div>
              
              <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10 flex items-center justify-between backdrop-blur-xl">
                <div>
                  <p className="text-[9px] font-bold text-white/20 mb-1 uppercase tracking-widest">Plano Atual</p>
                  <div className="flex items-center gap-2">
                    {actualPlan.isLuxury ? (
                      <span className="text-amber-400 font-bold flex items-center gap-1.5 text-base tracking-tight drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]"><Crown size={16} fill="currentColor" /> {actualPlan.label}</span>
                    ) : actualPlan.isPremium ? (
                      <span className="text-[#D81BFF] font-bold flex items-center gap-1.5 text-base tracking-tight"><Crown size={16} fill="currentColor" /> {actualPlan.label}</span>
                    ) : (
                      <span className="text-white/60 font-bold text-base tracking-tight uppercase">{actualPlan.label}</span>
                    )}
                  </div>
                </div>
                {!isPremium && (
                  <button className="luxury-button text-[10px] font-bold px-5 py-2 rounded-full text-white uppercase tracking-widest">
                    Upgrade
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Logout button in full view */}
          {isFullView && (
            <div className="pt-6">
              <button 
                onClick={logout}
                className="w-full py-5 rounded-full font-bold text-white/40 border border-white/5 hover:bg-white/5 hover:text-white transition-all uppercase tracking-[0.3em] text-[10px]"
              >
                Sair da Conta
              </button>
            </div>
          )}

          {!isFullView && (
            <button 
              onClick={handleSave}
              className="luxury-button w-full py-5 rounded-full font-bold text-white shadow-lg transition-transform active:scale-95 uppercase tracking-[0.3em] text-xs"
            >
              Salvar Alterações
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
