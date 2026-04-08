import { useState, useEffect } from 'react';
import { Logo } from './components/Logo';
import { Home, Dumbbell, Heart, TrendingUp, Bot, Crown, Menu, Apple, Brain, Headphones, Sun, Moon, User, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Contexts
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { UserProvider, useUser } from './contexts/UserContext';

// Views
import DashboardView from './views/DashboardView';
import WorkoutsView from './views/WorkoutsView';
import JournalView from './views/JournalView';
import ContentView from './views/ContentView';
import AICoachView from './views/AICoachView';
import SupportView from './views/SupportView';
import SubscriptionView from './views/SubscriptionView';
import AuthView from './views/AuthView';
import OnboardingView from './views/OnboardingView';
import LandingView from './views/LandingView';

import NutritionView from './views/NutritionView';
import MindView from './views/MindView';
import GroupTherapyView from './views/GroupTherapyView';
import TherapistDashboardView from './views/TherapistDashboardView';

// Components
import ThemeSettingsModal from './components/ThemeSettingsModal';
import SidebarMenu from './components/SidebarMenu';
import DesktopSidebar from './components/DesktopSidebar';

function AppContent() {
  const { theme } = useTheme();
  const { setUserName, isPremium, isAuthReady, userId, hasCompletedOnboarding, role } = useUser();
  
  // App State
  const [showLanding, setShowLanding] = useState(true);

  useEffect(() => {
    if (!userId && isAuthReady) {
      setShowLanding(true);
    }
    
    const handleOpenCoach = () => setActiveTab('coach');
    window.addEventListener('open-coach', handleOpenCoach);
    return () => window.removeEventListener('open-coach', handleOpenCoach);
  }, [userId, isAuthReady]);
  
  const [activeTab, setActiveTab] = useState('home');
  const [showThemeSettings, setShowThemeSettings] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const tabs = [
    { id: 'home', icon: Home, label: 'Início' },
    { id: 'workouts', icon: Dumbbell, label: 'Treinos', premium: true },
    { id: 'nutrition', icon: Apple, label: 'Nutrição', premium: true },
    { id: 'therapy', icon: Brain, label: 'Mente', premium: true },
    { id: 'coach', icon: Bot, label: 'Coach IA' },
    { id: 'journal', icon: Heart, label: 'Calendário' },
    { id: 'profile', icon: User, label: 'Perfil' },
  ];

  const handleLogin = (name: string) => {
    setUserName(name);
  };

  const handleRegister = (name: string) => {
    setUserName(name);
  };

  const handleOnboardingComplete = () => {
    // No longer needed to set local state, UserContext handles it
  };

  if (!isAuthReady) {
    return (
      <div className="w-full h-screen-dynamic relative flex flex-col overflow-hidden bg-[#0F0A1F] items-center justify-center">
         <div className="w-10 h-10 border-2 border-[#D81BFF]/30 border-t-[#D81BFF] rounded-full animate-spin" />
      </div>
    );
  }

  if (!userId) {
    if (showLanding) {
      return <LandingView onStart={() => setShowLanding(false)} />;
    }

    return (
      <div className="w-full h-screen-dynamic relative flex flex-col overflow-hidden bg-[#0F0A1F]">
        <AuthView onLogin={handleLogin} onRegister={handleRegister} />
      </div>
    );
  }

  if (!hasCompletedOnboarding) {
    return (
      <div className="w-full h-screen-dynamic relative flex flex-col overflow-hidden bg-[#0F0A1F]">
        <OnboardingView onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  return (
    <div className="w-full h-screen-dynamic relative flex flex-col lg:flex-row overflow-hidden bg-[#0F0A1F] font-sans">
      
      {/* Desktop Sidebar */}
      <DesktopSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenSettings={() => setShowThemeSettings(true)}
        onUpgrade={() => setShowSubscription(true)}
      />

      <div className="w-full lg:flex-1 h-full relative flex flex-col overflow-hidden transition-all duration-500 bg-transparent">
        <div className="infinite-bg" />
        
        {/* Header */}
        <header className={`pt-10 sm:pt-14 lg:pt-8 pb-4 sm:pb-6 lg:pb-8 px-6 sm:px-10 lg:px-12 sticky top-0 z-30 bg-transparent shrink-0 border-none transition-all duration-500 ${activeTab === 'home' ? 'backdrop-blur-0' : 'backdrop-blur-3xl'}`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 sm:gap-5">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-sm transition-all glass-morphism text-white/40 hover:text-[#D81BFF]"
              >
                <Menu size={20} className="sm:w-6 sm:h-6" />
              </button>
              <div className="flex items-center gap-3">
                <Logo size="sm" className="lg:hidden" />
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              {!isPremium ? (
                <button 
                  onClick={() => setShowSubscription(true)}
                  className="flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-full text-[9px] sm:text-[10px] font-bold shadow-2xl uppercase tracking-[0.2em] bg-[#D81BFF] text-white transition-all hover:bg-white hover:text-[#D81BFF] hover:scale-105 active:scale-95"
                >
                  <Crown size={12} className="sm:w-3.5 sm:h-3.5" fill="currentColor" /> UPGRADE
                </button>
              ) : (
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl lg:rounded-[1.5rem] bg-[#D81BFF]/10 border border-[#D81BFF]/20 flex items-center justify-center text-[#D81BFF] shadow-xl">
                  <Crown size={20} className="sm:w-6 sm:h-6 lg:w-8 lg:h-8" fill="currentColor" />
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-32 lg:pb-12 hide-scrollbar bg-transparent relative scroll-container overscroll-none">
          <div className="w-full h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="h-full"
              >
                {activeTab === 'home' && <DashboardView onNavigate={setActiveTab} onUpgrade={() => setShowSubscription(true)} />}
                {activeTab === 'workouts' && <WorkoutsView onUpgrade={() => setShowSubscription(true)} />}
                {activeTab === 'nutrition' && <NutritionView onUpgrade={() => setShowSubscription(true)} />}
                {activeTab === 'therapy' && <GroupTherapyView onUpgrade={() => setShowSubscription(true)} />}
                {activeTab === 'coach' && <AICoachView onUpgrade={() => setShowSubscription(true)} />}
                {activeTab === 'support' && <SupportView />}
                {activeTab === 'journal' && <JournalView />}
                {activeTab === 'profile' && <ThemeSettingsModal onClose={() => setActiveTab('home')} isFullView={true} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Bottom Navigation - Floating Style */}
        <nav className="lg:hidden fixed bottom-6 left-6 right-6 px-4 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] z-40 glass-morphism rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 overflow-x-auto hide-scrollbar">
          <ul className="flex justify-between items-center min-w-max gap-4 px-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const isLocked = tab.premium && !isPremium;
              return (
                <li key={tab.id} className="shrink-0">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-col items-center gap-1.5 transition-all duration-500 relative ${
                      isActive ? 'text-[#D81BFF]' : 'text-white/40 hover:text-white'
                    }`}
                  >
                    <div className={`relative transition-all duration-500 ${isActive ? 'scale-110' : ''}`}>
                      <Icon size={isActive ? 22 : 20} strokeWidth={isActive ? 2.5 : 2} />
                      {isLocked && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#D81BFF] rounded-full flex items-center justify-center border border-[#0F0A1F]">
                          <Lock size={6} className="text-white" fill="currentColor" />
                        </div>
                      )}
                      {isActive && (
                        <motion.div 
                          layoutId="activeTabGlow"
                          className="absolute -inset-2 bg-[#D81BFF]/10 blur-xl rounded-full -z-10"
                        />
                      )}
                    </div>
                    <AnimatePresence>
                      {isActive && (
                        <motion.span 
                          initial={{ opacity: 0, y: 5, scale: 0.8 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 5, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                          className="text-[8px] font-bold uppercase tracking-[0.2em]"
                        >
                          {tab.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Modals */}
        <AnimatePresence>
          {showThemeSettings && <ThemeSettingsModal onClose={() => setShowThemeSettings(false)} />}
          {showSubscription && <SubscriptionView onClose={() => setShowSubscription(false)} />}
          <SidebarMenu 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)} 
            onOpenSettings={() => setShowThemeSettings(true)}
            onOpenHelp={() => setActiveTab('coach')}
            onOpenSupport={() => setActiveTab('support')}
          />
          {showDisclaimer && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-6">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass-morphism rounded-[2rem] p-8 max-w-sm w-full shadow-2xl border border-white/10"
              >
                <h2 className="text-2xl font-bold text-white mb-4 tracking-tighter">Aviso Importante</h2>
                <div className="space-y-4 text-sm text-white/40 mb-8 font-bold uppercase tracking-widest text-[10px]">
                  <p>O <strong className="font-bold text-white">EvoluaEla</strong> é uma plataforma para te ajudar na organização, motivação e apoio na sua rotina.</p>
                  <p className="font-bold text-[#D81BFF] uppercase tracking-widest text-[10px]">Lembre-se: ele NÃO substitui o acompanhamento de profissionais como:</p>
                  <ul className="list-disc pl-5 space-y-2 text-white/40">
                    <li>Nutricionistas</li>
                    <li>Médicos</li>
                    <li>Educadores Físicos</li>
                    <li>Psicólogos</li>
                  </ul>
                  <p className="text-[10px] text-white/40 leading-relaxed font-bold uppercase tracking-widest">Os resultados variam de pessoa para pessoa e você é responsável pelas próprias decisões. Sempre consulte um especialista antes de começar dietas ou exercícios intensos, combinado?</p>
                </div>
                <button 
                  onClick={() => setShowDisclaimer(false)}
                  className="luxury-button w-full py-5 rounded-full font-bold text-white hover:scale-[1.02] transition-all uppercase tracking-widest text-[10px]"
                >
                  Entendi, vamos lá!
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <UserProvider>
      <ThemeProvider>
        <AppContentWrapper />
      </ThemeProvider>
    </UserProvider>
  );
}

function AppContentWrapper() {
  const themeContext = useTheme();
  useEffect(() => {
    (window as any).themeContext = themeContext;
  }, [themeContext]);

  return <AppContent />;
}
