import { useState, useEffect } from 'react';
import { Home, Dumbbell, Heart, TrendingUp, Bot, Settings, Crown, Menu, Apple, Brain } from 'lucide-react';
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
import SubscriptionView from './views/SubscriptionView';
import AuthView from './views/AuthView';
import OnboardingView from './views/OnboardingView';
import LandingView from './views/LandingView';

import NutritionView from './views/NutritionView';
import MindView from './views/MindView';

// Components
import ThemeSettingsModal from './components/ThemeSettingsModal';
import SidebarMenu from './components/SidebarMenu';

function AppContent() {
  const { theme } = useTheme();
  const { setUserName, isPremium, isAuthReady, userId, hasCompletedOnboarding } = useUser();
  
  // App State
  const [showLanding, setShowLanding] = useState(true);
  
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
    { id: 'coach', icon: Bot, label: 'Coach IA' },
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
      <div className="min-h-screen flex justify-center items-center font-sans bg-[#FAF7F5]">
        <div className="w-full max-w-md min-h-[100dvh] md:min-h-[800px] md:h-auto md:rounded-[3rem] shadow-2xl relative flex flex-col overflow-hidden bg-white items-center justify-center border border-[#3F2A2F]/5">
           <div className="w-12 h-12 border-4 border-[#E8B4BC]/20 border-t-[#E8B4BC] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!userId) {
    if (showLanding) {
      return (
        <div className="min-h-screen font-sans bg-[#FAF7F5]">
          <LandingView onStart={() => setShowLanding(false)} />
        </div>
      );
    }

    return (
      <div className="min-h-screen flex justify-center items-center font-sans bg-[#FAF7F5]">
        <div className="w-full max-w-md min-h-[100dvh] md:min-h-[800px] md:h-auto md:rounded-[3rem] shadow-2xl relative flex flex-col overflow-hidden bg-white border border-[#3F2A2F]/5">
          <AuthView onLogin={handleLogin} onRegister={handleRegister} />
        </div>
      </div>
    );
  }

  if (!hasCompletedOnboarding) {
    return (
      <div className="min-h-screen flex justify-center items-center font-sans bg-[#FAF7F5]">
        <div className="w-full max-w-md min-h-[100dvh] md:min-h-[800px] md:h-auto md:rounded-[3rem] shadow-2xl relative flex flex-col overflow-hidden bg-white border border-[#3F2A2F]/5">
          <OnboardingView onComplete={handleOnboardingComplete} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center font-sans bg-[#FAF7F5]">
      <div className="w-full max-w-md min-h-[100dvh] md:min-h-[800px] md:h-auto md:rounded-[3rem] shadow-2xl relative flex flex-col overflow-hidden transition-all duration-500 bg-white border border-[#3F2A2F]/5">
        
        {/* Header */}
        <header className="pt-14 pb-6 px-8 border-b border-[#3F2A2F]/5 sticky top-0 z-10 bg-white/80 backdrop-blur-xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-5">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-all bg-[#FAF7F5] border border-[#3F2A2F]/5 text-[#3F2A2F]/40 hover:bg-[#E8B4BC]/10 hover:text-[#E8B4BC]"
              >
                <Menu size={24} />
              </button>
              <div className="flex flex-col">
                <h1 className="text-2xl font-poppins font-extrabold tracking-tight text-[#3F2A2F] leading-none">EvoluaEla</h1>
                <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#E8B4BC] mt-1.5">High Performance</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {!isPremium ? (
                <button 
                  onClick={() => setShowSubscription(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-bold shadow-lg uppercase tracking-widest bg-[#E8B4BC] text-white transition-all hover:bg-[#3F2A2F] hover:scale-105 active:scale-95"
                >
                  <Crown size={14} fill="currentColor" /> UPGRADE
                </button>
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-[#E8B4BC]/10 border border-[#E8B4BC]/20 flex items-center justify-center text-[#E8B4BC]">
                  <Crown size={24} fill="currentColor" />
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-28 hide-scrollbar bg-[#FAF7F5]">
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
              {activeTab === 'coach' && <AICoachView />}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Bottom Navigation */}
        <nav className="absolute bottom-0 w-full border-t border-[#3F2A2F]/5 px-8 py-5 pb-12 z-20 bg-white/95 backdrop-blur-2xl">
          <ul className="flex justify-between items-center">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <li key={tab.id} className="flex-1">
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex flex-col items-center gap-2.5 transition-all duration-500 ${
                      isActive ? 'text-[#E8B4BC]' : 'text-[#3F2A2F]/20 hover:text-[#3F2A2F]/40'
                    }`}
                  >
                    <div className={`relative transition-all duration-500 ${isActive ? 'scale-110' : ''}`}>
                      <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                      {isActive && (
                        <motion.div 
                          layoutId="nav-indicator"
                          className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#E8B4BC]"
                        />
                      )}
                    </div>
                    <span className={`text-[9px] font-bold uppercase tracking-widest transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
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
          />
          {showDisclaimer && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl"
              >
                <h2 className="text-2xl font-serif font-bold text-stone-800 mb-4">Aviso Importante</h2>
                <div className="space-y-4 text-sm text-stone-600 mb-8 font-medium">
                  <p>O <strong>EvoluaEla</strong> é uma plataforma para te ajudar na organização, motivação e apoio na sua rotina.</p>
                  <p className="font-bold text-amber-600">Lembre-se: ele NÃO substitui o acompanhamento de profissionais como:</p>
                  <ul className="list-disc pl-5 space-y-2 text-stone-500">
                    <li>Nutricionistas</li>
                    <li>Médicos</li>
                    <li>Educadores Físicos</li>
                    <li>Psicólogos</li>
                  </ul>
                  <p className="text-xs text-stone-400">Os resultados variam de pessoa para pessoa e você é responsável pelas próprias decisões. Sempre consulte um especialista antes de começar dietas ou exercícios intensos, combinado?</p>
                </div>
                <button 
                  onClick={() => setShowDisclaimer(false)}
                  className="w-full py-4 rounded-[1.5rem] font-bold text-white gradient-bg shadow-lg hover:shadow-xl transition-all"
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
