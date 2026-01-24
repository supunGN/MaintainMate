import HomeHeader from '@/components/molecules/HomeHeader';
import ServiceHistoryCard from '@/components/molecules/ServiceHistoryCard';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  // Mock Data
  const recentActivity = [
    {
      id: '1',
      title: 'Toyota Corolla, Oil Change',
      category: 'Today', // Using category field for date/subtitle to match design
      date: 'Rs. 5,000', // Using date field for price to match design layout
      cost: 5000,
      image: undefined, // Add car icon if available
    },
    {
      id: '2',
      title: 'Dell XPS, Screen Repair',
      category: '8 Dec 2024',
      date: 'Rs. 12,500',
      cost: 12500,
      image: undefined, // Add laptop icon if available
    },
  ];

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const handleContactsPress = () => {
    router.push('/contacts' as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <HomeHeader
        onContactsPress={handleContactsPress}
        onSettingsPress={() => console.log('Settings')}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Next Due Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Next Due</Text>
          <TouchableOpacity onPress={() => router.push('/upcoming' as any)}>
            <Ionicons name="chevron-forward" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>This Month</Text>
            <Text style={styles.statValue}>Rs. 16,200</Text>
            <Text style={styles.statChange}>
              <Text style={{ color: '#E53935' }}>↓ 12%</Text> last month
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Services Done</Text>
            <Text style={styles.statValue}>06</Text>
            <Text style={styles.statSubtext}>Previously 03</Text>
          </View>
        </View>

        {/* Vehicle/Item Card (Carousel Item) */}
        <View style={styles.vehicleCard}>
          <View style={styles.vehicleHeader}>
            <View style={styles.iconContainer}>
              <Ionicons name="calendar-outline" size={24} color="#2F7D5A" />
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>In 3 days</Text>
            </View>
          </View>
          
          <View style={styles.vehicleContentRow}>
             <View>
                <Text style={styles.vehicleTitle}>Toyota Corolla</Text>
                <Text style={styles.vehicleDate}>19 Jan 2024</Text>
             </View>
             {/* Placeholder for Car Image - using a colored box or icon for now */}
              <Image 
                source={require('@/assets/images/onboarding/onboarding_1.png')} 
                style={styles.vehicleImage}
                resizeMode="cover"
              />
          </View>
        </View>
        
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
          {recentActivity.map((item) => (
             <View key={item.id} style={styles.activityItem}>
                 <View style={styles.activityIcon}>
                     {/* Placeholder icon */}
                    <Ionicons name="car-sport-outline" size={24} color="#555" />
                 </View>
                 <View style={styles.activityContent}>
                     <Text style={styles.activityTitle}>{item.title}</Text>
                     <Text style={styles.activitySubtitle}>{item.category}</Text>
                 </View>
                 <Text style={styles.activityPrice}>{item.date}</Text>
             </View>
          ))}
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
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
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.h3,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: Spacing.md,
    paddingVertical: Spacing.lg,
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  statChange: {
    fontSize: 12,
    color: '#888',
  },
  statSubtext: {
    fontSize: 12,
    color: '#888',
  },
  vehicleCard: {
    backgroundColor: '#FFFFFF', // Or light grey if needed to match image exactly, but image looks like white on grey bg
    borderRadius: 24,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  vehicleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    height: 32,
    justifyContent: 'center',
  },
  badgeText: {
    color: '#2F7D5A',
    fontWeight: '600',
    fontSize: 12,
  },
  vehicleContentRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
  },
  vehicleTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: '#000',
      marginBottom: 4,
  },
  vehicleDate: {
      fontSize: 14,
      fontWeight: '600',
      color: '#000',
  },
  vehicleImage: {
      width: 140,
      height: 90,
      borderRadius: 12,
  },
  paginationDots: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 6,
      marginBottom: Spacing.lg,
  },
  dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#E0E0E0',
  },
  activeDot: {
      backgroundColor: '#2F7D5A',
  },
  listContainer: {
      backgroundColor: '#FFFFFF',
      borderRadius: 20,
      padding: Spacing.md,
  },
  activityItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#F5F5F5',
  },
  activityIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#F5F5F5',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
  },
  activityContent: {
      flex: 1,
  },
  activityTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: '#000',
  },
  activitySubtitle: {
      fontSize: 12,
      color: '#888',
      marginTop: 2,
  },
  activityPrice: {
      fontSize: 14,
      fontWeight: '600',
      color: '#555',
  },
});
