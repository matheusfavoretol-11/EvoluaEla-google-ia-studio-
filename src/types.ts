export type Exercise = { 
  id: string; 
  name: string; 
  reps: string; 
  sets: number | string; 
};

export type Workout = { 
  id: string; 
  title: string; 
  duration: string; 
  level: string; 
  calories: string; 
  premium: boolean; 
  exercises: Exercise[]; 
};

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
