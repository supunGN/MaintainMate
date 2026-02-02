import PageHeader from '@/components/molecules/PageHeader';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Bell, ChevronRight, Database, FileText, HelpCircle, Info, LogOut, Moon, Trash2, User } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SettingItem {
  id: string;
  label: string;
  icon: any;
  type: 'navigation' | 'toggle' | 'action';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  destructive?: boolean;
}

interface SettingSection {
  title: string;
  items: SettingItem[];
}

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [userName, setUserName] = useState('User');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  useEffect(() => {
    loadUserName();
    loadPreferences();
  }, []);

  const loadUserName = async () => {
    try {
      const name = await AsyncStorage.getItem('userName');
      if (name) setUserName(name);
    } catch (error) {
      console.error('Error loading user name:', error);
    }
  };

  const loadPreferences = async () => {
    try {
      const notifications = await AsyncStorage.getItem('notificationsEnabled');
      const darkMode = await AsyncStorage.getItem('darkModeEnabled');
      
      if (notifications !== null) setNotificationsEnabled(notifications === 'true');
      if (darkMode !== null) setDarkModeEnabled(darkMode === 'true');
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleEditProfile = useCallback(() => {
    Alert.alert(
      'Edit Profile',
      'Profile editing will be implemented soon.',
      [{ text: 'OK' }]
    );
  }, []);

  const handleNotificationsToggle = useCallback(async (value: boolean) => {
    setNotificationsEnabled(value);
    try {
      await AsyncStorage.setItem('notificationsEnabled', value.toString());
    } catch (error) {
      console.error('Error saving notification preference:', error);
    }
  }, []);

  const handleDarkModeToggle = useCallback(async (value: boolean) => {
    setDarkModeEnabled(value);
    try {
      await AsyncStorage.setItem('darkModeEnabled', value.toString());
      Alert.alert(
        'Dark Mode',
        'Dark mode will be fully implemented in a future update.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error saving dark mode preference:', error);
    }
  }, []);

  const handleExportData = useCallback(() => {
    Alert.alert(
      'Export Data',
      'Export your maintenance records to a CSV file.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => {
          Alert.alert('Success', 'Data export will be implemented soon.');
        }}
      ]
    );
  }, []);

  const handleClearData = useCallback(() => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your maintenance records. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete All', 
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('serviceRecords');
              Alert.alert('Success', 'All data has been cleared.');
              router.replace('/');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data.');
            }
          }
        }
      ]
    );
  }, [router]);

  const handlePrivacyPolicy = useCallback(() => {
    Alert.alert(
      'Privacy Policy',
      'MaintainMate stores all data locally on your device. No data is sent to external servers.',
      [{ text: 'OK' }]
    );
  }, []);

  const handleHelp = useCallback(() => {
    Alert.alert(
      'Help & Support',
      'For help and support, please contact us at support@maintainmate.app',
      [{ text: 'OK' }]
    );
  }, []);

  const handleAbout = useCallback(() => {
    Alert.alert(
      'About MaintainMate',
      'Version 1.0.0\n\nMaintainMate helps you track and manage maintenance for all your items.\n\n© 2026 MaintainMate',
      [{ text: 'OK' }]
    );
  }, []);

  const handleLogout = useCallback(() => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout? You can login again anytime.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('onboardingComplete');
              router.replace('/onboarding');
            } catch (error) {
              Alert.alert('Error', 'Failed to logout.');
            }
          }
        }
      ]
    );
  }, [router]);

  const sections: SettingSection[] = [
    {
      title: 'Account',
      items: [
        {
          id: 'profile',
          label: 'Edit Profile',
          icon: User,
          type: 'navigation',
          onPress: handleEditProfile,
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          id: 'notifications',
          label: 'Notifications',
          icon: Bell,
          type: 'toggle',
          value: notificationsEnabled,
          onToggle: handleNotificationsToggle,
        },
        {
          id: 'darkMode',
          label: 'Dark Mode',
          icon: Moon,
          type: 'toggle',
          value: darkModeEnabled,
          onToggle: handleDarkModeToggle,
        },
      ],
    },
    {
      title: 'Data Management',
      items: [
        {
          id: 'export',
          label: 'Export Data',
          icon: Database,
          type: 'navigation',
          onPress: handleExportData,
        },
        {
          id: 'clear',
          label: 'Clear All Data',
          icon: Trash2,
          type: 'action',
          onPress: handleClearData,
          destructive: true,
        },
      ],
    },
    {
      title: 'About',
      items: [
        {
          id: 'privacy',
          label: 'Privacy Policy',
          icon: FileText,
          type: 'navigation',
          onPress: handlePrivacyPolicy,
        },
        {
          id: 'help',
          label: 'Help & Support',
          icon: HelpCircle,
          type: 'navigation',
          onPress: handleHelp,
        },
        {
          id: 'about',
          label: 'About',
          icon: Info,
          type: 'navigation',
          onPress: handleAbout,
        },
      ],
    },
    {
      title: '',
      items: [
        {
          id: 'logout',
          label: 'Logout',
          icon: LogOut,
          type: 'action',
          onPress: handleLogout,
          destructive: true,
        },
      ],
    },
  ];

  const renderSettingItem = (item: SettingItem) => {
    const IconComponent = item.icon;

    return (
      <TouchableOpacity
        key={item.id}
        style={styles.settingItem}
        onPress={item.onPress}
        activeOpacity={item.type === 'toggle' ? 1 : 0.7}
        disabled={item.type === 'toggle'}
      >
        <View style={styles.settingLeft}>
          <View style={[styles.iconContainer, item.destructive && styles.iconContainerDestructive]}>
            <IconComponent 
              size={20} 
              color={item.destructive ? Colors.error : Colors.primary.main} 
            />
          </View>
          <Text style={[styles.settingLabel, item.destructive && styles.settingLabelDestructive]}>
            {item.label}
          </Text>
        </View>

        {item.type === 'toggle' && (
          <Switch
            value={item.value}
            onValueChange={item.onToggle}
            trackColor={{ false: Colors.neutral.gray300, true: Colors.primary.main + '40' }}
            thumbColor={item.value ? Colors.primary.main : Colors.neutral.white}
          />
        )}

        {item.type === 'navigation' && (
          <ChevronRight size={20} color={Colors.text.secondary} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <PageHeader title="Settings" showBackButton onBackPress={handleBack} />

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* User Info Card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{userName.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.userEmail}>Offline Account</Text>
          </View>
        </View>

        {/* Settings Sections */}
        {sections.map((section, index) => (
          <View key={index} style={styles.section}>
            {section.title !== '' && (
              <Text style={styles.sectionTitle}>{section.title}</Text>
            )}
            <View style={styles.sectionContent}>
              {section.items.map(renderSettingItem)}
            </View>
          </View>
        ))}

        {/* App Version */}
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </View>
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
    paddingHorizontal: Spacing.screenHorizontal,
    paddingBottom: Spacing.xl,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral.gray100,
    borderRadius: Spacing.borderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral.white,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: Typography.fontSize.h3,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: Typography.fontSize.caption,
    color: Colors.text.secondary,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.caption,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.secondary,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  sectionContent: {
    backgroundColor: Colors.neutral.gray100,
    borderRadius: Spacing.borderRadius.xl,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.gray200,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary.main + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  iconContainerDestructive: {
    backgroundColor: Colors.errorLight,
  },
  settingLabel: {
    fontSize: Typography.fontSize.body,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
  },
  settingLabelDestructive: {
    color: Colors.error,
  },
  versionText: {
    fontSize: Typography.fontSize.caption,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
});
