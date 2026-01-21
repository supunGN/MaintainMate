import HomeHeader from '@/components/molecules/HomeHeader';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  const handleContactsPress = () => {
    router.push('/contacts' as any);
  };

  const handleSettingsPress = () => {
    // TODO: Navigate to Settings screen
    console.log('Navigate to Settings');
  };

  const handleMaintenanceTipsPress = () => {
    router.push('/(tabs)/maintenance-tips' as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <HomeHeader
        onContactsPress={handleContactsPress}
        onSettingsPress={handleSettingsPress}
      />

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={handleMaintenanceTipsPress}
        >
          <Text style={styles.buttonText}>❔ Go to Maintenance Tips</Text>
        </TouchableOpacity>

        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Home Screen Content</Text>
          <Text style={styles.placeholderSubtext}>
            Main content will go here
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.default,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.screenHorizontal,
  },
  button: {
    backgroundColor: Colors.primary.main,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 8,
    marginVertical: Spacing.md,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: Typography.fontSize.body,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  placeholderText: {
    fontSize: Typography.fontSize.h2,
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: Typography.fontSize.body,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.secondary,
  },
});
