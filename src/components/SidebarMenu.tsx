import { motion, AnimatePresence } from 'motion/react';
import { X, HelpCircle, Settings, Mail, User, Crown, LogOut } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
}

export default function SidebarMenu({ isOpen, onClose, onOpenSettings, onOpenHelp }: SidebarMenuProps) {
  const { theme } = useTheme();
  const { userName, isPremium, subscriptionStatus, logout } = useUser();

  const handleEmailSupport = () => {
    window.location.href = 'mailto:evoluaela@gmail.com';
  };

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        />
      )}
      {isOpen && (
        <motion.div
          key="sidebar"
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-0 left-0 bottom-0 w-[80%] max-w-sm bg-white z-50 shadow-2xl flex flex-col"
        >
            {/* Header */}
            <div className="p-6 border-b border-stone-100 flex items-center justify-between gradient-bg-light" style={{ color: theme.primary }}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm text-stone-600">
                  <User size={24} />
                </div>
                <div>
                  <h2 className="font-serif font-bold text-lg text-stone-800">{userName || 'Usuária'}</h2>
                  <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest mt-0.5">
                    {isPremium ? (
                      <span className="text-amber-500 flex items-center gap-1"><Crown size={12} /> Premium</span>
                    ) : subscriptionStatus === 'trial' ? (
                      <span className="text-emerald-500 flex items-center gap-1"><Crown size={12} /> Teste Grátis</span>
                    ) : (
                      <span className="text-stone-500">Plano Gratuito</span>
                    )}
                  </div>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center text-stone-600 hover:bg-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto py-4">
              <div className="px-4 space-y-2">
                <button
                  onClick={() => {
                    onClose();
                    onOpenHelp();
                  }}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-stone-50 transition-colors text-left group"
                >
                  <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-500 group-hover:text-stone-800 transition-colors" style={{ color: theme.primary }}>
                    <HelpCircle size={20} />
                  </div>
                  <div>
                    <span className="block font-bold text-stone-800">Tirar dúvida</span>
                    <span className="text-xs text-stone-500 font-medium">Pergunte à Coach IA</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onOpenSettings();
                  }}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-stone-50 transition-colors text-left group"
                >
                  <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-500 group-hover:text-stone-800 transition-colors" style={{ color: theme.primary }}>
                    <Settings size={20} />
                  </div>
                  <div>
                    <span className="block font-bold text-stone-800">Configurações</span>
                    <span className="text-xs text-stone-500 font-medium">Cores, perfil e plano</span>
                  </div>
                </button>

                <button
                  onClick={handleEmailSupport}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-stone-50 transition-colors text-left group"
                >
                  <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-500 group-hover:text-stone-800 transition-colors" style={{ color: theme.primary }}>
                    <Mail size={20} />
                  </div>
                  <div>
                    <span className="block font-bold text-stone-800">Suporte</span>
                    <span className="text-xs text-stone-500 font-medium">Fale com nossa equipe</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-stone-100">
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-stone-400 hover:text-red-500 transition-colors text-sm font-bold uppercase tracking-widest"
              >
                <LogOut size={16} />
                Sair da conta
              </button>
            </div>
          </motion.div>
      )}
    </AnimatePresence>
  );
}
