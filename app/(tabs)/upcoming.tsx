import EmptyState from '@/components/atoms/EmptyState';
import PageHeader from '@/components/molecules/PageHeader';
import ActionSheetModal from '@/components/organisms/ActionSheetModal';
import { Colors } from '@/constants/Colors';
import { useDeleteService } from '@/hooks/useDeleteService';
import { useServiceRecords } from '@/hooks/useServiceRecords';
import { useUpdateService } from '@/hooks/useUpdateService';
import { cancelServiceReminder, scheduleServiceReminder } from '@/utils/notifications';
import { ServiceRecord } from '@/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
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

export default function UpcomingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: services = [], isLoading } = useServiceRecords();
  const updateMutation = useUpdateService();
  const deleteMutation = useDeleteService();

  // Modal states
  const [selectedService, setSelectedService] = useState<ServiceRecord | null>(null);
  const [showActions, setShowActions] = useState(false);

  // Filter upcoming services (future dates only)
  const upcomingServices = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return services
      .filter(s => {
        const [month, day, year] = s.date.split(' - ').map(Number);
        return new Date(year, month - 1, day) > today;
      })
      .sort((a, b) => {
        const dateA = a.date.split(' - ').map(Number);
        const dateB = b.date.split(' - ').map(Number);
        return new Date(dateA[2], dateA[0] - 1, dateA[1]).getTime() -
          new Date(dateB[2], dateB[0] - 1, dateB[1]).getTime();
      });
  }, [services]);

  const calculateDaysLeft = useCallback((dateStr: string) => {
    const [month, day, year] = dateStr.split(' - ').map(Number);
    const serviceDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = serviceDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, []);

  const handleOpenActions = useCallback((service: ServiceRecord) => {
    setSelectedService(service);
    setShowActions(true);
  }, []);

  const handleOpenDetails = useCallback((service: ServiceRecord) => {
    router.push({
      pathname: '/upcoming-details/[id]',
      params: { id: service.id },
    });
  }, [router]);

  const handleCloseActions = useCallback(() => {
    setShowActions(false);
  }, []);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleMarkAsComplete = useCallback(async () => {
    if (!selectedService) return;

    Alert.alert(
      'Mark as Complete',
      'Are you sure you want to mark this service as completed?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Combine',
          style: 'default',
          onPress: async () => {
            try {
              const today = new Date();
              const formattedDate = `${String(today.getMonth() + 1).padStart(2, '0')} - ${String(today.getDate()).padStart(2, '0')} - ${today.getFullYear()}`;

              await updateMutation.mutateAsync({
                id: selectedService.id,
                updatedFields: { date: formattedDate }
              });
              setShowActions(false);
              Alert.alert('Success', 'Service marked as complete and moved to history.');
            } catch (error) {
              Alert.alert('Error', 'Failed to update service.');
            }
          }
        }
      ]
    );
  }, [selectedService, updateMutation]);

  const handleToggleReminder = useCallback(async (value: boolean) => {
    if (!selectedService) return;

    try {
      if (value) {
        // Schedule Reminder
        const identifier = await scheduleServiceReminder(
          selectedService.date,
          `Maintenance Reminder: ${selectedService.itemName}`,
          `It's time for ${selectedService.repairType}!`
        );

        if (identifier) {
          await updateMutation.mutateAsync({
            id: selectedService.id,
            updatedFields: { reminderId: identifier }
          });
          Alert.alert('Reminder Set', 'You will be notified at 9:00 AM on the day of service.');

          // Update local state to reflect change immediately in the modal
          setSelectedService(prev => prev ? ({ ...prev, reminderId: identifier }) : null);
        } else {
          Alert.alert('Error', 'Could not schedule reminder. The date might be in the past.');
        }
      } else {
        // Cancel Reminder
        if (selectedService.reminderId) {
          await cancelServiceReminder(selectedService.reminderId);
        }

        await updateMutation.mutateAsync({
          id: selectedService.id,
          updatedFields: { reminderId: null } // Explicitly null
        });

        // Update local state to reflect change immediately
        setSelectedService(prev => prev ? ({ ...prev, reminderId: null }) : null);

        Alert.alert('Reminder Cancelled', 'Notification has been removed.');
      }

      // Close sheet after short delay to show toggle animation
      setTimeout(() => setShowActions(false), 300);

    } catch (error) {
      Alert.alert('Error', 'Failed to update reminder settings.');
    }
  }, [selectedService, updateMutation]);

  const handleEdit = useCallback(() => {
    if (!selectedService) return;
    setShowActions(false);
    router.push({
      pathname: '/edit-service/[id]',
      params: {
        id: selectedService.id,
        itemName: selectedService.itemName,
        repairType: selectedService.repairType,
        date: selectedService.date,
        cost: selectedService.cost,
        note: selectedService.note || '',
        image: selectedService.image || '',
        category: selectedService.category,
      },
    });
  }, [selectedService, router]);



  const handleDelete = useCallback(() => {
    if (!selectedService) return;

    const performDelete = async () => {
      try {
        await deleteMutation.mutateAsync(selectedService.id);
        setShowActions(false);
        setSelectedService(null);
      } catch (error) {
        Alert.alert('Error', 'Failed to delete service.');
      }
    };

    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Are you sure you want to delete this service record?');
      if (confirmed) {
        performDelete();
      }
    } else {
      Alert.alert(
        'Delete Service',
        'Are you sure you want to delete this service record?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: performDelete
          },
        ]
      );
    }
  }, [selectedService, deleteMutation]);

  if (isLoading && upcomingServices.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.primary.main} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <PageHeader title="Upcoming Maintenance" showBackButton={false} />

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {upcomingServices.length > 0 ? (
          upcomingServices.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.serviceCard}
              onPress={() => handleOpenDetails(item)}
              activeOpacity={0.7}
            >
              <View style={styles.cardIconContainer}>
                <Image
                  source={getCategoryIcon(item.category)}
                  style={styles.categoryIcon}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.cardContent}>
                <Text style={styles.itemName}>{item.repairType}</Text>
                <Text style={styles.itemSubName}>{item.itemName}</Text>
                <Text style={styles.itemDate}>
                  In {calculateDaysLeft(item.date)} days
                  {item.reminderId && (
                    <Text style={{ color: Colors.primary.main, fontWeight: 'bold' }}> • 🔔 Reminder Set</Text>
                  )}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => handleOpenActions(item)}
              >
                <Ionicons name="ellipsis-vertical" size={20} color={Colors.neutral.black} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        ) : (
          <EmptyState
            title="No Upcoming Events"
            subtitle="Your scheduled maintenance will appear here"
          />
        )}
      </ScrollView>

      {/* Actions Bottom Sheet */}
      <ActionSheetModal
        visible={showActions}
        onClose={handleCloseActions}
        title={`${selectedService?.repairType || 'Service'} Service`}
        actions={[
          {
            id: 'complete',
            label: 'Mark as Complete',
            icon: 'checkbox-outline',
            onPress: handleMarkAsComplete,
          },
          {
            id: 'reminder',
            label: selectedService?.reminderId ? 'Reminder Set (9:00 AM)' : 'Set Reminder (9:00 AM)',
            type: 'toggle',
            value: !!selectedService?.reminderId,
            onValueChange: handleToggleReminder,
          },
          {
            id: 'edit',
            label: 'Edit',
            icon: 'pencil-outline',
            onPress: handleEdit,
          },
          {
            id: 'delete',
            label: 'Delete',
            icon: 'trash-outline',
            variant: 'destructive',
            onPress: handleDelete,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.default,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    gap: 16,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.neutral.black,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
    flexGrow: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceCard: {
    backgroundColor: Colors.neutral.gray100,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.neutral.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryIcon: {
    width: 32,
    height: 32,
  },
  cardContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.neutral.black,
    marginBottom: 2,
  },
  itemSubName: {
    fontSize: 14,
    color: Colors.text.quaternary,
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
  menuButton: {
    padding: 8,
  },
  fullModalOverlay: {
    flex: 1,
    backgroundColor: Colors.background.default,
  },
  detailsContainer: {
    flex: 1,
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.neutral.black,
  },
  detailsImage: {
    width: '90%',
    height: 220,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 16,
  },
  indicatorRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  indicator: {
    width: 12,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.neutral.gray300,
  },
  activeIndicator: {
    width: 20,
    backgroundColor: Colors.primary.main,
  },
  detailsInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  detailsItemName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.neutral.black,
    marginBottom: 4,
  },
  detailsRepairType: {
    fontSize: 14,
    color: Colors.text.tertiary,
    textTransform: 'capitalize',
  },
  daysBadge: {
    backgroundColor: Colors.errorLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  daysBadgeText: {
    color: Colors.errorDark,
    fontSize: 12,
    fontWeight: 'bold',
  },
  detailsCard: {
    backgroundColor: Colors.neutral.white,
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 24,
    marginBottom: 40,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.neutral.black,
  },
  detailValue: {
    fontSize: 16,
    color: Colors.neutral.black,
    fontWeight: '500',
  },
  detailDivider: {
    height: 1,
    backgroundColor: Colors.background.subtle,
    marginVertical: 16,
  },
  detailSection: {
    marginTop: 4,
  },
  detailNotes: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 8,
    lineHeight: 20,
  },

});
