import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { UserLevel, EmotionalStats, DailyMission } from '../types';

interface UserContextType {
  userName: string;
  setUserName: (name: string) => void;
  isPremium: boolean;
  setIsPremium: (status: boolean) => void;
  subscriptionStatus: string;
  setSubscriptionStatus: (status: string) => void;
  actualPlan: {
    name: string;
    label: string;
    color: string;
    isPremium: boolean;
    isLuxury: boolean;
  };
  valorPago: number;
  setValorPago: (valor: number) => void;
  subscriptionEndDate: string | null;
  setSubscriptionEndDate: (date: string | null) => void;
  trialEndDate: Date | null;
  setTrialEndDate: (date: Date | null) => void;
  coachMessagesCount: number;
  setCoachMessagesCount: (count: number) => void;
  selectedDiet: string | null;
  setSelectedDiet: (diet: string | null) => void;
  lastDietChangeDate: string | null;
  scheduledSessions: Array<{ id: string, date: string, time: string, topic: string }>;
  setScheduledSessions: (sessions: Array<{ id: string, date: string, time: string, topic: string }>) => void;
  lastSessionDate: string | null;
  dailyGoal: string;
  setDailyGoal: (goal: string) => void;
  isDailyGoalCompleted: boolean;
  setIsDailyGoalCompleted: (status: boolean) => void;
  level: UserLevel;
  setLevel: (level: UserLevel) => void;
  emotionalStats: EmotionalStats;
  setEmotionalStats: (stats: EmotionalStats) => void;
  updateEmotionalStats: (updates: Partial<EmotionalStats>) => void;
  dailyMissions: DailyMission[];
  setDailyMissions: (missions: DailyMission[]) => void;
  toggleMission: (id: string) => void;
  streakCount: number;
  onboardingAnswers: Record<string, string>;
  setOnboardingAnswers: (answers: Record<string, string>) => void;
  hasCompletedOnboarding: boolean;
  acessoTerapiaGrupo: boolean;
  role: 'user' | 'therapist' | 'admin';
  isAuthReady: boolean;
  userId: string | null;
  notifications: any[];
  setNotifications: (notifications: any[]) => void;
  userStats: { totalWorkouts: number; totalMinutes: number; streak: number };
  completeWorkout: (workoutId: string, duration: number) => Promise<void>;
  verificarAcessoPremium: () => { acesso: boolean; motivo?: string; mensagem?: string };
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userName, setUserName] = useState<string>('');
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('free');
  const [valorPago, setValorPago] = useState<number>(0);

  // Derived plan state
  const actualPlan = React.useMemo(() => {
    const isLuxury = subscriptionStatus === 'luxury';
    const isTrial = ['trialing', 'trial'].includes(subscriptionStatus);
    const isPaidPremium = ['premium', 'active'].includes(subscriptionStatus);
    
    if (isLuxury) {
      return {
        name: 'luxury',
        label: 'MEMBRO LUXURY',
        color: 'text-amber-400',
        isPremium: true,
        isLuxury: true
      };
    }

    if (isTrial) {
      return {
        name: 'trial',
        label: 'TESTE GRÁTIS',
        color: 'text-[#F8C1FF]',
        isPremium: true,
        isLuxury: false
      };
    }
    
    if (isPaidPremium) {
      return {
        name: 'premium',
        label: 'MEMBRO PREMIUM',
        color: 'text-[#D81BFF]',
        isPremium: true,
        isLuxury: false
      };
    }

    return {
      name: 'free',
      label: 'MEMBRO FREE',
      color: 'text-white/40',
      isPremium: false,
      isLuxury: false
    };
  }, [subscriptionStatus]);
  const [subscriptionEndDate, setSubscriptionEndDate] = useState<string | null>(null);
  const [trialEndDate, setTrialEndDate] = useState<Date | null>(null);
  const [coachMessagesCount, setCoachMessagesCount] = useState<number>(0);
  const [selectedDiet, setSelectedDiet] = useState<string | null>(null);
  const [lastDietChangeDate, setLastDietChangeDate] = useState<string | null>(null);

  const canChangeDiet = () => {
    if (!lastDietChangeDate) return true;
    const lastChange = new Date(lastDietChangeDate);
    const now = new Date();
    
    // Check if it's a different month or year
    return now.getMonth() !== lastChange.getMonth() || now.getFullYear() !== lastChange.getFullYear();
  };

  const updateSelectedDiet = async (diet: string | null) => {
    if (diet && !canChangeDiet()) {
      throw new Error("Você só pode trocar de dieta uma vez por mês.");
    }
    setSelectedDiet(diet);
  };
  const [scheduledSessions, setScheduledSessions] = useState<Array<{ id: string, date: string, time: string, topic: string }>>([]);
  const [lastSessionDate, setLastSessionDate] = useState<string | null>(null);
  const [dailyGoal, setDailyGoal] = useState<string>('');
  const [isDailyGoalCompleted, setIsDailyGoalCompleted] = useState<boolean>(false);
  
  const [level, setLevel] = useState<UserLevel>('Despertando');
  const [emotionalStats, setEmotionalStats] = useState<EmotionalStats>({
    confianca: 30,
    autoestima: 40,
    disciplina: 20,
    amorProprio: 35
  });
  const [dailyMissions, setDailyMissions] = useState<DailyMission[]>([
    { id: '1', title: 'Se arrume hoje como se fosse um encontro importante', completed: false },
    { id: '2', title: 'Evite se criticar hoje', completed: false },
    { id: '3', title: 'Faça algo só por você', completed: false }
  ]);
  const [streakCount, setStreakCount] = useState<number>(0);
  const [onboardingAnswers, setOnboardingAnswers] = useState<Record<string, string>>({});
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(false);
  const [acessoTerapiaGrupo, setAcessoTerapiaGrupo] = useState<boolean>(false);
  const [role, setRole] = useState<'user' | 'therapist' | 'admin'>('user');

  const [isAuthReady, setIsAuthReady] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [userStats, setUserStats] = useState({ totalWorkouts: 0, totalMinutes: 0, streak: 0 });

  const fetchUserStats = async (uid: string) => {
    try {
      const { data: history, error } = await supabase
        .from('workout_history')
        .select('completed_at, duration_minutes')
        .eq('user_id', uid)
        .order('completed_at', { ascending: false });

      if (error) throw error;

      if (!history || history.length === 0) {
        setUserStats({ totalWorkouts: 0, totalMinutes: 0, streak: 0 });
        return;
      }

      const totalWorkouts = history.length;
      const totalMinutes = history.reduce((acc, curr) => acc + (curr.duration_minutes || 0), 0);

      // Simple streak calculation
      const dates = history.map(h => new Date(h.completed_at).toDateString());
      const uniqueDates = Array.from(new Set(dates));
      
      let streak = 0;
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      
      let checkDate = uniqueDates.includes(today) ? today : (uniqueDates.includes(yesterday) ? yesterday : null);
      
      if (checkDate) {
        let currentIdx = uniqueDates.indexOf(checkDate);
        streak = 1;
        
        while (currentIdx < uniqueDates.length - 1) {
          const currentDate = new Date(uniqueDates[currentIdx]);
          const prevDate = new Date(uniqueDates[currentIdx + 1]);
          const diffDays = Math.round((currentDate.getTime() - prevDate.getTime()) / (1000 * 3600 * 24));
          
          if (diffDays === 1) {
            streak++;
            currentIdx++;
          } else {
            break;
          }
        }
      }

      setUserStats({ totalWorkouts, totalMinutes, streak });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const completeWorkout = async (workoutId: string, duration: number) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('workout_history')
        .insert({
          user_id: userId,
          workout_id: workoutId,
          duration_minutes: duration
        });

      if (error) throw error;
      
      // Refresh stats
      await fetchUserStats(userId);
      
      // Send notification
      await supabase.from('notifications').insert({
        user_id: userId,
        title: '🔥 Treino Concluído!',
        message: `Parabéns! Você completou mais um treino e acumulou ${duration} minutos de evolução.`,
        type: 'success'
      });
    } catch (err) {
      console.error('Error completing workout:', err);
    }
  };

  const toggleMission = (id: string) => {
    setDailyMissions(prev => prev.map(m => m.id === id ? { ...m, completed: !m.completed } : m));
  };

  const verificarAcessoPremium = () => {
    // 1. Check if user has an active premium/luxury status based on our source of truth
    if (!actualPlan.isPremium) {
      return {
        acesso: false,
        motivo: "SEM_ASSINATURA",
        mensagem: "Você precisa assinar o plano Premium para acessar este recurso."
      };
    }

    // 2. Check for expiry if we have an end date
    if (subscriptionEndDate) {
      const hoje = new Date();
      const vencimento = new Date(subscriptionEndDate);
      if (hoje > vencimento) {
        return {
          acesso: false,
          motivo: "VENCIDO",
          mensagem: "Sua assinatura venceu. Renove para continuar aproveitando!"
        };
      }
    }

    return { acesso: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUserId(null);
    setUserName('');
    setIsPremium(false);
    setAcessoTerapiaGrupo(false);
    setRole('user');
    setSubscriptionStatus('free');
    setOnboardingAnswers({});
    setHasCompletedOnboarding(false);
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserId(session.user.id);
        setUserName(session.user.user_metadata?.display_name || session.user.email?.split('@')[0] || 'Usuária');
      } else {
        setUserId(null);
      }
      setIsAuthReady(true);
    }).catch(err => {
      console.error('Auth session error:', err);
      setIsAuthReady(true); // Ensure we don't get stuck on loading screen
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
        setUserName(session.user.user_metadata?.display_name || session.user.email?.split('@')[0] || 'Usuária');
      } else {
        setUserId(null);
      }
      setIsAuthReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch user data from Supabase when userId changes
  useEffect(() => {
    if (!userId) return;

    // Fetch emotional stats
    const fetchStats = async () => {
      const { data, error } = await supabase
        .from('emotional_stats')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (data && !error) {
        setEmotionalStats({
          confianca: data.confianca ?? 30,
          autoestima: data.autoestima ?? 40,
          disciplina: data.disciplina ?? 20,
          amorProprio: data.amor_proprio ?? 35
        });
      }
    };

    // Fetch onboarding answers
    const fetchOnboarding = async () => {
      const { data, error } = await supabase
        .from('onboarding_answers')
        .select('answers')
        .eq('user_id', userId)
        .single();
        
      if (data && !error && data.answers) {
        setOnboardingAnswers(data.answers);
      }
    };

    // Fetch user profile data
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (data && !error) {
        const fetchedStatus = (data.subscription_status || 'free').toLowerCase();
        
        // Strict mapping: If it's not a known paid/trial status, it's free.
        // This prevents 'premium' string from a boolean column or other junk data from being treated as premium.
        const isActuallyPremium = ['premium', 'active', 'luxury', 'trialing', 'trial'].includes(fetchedStatus);
        
        // Final sanity check: if the status is 'premium' but there was NO payment recorded and it's not a trial, 
        // we might be looking at stale data from a previous session.
        const vPago = Number(data.valor_pago) || 0;
        let finalStatus = fetchedStatus;
        if (fetchedStatus === 'premium' && vPago === 0) {
           finalStatus = 'free';
        }
        
        setSubscriptionStatus(finalStatus);
        setIsPremium(['premium', 'active', 'luxury', 'trialing', 'trial'].includes(finalStatus));
        setAcessoTerapiaGrupo(data.acesso_terapia_grupo || false);
        setRole(data.role || 'user');
        setValorPago(vPago);
        setSubscriptionEndDate(data.subscription_end_date || null);
        setCoachMessagesCount(data.coach_messages_count || 0);
        setSelectedDiet(data.selected_diet || null);
        setLastDietChangeDate(data.last_diet_change_date || null);
        
        // Ensure unique sessions
        const sessions = data.scheduled_sessions || [];
        const uniqueSessions = sessions.filter((s: any, index: number, self: any[]) =>
          index === self.findIndex((t) => t.id === s.id)
        );
        setScheduledSessions(uniqueSessions);
        
        setLastSessionDate(data.last_session_date || null);
      }
    };

    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (data && !error) {
        // Ensure unique notifications
        const uniqueNotifications = data.filter((n: any, index: number, self: any[]) =>
          index === self.findIndex((t) => t.id === n.id)
        );
        setNotifications(uniqueNotifications);
      }
    };

    fetchStats();
    fetchOnboarding();
    fetchProfile();
    fetchNotifications();
    fetchUserStats(userId);

    // Set up realtime subscriptions
    const profileSubscription = supabase
      .channel('public:users')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users', filter: `id=eq.${userId}` }, payload => {
        const data = payload.new as any;
        if (data) {
          const updatedStatus = (data.subscription_status || 'free').toLowerCase();
          
          const vPago = Number(data.valor_pago) || 0;
          let finalStatus = updatedStatus;
          if (updatedStatus === 'premium' && vPago === 0) {
             finalStatus = 'free';
          }

          setSubscriptionStatus(finalStatus);
          setIsPremium(['premium', 'active', 'luxury', 'trialing', 'trial'].includes(finalStatus));
          setAcessoTerapiaGrupo(data.acesso_terapia_grupo || false);
          setRole(data.role || 'user');
          setValorPago(vPago);
          setSubscriptionEndDate(data.subscription_end_date || null);
          setCoachMessagesCount(data.coach_messages_count || 0);
          setSelectedDiet(data.selected_diet || null);
          setLastDietChangeDate(data.last_diet_change_date || null);
          setScheduledSessions(data.scheduled_sessions || []);
          setLastSessionDate(data.last_session_date || null);
        }
      })
      .subscribe();

    const statsSubscription = supabase
      .channel('public:emotional_stats')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'emotional_stats', filter: `user_id=eq.${userId}` }, payload => {
        const data = payload.new as any;
        if (data) {
          setEmotionalStats({
            confianca: data.confianca ?? 30,
            autoestima: data.autoestima ?? 40,
            disciplina: data.disciplina ?? 20,
            amorProprio: data.amor_proprio ?? 35
          });
        }
      })
      .subscribe();

    const onboardingSubscription = supabase
      .channel('public:onboarding_answers')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'onboarding_answers', filter: `user_id=eq.${userId}` }, payload => {
        const data = payload.new as any;
        if (data && data.answers) {
          setOnboardingAnswers(data.answers);
        }
      })
      .subscribe();

    const notificationsSubscription = supabase
      .channel('public:notifications')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` }, payload => {
        if (payload.eventType === 'INSERT') {
          setNotifications(prev => {
            // Prevent duplicate IDs
            if (prev.some(n => n.id === payload.new.id)) return prev;
            return [payload.new, ...prev];
          });
        } else if (payload.eventType === 'UPDATE') {
          setNotifications(prev => prev.map(n => n.id === payload.new.id ? payload.new : n));
        } else if (payload.eventType === 'DELETE') {
          setNotifications(prev => prev.filter(n => n.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(profileSubscription);
      supabase.removeChannel(statsSubscription);
      supabase.removeChannel(onboardingSubscription);
      supabase.removeChannel(notificationsSubscription);
    };
  }, [userId]);

  const updateEmotionalStats = (updates: Partial<EmotionalStats>) => {
    setEmotionalStats(prev => {
      const newStats = { ...prev, ...updates };
      // Ensure values are between 0 and 100
      Object.keys(newStats).forEach(key => {
        const k = key as keyof EmotionalStats;
        newStats[k] = Math.max(0, Math.min(100, newStats[k]));
      });
      return newStats;
    });
  };

  // Recalculate level when emotional stats change
  useEffect(() => {
    const avg = (emotionalStats.confianca + emotionalStats.autoestima + emotionalStats.disciplina + emotionalStats.amorProprio) / 4;
    let newLevel: UserLevel = 'Despertando';
    if (avg >= 80) newLevel = 'Inabalável';
    else if (avg >= 60) newLevel = 'Confiante';
    else if (avg >= 40) newLevel = 'Em Evolução';
    
    setLevel(newLevel);
  }, [emotionalStats]);

  // Update hasCompletedOnboarding when onboardingAnswers changes
  useEffect(() => {
    setHasCompletedOnboarding(Object.keys(onboardingAnswers).length > 0);
  }, [onboardingAnswers]);

  // Sync selectedDiet to Supabase
  useEffect(() => {
    if (!userId || !selectedDiet) return;
    
    const syncDiet = async () => {
      await supabase
        .from('users')
        .update({ 
          selected_diet: selectedDiet,
          last_diet_change_date: new Date().toISOString()
        })
        .eq('id', userId);
    };
    
    syncDiet();
  }, [selectedDiet, userId]);

  // Sync scheduledSessions to Supabase
  useEffect(() => {
    if (!userId) return;
    
    const syncSessions = async () => {
      await supabase
        .from('users')
        .update({ scheduled_sessions: scheduledSessions })
        .eq('id', userId);
    };
    
    syncSessions();
  }, [scheduledSessions, userId]);

  // Sync coachMessagesCount to Supabase
  useEffect(() => {
    if (!userId) return;
    
    const syncMessages = async () => {
      await supabase
        .from('users')
        .update({ coach_messages_count: coachMessagesCount })
        .eq('id', userId);
    };
    
    syncMessages();
  }, [coachMessagesCount, userId]);

  return (
    <UserContext.Provider value={{ 
      userName, setUserName, 
      isPremium, setIsPremium,
      subscriptionStatus, setSubscriptionStatus,
      trialEndDate, setTrialEndDate,
      coachMessagesCount, setCoachMessagesCount,
      selectedDiet, setSelectedDiet: updateSelectedDiet,
      lastDietChangeDate, canChangeDiet,
      scheduledSessions, setScheduledSessions,
      lastSessionDate,
      dailyGoal, setDailyGoal,
      isDailyGoalCompleted, setIsDailyGoalCompleted,
      level, setLevel,
      emotionalStats, setEmotionalStats,
      updateEmotionalStats,
      dailyMissions, setDailyMissions,
      toggleMission,
      streakCount,
      onboardingAnswers, setOnboardingAnswers,
      hasCompletedOnboarding,
      acessoTerapiaGrupo,
      role,
      isAuthReady, userId,
      notifications, setNotifications,
      userStats, completeWorkout,
      actualPlan,
      verificarAcessoPremium,
      valorPago, setValorPago,
      subscriptionEndDate, setSubscriptionEndDate,
      logout
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
