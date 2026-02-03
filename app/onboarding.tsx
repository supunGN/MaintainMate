import OnboardingCarousel, { OnboardingSlideData } from '@/components/organisms/OnboardingCarousel';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ONBOARDING_SLIDES: OnboardingSlideData[] = [
  {
    id: '1',
    illustration: require('@/assets/images/onboarding/onboarding_1.png'),
    title: 'Welcome to MaintainMate',
    subtitle: 'Your simple companion for managing maintenance, records, and expenses',
  },
  {
    id: '2',
    illustration: require('@/assets/images/onboarding/onboarding_2.png'),
    title: 'Add Maintenance Records',
    subtitle: 'Save details of your vehicle and appliance maintenance in one place.',
  },
  {
    id: '3',
    illustration: require('@/assets/images/onboarding/onboarding_3.png'),
    title: 'Upcoming Maintenance',
    subtitle: 'View your upcoming services and never miss an important date.',
  },
  {
    id: '4',
    illustration: require('@/assets/images/onboarding/onboarding_4.png'),
    title: 'Track Your Expenses',
    subtitle: 'See how much you spend on maintenance and manage your costs better.',
  },
  {
    id: '5',
    illustration: require('@/assets/images/onboarding/onboarding_5.png'),
    title: 'View Past Records',
    subtitle: 'Access your past maintenance history whenever you need it.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();

  const handleComplete = () => {
    // Navigate to setup after onboarding slides
    router.replace('/setup');
  };

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingCarousel slides={ONBOARDING_SLIDES} onComplete={handleComplete} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.default,
  },
});
