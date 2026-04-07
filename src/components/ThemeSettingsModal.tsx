import { useState, ChangeEvent } from 'react';
import { X, Check, User, Crown, Sun, Moon } from 'lucide-react';
import { useTheme, predefinedThemes } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';

export default function ThemeSettingsModal({ onClose }: { onClose: () => void }) {
  const { theme, setTheme, setCustomColor, toggleTheme, isDark } = useTheme();
  const { userName, setUserName, isPremium, subscriptionStatus } = useUser();
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

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-xl">
      <div className="glass-morphism w-full rounded-t-[3rem] p-8 shadow-2xl animate-in slide-in-from-bottom-full duration-500 max-h-[90vh] overflow-y-auto border-t border-white/10">
        <div className="flex justify-between items-center mb-8 sticky top-0 bg-transparent z-10 py-2">
          <h2 className="text-2xl font-bold text-white tracking-tighter">Configurações</h2>
          <button onClick={onClose} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white/40 hover:bg-white/10 transition-colors border border-white/10">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-8">
          {/* Theme Toggle */}
          <div>
            <h3 className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] mb-4">Aparência</h3>
            <button 
              onClick={toggleTheme}
              className="w-full flex items-center justify-between p-6 rounded-[2rem] bg-white/5 border border-white/10 hover:border-[#8B4357]/90 transition-all group backdrop-blur-xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#8B4357] shadow-sm border border-white/10">
                  {isDark ? <Moon size={24} /> : <Sun size={24} />}
                </div>
                <div className="text-left">
                  <p className="font-bold text-white text-lg tracking-tight">Modo {isDark ? 'Escuro' : 'Claro'}</p>
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Toque para alternar</p>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${isDark ? 'bg-[#8B4357]' : 'bg-white/20'}`}>
                <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${isDark ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
            </button>
          </div>

          {/* Profile Settings */}
          <div>
            <h3 className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] mb-4">Seu Perfil</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-white/40 mb-2 uppercase tracking-widest ml-4">Nome</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="w-full pl-11 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-1 focus:ring-[#8B4357]/90 focus:outline-none transition-all text-white font-bold"
                  />
                </div>
              </div>
              
              <div className="p-5 bg-white/5 rounded-[2rem] border border-white/10 flex items-center justify-between backdrop-blur-xl">
                <div>
                  <p className="text-[9px] font-bold text-white/20 mb-1 uppercase tracking-widest">Seu Plano</p>
                  <div className="flex items-center gap-1.5">
                    {isPremium ? (
                      <span className="text-[#8B4357] font-bold flex items-center gap-1 text-sm tracking-tight"><Crown size={14} fill="currentColor" /> Premium</span>
                    ) : subscriptionStatus === 'trial' ? (
                      <span className="text-[#C5A059] font-bold flex items-center gap-1 text-sm tracking-tight"><Crown size={14} fill="currentColor" /> Teste Grátis (7 dias)</span>
                    ) : (
                      <span className="text-white font-bold text-sm tracking-tight">Gratuito</span>
                    )}
                  </div>
                </div>
                {!isPremium && subscriptionStatus !== 'trial' && (
                  <button className="text-[9px] font-bold px-3 py-1.5 rounded-full bg-[#8B4357] text-black uppercase tracking-widest hover:scale-105 transition-transform">
                    Fazer Upgrade
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Predefined Themes */}
          <div>
            <h3 className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] mb-4">Temas Prontos</h3>
            <div className="grid grid-cols-3 gap-3">
              {Object.values(predefinedThemes).map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-[2rem] border transition-all ${
                    theme.id === t.id ? 'border-[#8B4357]/90 bg-white/10 shadow-sm' : 'border-white/10 hover:border-[#8B4357]/90 bg-white/5 backdrop-blur-xl'
                  }`}
                >
                  <div 
                    className="w-8 h-8 rounded-full shadow-sm flex items-center justify-center"
                    style={{ backgroundColor: t.primary }}
                  >
                    {theme.id === t.id && <Check size={14} color="#fff" />}
                  </div>
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Color Picker */}
          <div>
            <h3 className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] mb-4">Cor Principal Customizada</h3>
            <div className="flex items-center gap-4 p-5 bg-white/5 rounded-[2rem] border border-white/10 shadow-sm backdrop-blur-xl">
              <input 
                type="color" 
                value={customPrimary}
                onChange={handleCustomColorChange}
                className="w-10 h-10 rounded-xl cursor-pointer border-0 p-0 bg-transparent"
              />
              <div className="flex-1">
                <p className="text-sm font-bold text-white tracking-tight">Escolha sua cor favorita</p>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">O app ficará com a sua cara!</p>
              </div>
            </div>
          </div>

          <button 
            onClick={handleSave}
            className="w-full py-5 rounded-full font-bold text-black shadow-lg transition-transform active:scale-95 bg-gradient-to-r from-[#8B4357] to-[#C5A059] hover:scale-[1.02] sticky bottom-0 uppercase tracking-widest text-[10px]"
          >
            Pronto, fechar
          </button>
        </div>
      </div>
    </div>
  );
}
