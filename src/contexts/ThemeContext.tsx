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
  const [theme, setTheme] = useState<Theme>(predefinedThemes.luxury);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.primary);
    root.style.setProperty('--color-bg', theme.bg);
    root.style.setProperty('--color-surface', theme.surface);
    root.style.setProperty('--color-text', theme.text);
    root.style.setProperty('--color-text-muted', theme.textMuted);
    root.style.setProperty('--color-accent', theme.accent);
    root.style.setProperty('--color-border', theme.border || 'rgba(216, 27, 255, 0.15)');
    
    root.classList.add('luxury-mode');
    root.classList.remove('light-mode', 'clean-mode');
  }, [theme]);

  const setCustomColor = (key: keyof Theme, value: string) => {
    setTheme((prev) => ({ ...prev, [key]: value, id: 'custom', name: 'Personalizado' }));
  };

  const toggleTheme = () => {
    // No-op as we only have one theme now
  };

  const isDark = true;

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
