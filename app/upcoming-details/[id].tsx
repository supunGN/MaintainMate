import PageHeader from '@/components/molecules/PageHeader';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { useServiceRecords } from '@/hooks/useServiceRecords';
import { useUpdateService } from '@/hooks/useUpdateService';
import { cancelServiceReminder, scheduleServiceReminder } from '@/utils/notifications';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar, CheckCircle, DollarSign, Pencil } from 'lucide-react-native';
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

  const handleToggleReminder = useCallback(async () => {
    if (!service) return;

    try {
      if (!service.reminderId) {
        // Schedule Reminder
        const identifier = await scheduleServiceReminder(
          service.date,
          `Maintenance Reminder: ${service.itemName}`,
          `It's time for ${service.repairType}!`
        );

        if (identifier) {
          await updateMutation.mutateAsync({
            id: service.id,
            updatedFields: { reminderId: identifier }
          });
          Alert.alert('Reminder Set', 'You will be notified at 9:00 AM on the day of service.');
        } else {
          Alert.alert('Error', 'Could not schedule reminder. The date might be in the past.');
        }
      } else {
        // Cancel Reminder
        Alert.alert(
          'Cancel Reminder',
          'Are you sure you want to turn off the reminder for this service?',
          [
            { text: 'Keep It', style: 'cancel' },
            {
              text: 'Turn Off',
              style: 'destructive',
              onPress: async () => {
                await cancelServiceReminder(service.reminderId!);
                await updateMutation.mutateAsync({
                  id: service.id,
                  updatedFields: { reminderId: null }
                });
                Alert.alert('Reminder Cancelled', 'Notification has been removed.');
              }
            }
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update reminder settings.');
    }
  }, [service, updateMutation]);

  const handleEdit = useCallback(() => {
    if (!service) return;
    router.push({
      pathname: '/edit-service/[id]',
      params: {
        id: service.id,
        itemName: service.itemName,
        repairType: service.repairType,
        date: service.date,
        cost: service.cost,
        note: service.note || '',
        image: service.image || '',
        category: service.category,
      },
    });
  }, [service, router]);

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



        {/* Meta Row: Badges */}
        <View style={styles.metaRow}>
          {/* Days Left Badge */}
          <View style={[styles.badge, daysLeft <= 7 && styles.urgentBadge]}>
            <Calendar size={14} color={daysLeft <= 7 ? Colors.error : Colors.primary.main} />
            <Text style={[styles.badgeText, daysLeft <= 7 && styles.urgentBadgeText]}>
              {daysLeft > 0 ? `In ${daysLeft} days` : daysLeft === 0 ? 'Today' : `${Math.abs(daysLeft)} days overdue`}
            </Text>
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
        </View>

        {/* Main Content */}
        <View style={styles.contentSection}>
          <Text style={styles.serviceTitle}>{service.repairType}</Text>
          <Text style={styles.itemName}>{service.itemName}</Text>

          {/* Facebook Bio Style Note */}
          {service.note && (
            <Text style={styles.bioText}>
              {service.note}
            </Text>
          )}

          {/* Action Buttons (Compact) - Moved after Bio */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.actionButton, styles.completeButton]}
              onPress={handleMarkComplete}
              disabled={isCompleting}
              activeOpacity={0.7}
            >
              <CheckCircle size={16} color={Colors.neutral.white} />
              <Text style={styles.actionButtonText}>
                {isCompleting ? 'Completing...' : 'Mark Complete'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.editButton
              ]}
              onPress={handleEdit}
              activeOpacity={0.7}
            >
              <Pencil size={16} color={Colors.neutral.black} />
              <Text style={[
                styles.actionButtonText,
                styles.editButtonText
              ]}>
                Edit
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Details Lists */}
          <View style={styles.detailsList}>
            {/* Date */}
            <View style={styles.detailRow}>
              <View style={styles.iconCircle}>
                <Calendar size={20} color={Colors.primary.main} />
              </View>
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Scheduled Date</Text>
                <Text style={styles.detailValue}>{service.date}</Text>
              </View>
            </View>

            {/* Cost */}
            <View style={styles.detailRow}>
              <View style={styles.iconCircle}>
                <DollarSign size={20} color={Colors.primary.main} />
              </View>
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Estimated Cost</Text>
                <Text style={styles.detailValue}>Rs. {parseFloat(service.cost).toLocaleString()}</Text>
              </View>
            </View>
          </View>
        </View>
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
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 12,
    marginBottom: 20,
    marginTop: 4,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.successLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8, // Facebook uses slightly tighter radii often
    gap: 6,
  },
  urgentBadge: {
    backgroundColor: Colors.errorLight,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary.main,
  },
  urgentBadgeText: {
    color: Colors.error,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral.gray100,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  categoryBadgeIcon: {
    width: 16,
    height: 16,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  contentSection: {
    paddingHorizontal: 4, // Minor adjustment for alignment
  },
  serviceTitle: {
    fontSize: Typography.fontSize.h2,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral.black,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  itemName: {
    fontSize: Typography.fontSize.body,
    color: Colors.text.primary,
    marginBottom: 16,
    fontWeight: Typography.fontWeight.semibold,
  },
  bioText: {
    fontSize: 14,
    color: Colors.text.tertiary,
    textAlign: 'left',
    marginBottom: 24,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.neutral.gray200,
    marginBottom: 24,
  },
  detailsList: {
    gap: 24,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.neutral.gray100, // Subtle background circle
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailTextContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 2,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 4,
    textTransform: 'capitalize', // Cleaner label style
    letterSpacing: 0.25,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
    lineHeight: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12, // More gap
    marginBottom: 32, // Space below buttons before divider
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10, // Reduced from 14
    borderRadius: 8, // Tighter radius
    gap: 6,
  },
  completeButton: {
    backgroundColor: Colors.primary.main,
    elevation: 2, // Subtle shadow for pop
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  editButton: {
    backgroundColor: Colors.neutral.gray200, // Light gray for secondary action
  },
  reminderButton: {
    backgroundColor: Colors.neutral.white,
    borderWidth: 1.5,
    borderColor: Colors.neutral.gray200, // Softer border
  },
  reminderActiveButton: {
    backgroundColor: Colors.primary.main,
    borderWidth: 1.5,
    borderColor: Colors.primary.main,
    opacity: 0.9,
  },
  actionButtonText: {
    fontSize: 14, // Slightly smaller text
    fontWeight: '600',
    color: Colors.neutral.white,
  },
  editButtonText: {
    color: Colors.neutral.black,
  },
  reminderButtonText: {
    color: Colors.text.primary, // Darker text for better contrast on white
  },
  reminderActiveText: {
    color: Colors.neutral.white,
  },
});
