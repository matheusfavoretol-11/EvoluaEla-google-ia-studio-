import { useState, useEffect } from 'react';
import { Logo } from './components/Logo';
import { Home, Dumbbell, Heart, TrendingUp, Bot, Crown, Menu, Apple, Brain, Headphones, Sun, Moon } from 'lucide-react';
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
      <div className="min-h-screen flex flex-col justify-center items-center font-sans bg-[var(--color-bg)]">
        <div className="w-full lg:h-screen min-h-[100dvh] relative flex flex-col overflow-hidden bg-[var(--color-surface)] items-center justify-center border-white/90">
           <div className="w-10 h-10 border-2 border-[var(--color-primary)]/90 border-t-[var(--color-primary)] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!userId) {
    if (showLanding) {
      return (
        <div className="min-h-screen font-sans bg-[var(--color-bg)]">
          <LandingView onStart={() => setShowLanding(false)} />
        </div>
      );
    }

    return (
      <div className="min-h-screen flex justify-center items-center font-sans bg-[var(--color-bg)]">
        <div className="w-full min-h-[100dvh] relative flex flex-col overflow-hidden bg-[var(--color-bg)]">
          <AuthView onLogin={handleLogin} onRegister={handleRegister} />
        </div>
      </div>
    );
  }

  if (!hasCompletedOnboarding) {
    return (
      <div className="min-h-screen flex justify-center items-center font-sans bg-[var(--color-bg)]">
        <div className="w-full min-h-[100dvh] relative flex flex-col overflow-hidden bg-[var(--color-bg)]">
          <OnboardingView onComplete={handleOnboardingComplete} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex lg:flex-row justify-center items-center font-sans bg-[var(--color-bg)] overflow-hidden">
      
      {/* Desktop Sidebar */}
      <DesktopSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenSettings={() => setShowThemeSettings(true)}
        onUpgrade={() => setShowSubscription(true)}
      />

      <div className="w-full lg:flex-1 h-screen min-h-[100dvh] lg:min-h-0 relative flex flex-col overflow-hidden transition-all duration-500 bg-[var(--color-bg)]">
        
        {/* Header */}
        <header className="pt-10 sm:pt-14 lg:pt-8 pb-4 sm:pb-6 lg:pb-8 px-4 sm:px-8 lg:px-12 sticky top-0 z-30 bg-[var(--color-bg)]/80 backdrop-blur-2xl shrink-0 shadow-sm border-none">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 sm:gap-5">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-sm transition-all bg-[var(--color-text)]/90 border border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-primary)]/90 hover:text-[var(--color-primary)]"
              >
                <Menu size={20} className="sm:w-6 sm:h-6" />
              </button>
              <div className="flex items-center gap-3">
                <Logo size="sm" className="lg:hidden" />
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button 
                onClick={() => {
                  const { toggleTheme } = (window as any).themeContext;
                  toggleTheme();
                }}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-sm transition-all bg-[var(--color-text)]/90 border border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-primary)]/90 hover:text-[var(--color-primary)] mr-1"
              >
                {(window as any).themeContext?.isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              {!isPremium ? (
                <button 
                  onClick={() => setShowSubscription(true)}
                  className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 lg:px-8 py-2 sm:py-2.5 lg:py-4 rounded-full text-[8px] sm:text-[9px] lg:text-[11px] font-bold shadow-lg uppercase tracking-widest bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-black transition-all hover:scale-105 active:scale-95"
                >
                  <Crown size={10} className="sm:w-3 sm:h-3 lg:w-4 lg:h-4" fill="currentColor" /> UPGRADE
                </button>
              ) : (
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl lg:rounded-[1.5rem] bg-[var(--color-primary)]/90 border border-[var(--color-primary)]/90 flex items-center justify-center text-[var(--color-primary)]">
                  <Crown size={20} className="sm:w-6 sm:h-6 lg:w-8 lg:h-8" fill="currentColor" />
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-32 lg:pb-12 hide-scrollbar bg-[var(--color-bg)] bg-grid-pattern relative scroll-container overscroll-none">
          <div className="w-full px-4 sm:px-8 lg:px-12 py-8 lg:py-12">
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
        <nav className="lg:hidden fixed bottom-0 w-full px-4 sm:px-8 py-4 sm:py-5 pb-[calc(1rem+env(safe-area-inset-bottom))] z-40 bg-[var(--color-surface)]/95 backdrop-blur-3xl border-t border-[var(--color-border)]/50 shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
          <ul className="flex justify-between items-center">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <li key={tab.id} className="flex-1">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex flex-col items-center gap-1.5 sm:gap-2.5 transition-all duration-500 ${
                      isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                    }`}
                  >
                    <div className={`relative transition-all duration-500 ${isActive ? 'scale-110' : ''}`}>
                      <Icon size={isActive ? 22 : 20} className="sm:w-6 sm:h-6" strokeWidth={isActive ? 2.5 : 2} />
                      {isActive && (
                        <motion.div 
                          layoutId="activeTabGlow"
                          className="absolute -inset-2 bg-[var(--color-primary)]/10 blur-xl rounded-full -z-10"
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
                          className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.2em]"
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
                className="bg-[var(--color-surface)] rounded-[2rem] p-8 max-w-sm w-full shadow-2xl border border-[var(--color-border)]"
              >
                <h2 className="text-2xl font-bold text-[var(--color-text)] mb-4 tracking-tighter">Aviso Importante</h2>
                <div className="space-y-4 text-sm text-[var(--color-text-muted)] mb-8 font-bold uppercase tracking-widest text-[10px]">
                  <p>O <strong className="font-bold text-[var(--color-text)]">EvoluaEla</strong> é uma plataforma para te ajudar na organização, motivação e apoio na sua rotina.</p>
                  <p className="font-bold text-[var(--color-primary)] uppercase tracking-widest text-[10px]">Lembre-se: ele NÃO substitui o acompanhamento de profissionais como:</p>
                  <ul className="list-disc pl-5 space-y-2 text-[var(--color-text-muted)]/90">
                    <li>Nutricionistas</li>
                    <li>Médicos</li>
                    <li>Educadores Físicos</li>
                    <li>Psicólogos</li>
                  </ul>
                  <p className="text-[10px] text-[var(--color-text-muted)]/90 leading-relaxed font-bold uppercase tracking-widest">Os resultados variam de pessoa para pessoa e você é responsável pelas próprias decisões. Sempre consulte um especialista antes de começar dietas ou exercícios intensos, combinado?</p>
                </div>
                <button 
                  onClick={() => setShowDisclaimer(false)}
                  className="w-full py-5 rounded-full font-bold text-black bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] hover:scale-[1.02] transition-all uppercase tracking-widest text-[10px]"
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
