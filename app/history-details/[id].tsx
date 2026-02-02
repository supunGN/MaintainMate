import PageHeader from '@/components/molecules/PageHeader';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { useServiceRecords } from '@/hooks/useServiceRecords';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar, DollarSign, FileText } from 'lucide-react-native';
import React, { useCallback, useMemo } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
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

  const serviceId = params.id as string;

  const service = useMemo(() => {
    return services.find(s => s.id === serviceId);
  }, [services, serviceId]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

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

        {/* Completed Badge */}
        <View style={styles.badgeContainer}>
          <View style={styles.completedBadge}>
            <Text style={styles.completedBadgeText}>✓ Completed</Text>
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
                <Text style={styles.detailLabel}>Service Date</Text>
                <Text style={styles.detailValue}>{service.date}</Text>
              </View>
            </View>

            {/* Cost */}
            <View style={styles.detailItem}>
              <View style={styles.detailIconContainer}>
                <DollarSign size={20} color={Colors.primary.main} />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Total Cost</Text>
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
  completedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.successLight,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  completedBadgeText: {
    fontSize: 14,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.success,
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
});
