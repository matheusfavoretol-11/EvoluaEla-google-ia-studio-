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
          <h2 className="text-2xl font-serif font-bold text-stone-800">Configurações</h2>
          <button onClick={onClose} className="w-8 h-8 bg-stone-100 rounded-full flex items-center justify-center text-stone-500 hover:bg-stone-200 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-8">
          {/* Profile Settings */}
          <div>
            <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-4">Seu Perfil</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-600 mb-2">Nome</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:outline-none transition-all text-stone-800"
                    style={{ focusRingColor: theme.primary }}
                  />
                </div>
              </div>
              
              <div className="p-4 bg-stone-50 rounded-[1.5rem] border border-stone-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-stone-600 mb-1">Plano Atual</p>
                  <div className="flex items-center gap-1.5">
                    {isPremium ? (
                      <span className="text-amber-500 font-bold flex items-center gap-1"><Crown size={16} /> Premium</span>
                    ) : subscriptionStatus === 'trial' ? (
                      <span className="text-emerald-500 font-bold flex items-center gap-1"><Crown size={16} /> Teste Grátis (7 dias)</span>
                    ) : (
                      <span className="text-stone-800 font-bold">Essencial</span>
                    )}
                  </div>
                </div>
                {!isPremium && subscriptionStatus !== 'trial' && (
                  <button className="text-xs font-bold px-3 py-1.5 rounded-xl gradient-bg-light" style={{ color: theme.primary }}>
                    Fazer Upgrade
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Predefined Themes */}
          <div>
            <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-4">Temas Prontos</h3>
            <div className="grid grid-cols-3 gap-3">
              {Object.values(predefinedThemes).map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-[1.5rem] border transition-all ${
                    theme.id === t.id ? 'border-stone-800 bg-stone-50 soft-shadow-sm' : 'border-stone-100 hover:border-stone-200 bg-white'
                  }`}
                >
                  <div 
                    className="w-10 h-10 rounded-full shadow-sm flex items-center justify-center"
                    style={{ backgroundColor: t.primary }}
                  >
                    {theme.id === t.id && <Check size={16} color="#fff" />}
                  </div>
                  <span className="text-xs font-bold text-stone-700">{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Color Picker */}
          <div>
            <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-4">Cor Principal Customizada</h3>
            <div className="flex items-center gap-4 p-4 bg-white rounded-[1.5rem] border border-stone-100 soft-shadow-sm">
              <input 
                type="color" 
                value={customPrimary}
                onChange={handleCustomColorChange}
                className="w-12 h-12 rounded-xl cursor-pointer border-0 p-0 bg-transparent"
              />
              <div className="flex-1">
                <p className="text-sm font-bold text-stone-800">Escolha sua cor favorita</p>
                <p className="text-xs font-medium text-stone-500">O app ficará com a sua cara!</p>
              </div>
            </div>
          </div>

          <button 
            onClick={handleSave}
            className="w-full py-4 rounded-[1.5rem] font-bold text-white shadow-md transition-transform active:scale-95 gradient-bg hover:scale-[1.02] sticky bottom-0"
          >
            Salvar e Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
