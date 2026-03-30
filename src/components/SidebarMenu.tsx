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
          className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white z-50 shadow-2xl flex flex-col font-sans text-[#3F2A2F]"
        >
            {/* Header */}
            <div className="p-8 pt-16 border-b border-[#3F2A2F]/5 flex items-center justify-between bg-[#FAF9F6]">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white border border-[#3F2A2F]/5 flex items-center justify-center shadow-sm text-[#3F2A2F]/20">
                  <User size={28} />
                </div>
                <div>
                  <h2 className="font-serif font-light text-xl text-[#3F2A2F] leading-tight italic">{userName || 'Usuária'}</h2>
                  <div className="flex items-center gap-2 text-[9px] font-medium uppercase tracking-[0.2em] mt-1.5">
                    {isPremium ? (
                      <span className="text-[#E8B4BC] flex items-center gap-1.5"><Crown size={12} fill="currentColor" /> Premium</span>
                    ) : subscriptionStatus === 'trial' ? (
                      <span className="text-[#A8C4B8] flex items-center gap-1.5"><Crown size={12} fill="currentColor" /> Teste Grátis</span>
                    ) : (
                      <span className="text-[#3F2A2F]/30">Plano Gratuito</span>
                    )}
                  </div>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-white border border-[#3F2A2F]/5 flex items-center justify-center text-[#3F2A2F]/20 hover:text-[#3F2A2F] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto py-8">
              <div className="px-6 space-y-4">
                {[
                  { 
                    id: 'help',
                    icon: HelpCircle, 
                    title: 'Tirar dúvida', 
                    subtitle: 'Pergunte à Coach IA', 
                    onClick: onOpenHelp,
                    color: '#E8B4BC'
                  },
                  { 
                    id: 'settings',
                    icon: Settings, 
                    title: 'Configurações', 
                    subtitle: 'Cores, perfil e plano', 
                    onClick: onOpenSettings,
                    color: '#A8C4B8'
                  },
                  { 
                    id: 'support',
                    icon: Mail, 
                    title: 'Suporte', 
                    subtitle: 'Fale com nossa equipe', 
                    onClick: handleEmailSupport,
                    color: '#E8B4BC'
                  }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onClose();
                      item.onClick();
                    }}
                    className="w-full flex items-center gap-5 p-5 rounded-3xl hover:bg-[#FAF9F6] transition-all text-left group border border-transparent hover:border-[#3F2A2F]/5"
                  >
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center transition-colors"
                      style={{ backgroundColor: `${item.color}15`, color: item.color }}
                    >
                      <item.icon size={24} />
                    </div>
                    <div>
                      <span className="block font-serif font-light text-[#3F2A2F] text-lg">{item.title}</span>
                      <span className="text-[10px] text-[#3F2A2F]/40 font-light uppercase tracking-widest">{item.subtitle}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-8 border-t border-[#3F2A2F]/5 bg-[#FAF9F6]/50">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-full border border-[#3F2A2F]/5 text-[#3F2A2F]/30 hover:text-red-400 hover:border-red-400/20 hover:bg-red-400/5 transition-all text-[9px] font-medium uppercase tracking-[0.2em]"
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
