import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BookUser, Settings } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
      const name = await AsyncStorage.getItem('@user_name');
      if (name) {
        setUserName(name);
      }
    } catch (error) {
      console.error('Error loading user name:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Welcome Text */}
      <View style={styles.textContainer}>
        <Text style={styles.welcomeText}>Welcome back,</Text>
        <Text style={styles.userName}>{userName || 'User'}</Text>
      </View>

      {/* Action Icons */}
      <View style={styles.iconsContainer}>
        {/* Service Contacts Icon */}
        <TouchableOpacity
          style={[styles.iconButton, styles.contactsButton]}
          onPress={onContactsPress}
          activeOpacity={0.7}
        >
          <BookUser size={20} color={Colors.neutral.white} strokeWidth={2} />
        </TouchableOpacity>

        {/* Settings Icon */}
        <TouchableOpacity
          style={[styles.iconButton, styles.settingsButton]}
          onPress={onSettingsPress}
          activeOpacity={0.7}
        >
          <Settings size={20} color={Colors.text.primary} strokeWidth={2} />
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
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.background.default,
  },
  textContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: Typography.fontSize.body,
    fontWeight: Typography.fontWeight.regular,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  userName: {
    fontSize: Typography.fontSize.h2,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  iconsContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  iconButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  contactsButton: {
    backgroundColor: Colors.primary.main,
  },
  settingsButton: {
    backgroundColor: Colors.neutral.gray100,
  },
});
