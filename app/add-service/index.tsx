import Button from '@/components/atoms/Button';
import CategoryGrid, { Category } from '@/components/organisms/CategoryGrid';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const CATEGORIES: Category[] = [
  {
    id: 'home_appliances',
    label: 'Home Appliances',
    image: require('@/assets/images/categories/cat_appliances.png'),
  },
  {
    id: 'vehicles',
    label: 'Vehicles',
    image: require('@/assets/images/categories/cat_vehicles.png'),
  },
  {
    id: 'entertainment',
    label: 'Entertainment',
    image: require('@/assets/images/categories/cat_entertainment.png'),
  },
  {
    id: 'computing',
    label: 'Computing',
    image: require('@/assets/images/categories/cat_computing.png'),
  },
  {
    id: 'security',
    label: 'Security & Smart',
    image: require('@/assets/images/categories/cat_security.png'),
  },
  {
    id: 'other',
    label: 'Other',
    image: require('@/assets/images/categories/cat_other.png'),
  },
];

export default function AddServiceCategoryScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleNext = () => {
    if (selectedCategory) {
      router.push({
        pathname: '/add-service/form',
        params: { category: selectedCategory },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Add Service</Text>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Choose Category</Text>

        <CategoryGrid
          categories={CATEGORIES}
          selectedCategoryId={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Button
          title="Next"
          onPress={handleNext}
          disabled={!selectedCategory}
        />
      </View>
    </SafeAreaView>
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
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    gap: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: Typography.fontSize.h3,
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.caption,
    fontFamily: Typography.fontFamily.medium,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
    paddingHorizontal: Spacing.screenHorizontal,
    marginBottom: Spacing.md,
  },
  footer: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral.gray200,
    backgroundColor: Colors.background.default,
  },
});
