import { useState, useEffect } from 'react';
import { Home, Dumbbell, Heart, TrendingUp, Bot, Crown, Menu, Apple, Brain, Headphones } from 'lucide-react';
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
    { id: 'workouts', icon: Dumbbell, label: 'Treinos' },
    { id: 'nutrition', icon: Apple, label: 'Nutrição' },
    { id: 'mind', icon: Brain, label: 'Mente' },
    { id: 'therapy', icon: Heart, label: 'Terapia' },
    { id: 'coach', icon: Bot, label: 'Coach IA' },
    { id: 'support', icon: Headphones, label: 'Suporte' },
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
      <div className="min-h-screen flex flex-col justify-center items-center font-sans bg-[#0A0A0A] p-0 sm:p-4">
        <div className="w-full max-w-md lg:max-w-none lg:w-full lg:h-screen min-h-[100dvh] sm:min-h-[800px] sm:h-auto sm:rounded-[3rem] lg:rounded-none shadow-2xl relative flex flex-col overflow-hidden bg-[#141414] items-center justify-center border border-white/5">
           <div className="w-10 h-10 border-2 border-[#E8B4BC]/20 border-t-[#E8B4BC] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!userId) {
    if (showLanding) {
      return (
        <div className="min-h-screen font-sans bg-[#0A0A0A]">
          <LandingView onStart={() => setShowLanding(false)} />
        </div>
      );
    }

    return (
      <div className="min-h-screen flex justify-center items-center font-sans bg-[#0A0A0A] p-0 sm:p-4">
        <div className="w-full max-w-md min-h-[100dvh] sm:min-h-[800px] sm:h-auto sm:rounded-[3rem] shadow-2xl relative flex flex-col overflow-hidden bg-[#141414] border border-white/5">
          <AuthView onLogin={handleLogin} onRegister={handleRegister} />
        </div>
      </div>
    );
  }

  if (!hasCompletedOnboarding) {
    return (
      <div className="min-h-screen flex justify-center items-center font-sans bg-[#0A0A0A] p-0 sm:p-4">
        <div className="w-full max-w-md min-h-[100dvh] sm:min-h-[800px] sm:h-auto sm:rounded-[3rem] shadow-2xl relative flex flex-col overflow-hidden bg-[#141414] border border-white/5">
          <OnboardingView onComplete={handleOnboardingComplete} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex lg:flex-row justify-center items-center font-sans bg-[#0A0A0A] p-0 sm:p-4 lg:p-0 overflow-hidden">
      
      {/* Desktop Sidebar */}
      <DesktopSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenSettings={() => setShowThemeSettings(true)}
        onUpgrade={() => setShowSubscription(true)}
      />

      <div className="w-full max-w-md lg:max-w-none lg:flex-1 h-screen min-h-[100dvh] sm:min-h-[800px] lg:min-h-0 sm:h-auto lg:h-screen sm:rounded-[3rem] lg:rounded-none shadow-2xl relative flex flex-col overflow-hidden transition-all duration-500 bg-[#141414] border border-white/5 lg:border-none">
        
        {/* Header */}
        <header className="pt-10 sm:pt-14 lg:pt-8 pb-4 sm:pb-6 lg:pb-8 px-6 sm:px-8 lg:px-12 border-b border-white/5 sticky top-0 z-10 bg-[#141414]/80 backdrop-blur-xl shrink-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 sm:gap-5">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-sm transition-all bg-white/5 border border-white/5 text-white/40 hover:bg-[#E8B4BC]/10 hover:text-[#E8B4BC]"
              >
                <Menu size={20} className="sm:w-6 sm:h-6" />
              </button>
              <div className="flex items-center gap-3">
                <img src="/logo.png?v=3" alt="EvoluaEla Logo" className="w-[120px] h-auto object-contain lg:hidden" />
                <div className="flex flex-col">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tighter text-white leading-none">
                    {tabs.find(t => t.id === activeTab)?.label || 'EvoluaEla'}
                  </h1>
                  <span className="text-[7px] sm:text-[8px] lg:text-[10px] font-bold uppercase tracking-[0.3em] text-[#E8B4BC] mt-1 sm:mt-1.5">
                    {activeTab === 'home' ? 'High Performance' : 'Sua Jornada'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              {!isPremium ? (
                <button 
                  onClick={() => setShowSubscription(true)}
                  className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 lg:px-8 py-2 sm:py-2.5 lg:py-4 rounded-full text-[8px] sm:text-[9px] lg:text-[11px] font-bold shadow-lg uppercase tracking-widest bg-gradient-to-r from-[#E8B4BC] to-[#D4B996] text-black transition-all hover:scale-105 active:scale-95"
                >
                  <Crown size={10} className="sm:w-3 sm:h-3 lg:w-4 lg:h-4" fill="currentColor" /> UPGRADE
                </button>
              ) : (
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl lg:rounded-[1.5rem] bg-[#E8B4BC]/10 border border-[#E8B4BC]/20 flex items-center justify-center text-[#E8B4BC]">
                  <Crown size={20} className="sm:w-6 sm:h-6 lg:w-8 lg:h-8" fill="currentColor" />
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-28 lg:pb-12 hide-scrollbar bg-[#0A0A0A] bg-grid-pattern relative">
          <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8 lg:py-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="h-full"
              >
                {activeTab === 'home' && <DashboardView onNavigate={setActiveTab} onUpgrade={() => setShowSubscription(true)} />}
                {activeTab === 'workouts' && <WorkoutsView onUpgrade={() => setShowSubscription(true)} />}
                {activeTab === 'nutrition' && <NutritionView onUpgrade={() => setShowSubscription(true)} />}
                {activeTab === 'mind' && <MindView onUpgrade={() => setShowSubscription(true)} />}
                {activeTab === 'therapy' && (
                  role === 'therapist' || role === 'admin' 
                    ? <TherapistDashboardView /> 
                    : <GroupTherapyView onUpgrade={() => setShowSubscription(true)} />
                )}
                {activeTab === 'coach' && <AICoachView />}
                {activeTab === 'support' && <SupportView />}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Bottom Navigation */}
        <nav className="lg:hidden absolute bottom-0 w-full border-t border-white/5 px-4 sm:px-8 py-4 sm:py-5 pb-8 sm:pb-12 z-20 bg-[#141414]/95 backdrop-blur-2xl">
          <ul className="flex justify-between items-center">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <li key={tab.id} className="flex-1">
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex flex-col items-center gap-1.5 sm:gap-2.5 transition-all duration-500 ${
                      isActive ? 'text-[#E8B4BC]' : 'text-white/20 hover:text-white/40'
                    }`}
                  >
                    <div className={`relative transition-all duration-500 ${isActive ? 'scale-110' : ''}`}>
                      <Icon size={isActive ? 22 : 20} className="sm:w-6 sm:h-6" strokeWidth={isActive ? 2.5 : 2} />
                      {isActive && (
                        <motion.div 
                          layoutId="nav-indicator"
                          className="absolute -bottom-2 sm:-bottom-2.5 left-1/2 -translate-x-1/2 w-1 sm:h-1.5 sm:w-1.5 h-1 rounded-full bg-[#E8B4BC]"
                        />
                      )}
                    </div>
                    <span className={`text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.2em] transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                      {tab.label}
                    </span>
                  </button>
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
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-[#141414] rounded-[2rem] p-8 max-w-sm w-full shadow-2xl border border-white/10"
              >
                <h2 className="text-2xl font-bold text-white mb-4 tracking-tighter">Aviso Importante</h2>
                <div className="space-y-4 text-sm text-white/40 mb-8 font-medium">
                  <p>O <strong className="font-bold text-white/60">EvoluaEla</strong> é uma plataforma para te ajudar na organização, motivação e apoio na sua rotina.</p>
                  <p className="font-bold text-[#E8B4BC] uppercase tracking-widest text-[10px]">Lembre-se: ele NÃO substitui o acompanhamento de profissionais como:</p>
                  <ul className="list-disc pl-5 space-y-2 text-white/30">
                    <li>Nutricionistas</li>
                    <li>Médicos</li>
                    <li>Educadores Físicos</li>
                    <li>Psicólogos</li>
                  </ul>
                  <p className="text-[10px] text-white/20 leading-relaxed font-bold uppercase tracking-widest">Os resultados variam de pessoa para pessoa e você é responsável pelas próprias decisões. Sempre consulte um especialista antes de começar dietas ou exercícios intensos, combinado?</p>
                </div>
                <button 
                  onClick={() => setShowDisclaimer(false)}
                  className="w-full py-5 rounded-full font-bold text-black bg-gradient-to-r from-[#E8B4BC] to-[#D4B996] hover:scale-[1.02] transition-all uppercase tracking-widest text-[10px]"
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
        <AppContent />
      </ThemeProvider>
    </UserProvider>
  );
}
