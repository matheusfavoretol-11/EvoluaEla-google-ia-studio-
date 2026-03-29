import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = {
  id: string;
  name: string;
  primary: string;
  bg: string;
  surface: string;
  text: string;
  textMuted: string;
  accent: string;
};

export const predefinedThemes: Record<string, Theme> = {
  premium: {
    id: 'premium',
    name: 'Premium',
    primary: '#E8B4BC',
    bg: '#FAF7F5',
    surface: '#FFFFFF',
    text: '#3F2A2F',
    textMuted: '#6B5E61',
    accent: '#A8C4B8',
  },
  delicado: {
    id: 'delicado',
    name: 'Delicado',
    primary: '#f43f5e', // rose-500
    bg: '#fafaf9', // stone-50
    surface: '#ffffff',
    text: '#292524', // stone-800
    textMuted: '#78716c', // stone-500
    accent: '#ffe4e6', // rose-100
  },
  elegante: {
    id: 'elegante',
    name: 'Elegante',
    primary: '#b45309', // amber-700
    bg: '#fdfbf7',
    surface: '#ffffff',
    text: '#1c1917',
    textMuted: '#a8a29e',
    accent: '#fef3c7', // amber-100
  },
  darkFeminino: {
    id: 'darkFeminino',
    name: 'Dark Feminino',
    primary: '#fb7185', // rose-400
    bg: '#1c1917', // stone-900
    surface: '#292524', // stone-800
    text: '#fafaf9', // stone-50
    textMuted: '#a8a29e', // stone-400
    accent: '#4c1d95', // violet-900
  },
};

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  setCustomColor: (key: keyof Theme, value: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(predefinedThemes.premium);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.primary);
    root.style.setProperty('--color-bg', theme.bg);
    root.style.setProperty('--color-surface', theme.surface);
    root.style.setProperty('--color-text', theme.text);
    root.style.setProperty('--color-text-muted', theme.textMuted);
    root.style.setProperty('--color-accent', theme.accent);
  }, [theme]);

  const setCustomColor = (key: keyof Theme, value: string) => {
    setTheme((prev) => ({ ...prev, [key]: value, id: 'custom', name: 'Personalizado' }));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, setCustomColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
