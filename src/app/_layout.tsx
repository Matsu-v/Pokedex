import { Inter_400Regular } from '@expo-google-fonts/inter';
import {
  Rubik_400Regular,
  Rubik_500Medium,
  Rubik_700Bold,
  useFonts,
} from '@expo-google-fonts/rubik';
import { QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { queryClient } from '@/data/query-client';

// Keep the splash screen up until the fonts are there, so text never jumps from the system font.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  // The keys match `Fonts` in theme.ts.
  const [fontsLoaded, fontError] = useFonts({
    Rubik_400Regular,
    Rubik_500Medium,
    Rubik_700Bold,
    Inter_400Regular,
  });
  const ready = fontsLoaded || fontError !== null;

  useEffect(() => {
    if (ready) SplashScreen.hide();
  }, [ready]);

  // A font error is not fatal: the app falls back to the system font.
  if (!ready) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        {/* Search and Detail have no tab bar in Figma, so they are pushed over the tabs. */}
        <Stack screenOptions={{ headerBackButtonDisplayMode: 'minimal' }}>
          {/* The title is what a screen reader says for the back button on the pushed screens. */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false, title: 'Pokémons' }} />
          <Stack.Screen name="search" options={{ title: 'Search' }} />
          <Stack.Screen name="pokemon/[id]" options={{ title: 'Pokémon' }} />
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
