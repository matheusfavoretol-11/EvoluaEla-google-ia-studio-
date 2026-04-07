import { useState, ChangeEvent } from 'react';
import { X, Check, User, Crown, Sun, Moon } from 'lucide-react';
import { useTheme, predefinedThemes } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';

export default function ThemeSettingsModal({ onClose, isFullView }: { onClose: () => void, isFullView?: boolean }) {
  const { theme, setTheme, setCustomColor, toggleTheme, isDark } = useTheme();
  const { userName, setUserName, isPremium, subscriptionStatus, logout } = useUser();
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
              <p className="text-xs font-bold text-[#D81BFF] uppercase tracking-[0.3em]">Membro Luxury</p>
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
                    {isPremium ? (
                      <span className="text-[#D81BFF] font-bold flex items-center gap-1.5 text-base tracking-tight"><Crown size={16} fill="currentColor" /> Premium</span>
                    ) : (
                      <span className="text-white font-bold text-base tracking-tight">Gratuito</span>
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

          {/* Theme Toggle */}
          <div>
            <h3 className="text-[10px] font-bold text-[#B8B0C8] uppercase tracking-[0.3em] mb-6">Preferências</h3>
            <button 
              onClick={toggleTheme}
              className="w-full flex items-center justify-between p-6 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-[#D81BFF]/50 transition-all group backdrop-blur-xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#D81BFF] shadow-sm border border-white/10">
                  {isDark ? <Moon size={24} /> : <Sun size={24} />}
                </div>
                <div className="text-left">
                  <p className="font-bold text-white text-lg tracking-tight">Modo {isDark ? 'Escuro' : 'Claro'}</p>
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Alternar visual</p>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${isDark ? 'bg-[#D81BFF]' : 'bg-white/20'}`}>
                <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${isDark ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
            </button>
          </div>

          {/* Predefined Themes */}
          <div>
            <h3 className="text-[10px] font-bold text-[#B8B0C8] uppercase tracking-[0.3em] mb-6">Temas Exclusivos</h3>
            <div className="grid grid-cols-3 gap-4">
              {Object.values(predefinedThemes).map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t)}
                  className={`flex flex-col items-center gap-3 p-5 rounded-[2rem] border transition-all ${
                    theme.id === t.id ? 'border-[#D81BFF] bg-[#D81BFF]/10 shadow-2xl' : 'border-white/5 hover:border-[#D81BFF]/30 bg-white/5 backdrop-blur-xl'
                  }`}
                >
                  <div 
                    className="w-10 h-10 rounded-full shadow-lg flex items-center justify-center"
                    style={{ backgroundColor: t.primary }}
                  >
                    {theme.id === t.id && <Check size={16} color="#fff" strokeWidth={3} />}
                  </div>
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{t.name}</span>
                </button>
              ))}
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
