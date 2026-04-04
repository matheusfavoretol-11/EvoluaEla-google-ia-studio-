import { Home, Dumbbell, Apple, Brain, Bot, Crown, Settings, LogOut, User, HelpCircle, Heart, CreditCard, Headphones } from 'lucide-react';
import { motion } from 'motion/react';
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
    { id: 'workouts', icon: Dumbbell, label: 'Treinos' },
    { id: 'nutrition', icon: Apple, label: 'Nutrição' },
    { id: 'mind', icon: Brain, label: 'Mente' },
    { id: 'therapy', icon: Heart, label: 'Terapia' },
    { id: 'coach', icon: Bot, label: 'Coach IA' },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-72 h-screen bg-[#141414] border-r border-white/5 sticky top-0 z-30">
      {/* Logo Section */}
      <div className="p-8 pb-10">
        <div className="flex items-center gap-3 mb-4">
          <img src="/logo.png?v=1" alt="EvoluaEla Logo" className="w-12 h-12 rounded-xl object-contain" />
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tighter text-white leading-none">EvoluaEla</h1>
            <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-[#E8B4BC] mt-1">High Performance</span>
          </div>
        </div>
      </div>

      {/* Scrollable Content Section */}
      <div className="flex-1 overflow-y-auto hide-scrollbar py-4">
        {/* Navigation Section */}
        <nav className="px-4 space-y-2">
          <div className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] px-4 mb-4">Navegação</div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-[#E8B4BC]/10 text-[#E8B4BC] border border-[#E8B4BC]/10' 
                    : 'text-white/40 hover:bg-white/5 hover:text-white/60 border border-transparent'
                }`}
              >
                <Icon size={20} className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className="text-sm font-semibold tracking-tight">{item.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-indicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-[#E8B4BC]"
                  />
                )}
              </button>
            );
          })}

          <div className="pt-8 text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] px-4 mb-4">Preferências</div>
          
          {isPremium && (
            <button
              onClick={handleManageSubscription}
              className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-white/40 hover:bg-white/5 hover:text-white/60 transition-all duration-300 group border border-transparent"
            >
              <CreditCard size={20} />
              <span className="text-sm font-semibold tracking-tight">Gerenciar Assinatura</span>
            </button>
          )}

          <button
            onClick={onOpenSettings}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-white/40 hover:bg-white/5 hover:text-white/60 transition-all duration-300 group border border-transparent"
          >
            <Settings size={20} className="group-hover:rotate-45 transition-transform duration-500" />
            <span className="text-sm font-semibold tracking-tight">Configurações</span>
          </button>

          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-white/40 hover:bg-rose-500/10 hover:text-rose-500 transition-all duration-300 group border border-transparent"
          >
            <LogOut size={20} />
            <span className="text-sm font-semibold tracking-tight">Sair</span>
          </button>

          <button
            onClick={() => setActiveTab('support')}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group border border-transparent ${
              activeTab === 'support' 
                ? 'bg-[#E8B4BC]/10 text-[#E8B4BC] border-[#E8B4BC]/10' 
                : 'text-white/40 hover:bg-white/5 hover:text-white/60'
            }`}
          >
            <Headphones size={20} className={activeTab === 'support' ? 'scale-110' : 'group-hover:scale-110 transition-transform duration-300'} />
            <span className="text-sm font-semibold tracking-tight">Suporte</span>
          </button>
        </nav>

        {/* Upgrade Section */}
        {!isPremium && (
          <div className="px-4 mt-8 mb-6">
            <div className="bg-gradient-to-br from-[#E8B4BC]/20 to-[#D4B996]/20 p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group">
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/5 rounded-full blur-2xl group-hover:bg-[#E8B4BC]/10 transition-colors duration-500" />
              <Crown className="text-[#E8B4BC] mb-3" size={24} fill="currentColor" />
              <h3 className="text-white font-bold text-sm mb-1 tracking-tight">Seja Premium</h3>
              <p className="text-white/40 text-[10px] leading-relaxed mb-4 font-medium uppercase tracking-wider">Acesso total a treinos e nutrição personalizada.</p>
              <button 
                onClick={onUpgrade}
                className="w-full py-3 rounded-full bg-gradient-to-r from-[#E8B4BC] to-[#D4B996] text-black text-[10px] font-bold uppercase tracking-widest hover:scale-[1.02] transition-transform active:scale-95 shadow-lg"
              >
                Upgrade Agora
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Profile Section */}
      <div className="p-4 border-t border-white/5 bg-[#0A0A0A]/50">
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20">
            <User size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate tracking-tight">{userName || 'Usuária'}</p>
            <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest truncate">
              {isPremium ? 'Membro Premium' : 'Plano Free'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
