import PageHeading from '@/components/atoms/PageHeading';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TIPS = [
  {
    title: 'Regular Cleaning',
    description: 'Clean your devices and vehicles regularly to prevent dust, rust, and damage.',
  },
  {
    title: 'Follow Service Schedules',
    description: 'Do maintenance on time to avoid sudden breakdowns and costly repairs.',
  },
  {
    title: 'Use Proper Handling',
    description: 'Handle appliances and vehicles carefully and avoid rough or incorrect usage.',
  },
  {
    title: 'Check for Early Issues',
    description: 'Fix small problems early before they turn into major repairs.',
  },
  {
    title: 'Keep Maintenance Records',
    description: 'Track past maintenance to plan future service.',
  },
];

export default function MaintenanceTipsScreen() {
  const [activeTab, setActiveTab] = useState<'vehicle' | 'home'>('vehicle');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <PageHeading title="Maintenance Tips" />
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'vehicle' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('vehicle')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'vehicle' && styles.activeTabText,
            ]}
          >
            Vehicle Maintenance
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'home' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('home')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'home' && styles.activeTabText,
            ]}
          >
            Home Appliance Maintenance
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Info Banner */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Follow these tips to keep your {activeTab === 'vehicle' ? 'vehicles' : 'home appliances'} in top condition.
            Regular maintenance can prevent costly repairs and improve lifespan.
          </Text>
        </View>

        {/* Tips */}
        {TIPS.map((tip, index) => (
          <View key={index} style={styles.tipItem}>
            <Ionicons
              name="checkmark-circle"
              size={22}
              color={Colors.success}
              style={styles.icon}
            />
            <View style={styles.tipTextContainer}>
              <Text style={styles.tipTitle}>{tip.title}</Text>
              <Text style={styles.tipDescription}>{tip.description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.default,
  },

  header: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: Spacing.lg,
  },

  tabs: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.screenHorizontal,
    marginTop: Spacing.sm,
    gap: Spacing.sm,
  },

  tab: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: 20,
    backgroundColor: Colors.background.subtle,
  },

  activeTab: {
    backgroundColor: Colors.primary.light,
  },

  tabText: {
    ...Typography.body2,
    color: Colors.text.secondary,
  },

  activeTabText: {
    color: Colors.primary.main,
    fontWeight: '600',
  },

  content: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingVertical: Spacing.lg,
  },

  infoBox: {
    backgroundColor: Colors.background.subtle,
    padding: Spacing.md,
    borderRadius: 12,
    marginBottom: Spacing.lg,
  },

  infoText: {
    ...Typography.body2,
    color: Colors.text.primary,
    lineHeight: 20,
  },

  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },

  icon: {
    marginTop: 2,
    marginRight: Spacing.sm,
  },

  tipTextContainer: {
    flex: 1,
  },

  tipTitle: {
    ...Typography.body1,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 2,
  },

  tipDescription: {
    ...Typography.body2,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
});
