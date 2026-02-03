import PageHeader from '@/components/molecules/PageHeader';
import EditNameBottomSheet from '@/components/organisms/EditNameBottomSheet';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { useServiceRecords } from '@/hooks/useServiceRecords';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Bell, ChevronRight, Database, FileText, HelpCircle, Info, Trash2, User } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  Share,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
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
  const queryClient = useQueryClient();
  const [userName, setUserName] = useState('User');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isNameModalVisible, setNameModalVisible] = useState(false);

  const { data: services = [] } = useServiceRecords();

  useEffect(() => {
    loadUserName();
    loadPreferences();
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

  const loadPreferences = async () => {
    try {
      const notifications = await AsyncStorage.getItem('notificationsEnabled');
      if (notifications !== null) setNotificationsEnabled(notifications === 'true');
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  // --- Actions ---

  const handleEditProfile = useCallback(() => {
    setNameModalVisible(true);
  }, []);

  const handleSaveName = async (newName: string) => {
    if (!newName.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }
    try {
      await AsyncStorage.setItem('@user_name', newName.trim());
      setUserName(newName.trim());
      // Logic handled in component onClose essentially, but we close here too if needed or rely on component
      // component calls onClose after onSave.
    } catch (error) {
      Alert.alert('Error', 'Failed to save name');
    }
  };

  const handleNotificationsToggle = useCallback(async (value: boolean) => {
    // Confirmation Dialog
    Alert.alert(
      'Notifications',
      `Are you sure you want to turn ${value ? 'ON' : 'OFF'} notifications?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {
            // Revert visual state if user cancels (strict React state alignment)
            // But since Switch is controlled by state, simply NOT updating state keeps it at old value.
          }
        },
        {
          text: 'Confirm',
          onPress: async () => {
            setNotificationsEnabled(value);
            try {
              await AsyncStorage.setItem('notificationsEnabled', value.toString());
            } catch (error) {
              console.error('Error saving notification preference:', error);
            }
          }
        }
      ]
    );
  }, []);

  const handleExportData = useCallback(async () => {
    try {
      const dataStr = JSON.stringify(services, null, 2);
      await Share.share({
        message: dataStr,
        title: 'MaintainMate_Backup.json',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to export data');
    }
  }, [services]);

  const handleClearData = useCallback(() => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete ALL your maintenance records, contacts, and profile info. The app will restart with personal setup. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            try {
              // 1. Clear all storage
              await AsyncStorage.clear();

              // 2. Clear React Query cache to remove in-memory data
              queryClient.clear();

              Alert.alert('Success', 'Everything has been erased. Restarting...', [
                {
                  text: 'OK',
                  onPress: () => {
                    // 3. Redirect to onboarding for a fresh start
                    router.replace('/onboarding');
                  }
                }
              ]);
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data.');
              console.error('Reset error:', error);
            }
          }
        }
      ]
    );
  }, [router, queryClient]);

  const handlePrivacyPolicy = useCallback(() => {
    Alert.alert(
      'Privacy Policy',
      'MaintainMate prioritizes your privacy. We do not collect, store, or share your personal data. All information, including your name and service records, is stored locally on your device. You have full control over your data.',
      [{ text: 'OK' }]
    );
  }, []);

  const handleHelp = useCallback(() => {
    Alert.alert(
      'Help & Support',
      'Need assistance? Have a suggestion? We\'d love to hear from you.\n\nContact us at:\nsupport@maintainmate.app',
      [{ text: 'OK' }]
    );
  }, []);

  const handleAbout = useCallback(() => {
    Alert.alert(
      'About MaintainMate',
      'MaintainMate is your personal maintenance tracking assistant.\n\nVersion 1.0.0\n\nBuilt with ❤️ for privacy and simplicity.',
      [{ text: 'OK' }]
    );
  }, []);

  const sections: SettingSection[] = [
    {
      title: 'Account',
      items: [
        {
          id: 'profile',
          label: 'Edit Name',
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

      {/* Edit Name Bottom Sheet */}
      <EditNameBottomSheet
        visible={isNameModalVisible}
        currentName={userName}
        onClose={() => setNameModalVisible(false)}
        onSave={handleSaveName}
      />
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
