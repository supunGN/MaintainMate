import PageHeading from '@/components/atoms/PageHeading';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { getServiceRecords, ServiceRecord } from '@/utils/storage';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useCallback } from 'react';
import { ScrollView, StyleSheet, Text, View, ActivityIndicator, Image } from 'react-native';

export default function UpcomingScreen() {
  const [loading, setLoading] = useState(true);
  const [upcomingServices, setUpcomingServices] = useState<ServiceRecord[]>([]);

  const loadData = useCallback(async () => {
    try {
      const data = await getServiceRecords();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const filtered = data
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

      setUpcomingServices(filtered);
    } catch (error) {
      console.error('Error loading upcoming services:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.primary.main} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <PageHeading title="Upcoming Maintenance" />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {upcomingServices.length > 0 ? (
          upcomingServices.map((item) => (
            <View key={item.id} style={styles.serviceCard}>
              <View style={styles.serviceHeader}>
                <View style={styles.iconContainer}>
                  <Ionicons name="calendar" size={20} color="#2F7D5A" />
                </View>
                <View style={styles.dateLabel}>
                  <Text style={styles.dateText}>{item.date}</Text>
                </View>
              </View>
              
              <View style={styles.serviceBody}>
                <View style={styles.serviceInfo}>
                  <Text style={styles.itemName}>{item.itemName}</Text>
                  <Text style={styles.repairType}>{item.repairType}</Text>
                </View>
                {item.image && (
                  <Image source={{ uri: item.image }} style={styles.serviceImage} />
                )}
              </View>
            </View>
          ))
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>No Upcoming Events</Text>
            <Text style={styles.placeholderSubtext}>
              Your scheduled maintenance will appear here
            </Text>
          </View>
        )}
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
    paddingTop: Spacing.xl,
    marginTop: Spacing.xxl,
    paddingBottom: Spacing.sm,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.screenHorizontal,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateLabel: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555',
  },
  serviceBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  repairType: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  serviceImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  placeholderText: {
    fontSize: Typography.fontSize.h2,
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: Typography.fontSize.body,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.secondary,
  },
});
