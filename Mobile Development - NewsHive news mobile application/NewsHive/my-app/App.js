// App.js
import React from 'react';
import { StatusBar } from 'react-native';
import RootNavigator from './navigation/RootNavigator';
import { FavouritesProvider } from './components/FavouriteContext';
import { ThemeProvider, useThemeCtx } from './components/ThemeContext';

function ThemedStatusBar() {
  const { theme } = useThemeCtx();
  const dark = theme === 'dark';
  return (
    <StatusBar
      barStyle={dark ? 'light-content' : 'dark-content'}
      backgroundColor={dark ? '#1E1E1E' : '#FFFFFF'} // Android background
      animated
    />
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <FavouritesProvider>
        <ThemedStatusBar />
        <RootNavigator />
      </FavouritesProvider>
    </ThemeProvider>
  );
}
