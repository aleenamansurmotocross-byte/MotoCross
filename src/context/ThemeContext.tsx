import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ThemeProvider component that wraps the application to provide theme state
export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initialize theme state with a lazy initialization function
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      // Check if user has a previously saved theme preference
      const saved = localStorage.getItem('theme') as Theme;
      if (saved === 'dark' || saved === 'light') return saved;
    }
    // Default to 'dark'
    return 'dark'; 
  });


  // Effect to apply the theme class to the HTML root element whenever the theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light'); // Apply light mode CSS variables
    } else {
      root.classList.remove('light');
      root.classList.add('dark'); // Apply dark mode CSS variables
    }
    // Persist the theme choice in localStorage for future visits
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Helper function to toggle between light and dark modes
  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
