import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BookUser, Settings } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import PageHeading from '../atoms/PageHeading';

interface HomeHeaderProps {
  onContactsPress?: () => void;
  onSettingsPress?: () => void;
}

export default function HomeHeader({ onContactsPress, onSettingsPress }: HomeHeaderProps) {
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    loadUserName();
  }, []);

  const loadUserName = async () => {
    try {
      const name = await AsyncStorage.getItem('userName');
      if (name) {
        setUserName(name);
      }
    } catch (error) {
      console.error('Error loading user name:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Page Heading */}
      <PageHeading 
        subtitle="Welcome back," 
        title={userName || 'User'} 
      />

      {/* Action Icons */}
      <View style={styles.iconsContainer}>
        {/* Service Contacts Icon */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onContactsPress}
          activeOpacity={0.7}
        >
          <BookUser size={Spacing.icon.md} color={Colors.text.primary} strokeWidth={2} />
        </TouchableOpacity>

        {/* Settings Icon */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onSettingsPress}
          activeOpacity={0.7}
        >
          <Settings size={Spacing.icon.md} color={Colors.text.primary} strokeWidth={2} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.background.default,
  },
  iconsContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  iconButton: {
    width: Spacing.iconButton + 8, // Larger than onboarding back button (40 + 8 = 48)
    height: Spacing.iconButton + 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Spacing.borderRadius.lg,
    backgroundColor: Colors.background.paper,
  },
});
