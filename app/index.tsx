import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';

export default function Index() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    try {
      const userName = await AsyncStorage.getItem('userName');
      setHasCompletedOnboarding(!!userName);
    } catch (error) {
      console.error('Error checking onboarding:', error);
      setHasCompletedOnboarding(false);
    }
  };

  // Show nothing while checking
  if (hasCompletedOnboarding === null) {
    return null;
  }

  // Redirect based on onboarding status
  return <Redirect href={hasCompletedOnboarding ? '/(tabs)' : '/onboarding'} />;
}
