import PageHeader from '@/components/molecules/PageHeader';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { useServiceRecords } from '@/hooks/useServiceRecords';
import { useUpdateService } from '@/hooks/useUpdateService';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Bell, Calendar, CheckCircle, DollarSign, FileText } from 'lucide-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import {
    Alert,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Helper function to get category icon
const getCategoryIcon = (category: string) => {
  const iconMap: { [key: string]: any } = {
    'home_appliances': require('@/assets/images/categories/cat_appliances.png'),
    'vehicles': require('@/assets/images/categories/cat_vehicles.png'),
    'entertainment': require('@/assets/images/categories/cat_entertainment.png'),
    'computing': require('@/assets/images/categories/cat_computing.png'),
    'security': require('@/assets/images/categories/cat_security.png'),
    'other': require('@/assets/images/categories/cat_other.png'),
  };
  return iconMap[category] || iconMap['other'];
};

export default function UpcomingDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { data: services = [] } = useServiceRecords();
  const updateMutation = useUpdateService();
  const [isCompleting, setIsCompleting] = useState(false);

  const serviceId = params.id as string;

  const service = useMemo(() => {
    return services.find(s => s.id === serviceId);
  }, [services, serviceId]);

  const calculateDaysLeft = useCallback((dateStr: string) => {
    const [month, day, year] = dateStr.split(' - ').map(Number);
    const serviceDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = serviceDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, []);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleMarkComplete = useCallback(async () => {
    if (!service) return;
    
    const confirmAction = () => {
      setIsCompleting(true);
      const today = new Date();
      const formattedDate = `${String(today.getMonth() + 1).padStart(2, '0')} - ${String(today.getDate()).padStart(2, '0')} - ${today.getFullYear()}`;
      
      updateMutation.mutateAsync({ 
        id: service.id, 
        updatedFields: { date: formattedDate } 
      }).then(() => {
        setIsCompleting(false);
        router.back();
      }).catch(() => {
        setIsCompleting(false);
        Alert.alert('Error', 'Failed to mark service as complete.');
      });
    };

    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Mark this service as completed today?');
      if (confirmed) confirmAction();
    } else {
      Alert.alert(
        'Mark as Complete',
        'Mark this service as completed today?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Complete', onPress: confirmAction },
        ]
      );
    }
  }, [service, updateMutation, router]);

  const handleSetReminder = useCallback(() => {
    // TODO: Implement reminder functionality
    Alert.alert(
      'Set Reminder',
      'Reminder functionality will be implemented soon.',
      [{ text: 'OK' }]
    );
  }, []);

  if (!service) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <PageHeader title="Service Details" showBackButton onBackPress={handleBack} />
        <View style={styles.centered}>
          <Text style={styles.errorText}>Service not found</Text>
        </View>
      </View>
    );
  }

  const daysLeft = calculateDaysLeft(service.date);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <PageHeader title="Maintenance Details" showBackButton onBackPress={handleBack} />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Service Image */}
        {service.image ? (
          <Image
            source={{ uri: service.image }}
            style={styles.serviceImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Image
              source={getCategoryIcon(service.category)}
              style={styles.placeholderIcon}
              resizeMode="contain"
            />
          </View>
        )}

        {/* Days Left Badge */}
        <View style={styles.badgeContainer}>
          <View style={[styles.badge, daysLeft <= 7 && styles.urgentBadge]}>
            <Calendar size={16} color={daysLeft <= 7 ? Colors.error : Colors.primary.main} />
            <Text style={[styles.badgeText, daysLeft <= 7 && styles.urgentBadgeText]}>
              {daysLeft > 0 ? `In ${daysLeft} days` : daysLeft === 0 ? 'Today' : `${Math.abs(daysLeft)} days overdue`}
            </Text>
          </View>
        </View>

        {/* Service Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.serviceTitle}>{service.repairType}</Text>
          <Text style={styles.itemName}>{service.itemName}</Text>

          {/* Details Grid */}
          <View style={styles.detailsGrid}>
            {/* Date */}
            <View style={styles.detailItem}>
              <View style={styles.detailIconContainer}>
                <Calendar size={20} color={Colors.primary.main} />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Scheduled Date</Text>
                <Text style={styles.detailValue}>{service.date}</Text>
              </View>
            </View>

            {/* Cost */}
            <View style={styles.detailItem}>
              <View style={styles.detailIconContainer}>
                <DollarSign size={20} color={Colors.primary.main} />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Estimated Cost</Text>
                <Text style={styles.detailValue}>Rs. {parseFloat(service.cost).toLocaleString()}</Text>
              </View>
            </View>

            {/* Notes */}
            {service.note && (
              <View style={[styles.detailItem, styles.notesItem]}>
                <View style={styles.detailIconContainer}>
                  <FileText size={20} color={Colors.primary.main} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Notes</Text>
                  <Text style={styles.detailValue}>{service.note}</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Category Badge */}
        <View style={styles.categoryBadge}>
          <Image
            source={getCategoryIcon(service.category)}
            style={styles.categoryBadgeIcon}
            resizeMode="contain"
          />
          <Text style={styles.categoryBadgeText}>
            {service.category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </Text>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.completeButton]}
            onPress={handleMarkComplete}
            disabled={isCompleting}
            activeOpacity={0.7}
          >
            <CheckCircle size={20} color={Colors.neutral.white} />
            <Text style={styles.actionButtonText}>
              {isCompleting ? 'Completing...' : 'Mark Complete'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.reminderButton]}
            onPress={handleSetReminder}
            activeOpacity={0.7}
          >
            <Bell size={20} color={Colors.primary.main} />
            <Text style={[styles.actionButtonText, styles.reminderButtonText]}>
              Set Reminder
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: Typography.fontSize.body,
    color: Colors.text.secondary,
  },
  serviceImage: {
    width: '100%',
    height: 240,
    borderRadius: 20,
    marginBottom: Spacing.md,
  },
  imagePlaceholder: {
    width: '100%',
    height: 240,
    borderRadius: 20,
    backgroundColor: Colors.neutral.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  placeholderIcon: {
    width: 80,
    height: 80,
  },
  badgeContainer: {
    marginBottom: Spacing.md,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.successLight,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  urgentBadge: {
    backgroundColor: Colors.errorLight,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.primary.main,
  },
  urgentBadgeText: {
    color: Colors.error,
  },
  infoCard: {
    backgroundColor: Colors.neutral.gray100,
    borderRadius: 20,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  serviceTitle: {
    fontSize: Typography.fontSize.h3,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  itemName: {
    fontSize: Typography.fontSize.body,
    color: Colors.text.secondary,
    marginBottom: Spacing.lg,
  },
  detailsGrid: {
    gap: Spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  notesItem: {
    alignItems: 'flex-start',
  },
  detailIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.neutral.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 13,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: Typography.fontSize.body,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.neutral.gray100,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  categoryBadgeIcon: {
    width: 24,
    height: 24,
  },
  categoryBadgeText: {
    fontSize: 14,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  footer: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral.gray200,
    backgroundColor: Colors.background.default,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: Spacing.borderRadius.lg,
    gap: 8,
  },
  completeButton: {
    backgroundColor: Colors.primary.main,
  },
  reminderButton: {
    backgroundColor: Colors.neutral.white,
    borderWidth: 1.5,
    borderColor: Colors.primary.main,
  },
  actionButtonText: {
    fontSize: Typography.fontSize.body,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.neutral.white,
  },
  reminderButtonText: {
    color: Colors.primary.main,
  },
});
