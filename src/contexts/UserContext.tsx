import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export type UserLevel = 'Despertando' | 'Em Evolução' | 'Confiante' | 'Inabalável';

export interface EmotionalStats {
  confianca: number;
  autoestima: number;
  disciplina: number;
  amorProprio: number;
}

export interface DailyMission {
  id: string;
  title: string;
  completed: boolean;
}

interface UserContextType {
  userName: string;
  setUserName: (name: string) => void;
  isPremium: boolean;
  setIsPremium: (status: boolean) => void;
  subscriptionStatus: 'free' | 'trial' | 'premium';
  setSubscriptionStatus: (status: 'free' | 'trial' | 'premium') => void;
  trialEndDate: Date | null;
  setTrialEndDate: (date: Date | null) => void;
  coachMessagesCount: number;
  setCoachMessagesCount: (count: number) => void;
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
  onboardingAnswers: Record<string, string>;
  setOnboardingAnswers: (answers: Record<string, string>) => void;
  isAuthReady: boolean;
  userId: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userName, setUserName] = useState<string>('');
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'free' | 'trial' | 'premium'>('free');
  const [trialEndDate, setTrialEndDate] = useState<Date | null>(null);
  const [coachMessagesCount, setCoachMessagesCount] = useState<number>(0);
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
  const [onboardingAnswers, setOnboardingAnswers] = useState<Record<string, string>>({});

  const [isAuthReady, setIsAuthReady] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

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
        setIsPremium(data.is_premium || false);
        setSubscriptionStatus(data.subscription_status || 'free');
        setCoachMessagesCount(data.coach_messages_count || 0);
      }
    };

    fetchStats();
    fetchOnboarding();
    fetchProfile();

    // Set up realtime subscriptions
    const profileSubscription = supabase
      .channel('public:users')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users', filter: `id=eq.${userId}` }, payload => {
        const data = payload.new as any;
        if (data) {
          setIsPremium(data.is_premium || false);
          setSubscriptionStatus(data.subscription_status || 'free');
          setCoachMessagesCount(data.coach_messages_count || 0);
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

    return () => {
      supabase.removeChannel(profileSubscription);
      supabase.removeChannel(statsSubscription);
      supabase.removeChannel(onboardingSubscription);
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

  return (
    <UserContext.Provider value={{ 
      userName, setUserName, 
      isPremium, setIsPremium,
      subscriptionStatus, setSubscriptionStatus,
      trialEndDate, setTrialEndDate,
      coachMessagesCount, setCoachMessagesCount,
      dailyGoal, setDailyGoal,
      isDailyGoalCompleted, setIsDailyGoalCompleted,
      level, setLevel,
      emotionalStats, setEmotionalStats,
      updateEmotionalStats,
      dailyMissions, setDailyMissions,
      onboardingAnswers, setOnboardingAnswers,
      isAuthReady, userId
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
