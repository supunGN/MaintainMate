import HomeHeader from '@/components/molecules/HomeHeader';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { useServiceRecords } from '@/hooks/useServiceRecords';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Calendar, ChevronRight } from 'lucide-react-native';
import React, { useCallback, useMemo } from 'react';
import {
    Image,
    RefreshControl,
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

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: services = [], isLoading, refetch } = useServiceRecords();

  const { upcomingServices, recentActivities, totalThisMonth, servicesDone } = useMemo(() => {
    const parseDate = (dateStr: string) => {
      const [month, day, year] = dateStr.split(' - ').map(Number);
      return new Date(year, month - 1, day);
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = services
      .filter(s => parseDate(s.date) > today)
      .sort((a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime());
    
    const recent = services
      .filter(s => parseDate(s.date) <= today)
      .sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime());

    const total = recent
      .filter(s => {
        const date = parseDate(s.date);
        return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
      })
      .reduce((acc, s) => acc + (parseFloat(s.cost) || 0), 0);

    return { 
      upcomingServices: upcoming, 
      recentActivities: recent.slice(0, 5), // Show only 5 recent
      totalThisMonth: total,
      servicesDone: recent.length
    };
  }, [services]);

  const calculateDaysLeft = (dateStr: string) => {
    const [month, day, year] = dateStr.split(' - ').map(Number);
    const serviceDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = serviceDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleContactsPress = useCallback(() => {
    router.push('/contacts' as any);
  }, [router]);

  const handleSettingsPress = useCallback(() => {
    router.push('/settings' as any);
  }, [router]);

  const handleViewUpcoming = useCallback(() => {
    router.push('/(tabs)/upcoming' as any);
  }, [router]);

  const onRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <HomeHeader
        onContactsPress={handleContactsPress}
        onSettingsPress={handleSettingsPress}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        }
      >
        {/* Next Due Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Next Due</Text>
          <TouchableOpacity onPress={handleViewUpcoming} activeOpacity={0.7}>
            <ChevronRight size={24} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>This Month</Text>
            <Text style={styles.statValue}>Rs. {totalThisMonth.toLocaleString()}</Text>
            <Text style={styles.statChange}>
              <Text style={{ color: Colors.error }}>↓ 12%</Text> last month
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Services Done</Text>
            <Text style={styles.statValue}>{servicesDone.toString().padStart(2, '0')}</Text>
            <Text style={styles.statSubtext}>Previously 03</Text>
          </View>
        </View>

        {/* Upcoming Service Card */}
        {upcomingServices.length > 0 ? (
          <View style={styles.vehicleCard}>
            <View style={styles.vehicleHeader}>
              <TouchableOpacity 
                style={styles.iconContainer}
                onPress={handleViewUpcoming}
                activeOpacity={0.7}
              >
                <Calendar size={24} color={Colors.primary.main} />
              </TouchableOpacity>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  In {calculateDaysLeft(upcomingServices[0].date)} days
                </Text>
              </View>
            </View>
            
            <View style={styles.vehicleContentRow}>
              <View style={styles.vehicleInfo}>
                <Text style={styles.vehicleTitle}>{upcomingServices[0].itemName}</Text>
                <Text style={styles.vehicleDate}>{upcomingServices[0].date}</Text>
              </View>
              {upcomingServices[0].image ? (
                <Image 
                  source={{ uri: upcomingServices[0].image }} 
                  style={styles.vehicleImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.vehicleImagePlaceholder}>
                  <Ionicons name="image-outline" size={40} color={Colors.neutral.gray400} />
                </View>
              )}
            </View>
          </View>
        ) : (
          <View style={[styles.vehicleCard, styles.emptyCard]}>
            <Text style={styles.emptyText}>No upcoming services</Text>
          </View>
        )}
        
        {/* Dots Indicator */}
        <View style={styles.paginationDots}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        {/* Recent Activities */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activities</Text>
        </View>

        <View style={styles.listContainer}>
          {recentActivities.length > 0 ? (
            recentActivities.map((item, index) => (
              <View 
                key={item.id} 
                style={[
                  styles.activityItem,
                  index === recentActivities.length - 1 && styles.lastActivityItem
                ]}
              >
                <View style={styles.activityIconContainer}>
                  <Image 
                    source={getCategoryIcon(item.category)} 
                    style={styles.categoryIcon}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{item.itemName}, {item.repairType}</Text>
                  <Text style={styles.activitySubtitle}>{item.date}</Text>
                </View>
                <Text style={styles.activityPrice}>Rs. {parseFloat(item.cost).toLocaleString()}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No recent activities</Text>
          )}
        </View>

        <View style={{ height: 80 }} />
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.body,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.neutral.gray100,
    borderRadius: 16,
    padding: Spacing.md,
    paddingVertical: 18,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.text.secondary,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 24,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  statChange: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  statSubtext: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  vehicleCard: {
    backgroundColor: Colors.neutral.gray100,
    borderRadius: 20,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  vehicleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.successLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: Colors.successLight,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    height: 36,
    justifyContent: 'center',
  },
  badgeText: {
    color: Colors.primary.main,
    fontWeight: Typography.fontWeight.semibold,
    fontSize: 13,
  },
  vehicleContentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vehicleInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  vehicleTitle: {
    fontSize: 20,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  vehicleDate: {
    fontSize: 14,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  vehicleImage: {
    width: 180,
    height: 120,
    borderRadius: 16,
  },
  vehicleImagePlaceholder: {
    width: 180,
    height: 120,
    borderRadius: 16,
    backgroundColor: Colors.neutral.gray200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginBottom: Spacing.md,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.neutral.gray300,
  },
  activeDot: {
    backgroundColor: Colors.primary.main,
  },
  listContainer: {
    backgroundColor: Colors.neutral.white,
    borderRadius: 20,
    padding: Spacing.md,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.gray100,
  },
  lastActivityItem: {
    borderBottomWidth: 0,
  },
  activityIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.neutral.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryIcon: {
    width: 32,
    height: 32,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  activitySubtitle: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  activityPrice: {
    fontSize: 14,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
    color: Colors.text.secondary,
    fontSize: 14,
  },
});
