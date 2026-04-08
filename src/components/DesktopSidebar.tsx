import { Home, Dumbbell, Apple, Brain, Bot, Crown, Settings, LogOut, User, HelpCircle, Heart, CreditCard, Headphones, Lock } from 'lucide-react';
import { motion } from 'motion/react';
import { Logo } from './Logo';
import { useUser } from '../contexts/UserContext';

interface DesktopSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSettings: () => void;
  onUpgrade: () => void;
}

export default function DesktopSidebar({ activeTab, setActiveTab, onOpenSettings, onUpgrade }: DesktopSidebarProps) {
  const { userName, isPremium, logout, userId } = useUser();

  const handleManageSubscription = async () => {
    try {
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('Portal error:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const menuItems = [
    { id: 'home', icon: Home, label: 'Início' },
    { id: 'workouts', icon: Dumbbell, label: 'Treinos', premium: true },
    { id: 'nutrition', icon: Apple, label: 'Nutrição', premium: true },
    { id: 'therapy', icon: Brain, label: 'Mente', premium: true },
    { id: 'coach', icon: Bot, label: 'Coach IA' },
    { id: 'journal', icon: Heart, label: 'Calendário' },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-72 h-screen bg-[#0F0A1F] border-r border-white/5 sticky top-0 z-30">
      {/* Logo Section */}
      <div className="p-8 pb-10">
        <Logo size="md" />
      </div>

      {/* Scrollable Content Section */}
      <div className="flex-1 overflow-y-auto hide-scrollbar py-4">
        {/* Navigation Section */}
        <nav className="px-4 space-y-2">
          <div className="text-[10px] font-bold text-[#B8B0C8] uppercase tracking-[0.2em] px-4 mb-4">Navegação</div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isLocked = item.premium && !isPremium;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-[#D81BFF]/10 text-[#D81BFF] border border-[#D81BFF]/20' 
                    : 'text-[#B8B0C8] hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                <div className="relative">
                  <Icon size={20} className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  {isLocked && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#D81BFF] rounded-full flex items-center justify-center border border-[#0F0A1F]">
                      <Lock size={6} className="text-white" fill="currentColor" />
                    </div>
                  )}
                </div>
                <span className="text-sm font-bold tracking-tight">{item.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-indicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-[#D81BFF]"
                  />
                )}
              </button>
            );
          })}

          <div className="pt-8 text-[10px] font-bold text-[#B8B0C8] uppercase tracking-[0.2em] px-4 mb-4">Preferências</div>
          
          {isPremium && (
            <button
              onClick={handleManageSubscription}
              className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[#B8B0C8] hover:bg-white/5 hover:text-white transition-all duration-300 group border border-transparent"
            >
              <CreditCard size={20} />
              <span className="text-sm font-bold tracking-tight">Gerenciar Assinatura</span>
            </button>
          )}

          <button
            onClick={onOpenSettings}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[#B8B0C8] hover:bg-white/5 hover:text-white transition-all duration-300 group border border-transparent"
          >
            <Settings size={20} className="group-hover:rotate-45 transition-transform duration-500" />
            <span className="text-sm font-bold tracking-tight">Configurações</span>
          </button>

          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[#B8B0C8] hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 group border border-transparent"
          >
            <LogOut size={20} />
            <span className="text-sm font-bold tracking-tight">Sair</span>
          </button>

          <button
            onClick={() => setActiveTab('support')}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group border border-transparent ${
              activeTab === 'support' 
                ? 'bg-[#D81BFF]/10 text-[#D81BFF] border-[#D81BFF]/20' 
                : 'text-[#B8B0C8] hover:bg-white/5 hover:text-white'
            }`}
          >
            <Headphones size={20} className={activeTab === 'support' ? 'scale-110' : 'group-hover:scale-110 transition-transform duration-300'} />
            <span className="text-sm font-bold tracking-tight">Suporte</span>
          </button>
        </nav>

        {/* Upgrade Section */}
        {!isPremium && (
          <div className="px-4 mt-8 mb-6">
            <div className="luxury-card p-6 relative overflow-hidden group">
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#D81BFF]/10 rounded-full blur-2xl group-hover:bg-[#D81BFF]/20 transition-colors duration-500" />
              <Crown className="text-[#D81BFF] mb-3" size={24} fill="currentColor" />
              <h3 className="text-white font-bold text-sm mb-1 tracking-tight">Seja Premium</h3>
              <p className="text-[#B8B0C8] text-[10px] leading-relaxed mb-4 font-medium uppercase tracking-wider">Acesso total a treinos e nutrição personalizada.</p>
              <button 
                onClick={onUpgrade}
                className="luxury-button w-full py-3 rounded-full text-white text-[10px] font-bold uppercase tracking-widest hover:scale-[1.02] transition-transform active:scale-95 shadow-lg"
              >
                Upgrade Agora
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Profile Section */}
      <button 
        onClick={() => setActiveTab('profile')}
        className={`p-4 border-t border-white/5 w-full text-left transition-colors ${activeTab === 'profile' ? 'bg-[#D81BFF]/10' : 'bg-white/5 hover:bg-white/10'}`}
      >
        <div className="flex items-center gap-3 px-2 py-3">
          <div className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-colors ${activeTab === 'profile' ? 'bg-[#D81BFF] text-white border-transparent' : 'bg-white/5 border-white/10 text-[#B8B0C8]'}`}>
            <User size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate tracking-tight">{userName || 'Usuária'}</p>
            <p className="text-[9px] font-bold text-[#B8B0C8] uppercase tracking-widest truncate">
              {isPremium ? 'Membro Premium' : 'Plano Free'}
            </p>
          </div>
        </div>
      </button>
    </aside>
  );
}
