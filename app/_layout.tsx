import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import AnimatedSplash from '@/components/organisms/AnimatedSplash';
import { useColorScheme } from '@/hooks/use-color-scheme';

// Prevent the native splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isAppReady, setIsAppReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Prepare app resources
    async function prepare() {
      try {
        // Add any initialization logic here (fonts, data, etc.)
        // For now, we'll just mark the app as ready
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (e) {
        console.warn(e);
      } finally {
        setIsAppReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    // Hide native splash screen once app is ready
    if (isAppReady) {
      SplashScreen.hideAsync();
    }
  }, [isAppReady]);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  // Don't render anything until app is ready
  if (!isAppReady) {
    return null;
  }

  return (
    <>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(tabs)" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>

      {/* Custom Animated Splash Screen */}
      {showSplash && <AnimatedSplash onAnimationComplete={handleSplashComplete} />}
    </>
  );
}
