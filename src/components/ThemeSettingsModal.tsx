import { useState, ChangeEvent } from 'react';
import { X, Check, User, Crown } from 'lucide-react';
import { useTheme, predefinedThemes } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';

export default function ThemeSettingsModal({ onClose }: { onClose: () => void }) {
  const { theme, setTheme, setCustomColor } = useTheme();
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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-t-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-full duration-300 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 py-2">
          <h2 className="text-2xl font-serif font-light text-[#3F2A2F]">Configurações</h2>
          <button onClick={onClose} className="w-8 h-8 bg-[#FAF9F6] rounded-full flex items-center justify-center text-[#3F2A2F]/40 hover:bg-[#3F2A2F]/5 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-8">
          {/* Profile Settings */}
          <div>
            <h3 className="text-[9px] font-medium text-[#3F2A2F]/40 uppercase tracking-[0.2em] mb-4">Seu Perfil</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-medium text-[#3F2A2F]/60 mb-2 uppercase tracking-widest ml-4">Nome</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#3F2A2F]/20">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-[#FAF9F6] border border-[#3F2A2F]/5 rounded-2xl focus:ring-1 focus:ring-[#E8B4BC]/30 focus:outline-none transition-all text-[#3F2A2F] font-light"
                  />
                </div>
              </div>
              
              <div className="p-4 bg-[#FAF9F6] rounded-[1.5rem] border border-[#3F2A2F]/5 flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-medium text-[#3F2A2F]/40 mb-1 uppercase tracking-widest">Seu Plano</p>
                  <div className="flex items-center gap-1.5">
                    {isPremium ? (
                      <span className="text-[#E8B4BC] font-medium flex items-center gap-1 text-sm"><Crown size={14} fill="currentColor" /> Premium</span>
                    ) : subscriptionStatus === 'trial' ? (
                      <span className="text-[#A8C4B8] font-medium flex items-center gap-1 text-sm"><Crown size={14} fill="currentColor" /> Teste Grátis (7 dias)</span>
                    ) : (
                      <span className="text-[#3F2A2F] font-medium text-sm">Gratuito</span>
                    )}
                  </div>
                </div>
                {!isPremium && subscriptionStatus !== 'trial' && (
                  <button className="text-[9px] font-medium px-3 py-1.5 rounded-full bg-[#E8B4BC] text-white uppercase tracking-widest">
                    Fazer Upgrade
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Predefined Themes */}
          <div>
            <h3 className="text-[9px] font-medium text-[#3F2A2F]/40 uppercase tracking-[0.2em] mb-4">Temas Prontos</h3>
            <div className="grid grid-cols-3 gap-3">
              {Object.values(predefinedThemes).map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-[1.5rem] border transition-all ${
                    theme.id === t.id ? 'border-[#3F2A2F]/20 bg-[#FAF9F6] soft-shadow-sm' : 'border-[#3F2A2F]/5 hover:border-[#3F2A2F]/10 bg-white'
                  }`}
                >
                  <div 
                    className="w-8 h-8 rounded-full shadow-sm flex items-center justify-center"
                    style={{ backgroundColor: t.primary }}
                  >
                    {theme.id === t.id && <Check size={14} color="#fff" />}
                  </div>
                  <span className="text-[10px] font-medium text-[#3F2A2F]/60 uppercase tracking-widest">{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Color Picker */}
          <div>
            <h3 className="text-[9px] font-medium text-[#3F2A2F]/40 uppercase tracking-[0.2em] mb-4">Cor Principal Customizada</h3>
            <div className="flex items-center gap-4 p-4 bg-white rounded-[1.5rem] border border-[#3F2A2F]/5 soft-shadow-sm">
              <input 
                type="color" 
                value={customPrimary}
                onChange={handleCustomColorChange}
                className="w-10 h-10 rounded-xl cursor-pointer border-0 p-0 bg-transparent"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-[#3F2A2F]">Escolha sua cor favorita</p>
                <p className="text-[10px] font-light text-[#3F2A2F]/40 uppercase tracking-widest">O app ficará com a sua cara!</p>
              </div>
            </div>
          </div>

          <button 
            onClick={handleSave}
            className="w-full py-5 rounded-full font-light text-white shadow-md transition-transform active:scale-95 bg-[#E8B4BC] hover:bg-[#3F2A2F] hover:scale-[1.02] sticky bottom-0 uppercase tracking-[0.2em] text-xs"
          >
            Pronto, fechar
          </button>
        </div>
      </div>
    </div>
  );
}
