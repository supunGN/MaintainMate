import PageHeader from '@/components/molecules/PageHeader';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { useDeleteService } from '@/hooks/useDeleteService';
import { useServiceRecords } from '@/hooks/useServiceRecords';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar, DollarSign, Trash } from 'lucide-react-native';
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

export default function HistoryDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { data: services = [] } = useServiceRecords();
  const deleteMutation = useDeleteService();
  const [isDeleting, setIsDeleting] = useState(false);

  const serviceId = params.id as string;

  const service = useMemo(() => {
    return services.find(s => s.id === serviceId);
  }, [services, serviceId]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleDelete = useCallback(() => {
    if (!service) return;

    const performDelete = async () => {
      try {
        setIsDeleting(true);
        await deleteMutation.mutateAsync(service.id);
        router.back();
      } catch (error) {
        setIsDeleting(false);
        Alert.alert('Error', 'Failed to delete service.');
      }
    };

    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Are you sure you want to delete this history record?');
      if (confirmed) performDelete();
    } else {
      Alert.alert(
        'Delete Record',
        'Are you sure you want to delete this history record?',
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
  }, [service, deleteMutation, router]);

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

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <PageHeader title="Service History" showBackButton onBackPress={handleBack} />

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
          {/* Completed Badge */}
          <View style={styles.completedBadge}>
            <Text style={styles.completedBadgeText}>✓ Completed</Text>
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

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.deleteButton
              ]}
              onPress={handleDelete}
              disabled={isDeleting}
              activeOpacity={0.7}
            >
              <Trash size={16} color={Colors.error} />
              <Text style={[
                styles.actionButtonText,
                styles.deleteButtonText
              ]}>
                {isDeleting ? 'Deleting...' : 'Delete Record'}
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
                <Text style={styles.detailLabel}>Service Date</Text>
                <Text style={styles.detailValue}>{service.date}</Text>
              </View>
            </View>

            {/* Cost */}
            <View style={styles.detailRow}>
              <View style={styles.iconCircle}>
                <DollarSign size={20} color={Colors.primary.main} />
              </View>
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Total Cost</Text>
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
  completedBadge: {
    backgroundColor: Colors.successLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  completedBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.success,
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
    paddingHorizontal: 4,
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
    backgroundColor: Colors.neutral.gray100,
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
    textTransform: 'capitalize',
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
    gap: 12,
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  deleteButton: {
    backgroundColor: Colors.errorLight,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral.white,
  },
  deleteButtonText: {
    color: Colors.error,
  },
});
