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
  border?: string;
};

export const predefinedThemes: Record<string, Theme> = {
  luxury: {
    id: 'luxury',
    name: 'Luxury',
    primary: '#D81BFF',
    bg: '#0F0A1F',
    surface: '#1F1638',
    text: '#FFFFFF',
    textMuted: '#B8B0C8',
    accent: '#F8C1FF',
    border: 'rgba(216, 27, 255, 0.15)',
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    primary: '#8B4357',
    bg: '#0A0A0A',
    surface: '#141414',
    text: '#FFFFFF',
    textMuted: '#888888',
    accent: '#C5A059',
    border: 'rgba(255, 255, 255, 0.1)',
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
  clean: {
    id: 'clean',
    name: 'Clean',
    primary: '#8B4357',
    bg: '#FFFFFF',
    surface: '#F9F9F9',
    text: '#1A1A1A',
    textMuted: '#717171',
    accent: '#8B4357',
    border: '#EEEEEE',
  },
  light: {
    id: 'light',
    name: 'Claro',
    primary: '#8B4357',
    bg: '#FAF8F5',
    surface: '#FFFFFF',
    text: '#1A1A1A',
    textMuted: '#555555',
    accent: '#C5A059',
    border: '#E0D8D0',
  },
};

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  setCustomColor: (key: keyof Theme, value: string) => void;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('evoluaela-theme');
    return saved && predefinedThemes[saved] ? predefinedThemes[saved] : predefinedThemes.luxury;
  });

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.primary);
    root.style.setProperty('--color-bg', theme.bg);
    root.style.setProperty('--color-surface', theme.surface);
    root.style.setProperty('--color-text', theme.text);
    root.style.setProperty('--color-text-muted', theme.textMuted);
    root.style.setProperty('--color-accent', theme.accent);
    if ('border' in theme) {
      root.style.setProperty('--color-border', (theme as any).border);
    } else {
      root.style.setProperty('--color-border', 'rgba(255,255,255,0.05)');
    }
    
    localStorage.setItem('evoluaela-theme', theme.id);
    
    if (theme.id === 'light') {
      root.classList.add('light-mode');
      root.classList.remove('clean-mode', 'luxury-mode');
    } else if (theme.id === 'clean') {
      root.classList.add('clean-mode');
      root.classList.remove('light-mode', 'luxury-mode');
    } else if (theme.id === 'luxury') {
      root.classList.add('luxury-mode');
      root.classList.remove('light-mode', 'clean-mode');
    } else {
      root.classList.remove('light-mode', 'clean-mode', 'luxury-mode');
    }
  }, [theme]);

  const setCustomColor = (key: keyof Theme, value: string) => {
    setTheme((prev) => ({ ...prev, [key]: value, id: 'custom', name: 'Personalizado' }));
  };

  const toggleTheme = () => {
    setTheme(prev => prev.id === 'light' ? predefinedThemes.luxury : predefinedThemes.light);
  };

  const isDark = theme.id !== 'light';

  return (
    <ThemeContext.Provider value={{ theme, setTheme, setCustomColor, toggleTheme, isDark }}>
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
