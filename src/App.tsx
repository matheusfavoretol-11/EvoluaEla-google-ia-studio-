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
  const { setUserName, isPremium, isAuthReady, userId } = useUser();
  
  // App State
  const [showLanding, setShowLanding] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  
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
    setHasCompletedOnboarding(true);
  };

  const handleRegister = (name: string) => {
    setUserName(name);
    setHasCompletedOnboarding(false);
  };

  const handleOnboardingComplete = () => {
    setHasCompletedOnboarding(true);
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex justify-center items-center font-sans transition-colors duration-300" style={{ backgroundColor: '#e7e5e4' }}>
        <div className="w-full max-w-md min-h-[100dvh] md:min-h-[800px] md:h-auto md:rounded-[2.5rem] shadow-2xl relative flex flex-col overflow-hidden bg-white items-center justify-center">
           <div className="w-10 h-10 border-4 border-stone-200 border-t-stone-800 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!userId) {
    if (showLanding) {
      return (
        <div className="min-h-screen font-sans bg-white">
          <LandingView onStart={() => setShowLanding(false)} />
        </div>
      );
    }

    return (
      <div className="min-h-screen flex justify-center items-center font-sans transition-colors duration-300" style={{ backgroundColor: '#e7e5e4' }}>
        <div className="w-full max-w-md min-h-[100dvh] md:min-h-[800px] md:h-auto md:rounded-[2.5rem] shadow-2xl relative flex flex-col overflow-hidden bg-white">
          <AuthView onLogin={handleLogin} onRegister={handleRegister} />
        </div>
      </div>
    );
  }

  if (!hasCompletedOnboarding) {
    return (
      <div className="min-h-screen flex justify-center items-center font-sans transition-colors duration-300" style={{ backgroundColor: '#e7e5e4' }}>
        <div className="w-full max-w-md min-h-[100dvh] md:min-h-[800px] md:h-auto md:rounded-[2.5rem] shadow-2xl relative flex flex-col overflow-hidden bg-white">
          <OnboardingView onComplete={handleOnboardingComplete} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center font-sans transition-colors duration-300" style={{ backgroundColor: '#e7e5e4' }}>
      <div className="w-full max-w-md min-h-[100dvh] md:min-h-[800px] md:h-auto md:rounded-[2.5rem] shadow-2xl relative flex flex-col overflow-hidden transition-colors duration-300" style={{ backgroundColor: theme.bg, color: theme.text }}>
        
        {/* Header */}
        <header className="pt-12 pb-4 px-6 border-b border-stone-100 sticky top-0 z-10 bg-white/80 backdrop-blur-md">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="w-10 h-10 rounded-[1.25rem] flex items-center justify-center shadow-sm transition-all bg-white border border-stone-100 text-stone-600 hover:bg-stone-50"
              >
                <Menu size={20} />
              </button>
              <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center text-white font-serif font-bold text-lg shadow-sm overflow-hidden">
                <img 
                  src="/logo.png" 
                  alt="EvoluaEla Logo" 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.nextElementSibling) {
                      (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'block';
                    }
                  }} 
                />
                <span className="hidden">E</span>
              </div>
              <h1 className="text-2xl font-serif font-bold tracking-tight text-stone-800">EvoluaEla</h1>
            </div>
            <div className="flex items-center gap-3">
              {!isPremium && (
                <button 
                  onClick={() => setShowSubscription(true)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-bold shadow-sm uppercase tracking-widest gradient-bg-light transition-transform hover:scale-105"
                  style={{ color: theme.primary }}
                >
                  <Crown size={14} /> PRO
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-24 hide-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
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
        <nav className="absolute bottom-0 w-full border-t border-stone-100 px-6 py-4 pb-8 z-20 bg-white/90 backdrop-blur-md">
          <ul className="flex justify-between items-center">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl transition-all duration-300 ${
                      isActive ? 'scale-110' : 'hover:opacity-80 hover:scale-105'
                    }`}
                    style={{ color: isActive ? theme.primary : '#a8a29e' }}
                  >
                    <div className={`relative ${isActive ? 'p-2 rounded-xl gradient-bg-light shadow-sm' : ''}`}>
                      <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-widest">{tab.label}</span>
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
                  <p>O <strong>EvoluaEla</strong> é uma plataforma de organização, motivação e apoio na rotina.</p>
                  <p className="font-bold text-amber-600">Ele NÃO substitui o acompanhamento de profissionais como:</p>
                  <ul className="list-disc pl-5 space-y-2 text-stone-500">
                    <li>Nutricionistas</li>
                    <li>Médicos</li>
                    <li>Educadores Físicos</li>
                    <li>Psicólogos</li>
                  </ul>
                  <p className="text-xs text-stone-400">Os resultados variam de pessoa para pessoa e você é responsável pelas próprias decisões.</p>
                </div>
                <button 
                  onClick={() => setShowDisclaimer(false)}
                  className="w-full py-4 rounded-[1.5rem] font-bold text-white gradient-bg shadow-lg hover:shadow-xl transition-all"
                >
                  Eu entendo e concordo
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
