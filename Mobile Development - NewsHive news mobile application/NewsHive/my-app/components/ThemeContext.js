// import libraries and dependencies
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import functions from services section
import { watchAuth } from '../services/auth';
import { getOwnerProfile, saveUserPrefs } from '../services/profile';

// declare variables
const ThemeContext = createContext({ theme:'light', setTheme: () => {} });

// ThemeProvider function
export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState('light');
  const storageKey = 'app.theme';

  const setTheme = async (next) => {
    setThemeState(next);
    try {
      await AsyncStorage.setItem(storageKey, next);
      await saveUserPrefs({ theme: next });
    } catch {}
  };

  useEffect(() => {
    let unsub = () => {};
    (async () => {
      try {
        const cached = await AsyncStorage.getItem(storageKey);
        if (cached === 'dark' || cached === 'light') setThemeState(cached);
      } catch {

      }

      unsub = watchAuth(async (user) => {
        if (!user) return;
        try {
          const prof = await getOwnerProfile();
          const t = prof?.prefs?.theme || prof?.theme;
          if (t === 'dark' || t === 'light') {
            setThemeState(t);
            await AsyncStorage.setItem(storageKey, t);
          }
        } catch {

        }
      });
    })();

    return () => unsub && unsub();
  }, []);

  const value = useMemo(() => ({ theme, setTheme }), [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
// export 
export const useThemeCtx = () => useContext(ThemeContext);

// Optional color tokens your components can reuse
export const palettes = {
  light: {
    bg: '#FFFFFF',
    text: '#000000',
    card: '#F6F6F6',
    accent: '#FFB703',
    buttonText: '#000000',
  },
  dark: {
    bg: '#1E1E1E',
    text: '#FFFFFF',
    card: '#2A2A2A',
    accent: '#FFB703',
    buttonText: '#000000',
  },
};
