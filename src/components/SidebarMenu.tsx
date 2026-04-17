import { motion, AnimatePresence } from 'motion/react';
import { X, HelpCircle, Settings, Mail, User, Crown, LogOut, Headphones } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
  onOpenSupport: () => void;
}

export default function SidebarMenu({ isOpen, onClose, onOpenSettings, onOpenHelp, onOpenSupport }: SidebarMenuProps) {
  const { theme } = useTheme();
  const { userName, isPremium, subscriptionStatus, logout, actualPlan } = useUser();

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
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-40"
        />
      )}
      {isOpen && (
          <motion.div
          key="sidebar"
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-0 left-0 bottom-0 w-[85%] glass-morphism z-50 shadow-2xl flex flex-col font-sans text-[var(--color-text)] border-r border-white/10"
        >
            {/* Header */}
            <div className="p-8 pt-16 border-b border-white/10 flex items-center justify-between bg-transparent">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[var(--color-text)]/90 border border-[var(--color-border)] flex items-center justify-center shadow-sm text-[var(--color-text-muted)]">
                  <User size={28} />
                </div>
                <div>
                  <h2 className="font-bold text-xl text-[var(--color-text)] leading-tight tracking-tighter">{userName || 'Usuária'}</h2>
                  <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] mt-1.5">
                    {actualPlan.isLuxury ? (
                      <span className="text-amber-400 flex items-center gap-1.5 drop-shadow-[0_0_5px_rgba(251,191,36,0.3)]"><Crown size={12} fill="currentColor" /> {actualPlan.label}</span>
                    ) : actualPlan.isPremium ? (
                      <span className={actualPlan.color + " flex items-center gap-1.5"}><Crown size={12} fill="currentColor" /> {actualPlan.label}</span>
                    ) : (
                      <span className="text-white/40">{actualPlan.label}</span>
                    )}
                  </div>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-[var(--color-text)]/90 border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
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
                    color: 'var(--color-primary)'
                  },
                  { 
                    id: 'settings',
                    icon: Settings, 
                    title: 'Configurações', 
                    subtitle: 'Cores, perfil e plano', 
                    onClick: onOpenSettings,
                    color: 'var(--color-accent)'
                  },
                  { 
                    id: 'support',
                    icon: Headphones, 
                    title: 'Suporte', 
                    subtitle: 'Fale com nossa equipe', 
                    onClick: onOpenSupport,
                    color: 'var(--color-primary)'
                  }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onClose();
                      item.onClick();
                    }}
                    className="w-full flex items-center gap-5 p-5 rounded-3xl hover:bg-white/10 transition-all text-left group border border-transparent hover:border-white/20"
                  >
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center transition-colors"
                      style={{ backgroundColor: `color-mix(in srgb, ${item.color}, transparent 10%)`, color: item.color }}
                    >
                      <item.icon size={24} />
                    </div>
                    <div>
                      <span className="block font-bold text-[var(--color-text)] text-lg tracking-tight">{item.title}</span>
                      <span className="text-[10px] text-[var(--color-text-muted)]/90 font-bold uppercase tracking-widest">{item.subtitle}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-8 border-t border-white/10 bg-transparent">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-full border border-[var(--color-border)] text-[var(--color-text-muted)]/90 hover:text-rose-500 hover:border-rose-500/90 hover:bg-rose-500/90 transition-all text-[9px] font-bold uppercase tracking-[0.2em]"
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
